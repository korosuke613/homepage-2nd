# `/deps-update` Skill 化プラン

## Context

本リポジトリは `docs/DEPENDENCY_POLICY.md` で Renovate Dependency Dashboard Approval 方式を採用し、`minimumReleaseAge: 7 days` 等の多層防御を敷いている。この仕組みに **手元 Claude Code 主導の依存更新フロー**を追加したい:

- Dashboard を候補リスト UI として参照しつつ、PR 作成・CHANGELOG 収集・怪しさチェック・実行を手元 Claude Code に寄せる
- `minimumReleaseAge` や `ignore-scripts=true` といった既存防御層は崩さず再現する
- 1 セッション 1 レベル（security / patch / minor / major のいずれか1種類）に絞り、変更範囲を制御する
- できるだけモノレポ系パッケージをグルーピングする
- 怪しい変更（新規 maintainer、install scripts、bundle size 急増等）を可視化する

**実装形式の決定**: 当初スラッシュコマンド（`.claude/commands/deps-update.md`）化を検討したが、本フローは以下の特徴を持ち Skill 形式が最適と判断した:

- 多段ワークフロー（情報収集 → 分類 → グルーピング → 怪しさチェック → plan 生成 → 承認 → 実行）
- 外部ツール多数呼び出し（`gh`、`npm view`、`pnpm`、`git`）
- ユーザー承認を中間で挟む
- 引数あり（`--level` / `--emergency` / `--dry-run`）
- 参照資料を分割管理したい（plan テンプレート、詳細ルール）

Skill は `/deps-update` として手動起動可能かつ、description による自動起動判定も効くため、「skill としてスラッシュコマンド化」というユーザー＝サンの要求を両立できる。

## 成果物

### 新規ファイル・ディレクトリ

```
.claude/skills/
└── deps-update/
    ├── SKILL.md              # メイン: frontmatter + Phase A〜G の手順
    └── templates/
        └── plan.md           # Phase E の plan ファイルテンプレート
```

既存ファイルへの変更は**なし**。`docs/DEPENDENCY_POLICY.md` への言及追加は将来タスク。

### SKILL.md frontmatter 設計

```yaml
---
name: deps-update
description: 依存関係を1レベル単位（security / patch / minor / major のいずれか）でグルーピング更新する。Dependency Dashboard 参照、minimumReleaseAge 7日尊重、怪しさチェック付き。グループごとに PR 化する。「依存関係を更新して」「patch 更新」等の依頼で起動。
allowed-tools: Read, Write, Edit, Glob, Grep, LS, Bash(gh:*), Bash(npm view:*), Bash(curl:*), Bash(jq:*), Bash(pnpm outdated:*), Bash(pnpm update:*), Bash(pnpm install:*), Bash(pnpm add:*), Bash(pnpm audit:*), Bash(pnpm run:*), Bash(pnpm test:*), Bash(pnpm exec:*), Bash(pnpm why:*), Bash(git status:*), Bash(git log:*), Bash(git branch), Bash(git diff:*), Bash(git switch:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(git pull:*)
argument-hint: "[--level security|patch|minor|major] [--emergency] [--dry-run]"
---
```

**frontmatter 検証方針**: `disable-model-invocation` や `context: fork` は claude-code-guide が挙げた 2026 年仕様として紹介されたが、本プロジェクトでは初採用のため、まず上記 4 フィールド（`name` / `description` / `allowed-tools` / `argument-hint`）で動作確認し、必要に応じて追加する。

### 引数設計

SKILL.md 本文の冒頭で `$ARGUMENTS` を解釈する:

| 引数 | 意味 | 既定 |
|---|---|---|
| `--level security\|patch\|minor\|major` | 対応レベルを明示指定 | 自動選定（優先度最高） |
| `--emergency` | GHSA High/Critical 時のみ `minimumReleaseAge: 7 days` 未達許容 | false |
| `--dry-run` | Phase A〜E のみ実施（`pnpm update` を行わない） | false |
| 引数なし | 自動選定で Phase A〜E、承認後 Phase F〜G | - |

起動例: `/deps-update`、`/deps-update --level patch`、`/deps-update --dry-run`、`/deps-update --emergency --level security`

## SKILL.md 本文の構造（7 Phase）

### Phase A: 情報収集（3 点突合）

```bash
# Dependency Dashboard Issue
gh issue list --state open --search "Dependency Dashboard in:title" --json number,title,body

# pnpm outdated（ルート & tools/）
pnpm outdated --format json
cd tools && pnpm outdated --format json && cd -

# GHSA / Dependabot alerts
gh api /repos/korosuke613/homepage-2nd/dependabot/alerts \
  --jq '[.[] | select(.state=="open")]'
```

`minimumReleaseAge` 検証（各候補 `pkg@target`）:

```bash
npm view <pkg>@<target> time.<target> --json
```

- `publishedAt + 7 days <= now()` → 採用
- 未達 → 7 日以上経過した直近バージョンへダウングレード採用
- 全バージョン未達 → 今回は見送り
- `--emergency` かつ GHSA High/Critical 時のみ未達許容

### Phase B: レベル分類・1 レベル選定

semver 比較で `security` / `patch` / `minor` / `major` に分類（security は GHSA 該当で最優先）。

`--level` 未指定時は **優先度最高の存在するレベルのみ対応**（security > patch > minor > major）。複数レベル混在は禁止。

### Phase C: グルーピング

選定レベル内で以下の優先順:

1. モノレポ関連は1グループ: `astro` + `@astrojs/*`、`@biomejs/*`、`vitest` + `@vitest/*`、`@playwright/*` + `playwright`、`storybook` + `@storybook/*`
2. ルートと `tools/` は別グループ
3. major は必ず単独グループ
4. それ以外は個別グループ
5. `@types/*` は対応する本体パッケージに相乗り

グループ命名: モノレポは `astro-monorepo` / `biome` / `vitest` / `playwright` / `storybook`、単独は `<pkg-name>`。

### Phase D: 怪しさチェック

| 項目 | コマンド | 🚨 条件 |
|---|---|---|
| 公開日 | `npm view <pkg>@<target> time.<target>` | 7 日未満 |
| maintainer 変化 | `npm view <pkg> maintainers --json` と前版比較 | 新規 maintainer 追加 |
| install scripts | `npm view <pkg>@<target> scripts --json` | `install` / `postinstall` / `preinstall` / `prepare` / `prepublish` のいずれか存在 |
| bundle size | `npm view <pkg>@<target> dist.unpackedSize` と前版比較 | 2 倍以上に膨張 |
| direct dependencies | `npm view <pkg>@<target> dependencies --json` と前版比較 | 新規 direct 依存追加 |
| repository URL | `npm view <pkg>@<target> repository.url` と前版比較 | URL 変化 |
| release note | GitHub Releases / CHANGELOG.md | URL 取得不能 or 空 |

1 つでも fail → Phase E の plan に 🚨 マーク（自動ブロックではなく**可視化**が目的）。

### Phase E: plan ファイル生成

`templates/plan.md` を雛形として `plans/YYYY-MM-DD-deps-<level>-<topic>.md` を生成する。

### Phase F: ユーザー承認

plan ファイル生成直後、**ユーザー＝サンの明示的な GO サインを待つ**。「実行して」「go」「進めて」等の明示指示を受けたら Phase G へ。

`--dry-run` 指定時は Phase F で終了。

### Phase G: 実行（グループ単位で順次）

```bash
# G-1. ブランチ作成
git switch main && git pull
git switch -c deps/<date>-<level>-<group-name>

# G-2. 更新（ルート / tools の該当側）
pnpm update <pkg>@<version> [...]
# tools/ 該当時
cd tools && pnpm update <pkg>@<version> [...] && cd -

# G-3. 安全チェック（全部通過必須）
pnpm install
pnpm audit signatures
pnpm audit
pnpm run lint
pnpm run build-types
pnpm run build          # 60秒以上。タイムアウト厳禁（CLAUDE.md オキテ）
pnpm test

# G-4. commit & push & PR
git add package.json pnpm-lock.yaml [tools/package.json tools/pnpm-lock.yaml]
git commit -m "build: update <group-name> to <version>"
git push -u origin HEAD
gh pr create --title "build: update <group-name>" --body "<Phase E の差分サマリ>"
```

いずれかの安全チェックが失敗 → PR 作成せず停止 → 原因分析してユーザー＝サンに報告。

**`review-dependency-pr.yaml` は `kiba-renovate[bot]` / `dependabot[bot]` / `workflow_dispatch` 限定のため、手元発 PR では自動起動しない**。Phase D の怪しさチェック結果を PR body に転記してレビュー情報を補完する。将来 `gh workflow run review-dependency-pr.yaml -f pr_number=<num>` を Phase G に組み込む選択肢は残す。

## templates/plan.md の構造

Phase E で生成される plan ファイルの雛形:

```markdown
# 依存関係更新プラン: {{level}} / {{date}}

## 情報源サマリ
- Dashboard Issue: #{{issue_number}}（候補 {{total_candidates}} 件）
- pnpm outdated: ルート {{root_count}} 件 / tools {{tools_count}} 件
- GHSA open: {{ghsa_count}} 件（うち該当 {{relevant_ghsa_count}} 件）

## 今回対応レベル
{{level}}（理由: {{reason}}）

## 見送り候補（次回以降 or Dashboard 残置）
{{deferred_list}}

## 実行グループ一覧

### Group {{n}}: {{group_name}}
| パッケージ | 現在 | 更新先 | 公開日 | maintainer | scripts | bundle | release note |
|---|---|---|---|---|---|---|---|
{{rows}}

#### 怪しさ警告
{{warnings or "該当なし"}}

#### 実行コマンド
\`\`\`bash
{{commands}}
\`\`\`

## 承認を要する判断
- [ ] 対応レベル: {{level}} で良いか
- [ ] 怪しさ警告 🚨 の個別許容
- [ ] 実行順序（1レベルのみ今回実行する前提）
```

## SKILL.md 内の参照（`@...` 記法）

SKILL.md 冒頭で以下を参照させる:

```
@docs/DEPENDENCY_POLICY.md
@renovate.json5
@.npmrc
@package.json
@tools/package.json
```

これにより Claude Code は Skill 起動時に最新の設定値を自動ロードする。

## 既存ポリシー・設定との整合

| 既存要素 | 手元フロー側の対応 |
|---|---|
| `renovate.json5: minimumReleaseAge: 7 days` | Phase A で `npm view time` により再現 |
| `renovate.json5: dependencyDashboardApproval: true` | Dashboard を情報源として参照のみ（チェックボックス操作不要） |
| `renovate.json5: vulnerabilityAlerts: { enabled: false }` | GHSA を手元で直接照会 |
| `.npmrc: ignore-scripts=true` | 手元 `pnpm install` でも尊重される |
| `package.json: pnpm.onlyBuiltDependencies: []` | 変更なし |
| `package.json: pnpm.overrides: { baseline-browser-mapping }` | 推移的依存対応時、既存キーとの衝突に注意 |
| `ci.yaml: pnpm audit signatures` | 手元でも同コマンドを Phase G-3 で実行 |
| `dependency-review.yaml` | PR 作成後に自動起動（変更不要） |
| `review-dependency-pr.yaml` | 手元発 PR では自動起動しない → Phase D で代替情報を生成 |

## 検証手順（実装後の段階的確認）

1. **Skill 検出確認**: `.claude/skills/deps-update/SKILL.md` 作成後、Claude Code セッション再起動し `/deps-update` で起動するか確認
2. **dry-run 動作**: `/deps-update --dry-run` で Phase A〜E のみ走り、`plans/YYYY-MM-DD-deps-<level>-<topic>.md` が生成されること、`pnpm update` が呼ばれないことを確認
3. **patch 単独更新**: 軽微な patch 更新 1 パッケージを `--level patch` で指定し、Phase A〜G が完走し PR が作られ CI green になることを確認
4. **minor グループ更新**: `astro-monorepo` 系の minor 更新で Phase C のグルーピングが `astro` + `@astrojs/*` を 1 グループにまとめることを確認
5. **minimumReleaseAge 未達検証**: 7 日未満の target が返ってくる候補に対し、Phase A がダウングレード or 見送り判定することを確認
6. **怪しさ警告**: `install` スクリプトを持つパッケージを含むグループで Phase D が 🚨 を出すことを確認
7. **レベル混在禁止**: `--level security` 指定時に patch 候補が自動無視されることを確認
8. **description 自動起動**: スラッシュコマンド以外にも「依存関係を更新して」等の発話で Claude が Skill を起動するか確認（description の書き方調整の機会）

## 将来タスク（本プランのスコープ外）

- `docs/DEPENDENCY_POLICY.md` に「手元 Skill `/deps-update` 運用パス」セクションを追記
- `.github/workflows/review-dependency-pr.yaml` の発火条件拡張（`deps/` ブランチプリフィクス発 PR、または Skill 内で `workflow_dispatch` 自動起動）
- `reference.md` を `.claude/skills/deps-update/` 配下に追加し、グルーピング詳細ルール・怪しさチェックの検知閾値を外出しする（SKILL.md が肥大化したら）
- `scripts/validate-release-age.sh` 等のヘルパースクリプトを同ディレクトリに分離（Skill 本文で bash ロジックが肥大化したら）
- Skill 側から `disable-model-invocation: true` 追加検討（自動起動を嫌う場合）

## プランモード終了後の段取り

CLAUDE.md のオキテに従い、プランモード抜けたら本プランファイル名を `plans/2026-04-18-deps-update-skill.md` へリネーム（`git mv` 相当）。

その後、以下の順で実装:

1. `.claude/skills/deps-update/` ディレクトリ作成
2. `.claude/skills/deps-update/SKILL.md` 新規作成（上記設計通り）
3. `.claude/skills/deps-update/templates/plan.md` 新規作成（雛形）
4. Claude Code セッション再起動して `/deps-update --dry-run` で検証（Phase A〜E のみ）
5. 問題なければ `/deps-update --dry-run --level patch` 等で段階検証、最終的に実地運用へ
