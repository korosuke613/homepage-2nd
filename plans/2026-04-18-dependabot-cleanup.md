# Dependabotアラートお掃除プラン

## Context
GitHub Dependabotが18件のオープンアラート（#102, #171, #172, #177, #182, #185, #186, #187, #188, #189, #190, #191, #192, #193, #194, #195, #196, #197）を報告中。全て推移的依存（root `pnpm-lock.yaml`）に対する脆弱性であり、直接依存には該当しない。アラート一覧をクリーンにし、今後のDependabot通知を残存可能性の高いものに集中させる。

## プロジェクトタイプと攻撃面分析

**プロジェクト**: Astroベース個人ホームページ。SSG（Static Site Generation）モードで運用。`astro build` で静的HTML/CSS/JSを生成しGitHub Pagesにデプロイ。本番成果物には Node.js ランタイム依存は含まれない。

**攻撃面**:
- 本番: 純静的ファイル（脆弱パッケージのコードは含まれない）
- ビルド時: 自分のブログ投稿データ、自分の設定ファイル（= 信頼できる入力のみ）
- 開発時: ローカルの dev server（公開されない）
- CI: GitHub Actions 内でのビルド・テスト（外部入力なし）

**結論**: 全アラートは「untrusted input を受ける経路が存在しない」ため、プロジェクト固有の攻撃面に該当しない。

## アラート仕分け結果

### A2: 直接依存のパッチ更新で推移的依存の解消を試行（3件）

パッチバージョン更新のみ、後方互換性ほぼ保証、低リスク。

| 直接依存 | 現バージョン | 更新先 | 期待する解消アラート |
|---|---|---|---|
| `@astrojs/rss` | 4.0.17 | 4.0.18 | #187 fast-xml-parser@5.4.1 → 5.5.6+ |
| `natural` | 8.1.0 | 8.1.1 | #171 underscore@1.13.7 → 1.13.8+ |
| `@astrojs/check` | 0.9.7 | 0.9.8 | #188 yaml@2.7.1 分（yaml-language-server経由） |

**注意**: これらはパッチ更新で推移的依存が引き上がることを**期待**するだけで、保証はない。Phase 6 の再スキャンで解消されなかった場合は C に振り替える。

### C: 影響なしとして `tolerable_risk` で dismiss（15件）

| # | パッケージ | 経路 | dismiss 理由 |
|---|---|---|---|
| #102 | glob@10.4.5 | vite-plugin-react-docgen-typescript, sucrase/tailwindcss, vitest/coverage, textlint 経由 | glob CLI の `-c/--cmd` 実行時のシェル注入。プロジェクトは glob CLI を起動しない。ライブラリAPIとしてのみ使用されるため攻撃条件不成立 |
| #172 | @tootallnate/once@2.0.0 | @google-analytics/data → google-gax → retry-request → teeny-request → http-proxy-agent 経由 | low severity。HTTPS Proxy経路でのフロー制御問題。プロキシ未使用、GA4サーバー直接アクセスのみ |
| #177 | flatted@3.3.3 | vitest / textlint 経由 | 信頼できないJSONを parse した場合のDoS。vitest はテストキャッシュ、textlint は flat-cache で自己生成ファイルのみ扱う |
| #182 | flatted@3.3.3 | 同上 | Prototype Pollution via parse。同経路・同理由 |
| #185 | h3@1.15.8 | astro/unstorage 経由 | `serveStatic` の Path Traversal。SSGビルドでは astro dev / preview のみで使用。本番公開されない |
| #186 | h3@1.15.8 | astro/unstorage 経由 | SSE Event Injection。同経路・同理由。SSE 機能未使用 |
| #188 | yaml@2.7.1 / 2.8.1 / 2.8.2 | @astrojs/check, tailwindcss/postcss-load-config, astro/@astrojs/yaml2ts 経由 | 深くネストされたYAMLによるStack Overflow。入力は自分の設定ファイル・langserver入力のみ |
| #189 | smol-toml@1.6.0 | @astrojs/markdown-remark 経由 | コメント行数千行でのDoS。自ブログ投稿のfrontmatterのみparse、投稿はYAML frontmatter採用でTOML未使用 |
| #190 | picomatch@4.0.3 | astro, storybook, vitest, vite 経由 | glob pattern での ReDoS。パターンは開発者設定値のみ、untrustedな入力からのパターン指定は無い |
| #191 | picomatch@2.3.1 | tailwindcss/chokidar, textlint/fast-glob 経由 | 同上。ビルド時の固定glob pattern利用 |
| #192 | picomatch@4.0.3 | 同経路 | POSIX character class method injection。同理由 |
| #193 | picomatch@2.3.1 | 同経路 | 同理由 |
| #194 | path-to-regexp@8.3.0 | textlint/@modelcontextprotocol/sdk/express/router 経由 | Optional groups ReDoS。textlint CLI のローカル実行、external HTTP 未受付 |
| #195 | path-to-regexp@8.3.0 | 同経路 | Multiple wildcards ReDoS。同理由 |
| #196 | brace-expansion@2.0.2 | minimatch@9/glob@10.4.5 経由 | Zero-step sequence DoS。glob patternは開発者設定値のみ |
| #197 | brace-expansion@1.1.12 | minimatch@3/glob@7/globby@10/@proofdict/textlint-rule-proofdict 経由 | 同理由。textlint のローカル実行経路 |

### B2: 該当なし
### B1: 該当なし
### D: Phase 7 の再スキャンで判定

## 実行計画

### Phase 5: アップデート実行（A2）

1. `pnpm add @astrojs/rss@4.0.18`
2. `pnpm add @astrojs/check@0.9.8`
3. `pnpm add natural@8.1.1`

`saveExact: true` のため `pnpm update` ではバージョンが更新されない。明示的に `pnpm add` で新バージョンを指定する。`@latest` は使わない。

### Phase 6: アップデート検証

- `pnpm list fast-xml-parser --depth=Infinity`
- `pnpm list underscore --depth=Infinity`
- `pnpm list yaml --depth=Infinity`
- `pnpm run build`
- `pnpm run lint`
- `pnpm run test:unit` （ユニットテストのみ。E2E/VRTは時間がかかる上、依存更新の検証にはユニットで十分）

### Phase 7: 再スキャン＆dismiss

`get-open-alerts.sh` で残存アラートを再取得。A2で解消できなかったアラート（#187, #171, #188 が残る可能性あり）は C に振替て dismiss 処理に含める。

**dismiss一括実行**（`dismiss-alerts-batch.sh`）:
- 理由: "Transitive dependency used only at build/test/dev time in this static site generator project. No untrusted input reaches the vulnerable code path in [具体的な経路]. Not exploitable in this project's threat model."
- `dismiss_reason`: `tolerable_risk`
- 対象: C分類の15件（+ A2が解消失敗した場合の追加アラート）

個別のdismiss理由はアラートごとに文言を調整する（上表の「dismiss 理由」列を使用）。

### Phase 8: 結果レポート

対応結果を表形式でサマリー報告。

## 修正対象ファイル

- `/Users/korosuke613/ghq/github.com/korosuke613/homepage-2nd/package.json`
- `/Users/korosuke613/ghq/github.com/korosuke613/homepage-2nd/pnpm-lock.yaml`
- （dismiss はAPI経由、ファイル変更なし）

## リスクと代替案

**リスク**:
- A2で引き上がる推移的依存がない可能性（特にマイナー/パッチ更新では、親パッケージが古いバージョン指定のまま）
- ただし失敗しても影響なし（ロールバック可能）

**スコープ外（今回は扱わない）**:
- メジャー更新 (astro 5→6, vitest 3→4, storybook 9→10, textlint 14→15, @google-analytics/data 4→5, tailwindcss 3→4) → Renovateが別PRで管理中
- tools/ディレクトリのアラート → 該当なし（recent commit で既に fast-xml-parser v5.5.7 へ更新済み）

## 検証手順（End-to-End）

1. `pnpm add` で3パッケージを更新
2. `pnpm list <vulnerable-package> --depth=Infinity` で脆弱パッケージのバージョン確認
3. `pnpm run build` が成功すること
4. `pnpm run lint` がエラーなく完走すること
5. `pnpm run test:unit` がグリーンであること
6. `scripts/get-open-alerts.sh` で再スキャンし、残存アラートを確認
7. `scripts/dismiss-alerts-batch.sh` でC分類アラートを一括dismiss
8. 再度 `scripts/get-open-alerts.sh` で0件または残存B2系のみになったことを確認

---

## 実行結果（2026-04-18 実行完了）

### Phase 5: A2 アップデート実行結果

実行コマンド: `pnpm add @astrojs/rss@4.0.18 @astrojs/check@0.9.8 natural@8.1.1`

### Phase 6a: 推移的依存の検証

| 期待解消アラート | 直接依存 | 結果 | 検証内容 |
|---|---|---|---|
| #187 fast-xml-parser | `@astrojs/rss` | ✅ **解消** | fast-xml-parser@5.4.1 → 5.5.11 に引き上がり。脆弱範囲 `< 5.5.6` を脱出 |
| #171 underscore | `natural` | ❌ **未解消** | natural@8.1.1 でも underscore@1.13.7 のまま（依存指定が固定バージョン） |
| #188 yaml | `@astrojs/check` | ❌ **未解消** | yaml@2.7.1 / 2.8.1 / 2.8.2 が3系統で残存。yaml-language-server / postcss-load-config / vite の依存指定が変わらず |

### Phase 6b: ビルド・lint・テスト検証

| チェック | 結果 | 備考 |
|---|---|---|
| `pnpm run lint` | ✅ グリーン | Biome 171ファイル、No fixes applied |
| `pnpm run test:unit` | ✅ グリーン | vitest coverage出力完走 |
| `pnpm run build` | ❌ 失敗 | `@astrojs/db@0.20.0` の `getTempViteServer` で `Cannot read properties of undefined (reading 'client')` |

**ビルドエラーの原因分析**: `git stash` で更新前の main へ戻してビルド再実行したところ**同じエラーが再現**。今回の依存更新とは無関係の既存問題と判定。`@astrojs/db@0.20.0` が `astro@5.18.1` の内部 vite サーバー API に互換性のない参照をしている模様。**本タスクのスコープ外として別イシューで対応**。

### Phase 7: dismiss 実行結果

**振替え**: A2で解消できなかった #171, #188 を C に追加し、dismiss対象を **計17件** に拡張。

**実行結果**:
- 全17件を `dismiss-alert.sh` でアラートごとに個別理由付きで `tolerable_risk` として dismiss 完了
- 実行時に **GitHub API の dismiss_comment は280文字上限**という仕様制約を発見（#188初回実行時に HTTP 422）。長文コメントは短縮版に書き直して再実行
- Auto Modeの permission guard が発動し、ユーザー＝サンの明示承認（「実行」「さらに実行」）を得てから2回に分けて送信

### Phase 8: 最終状態

| カテゴリ | 件数 | アラート番号 |
|---|---|---|
| A2: 直接依存アップデートで解消 | 1件 | #187（lockfile push 後に Dependabot 自動クローズ） |
| C: dismiss済み（tolerable_risk） | 17件 | #102, #171, #172, #177, #182, #185, #186, #188, #189, #190, #191, #192, #193, #194, #195, #196, #197 |
| D / B1 / B2 | 0件 | なし |
| **残存オープン** | 1件 | #187（ローカルのlockfileは更新済み、push待ち） |

### 変更ファイル

- `package.json`: 3パッケージのバージョン文字列を更新
- `pnpm-lock.yaml`: `fast-xml-parser@5.5.11` 含む lockfile 更新
- `generated/years.json`: ビルド副産物（自動生成、コミット対象外扱いが無難）

### 次アクション（ユーザー判断待ち）

1. **コミット & push**: `fix:` プレフィックスで脆弱性修正コミット。push すれば #187 を Dependabot が自動クローズ
2. **ビルドエラー対処**: `@astrojs/db@0.20.0` vs `astro@5.18.1` 互換問題を別イシュー化

### 得られた知見（次回のdependabot-cleanup時に再利用）

- `saveExact: true` の pnpm 環境では `pnpm update` ではなく `pnpm add pkg@ver` で明示指定が必須
- `dismiss_comment` は **280文字以内**。API仕様ドキュメントに明記なし、エラー時に判明する
- Auto Mode の permission guard は「外部システム書き込み」を検知する。dismiss 等を大量に実行する場合は事前にユーザー承認を得ること
- Astro SSG プロジェクトでは本番成果物に脆弱パッケージのコードが含まれないため、推移的依存の脆弱性は大半が `tolerable_risk` として妥当に dismiss できる
