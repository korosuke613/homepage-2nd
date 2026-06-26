# GitHub Actions ステップ並行実行の導入 + pnpm exec 移行

## Context

2026-06-25 に GitHub Actions へ「ステップの非同期/並行実行」機能が追加された
（[changelog](https://github.blog/changelog/2026-06-25-actions-steps-can-now-be-run-in-parallel/)）。
従来 `steps:` は逐次実行のみだったが、新たに以下のキーワードが使えるようになった。

| キーワード | 意味 |
|---|---|
| `background: true` | ステップを非同期起動し、即座に次のステップへ進む |
| `wait` / `wait-all` | 特定の／全てのバックグラウンドステップの完了を待つバリア |
| `cancel` | バックグラウンドステップを正常終了させる |
| `parallel` | 複数ステップを並行実行する糖衣構文 |

本リポジトリには「同一ジョブ内で逐次実行されているが、実際には互いに独立した
ネットワーク律速のステップ」が存在する。これらは**ジョブ分割よりもステップ並行化が適する**
（checkout・app-token・pnpm install のセットアップを共有でき、生成物を artifact 経由で
受け渡さずそのまま後続ステップで利用できるため）。本変更でこれらを並行化し、対象ワークフローの
実行時間を短縮する。

加えて、対象ステップは現状 `npx ts-node ...` で実行しているが、`npx` はレジストリから取得し得る
ため **`tools/package.json` に固定された `ts-node@10.9.2` を確実に使う**ように
`pnpm exec ts-node ...` へ移行する。`pnpm dlx` は npx 同様にレジストリ取得となり版固定の
目的に反するため採用しない。

### スコープ（ユーザー確定事項）

- **並行化対象**: `update-blogs-data.yaml`（最有力）と `ci.yaml` の `tools` ジョブの2箇所のみ。
  テスト系（ct-test）はCPU律速で効果が相殺・不安定になりうるため見送り。
- **pnpm exec 移行対象**: 上記2ファイルの `npx ts-node`（計5箇所）のみ。
  `pages.yml` の `npx astro db verify` / `cache.yaml` の `npx playwright install` /
  `claude-code-action.yaml` の `npx @playwright/mcp@latest` は今回は対象外。

## 新機能ゆえの重要な前提（実装前に必ず確認）

本機能は公開直後（2026-06-25）で、公式の
[workflow syntax ドキュメント](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)
にはまだ詳細な YAML スキーマが反映されていない。実装着手時に以下を一次情報で確認すること：

1. `parallel` / `background` / `wait-all` の**正確な YAML 記法**（ステップ属性か独立ブロックか）
2. バックグラウンドステップが**非ゼロ終了した場合にジョブが失敗するか**（`wait-all` が exit code を伝播するか）
3. `actionlint` / エディタの schema 検証が新キーワードに対応済みか（未対応なら lint 警告は許容）

下記 YAML は changelog 記載のキーワードに基づく**推奨形**。記法が確定するまでは、挙動が読みやすい
`background: true` + `wait-all` バリア方式を採用する（`parallel` 糖衣が使えるなら簡潔なそちらへ置換可）。

## 適用対象1: `.github/workflows/update-blogs-data.yaml`（最優先）

`update` ジョブ内の3つの取得ステップ（現状 L46-56、逐次）を並行化し、同時に `pnpm exec` へ移行する。
3スクリプトは独立した外部APIから取得し別ファイルへ書き込むことを確認済み：
- `updateZennJson.ts` → `../public/assets/zenn.json`
- `updateZennScrapJson.ts` → `../public/assets/zenn_scrap.json`
- `updateHatenaBlogJson.ts` → `../public/assets/hatena_blog.json`

並行化後、後続の `Check files changed`（L58-）→ `Commit files`（L67-）はすべての
取得完了後にまとめて変更ファイルを拾うため、ロジック変更は不要。

**Before（抜粋）**
```yaml
- name: Update zenn.json
  run: |
    npx ts-node updateZennJson.ts
- name: Update zenn_scrap.json
  run: |
    npx ts-node updateZennScrapJson.ts
- name: Update hatena_blog.json
  run: |
    npx ts-node updateHatenaBlogJson.ts
```

**After（並行化 + pnpm exec / 推奨形）**
```yaml
- name: Update zenn.json
  background: true
  run: |
    pnpm exec ts-node updateZennJson.ts
- name: Update zenn_scrap.json
  background: true
  run: |
    pnpm exec ts-node updateZennScrapJson.ts
- name: Update hatena_blog.json
  background: true
  run: |
    pnpm exec ts-node updateHatenaBlogJson.ts
- name: Wait for all blog data updates
  wait-all: true
```

`parallel` 糖衣が使えると確認できた場合の代替形（記法は要確認）：
```yaml
- name: Update all blog data
  parallel:
    - run: pnpm exec ts-node updateZennJson.ts
    - run: pnpm exec ts-node updateZennScrapJson.ts
    - run: pnpm exec ts-node updateHatenaBlogJson.ts
```

注意:
- `defaults.run.working-directory: ./tools` はバックグラウンドステップにも継承される想定。継承挙動を上記「前提」と併せて確認する。
- `ts-node` は `tools/pnpm-lock.yaml` で固定済み、`pnpm install --frozen-lockfile`（L44）後に `pnpm exec` で解決される。

## 適用対象2: `.github/workflows/ci.yaml` の `tools` ジョブ

`tools` ジョブ内の dry-run 2ステップ（現状 L344-351、逐次）を同様に並行化 + pnpm exec 移行する。
こちらも独立したネットワーク取得（ファイル出力はせず取得検証のみ）。

**Before（抜粋）**
```yaml
- name: Dry run update zenn.json
  run: |
    npx ts-node updateZennJson.ts
- name: Dry run update hatena_blog.json
  run: |
    npx ts-node updateHatenaBlogJson.ts
```

**After（並行化 + pnpm exec / 推奨形）**
```yaml
- name: Dry run update zenn.json
  background: true
  run: |
    pnpm exec ts-node updateZennJson.ts
- name: Dry run update hatena_blog.json
  background: true
  run: |
    pnpm exec ts-node updateHatenaBlogJson.ts
- name: Wait for all dry runs
  wait-all: true
```

## スコープ外（候補だが今回見送り）

- **`ci.yaml` `ct-test` ジョブ**（`test:playwright-ct` → `test:storybook`）: 両者ともCPU/Playwright
  ワーカーを多用し、同一ランナー上の並行化はコア数次第で効果が相殺・不安定になりうる。別ジョブ分割の方が素直。
- **`pages.yml` の scraping / vrt-init**: 別ワークフロー呼び出し（`uses:`）でありステップ並行化の対象外。
- **その他の `npx`**（pages.yml astro / cache.yaml playwright / claude-code-action MCP）: 今回は移行対象外。

## 実装手順

1. ブランチを作成（例: `feat/parallel-steps` 系）。
2. 上記「前提」3点を公式 changelog / docs / Actions runner リリースノートで確認し、確定記法を決定。
3. `update-blogs-data.yaml` の3ステップを並行化 + `pnpm exec` 移行。
4. `ci.yaml` `tools` ジョブの2ステップを並行化 + `pnpm exec` 移行。
5. `actionlint`（導入済みなら）で構文チェック。新キーワード未対応の警告は新機能由来か切り分けて許容。

## 検証方法

- **構文**: `actionlint .github/workflows/update-blogs-data.yaml .github/workflows/ci.yaml`。
- **update-blogs-data.yaml**: `workflow_dispatch` で手動実行し、
  (a) 3取得が並行起動していること（actions-timeline / ログのタイムスタンプで確認）、
  (b) 3ファイルとも正しく更新されること、
  (c) `pnpm exec ts-node` が `node_modules` の `ts-node@10.9.2` を使い正常完了すること、
  (d) 取得を1つ意図的に失敗させた場合に**ジョブが失敗する**こと（exit code 伝播の確認）。
- **ci.yaml `tools`**: PR を作成し `tools` ジョブが緑になること、実行時間が短縮されていることを
  actions-timeline で確認。
- 既存の `notify-on-fail` 経路（update ジョブ失敗時の Slack 通知）が壊れていないことを確認。
```
