# 依存関係管理ポリシー

このドキュメントは、本リポジトリにおける npm 依存関係の更新・セキュリティ運用方針を定めます。

## 背景と目的

近年の npm エコシステムでは、メンテナアカウント乗っ取りや typo-squatting を起点としたサプライチェーン攻撃が頻発しています（例: `event-stream`、`ua-parser-js`、`node-ipc`、`chalk` / `debug` への攻撃、`xz-utils` 事例など）。

これらの攻撃の多くは、**公開後 24〜72 時間以内に検知・削除** されています。つまり「新しい版をすぐ取り込まない」だけで、実効的なリスク低減が可能です。

一方で、依存関係更新を怠ると、既知の脆弱性が放置されて別のセキュリティリスクを生みます。本ポリシーは、両者のバランスを取るためのものです。

## 原則

1. **自動 PR 作成は行わない**: Renovate による定期的な自動 PR 作成を廃止し、Dependency Dashboard Issue のチェック承認式で人間が起点となる運用に切り替えます
2. **自動マージは行わない**: いかなる依存関係更新 PR も人間の最終確認を経てマージします
3. **脆弱性対応も Dashboard 経由**: Renovate の脆弱性自動 PR 機能（`vulnerabilityAlerts`）は無効化します。脆弱性は GitHub Dependabot Alerts の通知で検知し、Dashboard 経由で対応します
4. **多層防御**: 単一の防御に依存せず、cool-off 期間・署名検証・スクリプト無効化・レビューを組み合わせます

## 運用フロー

### 通常更新フロー（週次／月次）

```
[月曜 05:00 UTC]
  Renovate が Dependency Dashboard Issue を更新
       ↓
[任意のタイミング]
  メンテナが Issue を開き、更新したい項目にチェック ON
       ↓
  Renovate が PR を作成
       ↓
[PR に対して CI 実行]
  ・Dependency Review Action
  ・pnpm audit signatures
  ・Claude Code 自動レビュー
  ・通常の lint / build / test
       ↓
  メンテナが最終レビュー → 手動マージ
```

### 脆弱性対応フロー

```
[GitHub が検知]
  Security タブ → Dependabot alerts に通知
  （PR は自動作成されない）
       ↓
[メンテナ確認]
  GitHub 通知メール or Web UI で内容確認
       ↓
  Dependency Dashboard で対象パッケージをチェック ON
  （Dashboard に出ない推移的依存は `pnpm update <pkg>`
   または `pnpm.overrides` で手動対応）
       ↓
  通常更新フローの CI→マージに合流
```

**重要**: リポジトリ設定で `Dependabot alerts` は ON、`Dependabot security updates` は OFF のままにします。後者を ON にすると PR を自動作成してしまい、本ポリシーと矛盾します。

## 防御層

### 1. Renovate Dependency Dashboard Approval
`renovate.json5` で `dependencyDashboardApproval: true` を設定しています。これにより全ての更新候補は PR 化されず、Dashboard Issue にチェックボックスとして並びます。

### 2. `minimumReleaseAge: 7 days`
npm 公開から 7 日未満のバージョンは候補から除外します。悪意あるパッケージの多くはこの期間内に検知・削除されるため、「待つ」ことが最も効果的な防御になります。

### 3. `.npmrc` `ignore-scripts=true`
依存関係の lifecycle script（`install`、`postinstall`、`prepare` 等）の自動実行を全て無効化します。サプライチェーン攻撃の大半は post-install スクリプト経由で発動するため、これを塞ぐことで攻撃面を大きく減らせます。

本プロジェクトはプロジェクト自身の lifecycle script を使用しておらず、ネイティブモジュール（`esbuild`、`sharp` 等）は platform-specific prebuild binary で動作するため、この設定でビルドに支障はありません。

### 4. `pnpm.onlyBuiltDependencies: []`
pnpm 10 のホワイトリスト機能を空配列で明示設定し、「いかなる依存のビルドスクリプトも許可しない」という意図をコードで表明します。将来ネイティブ compile が必要なパッケージを追加する場合は、この配列に追記する形で許可します。

### 5. `pnpm audit signatures`（Sigstore 検証）
CI の lint ジョブで `pnpm audit signatures` を実行し、npm パッケージの Sigstore 署名を検証します。段階導入のため当面は `continue-on-error: true` とし、未署名パッケージの警告を蓄積します。

### 6. GitHub Dependency Review Action
`dependency-review.yaml` ワークフローで、PR 差分に含まれる新規・更新依存に既知の脆弱性や license issue がないかをチェックし、`moderate` 以上で fail させます。

### 7. Claude Code 自動レビュー
`review-dependency-pr.yaml` で、`kiba-renovate[bot]` と `dependabot[bot]` からの PR に対し Claude Code がコードレビューを実施します。サプライチェーン観点では、以下を確認します。
- 追加された依存の公開日・maintainer・release 履歴の不自然さ
- post-install スクリプトの有無と内容
- bundle size の急増

## 例外ルール: 緊急脆弱性対応

以下の条件を全て満たす場合、`minimumReleaseAge` 未満のバージョンでも取り込みを許可します。

- GitHub Security Advisory で高 severity（High / Critical）と判定されている
- 本プロジェクトの依存ツリーに確実に影響する
- fix バージョンが公式 maintainer からリリースされている

対応手順:
1. Dependency Dashboard で該当パッケージをチェック ON（cool-off 設定に関わらず候補化される）
2. または `pnpm update <pkg>` を手動実行し、lockfile 差分を PR 化
3. Renovate プリセットや Dashboard で拾えない推移的依存は、`package.json` の `pnpm.overrides` で固定

## 依存関係 PR レビューチェックリスト

依存関係更新 PR をレビューする際、以下を必ず確認します。

- [ ] 公開日が極端に新しくないか（`minimumReleaseAge` で除外されているはずだが念押し）
- [ ] maintainer に不自然な変化はないか（新規 maintainer が急に publish など）
- [ ] release note / CHANGELOG に不審な変更はないか
- [ ] post-install / install / prepare スクリプトの追加・変更はないか
- [ ] bundle size / 依存数が急増していないか
- [ ] license が許容範囲内か（Dependency Review Action が拾うはず）
- [ ] 既存テストが通るか

## 関連ファイル

| パス | 役割 |
|---|---|
| `renovate.json5` | Dashboard Approval 設定 |
| `.npmrc` | `ignore-scripts=true` |
| `package.json` (`pnpm.onlyBuiltDependencies`) | 空配列で build script 全ブロック |
| `.github/workflows/renovate.yaml` | Renovate 実行（週次 cron） |
| `.github/workflows/dependency-review.yaml` | Dependency Review Action |
| `.github/workflows/ci.yaml` (lint job) | `pnpm audit signatures` |
| `.github/workflows/review-dependency-pr.yaml` | Claude Code 自動レビュー |

## 公開記事

このポリシーの背景と設計経緯は、以下のブログ記事としても公開しています。

- [Renovate 自動 PR をやめて Dependency Dashboard 承認式に切り替えた話](/posts/20260418_dependency_update_strategy)
