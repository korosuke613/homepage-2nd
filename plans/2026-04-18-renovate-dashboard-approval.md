# Renovate 自動 PR・自動マージを廃止しつつ依存管理を継続する計画

## Context（背景）
- 昨今の npm サプライチェーン攻撃事例（chalk/debug、ua-parser-js、event-stream、node-ipc 等）を踏まえ、**Renovate による自動 PR 作成と自動マージを全廃止** したい。
- ただし、完全な手動運用は「更新忘れ → 脆弱性の蓄積」という別のセキュリティリスクを招くため避けたい。
- 要件:
  1. 自動 PR 作成を停止する
  2. 自動マージは全廃止する
  3. Renovate Dashboard のような「更新候補の見える化」を維持する
  4. 週次または月次で手動更新する
  5. CI 側でサプライチェーン攻撃の多層防御を導入する（`pnpm audit signatures`、Dependency Review Action、`ignore-scripts`）

## 採用アプローチ

Renovate 自体は残し、**Dependency Dashboard Approval モード** に切り替える。これで「自動 PR 作成停止＋ダッシュボード維持」の要件を Renovate の公式機能で満たせる。あわせて CI に多層防御を導入する。

## 変更内容

### 1. `renovate.json5` — 承認式運用への切り替え

外部プリセット `github>korosuke613/renovate-config` を継承しつつ、本リポジトリでオーバーライドする。

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>korosuke613/renovate-config',
  ],
  // 全 PR は Dashboard Issue でのチェック承認を必須化（自動 PR 作成停止）
  dependencyDashboard: true,
  dependencyDashboardApproval: true,
  // 自動マージ全廃止（プリセット上書き）
  automerge: false,
  packageRules: [
    { matchPackagePatterns: ['*'], automerge: false },
  ],
  // 公開から 7 日未満のバージョンは候補から除外
  minimumReleaseAge: '7 days',
  // ダッシュボード更新は週次で十分（GitHub Actions cron は後述で緩和）
  schedule: ['before 5am on monday'],
  // Renovate 側の脆弱性自動 PR 機能は無効化（Dashboard Approval をバイパスするため）
  // 脆弱性は GitHub Dependabot Alerts（通知のみ）で検知 → 人間が Dashboard 経由で対応
  vulnerabilityAlerts: {
    enabled: false,
  },
}
```

**ポイント:**
- `dependencyDashboardApproval: true` がコア。これにより全ての更新候補は PR 化されず、Dashboard Issue に「承認待ちチェックボックス」として並ぶ。
- `automerge: false` を `packageRules` でも念押しし、プリセット継承の自動マージが万一残っても無効化する。
- `minimumReleaseAge: '7 days'` で攻撃パッケージが検知・削除される時間を稼ぐ。
- `vulnerabilityAlerts.enabled: false` により、Renovate が脆弱性修正 PR を Dashboard バイパスで自動作成する挙動を封じる。**全ての PR は必ず人間の承認起点で作成される**という一貫性を確保する。

### 2. `.github/workflows/renovate.yaml` — 実行頻度の削減

現在 30 分ごとに動いているが、Dashboard 承認式になるので週次で十分。

- `cron: '0/30 * * * *'` → `cron: '0 5 * * 1'`（毎週月曜 05:00 UTC）
- `issue_comment` と `workflow_dispatch` トリガは維持（Dashboard チェック時に即応するため）

### 3. `.npmrc` — ignore-scripts の有効化

サプライチェーン攻撃の多くは post-install スクリプト経由。リポジトリルートに `.npmrc` を作成（または追記）:

```
ignore-scripts=true
```

そのうえで、本当にビルド時スクリプト実行が必要なパッケージだけを `package.json` の `pnpm.onlyBuiltDependencies` にホワイトリスト化する。

```json
// package.json 追記例
"pnpm": {
  "overrides": { "baseline-browser-mapping": "^2.10.8" },
  "onlyBuiltDependencies": [
    // ビルドに実際必要なものだけ精査して列挙。例:
    // "esbuild", "sharp" 等 — 現状 `pnpm install` のログを見て判断
  ]
}
```

**検証手順:** `.npmrc` 追加後に `pnpm install --frozen-lockfile` を実行し、エラーになる場合は必要なパッケージを `onlyBuiltDependencies` に追加する。astro、sharp、esbuild、@biomejs/biome、playwright、vite-plugin-turbosnap あたりが候補。

### 4. CI への `pnpm audit signatures` 追加

Sigstore ベースの署名検証を行う。`.github/workflows/build-types.yaml`（型チェックワークフロー）またはビルド系ワークフローの `pnpm install` 直後に追加。

```yaml
- name: Verify package signatures
  run: pnpm audit signatures
```

未署名パッケージの一部が fail する可能性があるため、まずは警告レベルで試験運用し、問題があれば `continue-on-error: true` を一時的に付ける。

### 5. CI への Dependency Review Action 追加

GitHub 公式アクション。PR の差分で新たに追加・更新される依存に既知の脆弱性や license issue があれば PR を fail させる。

`.github/workflows/review-dependency-pr.yaml` か新規の `dependency-review.yaml` に追加:

```yaml
on:
  pull_request:
    paths:
      - 'package.json'
      - 'pnpm-lock.yaml'
      - 'tools/package.json'
      - 'tools/pnpm-lock.yaml'

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: moderate
          comment-summary-in-pr: always
```

### 6. 戦略ドキュメント `docs/DEPENDENCY_POLICY.md` の新規作成

このプロジェクトの依存関係管理ポリシーを明文化した内部ドキュメントを作成する。`docs/VRT.md` と同じスタイル（プレーンな Markdown、Astro content collection の対象外）。

**記載する内容:**
- **背景と目的**: サプライチェーン攻撃事例（chalk/debug、ua-parser-js、event-stream 等）と、それを踏まえた方針
- **原則**: 自動 PR 作成なし／自動マージなし／全 PR は人間起点／脆弱性対応も Dashboard 経由
- **運用フロー図**: 通常更新 / 脆弱性対応の 2 経路
- **防御層の説明**:
  - Renovate Dependency Dashboard Approval
  - `minimumReleaseAge: 7 days` の根拠
  - `.npmrc` `ignore-scripts` と `pnpm.onlyBuiltDependencies`
  - `pnpm audit signatures`（Sigstore）
  - Dependency Review Action
  - Claude Code 自動レビュー
- **例外ルール**: 脆弱性即時対応が必要な場合の手順（Dashboard 即チェック or `pnpm.overrides` 直接追記）
- **レビュー観点**: 依存関係 PR をレビューする際のチェックリスト（新規 maintainer、公開日の不自然さ、post-install スクリプト、bundle size 急増など）
- `CLAUDE.md` から本ドキュメントへのリンクを追加

### 7. ブログ記事の新規作成 `src/content/posts/20260418_dependency_update_strategy.md`

内部ドキュメントとは別に、外部に向けた知見共有記事を執筆する。フロントマターは `src/content/config.ts` のスキーマに従う:

```markdown
---
title: 'Renovate 自動 PR をやめて Dependency Dashboard 承認式に切り替えた話'
description: 'サプライチェーン攻撃対策として Renovate の自動 PR 作成と自動マージを廃止し、Dashboard Approval 方式＋CI 多層防御に再設計した記録'
pubDate: 2026-04-18T00:00:00Z
imgSrc: '/assets/images/cover/dependency_strategy.webp'
imgAlt: '依存関係更新戦略'
tags:
  - ホムペ
  - Renovate
  - Security
  - pnpm
  - GitHub Actions
---
```

**構成:**
1. はじめに（なぜやめる決断をしたか、最近の事例への言及）
2. 元の構成（Renovate＋自動マージ＋Claude Code レビュー）の強みと限界
3. 要件整理（自動 PR 停止／自動マージ廃止／ダッシュボード維持／セキュリティ継続）
4. 採用した設計（Dashboard Approval＋多層防御）
5. 具体的な設定コード（`renovate.json5`、`.npmrc`、CI ワークフロー抜粋）
6. 脆弱性対応を Dependabot alerts（通知）に分離した理由
7. 想定される運用負荷と対処
8. 参考リンク（Renovate docs、GitHub Dependency Review、Sigstore 関連）

**画像アセット**: `/public/assets/images/cover/dependency_strategy.webp`（任意、後続追加可）

### 8. `CLAUDE.md` への追記
「依存関係管理ポリシー」セクションを追加し、`docs/DEPENDENCY_POLICY.md` と公開ブログ記事へのリンクを記載する（数行）。

### 9. 既存 Claude Code 自動レビューの維持

`review-dependency-pr.yaml` は現状のまま残す。Dashboard 承認式になっても、承認後に Renovate が作成した PR に対して従来通り自動レビューが走る。サプライチェーン検知の観点でレビュープロンプトを一行追加するとより良い:

- 「追加された依存関係について、公開日、maintainers、リリース履歴の不自然さをチェックしてください」

## 手動更新フロー（週次／月次運用）

### 通常更新フロー
1. 月曜 05:00 UTC に Renovate が Dependency Dashboard Issue を更新
2. ユーザー＝サンが Issue を開き、更新したいパッケージのチェックボックスを ON
3. Renovate が PR を作成
4. Dependency Review Action・`pnpm audit signatures`・Claude Code 自動レビューが走る
5. 人間が最終確認してマージ（マージボタンは人間のみが押す）

### 脆弱性対応フロー（Renovate ではなく GitHub 標準機能を使う）
1. GitHub が依存に脆弱性を検知 → リポジトリの **Security タブ → Dependabot alerts** に通知（PR は自動作成されない）
2. GitHub 通知メール or Web UI で確認
3. Dependency Dashboard の該当パッケージをチェック ON → Renovate PR 作成
   - または、Dashboard に載らない推移的依存の場合は `pnpm update <pkg>` / `pnpm audit --fix` を手動実行
4. 通常更新フローの 4〜5 と同じく CI 検証後に人間マージ

### Dependabot の扱い（重要）
- **リポジトリ設定で有効にするもの**: `Dependabot alerts`（通知のみ、PR なし）
- **無効のままにするもの**: `Dependabot security updates`（これを ON にすると PR を自動作成してしまい、「自動 PR 作成停止」原則と矛盾する）
- `.github/dependabot.yml` は作成しない（更新 PR を生まないため）

## 変更対象ファイル

| パス | 変更内容 |
|---|---|
| `renovate.json5` | Dashboard Approval・automerge 無効・minimumReleaseAge・`vulnerabilityAlerts.enabled: false` |
| `.github/workflows/renovate.yaml` | cron を週次に変更 |
| `.npmrc`（新規） | `ignore-scripts=true` |
| `package.json` | `pnpm.onlyBuiltDependencies` 追加 |
| `.github/workflows/dependency-review.yaml`（新規）または既存ビルドワークフロー | Dependency Review Action 追加 |
| `.github/workflows/build-types.yaml` or 新規 | `pnpm audit signatures` 追加 |
| `.github/workflows/review-dependency-pr.yaml` | レビュープロンプトに供給源チェック追記（任意） |
| `docs/DEPENDENCY_POLICY.md`（新規） | 内部向け依存関係管理ポリシー |
| `src/content/posts/20260418_dependency_update_strategy.md`（新規） | ブログ公開記事 |
| `CLAUDE.md` | 依存関係管理ポリシーのリンク追加（数行） |

参考: 外部プリセット `github>korosuke613/renovate-config` に自動マージ設定が含まれる場合、本リポジトリの `automerge: false` と `packageRules` で上書きされる（Renovate は後続設定が優先）。

## 検証手順

1. `renovate.json5` 変更後、既存の `dry-renovate.yaml` ワークフローを `workflow_dispatch` 実行し、ドライラン出力でチェックボックス方式になっていることを確認。
2. 実本番の次回実行で Dependency Dashboard Issue が作成／更新されることを確認。
3. Issue のチェックボックスを 1 つだけ ON にして、対応する PR が作られることを確認。
4. その PR で以下が全て動くことを確認:
   - Dependency Review Action
   - `pnpm audit signatures`
   - 既存の Claude Code 自動レビュー
5. PR に自動マージラベルや自動マージコメントが **付かない** ことを確認。
6. ローカルで `.npmrc` 有効状態の `pnpm install --frozen-lockfile` → `pnpm run build` → `pnpm test` が成功することを確認（`onlyBuiltDependencies` 調整の判断材料）。
7. GitHub リポジトリ設定（Settings → Security → Code security and analysis）を確認:
   - `Dependabot alerts` が **ON**
   - `Dependabot security updates` が **OFF**（自動 PR 防止）
   - `Dependency graph` が ON（Dependency Review Action の前提）
8. `docs/DEPENDENCY_POLICY.md` と新規ブログ記事について `pnpm run build` が成功することを確認（Astro の schema 検証を通す）。
9. `pnpm run dev` でブログ記事プレビューを確認（画像アセット未作成なら仮画像で可）。

## リスクと緩和策

| リスク | 緩和策 |
|---|---|
| 脆弱性対応の遅延（Renovate 自動 PR を捨てるため） | GitHub Dependabot alerts の通知を確実に受け取る（ユーザーの GitHub 通知設定で `Security alerts` を有効化）＋週次の Dashboard 確認で対応 |
| Dashboard / Security alerts 見落とし | 週次 GitHub Actions で Dashboard Issue 残タスク数と Security alert 件数を集計し Issue コメントで通知（後続改善） |
| `ignore-scripts` でビルド失敗 | `onlyBuiltDependencies` で必要最小限だけホワイトリスト化 |
| 外部プリセットの将来変更で自動マージ復活 | 本リポジトリ内で `automerge: false` を明示オーバーライド済み |
| `pnpm audit signatures` が未署名 npm パッケージで頻繁 fail | 当面 `continue-on-error: true` で段階導入 → 後日 fail-fast 化 |
| 更新停滞 | 月末リマインダーを Issue 化する別 Action を後日追加検討 |
| Dashboard に出ない推移的依存の脆弱性 | `pnpm audit` を CI で定期実行し検知。手動で `pnpm update` or `pnpm.overrides` で対応 |

## 対象外（本プランでは扱わない）

- `korosuke613/renovate-config` プリセット側の変更（本リポジトリ内で完結する上書きで対処）
- Socket.dev や Snyk など外部 SaaS の導入（将来の検討事項）
- `tools/` ディレクトリの同等対応（同じパターンで後追い可能。まずはルートで動作確認する）
