# GitHub PR コードカバレッジ機能の導入

## Context（背景・目的）

GitHub が 2026-05-26 に [PRコードカバレッジ機能をパブリックプレビュー](https://github.blog/changelog/2026-05-26-code-coverage-in-pull-requests-is-now-in-public-preview/) で公開した。Cobertura XML を `actions/upload-code-coverage` でアップロードすると、PR上にGitHubネイティブのカバレッジUI（ファイル別カバレッジ、増減diff）が表示される。

このリポジトリは既に Codecov へ Cobertura レポートをアップロードしている。**Codecovのアップロードはそのまま残し**、同じ Cobertura レポートをGitHubの新機能にも追加でアップロードして両方を併用する。

### 現状（調査結果）

- **PR用**: `.github/workflows/ci.yaml`（トリガー `pull_request` / `workflow_dispatch`）
  - `unit-test` ジョブ: `pnpm run test:unit` → codecov flag `unittests`（211-215行）
  - `ct-test` ジョブ: `pnpm run test:storybook` → codecov flag `storybook`（280-284行）
- **main push用**: `.github/workflows/cache.yaml`（トリガー `push: branches: [main]`）
  - キャッシュ温め＋Chromaticベースライン＋`pnpm run test:unit` → codecov flag `unittests`（83-88行）。playwright も install 済み（59-61行）、build 済み。
- カバレッジ生成: `vite.config.mts` で `reporter: ["text", "cobertura"]`、出力先 `coverage/unit/cobertura-coverage.xml`（unit / storybook 両プロジェクト共通＝同一パスに上書き出力）
- 両ワークフローのトップレベル権限: `contents: read` / `packages: read`
- codecov.yml は無し（デフォルト設定）

### 使用するアクション（調査で確定）

`actions/upload-code-coverage` — SHA `b51da2c3c1b23e04d2d6477cfc34350b1f5cd3e9`（`v1.2.0`）

| input | 必須 | 値 |
|-------|------|----|
| `file` | ○ | `coverage/unit/cobertura-coverage.xml` |
| `language` | ○ | `TypeScript` |
| `label` | ○ | unit: `unit` / storybook: `storybook`（接頭語 `code-coverage/` は必須でないため省略） |
| `fail-on-error` | - | `false`（プレビュー機能のためbest-effort。CIをブロックしない） |
| `token` | - | 省略（デフォルト `github.token`。ただし `code-quality: write` 権限が必要） |

- 必須権限: ワークフロー/ジョブに `code-quality: write`。**job-level `permissions` を書くとワークフロー全体の権限設定を完全に上書きする**ため、ジョブに付ける場合は既存の `contents: read` / `packages: read` も併記する。
- フォークPR・マージキューはアクション側で自動スキップ（CIは落ちない）。
- 同一ファイル `coverage/unit/cobertura-coverage.xml` は test:unit と test:storybook で**上書き**されるため、各テスト直後にアップロードする順序が重要。

### ユーザー決定事項

- **fail-on-error: false**（CIをブロックしない）
- **main push のベースラインも追加**（PRのカバレッジ増減diffを機能させるため）→ `cache.yaml` を利用（ci.yaml のトリガー変更は不要）
- **storybook ベースラインも追加**（cache.yaml に test:storybook を追加して両ラベルの完全なベースラインを取る）

---

## 実装方針

ci.yaml のトリガーやジョブのガードは**一切変更しない**。PR は ci.yaml、main ベースラインは cache.yaml にそれぞれアップロードステップを足すだけ。

### 0. プランファイルのリネーム（最初に実施）

`plans/https-github-blog-changelog-2026-05-26-c-foamy-salamander.md`
→ `plans/2026-05-27-github-pr-code-coverage.md`

### 1. ci.yaml `unit-test` ジョブ（PR・unit）

`.github/workflows/ci.yaml`（175行付近）:

- ジョブに `permissions` を追加:
  ```yaml
  permissions:
    contents: read
    packages: read
    code-quality: write
  ```
- 既存 codecov ステップ（211-215行）は**変更しない**。その直後に追加:
  ```yaml
      - uses: actions/upload-code-coverage@b51da2c3c1b23e04d2d6477cfc34350b1f5cd3e9 # v1.2.0
        with:
          file: coverage/unit/cobertura-coverage.xml
          language: TypeScript
          label: unit
          fail-on-error: false
        if: always()
  ```

### 2. ci.yaml `ct-test` ジョブ（PR・storybook）

`.github/workflows/ci.yaml`（250行付近）:

- 同様に `permissions`（contents/packages: read + code-quality: write）を追加。
- 既存 codecov ステップ（280-284行）は変更せず、その直後に `label: storybook` でアップロードステップを追加（他は手順1と同じ、`if: always()`）。

### 3. cache.yaml（main ベースライン・unit + storybook）

`.github/workflows/cache.yaml`:

- トップレベル `permissions`（8-10行）に `code-quality: write` を追加（単一ジョブなのでトップレベルで十分）。
- 既存の流れ: `Vitest`（test:unit, 80-81行）→ `Upload coverage to Codecov`（83-88行）。
  この**Codecovステップの直後**に unit のアップロードを追加:
  ```yaml
      - uses: actions/upload-code-coverage@b51da2c3c1b23e04d2d6477cfc34350b1f5cd3e9 # v1.2.0
        with:
          file: coverage/unit/cobertura-coverage.xml
          language: TypeScript
          label: unit
          fail-on-error: false
        if: always()
  ```
- その後に storybook テストとアップロードを追加（cobertura は同一パスに上書きされるため、unit アップロードの**後**に実行すること）:
  ```yaml
      - name: Storybook testing
        run: pnpm run test:storybook

      - uses: actions/upload-code-coverage@b51da2c3c1b23e04d2d6477cfc34350b1f5cd3e9 # v1.2.0
        with:
          file: coverage/unit/cobertura-coverage.xml
          language: TypeScript
          label: storybook
          fail-on-error: false
        if: always()
  ```
  - 注: storybook テストは playwright browser を使う。cache.yaml は既に `npx playwright install chromium`（59-61行）を実行済みなので追加セットアップ不要。

### 4. リポジトリ側の機能有効化（コード外の手動作業）

アクションだけでは完結せず、GitHub側でコードカバレッジ機能を有効化する必要がある（リポジトリ Settings の Code coverage / Code quality 設定）。プレビュー期間中は無料。実装後、ユーザー＝サン側での有効化が必要な旨を案内する。

---

## 変更ファイル

- `plans/...` → リネーム（手順0）
- `.github/workflows/ci.yaml`（手順1・2: unit-test / ct-test に権限＋アップロードステップ）
- `.github/workflows/cache.yaml`（手順3: 権限＋unitアップロード＋storybookテスト＋storybookアップロード）

vite.config.mts・package.json は変更不要（既存の Cobertura 出力をそのまま流用）。ci.yaml のトリガー・ジョブガードも変更不要。

---

## 検証方法

1. **YAML構文チェック**: インデントと既存ステップとの整合を目視確認（actionlint が使えれば実行）。
2. **PR作成して動作確認**:
   - `unit-test` / `ct-test` ジョブで codecov ステップ（従来通り）と新規 upload-code-coverage ステップの両方が成功（fail-on-error: false なので失敗時も警告止まり）。
   - PR画面にGitHubネイティブのカバレッジ表示が出ること。出ない場合はリポジトリ設定で機能が有効化されているか確認（手順4）。
3. **main マージ後**: `cache.yaml` が走り、unit と storybook 両ラベルのベースラインが GitHub に登録されること。以降のPRで増減diffが表示される。
4. **Codecov併用確認**: ci.yaml / cache.yaml ともに Codecov のレポートが従来通り更新されていること（既存挙動が壊れていない）。
