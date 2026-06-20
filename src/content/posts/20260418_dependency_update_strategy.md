---
title: 'Renovate 自動 PR をやめて Dependency Dashboard 承認式に切り替えた話'
description: 'サプライチェーン攻撃対策として、Renovate による自動 PR 作成と自動マージを廃止し、Dependency Dashboard Approval 方式＋CI 多層防御に再設計した記録'
pubDate: 2026-04-18T00:00:00Z
imgSrc: '/assets/images/cover/compare_renovate_logs_workflow.webp'
imgAlt: '依存関係更新戦略のイメージ'
tags:
  - ホムペ
  - Renovate
  - Security
  - pnpm
  - GitHub Actions
  - Pickup ⭐️
---

## はじめに

このホームページ（homepage-2nd）では長らく、[Renovate](https://docs.renovatebot.com/) に依存関係更新の自動 PR 作成と自動マージを任せていました。Claude Code による自動レビューも乗せていて、なかなか良い体制だったと思います。

が、昨今の npm エコシステムにおけるサプライチェーン攻撃事例を見るにつけ「これ、自動マージしてていいんだっけ？」という気持ちが高まってきました。本記事では、**Renovate による自動 PR 作成と自動マージを全廃止**しつつ、更新フローを破綻させないために採った設計を記録します。

## なぜやめる決断をしたか

### 最近のサプライチェーン攻撃

記憶に新しい事例だけ挙げても、なかなかの数です。

- `event-stream` への悪意あるコード混入（2018）
- `ua-parser-js` のメンテナアカウント乗っ取り（2021）
- `node-ipc` へのプロテストウェア化（2022）
- `xz-utils` の長期潜伏型バックドア（2024）
- `chalk` / `debug` などの大規模 npm パッケージ群への攻撃（2025）

攻撃の多くは公開後 24〜72 時間以内に検知・削除されています。つまり**「新しい版をすぐ取り込まない」だけで、かなりの実効防御になる**わけです。

### 自動マージのおそろしさ

自動マージ運用下では、悪意あるバージョンが npm にアップロードされた瞬間に、

1. Renovate が 30 分以内に PR を作成
2. CI が走る（多くの場合 green になる。攻撃はビルド結果を壊さない設計のことが多い）
3. 自動マージされる
4. デプロイ or 次回のビルドで汚染コードが取り込まれる

という流れを一切の人間の介入なしに駆け抜けてしまいます。Claude Code 自動レビューを挟んでいても、攻撃パッケージの「不自然さ」を全部拾える保証はなく、おそろしい。

## 要件整理

やめたい気持ちを出発点に、要件を整理しました。

1. 自動 PR 作成は停止する
2. 自動マージは全廃止する
3. ただし「更新候補の見える化」は維持したい（Renovate Dashboard のようなもの）
4. 週次または月次で手動更新する現実的なフロー
5. 脆弱性対応の経路は別途確保する（更新停止で既知 CVE を放置するのは別種のセキュリティリスク）
6. CI 側でもサプライチェーン攻撃への防御を厚くする

## 採用した設計

### コア: Renovate Dependency Dashboard Approval モード

実は Renovate には `dependencyDashboardApproval: true` というオプションがあります。これを有効にすると、**すべての更新候補は PR 化されず、Dashboard Issue のチェックボックスとして並ぶ**だけになります。人間がチェックを入れた時だけ PR が作成される、承認起点の運用に切り替わります。

```json5
{
  $schema: 'https://docs.renovatebot.com/renovate-schema.json',
  extends: [
    'github>korosuke613/renovate-config',
  ],
  dependencyDashboard: true,
  dependencyDashboardApproval: true,
  automerge: false,
  packageRules: [
    { matchPackagePatterns: ['*'], automerge: false },
  ],
  minimumReleaseAge: '7 days',
  schedule: ['before 5am on monday'],
  vulnerabilityAlerts: {
    enabled: false,
  },
}
```

ポイントを順に。

- `dependencyDashboardApproval: true` がコア設定
- `automerge: false` をトップレベルと `packageRules` の両方に書いて、外部プリセットの上書き漏れを防止
- `minimumReleaseAge: '7 days'` で cool-off 期間を設定。攻撃パッケージが削除される時間を稼ぐ
- `schedule` は週次で十分。Dashboard 承認式なので 30 分毎に走る意味がない
- `vulnerabilityAlerts.enabled: false` が地味に重要。後述

### 脆弱性対応をなぜ Dependabot alerts に分離したか

最初、脆弱性対応だけは Renovate の `vulnerabilityAlerts` で即時対応させようと考えていました。でもこの機能、**Dashboard Approval をバイパスして自動 PR を作成する仕様**なんですよね。つまり、

- 通常更新: Dashboard 承認式（人間起点）
- 脆弱性更新: 自動 PR 作成（Renovate 起点）

という不整合が発生します。「全 PR は人間起点」という原則が崩れるのは気持ち悪い。

そこで、脆弱性対応は GitHub 標準の **Dependabot alerts**（通知のみ、PR は作成しない機能）に完全分離しました。

- GitHub が脆弱性を検知 → リポジトリの Security タブに通知
- メンテナ（わたし）が通知メールで内容を確認
- Dependency Dashboard の該当パッケージをチェック ON → Renovate が PR 作成
- 通常フローと同じ CI→手動マージ

注意点として、リポジトリ設定で

- `Dependabot alerts`: **ON**（通知のみ）
- `Dependabot security updates`: **OFF**（これを ON にすると PR を自動作成してしまう）

という区別をつける必要があります。ここは手動で GitHub の Settings → Code security から設定します。

### CI 側の多層防御

Renovate 側で「自動性」を剥いだ分、CI 側で防御を足しました。

**1. `.npmrc` `ignore-scripts=true`**

サプライチェーン攻撃の多くは post-install スクリプト経由で発動します。これを根本から塞ぐために、依存関係のすべての lifecycle script を無効化しました。

```
ignore-scripts=true
```

このプロジェクトはプロジェクト自身の lifecycle script を使っておらず、ネイティブモジュール（`esbuild`、`sharp` 等）は platform-specific prebuild binary で動作するため、この設定でビルドに支障はありませんでした。pnpm 10 ではそもそもデフォルトで依存のビルドスクリプトがブロックされる仕様ですが、`.npmrc` 側の設定は npm/yarn で install された場合にも効くため、belt and suspenders の意味があります。

**2. `pnpm.onlyBuiltDependencies: []`**

pnpm 10 のホワイトリスト機能に空配列を明示設定し、「いかなる依存のビルドスクリプトも許可しない」という意図をコードで表明しました。将来ネイティブ compile が必要になった時は、ここに追記する形で許可します。

**3. `pnpm audit signatures`（Sigstore 検証）**

CI の lint ジョブで `pnpm audit signatures` を実行し、npm パッケージの Sigstore 署名を検証します。未署名パッケージで頻繁に fail する懸念があったので、当面は `continue-on-error: true` で段階導入。

```yaml
- name: Verify package signatures
  run: pnpm audit signatures
  continue-on-error: true
```

**4. GitHub Dependency Review Action**

PR 差分で新たに追加・更新される依存に既知の脆弱性や license issue がないかをチェック。`moderate` 以上で fail させます。

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

**5. Claude Code 自動レビュー（継続）**

既存の Claude Code 自動レビューはそのまま残しました。Dashboard 承認後に作られる PR に対しても引き続き動きます。

## 想定している運用負荷

週に一度、月曜朝イチで Dashboard Issue を開いてチェックを入れる、くらいの手間を想定しています。個人ホームページ規模なら十分現実的な負荷。

ずぼらしていると更新が溜まっていくリスクはあるので、後続改善として「月末に残タスク数を Issue コメントで通知する Action」を入れる予定です。

## おわりに

依存関係管理のポリシーは [docs/DEPENDENCY_POLICY.md](https://github.com/korosuke613/homepage-2nd/blob/main/docs/DEPENDENCY_POLICY.md) にまとめました。ブログ記事と違ってコードに近いところに置いておきたかったので、docs/ に置いています。

サプライチェーン攻撃は「いつか自分のプロジェクトが巻き込まれる可能性がある」というスタンスで備えるのが良いと感じています。Renovate の自動化は便利ですが、便利さと引き換えに失うものも認識しつつ、プロジェクトの規模と目的に合わせて調整していきたいところ。

それでは、良き依存関係管理を。

## 参考リンク

- [Renovate: Dependency Dashboard](https://docs.renovatebot.com/key-concepts/dashboard/)
- [Renovate: `dependencyDashboardApproval`](https://docs.renovatebot.com/configuration-options/#dependencydashboardapproval)
- [Renovate: `minimumReleaseAge`](https://docs.renovatebot.com/configuration-options/#minimumreleaseage)
- [GitHub: Dependabot alerts について](https://docs.github.com/ja/code-security/dependabot/dependabot-alerts/about-dependabot-alerts)
- [GitHub: Dependency Review Action](https://github.com/actions/dependency-review-action)
- [pnpm: `onlyBuiltDependencies`](https://pnpm.io/settings#onlybuiltdependencies)
- [npm: Verifying package signatures](https://docs.npmjs.com/verifying-package-signatures)
