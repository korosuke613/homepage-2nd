# Visual Regression Testing (VRT)

このプロジェクトでは、UIの視覚的な変更を検出するためにVisual Regression Testing (VRT)を実装しています。

## 概要

VRTは、Webページのスクリーンショットを撮影し、以前のスナップショットと比較することで、意図しないUIの変更を検出します。

### 対象ページ

以下のページがVRTの対象です：

- `/` - トップページ
- `/posts/productivity_weekly/` - Productivity Weekly
- `/posts/dormitory_introduction` - 寮紹介ページ
- `/posts` - 投稿一覧
- `/posts/tag/ポエム` - タグ別投稿
- `/posts/year/2022` - 年別投稿
- `/blogs` - ブログ一覧
- `/blogs/tag/ポエム` - タグ別ブログ
- `/blogs/year/2022` - 年別ブログ

定義: `src/tests/vrt/testdata.ts`

## アーキテクチャ

### スナップショット管理

VRTのスナップショットは**GitHub Actionsのキャッシュ**で管理されており、Gitにはコミットされません。

```yaml
# .github/workflows/vrt-regression.yaml
- name: Cache VRT snapshots
  uses: actions/cache@v4
  with:
    path: src/tests/vrt/snapshots
    key: vrt-${{ vars.RECENT_ARTIFACTS_SHA256 }}
```

- **キャッシュキー**: `vrt-${RECENT_ARTIFACTS_SHA256}`
  - `RECENT_ARTIFACTS_SHA256`: 最後にデプロイされたビルドのSHA256ハッシュ
  - ビルド成果物が変更されたときのみ、新しいスナップショットが生成される

### 2つのテストモード

#### 1. 依存関係更新時 (`update dependencies`)

```typescript
pnpm run vrt:regression --retries=1 --grep="update dependencies"
```

- **対象**: パッケージの依存関係を更新するPR
- **許容差分**: `maxDiffPixelRatio: 0.02` (2%)
- **期待**: UIに変更がない

#### 2. コンテンツ追加時 (`add contents`)

```typescript
pnpm run vrt:regression --retries=1 --grep="add contents"
```

- **対象**: 投稿やブログを追加するPR
- **許容差分**: より大きい値（ページによって異なる）
- **期待**: コンテンツ追加による変更

### init vs compare

#### init関数（スナップショット生成）

```typescript
// src/tests/vrt/utils.ts
export const init = async (page, testInfo, targetPage, option?) => {
  const url = path.join("https://korosuke613.dev/", targetPage.path);
  // 本番サイトからスナップショットを生成
  await page.goto(url);
  await page.screenshot({ fullPage: true, path: "...", mask: [...] });
};
```

- **URL**: 本番サイト (`https://korosuke613.dev/`)
- **実行タイミング**: スナップショットが存在しない場合、またはキャッシュミス時
- **保存先**: `src/tests/vrt/snapshots/`

#### compare関数（比較）

```typescript
export const compare = async (page, targetPage, option?) => {
  const url = path.join("localhost:4321", targetPage.path);
  // ローカルビルドと比較
  await page.goto(url);
  expect(await page.screenshot({ fullPage: true, mask: [...] }))
    .toMatchSnapshot(fileName, { maxDiffPixelRatio: 0.02 });
};
```

- **URL**: ローカルビルド (`localhost:4321`)
- **比較対象**: キャッシュされたスナップショット
- **実行環境**: `IS_TESTING=true`（eager loading有効）

## スクリーンショットのマスク

動的に生成されるセクションは、スクリーンショット時にマスクして比較から除外しています。

### 除外セクション

#### 編集履歴

**理由**: git履歴から動的に生成されるため、ビルド環境（本番 vs PR）で内容が異なる

```typescript
mask: [page.locator('h3:has-text("編集履歴")').locator("..")],
```

- **実装**: `src/tests/vrt/utils.ts`
- **対象コンポーネント**: `src/components/CommitHistoryPost/index.tsx`
- **データソース**: `src/utils/CommitHistories.ts` - `getCommitHistories`関数

## 使い方

### ローカルでの実行

#### 1. スナップショットの初期化

```bash
pnpm run vrt:init
```

本番サイトからスナップショットを生成します。

#### 2. 回帰テストの実行

```bash
# 依存関係更新モード
pnpm run vrt:regression --grep="update dependencies"

# コンテンツ追加モード
pnpm run vrt:regression --grep="add contents"
```

### CI/CDでの実行

VRTは以下の条件で自動実行されます：

1. ビルド成果物が変更された場合（`is_artifacts_changed=true`）
2. `skip VRT 🚫` ラベルが付いていない場合

#### VRTをスキップする

UIに影響しない変更（例: ドキュメント更新、設定変更）の場合：

```bash
gh pr edit <PR番号> --add-label "skip VRT 🚫"
```

## トラブルシューティング

### VRTが不安定（flaky）な場合

**症状**: UIに変更がないはずなのに、VRTが失敗する

**原因候補**:
1. **動的コンテンツ**: ビルド時に動的生成される内容が環境によって異なる
2. **画像の遅延読み込み**: 画像が完全に読み込まれる前にスクリーンショットを撮影
3. **アニメーション**: CSSアニメーションやトランジション

**解決策**:
1. 動的セクションをマスクする（例: 編集履歴）
2. `waitForTimeoutBeforeScreenshot` オプションを使用
3. テスト設定で `IS_TESTING=true` を設定し、アニメーションを無効化

### スナップショットの差分を確認する

VRT失敗時、GitHub ActionsのArtifactsに差分画像が保存されます：

```bash
gh run download <run-id> -n "vrt-failed-screenshots-<sha>"
```

- `*-expected.png`: 期待されるスナップショット（キャッシュ）
- `*-actual.png`: 実際のスクリーンショット（PR）
- `*-diff.png`: 差分画像（赤色部分が変更箇所）

### スナップショットを強制更新する

キャッシュを無効化して新しいスナップショットを生成する方法：

#### 方法1: GitHub Repository Variablesを変更

1. GitHub リポジトリの Settings → Secrets and variables → Actions → Variables
2. `RECENT_ARTIFACTS_SHA256` を一時的に無効な値（例: `dummy`）に変更
3. ワークフローを再実行
4. キャッシュミスが発生し、`vrt:init` が実行される
5. 新しいスナップショットが生成される
6. `RECENT_ARTIFACTS_SHA256` を正しい値に戻す

#### 方法2: workflow_dispatchで手動実行

```bash
gh workflow run vrt-regression.yaml
```

## メンテナンス

### スナップショットの更新が必要なケース

1. **意図的なUI変更**: デザイン変更、レイアウト調整
2. **新しいページの追加**: `src/tests/vrt/testdata.ts` に追加
3. **本番サイトのコンテンツ更新**: 編集履歴など

### 新しいページをVRT対象に追加

1. `src/tests/vrt/testdata.ts` にページ情報を追加：

```typescript
export const targetPages = {
  newPage: {
    name: "new-page",
    path: "/new-page",
  },
  // ...
};
```

2. `src/tests/vrt/regression.spec.ts` で必要に応じてオプションを設定：

```typescript
const baseOptions: TestOptions = {
  newPage: {
    testTimeout: 60000,
    waitForTimeoutBeforeScreenshot: 2000,
    matchSnapshot: { maxDiffPixelRatio: 0.05 },
  },
  // ...
};
```

3. スナップショットを生成：

```bash
pnpm run vrt:init
```

## 参考資料

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [GitHub Actions Cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
