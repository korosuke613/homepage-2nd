---
name: deps-update
description: 依存関係を1レベル単位（security / patch / minor / major のいずれか）でグルーピング更新する。Dependency Dashboard 参照、minimumReleaseAge 7日尊重、怪しさチェック付き。グループごとに PR 化する。
when_to_use: ユーザーが「依存関係を更新して」「patch 更新」「依存パッケージの最新化」「Dependabot アラートを対応して」等の依頼をした時、または `/deps-update` で明示起動された時。
argument-hint: "[--level security|patch|minor|major] [--emergency] [--dry-run]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - LS
  - Bash(gh issue list:*)
  - Bash(.claude/skills/deps-update/scripts/fetch-dependabot-alerts.sh:*)
  - Bash(npm view:*)
  - Bash(curl:*)
  - Bash(jq:*)
  - Bash(pnpm outdated:*)
  - Bash(pnpm update:*)
  - Bash(pnpm install:*)
  - Bash(pnpm add:*)
  - Bash(pnpm audit:*)
  - Bash(pnpm run:*)
  - Bash(pnpm test:*)
  - Bash(pnpm exec:*)
  - Bash(pnpm why:*)
  - Bash(pnpm ls:*)
  - Bash(git status:*)
  - Bash(git log:*)
  - Bash(git branch)
  - Bash(git diff:*)
  - Bash(git switch:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git pull:*)
  - Bash(date:*)
  - Bash(mkdir:*)
  - Bash(cd:*)
---

# deps-update Skill

手元 Claude Code 主導の依存関係更新ワークフロー。Renovate Dependency Dashboard を情報源として参照しつつ、1 セッション 1 レベル（security / patch / minor / major のいずれか1種類）でグルーピング更新し、怪しさチェック結果を含む plan ファイルをユーザー承認してから実行する。

## 参照ファイル（必読）

@docs/DEPENDENCY_POLICY.md
@renovate.json5
@.npmrc
@package.json
@tools/package.json

## 原則（絶対に崩さない）

1. **`minimumReleaseAge: 7 days` を尊重**: npm 公開から 7 日未満のバージョンは原則採用しない
2. **1 レベルのみ対応**: security / patch / minor / major のうち優先度最高のレベル 1 種類のみを今回対応する（複数レベル混在は禁止）
3. **ユーザー承認を必須**: plan ファイル生成後、明示的な GO サインを受けてから `pnpm update` 実行
4. **`.npmrc: ignore-scripts=true` を前提**: 手元 `pnpm install` でも尊重される
5. **60 秒以上のビルド途中キャンセル厳禁**: `pnpm run build` は完走を待つ（CLAUDE.md オキテ）
6. **公開操作は都度承認**: `gh pr create`・`git push` は `allowed-tools` に含めない設計。実行時に permission prompt が出るので、ユーザー＝サンの明示承認なしに副作用を起こさない。pre-approve しているのは以下のみ:
   - `gh issue list`（read-only）
   - `.claude/skills/deps-update/scripts/fetch-dependabot-alerts.sh`（エンドポイントと jq 式を固定化した Dependabot alerts 取得スクリプト）

   `gh api` 全域の pre-approve は任意エンドポイント書き込みを許すため採用しない。新たに gh API が必要になったら、同様にスクリプト化してエンドポイントを固定化してから `allowed-tools` に追加する。

## 引数解釈

起動時に `$ARGUMENTS` を以下のルールで解釈する:

| 引数 | 意味 | 既定 |
|---|---|---|
| `--level security\|patch\|minor\|major` | 対応レベルを明示指定 | 自動選定（優先度最高） |
| `--emergency` | GHSA High/Critical 時のみ `minimumReleaseAge: 7 days` 未達許容 | false |
| `--dry-run` | Phase A〜E のみ実施（`pnpm update` を行わない） | false |

引数なしは「自動選定 + Phase A〜E 実施 + 承認後 Phase F〜G」。

## 実行順序

以下を Phase A から順に実行する。各 Phase の開始時にユーザー＝サンへ 1 行で「Phase X 開始」と知らせる。

---

## Phase A: 情報収集（3 点突合）

情報源は Dashboard / pnpm outdated / GHSA の 3 つ。

### A-1. Dependency Dashboard Issue の取得

```bash
gh issue list --state open --search "Dependency Dashboard in:title" --json number,title,body --limit 5
```

取得した Issue 本文から「Pending Approval」「Open」「Ignored」等のセクションを解析し、候補パッケージ名とバージョンを抽出する。

### A-2. pnpm outdated（ルートと `tools/`）

```bash
pnpm outdated --format json
cd tools && pnpm outdated --format json && cd -
```

各パッケージの `current` / `wanted` / `latest` を取得。

### A-3. GHSA / Dependabot alerts

専用スクリプトで取得する。`gh api` のエンドポイントと jq 式を固定化することで、`Bash(gh api:*)` を全域 pre-approve する危険を避けている。

```bash
.claude/skills/deps-update/scripts/fetch-dependabot-alerts.sh
```

出力は以下の形状の JSON 配列（open な alert のみ）:

```json
[
  {
    "number": 42,
    "severity": "high",
    "package": "axios",
    "ecosystem": "npm",
    "vulnerable": "<1.6.0",
    "fixed": "1.6.0",
    "ghsa": "GHSA-xxxx-xxxx-xxxx",
    "cvss": 7.5,
    "url": "https://github.com/korosuke613/homepage-2nd/security/dependabot/42"
  }
]
```

引数で `owner/repo` を明示指定できる（省略時は `git remote origin` から自動推定）。

### A-4. minimumReleaseAge 検証

候補 `pkg@target` ごとに publish 日時を照会:

```bash
npm view <pkg>@<target> time.<target> --json
```

判定:

- `publishedAt + 7 days <= now()` → 採用
- 未達 → 直近で 7 日以上経過しているバージョンへダウングレード採用
- 全バージョン未達 → 今回は見送り（Dashboard に残す）
- `--emergency` かつ GHSA High/Critical 時のみ未達許容（plan ファイルに警告記載）

現在時刻は `date -u +%s` で取得して比較する。

---

## Phase B: レベル分類・1 レベル選定

### B-1. 各候補の分類

semver 比較で以下のいずれかに分類:

| レベル | 条件 |
|---|---|
| `security` | GHSA で open かつ本プロジェクトの直接/間接依存に該当 |
| `patch` | `X.Y.Z` の `Z` のみ差分 |
| `minor` | `Y` 差分（`X` 同一） |
| `major` | `X` 差分 |

pre-release（`-alpha` / `-beta` / `-rc` / `-next` 等）は**見送り**に分類する。

### B-2. 1 レベル選定

`--level` 指定時はそのレベルのみ対応。未指定時は **優先度最高の存在するレベルのみ対応**:

1. security 候補があれば → security のみ
2. security なし、patch あり → patch のみ
3. patch なし、minor あり → minor のみ
4. minor なし、major あり → major のみ
5. すべてなし → 終了（「更新候補なし」をユーザーへ報告）

**複数レベル混在は禁止**。選定外のレベルは plan ファイルの「見送り候補」に記載する。

---

## Phase C: グルーピング

選定したレベル内で、以下の優先順にグループ化:

1. **モノレポ関連は 1 グループ**:
   - `astro` + `@astrojs/*` + `astro-*`
   - `@biomejs/*`
   - `vitest` + `@vitest/*`
   - `@playwright/*` + `playwright` + `playwright-*`
   - `storybook` + `@storybook/*`
2. **ルートと `tools/` は別グループ**（`tools/package.json` の依存は別 PR）
3. **major は必ず単独グループ**（1 PR 1 パッケージ）
4. **それ以外は個別グループ**
5. `@types/*` は対応する本体パッケージに相乗り

### グループ命名

- モノレポ: `astro-monorepo` / `biome` / `vitest` / `playwright` / `storybook`
- 単独: `<pkg-name>`（scope 部の `@` は除去、例: `@astrojs/react` → `astrojs-react`）

---

## Phase D: 怪しさチェック（各候補）

各候補に対し以下 7 項目をチェックし、結果を Phase E の plan ファイルに横並び表で記載する。

| 項目 | コマンド | 🚨 条件 |
|---|---|---|
| 公開日 | `npm view <pkg>@<target> time.<target>` | 7 日未満（`--emergency` 時のみ許容） |
| maintainer 変化 | `npm view <pkg> maintainers --json` と `npm view <pkg>@<previous> maintainers --json` の比較 | 前版から新規 maintainer 追加 |
| install scripts | `npm view <pkg>@<target> scripts --json` | `install` / `postinstall` / `preinstall` / `prepare` / `prepublish` のいずれか存在 |
| bundle size | `npm view <pkg>@<target> dist.unpackedSize` と前版比較 | 2 倍以上に膨張 |
| direct dependencies | `npm view <pkg>@<target> dependencies --json` と前版比較 | 新規 direct 依存が追加されている |
| repository URL | `npm view <pkg>@<target> repository.url` と前版比較 | URL が変化している |
| release note | `npm view <pkg>@<target> homepage` / GitHub Releases / CHANGELOG.md | URL 取得不能 or release note が空 |

**判定方針**: 1 つでも fail したら plan 内で 🚨 マークで警告する。**自動ブロックはしない**（ユーザー＝サンの最終判断に委ねる）。

### 前版バージョンの取得方法

ルートの場合: `pnpm ls <pkg> --depth=0 --json` で現バージョンを取得。
tools/ の場合: `cd tools && pnpm ls <pkg> --depth=0 --json`。

---

## Phase E: plan ファイル生成

雛形: `@.claude/skills/deps-update/templates/plan.md`

### E-1. ファイル名決定

```bash
TODAY=$(date +%Y-%m-%d)
# グループ数による命名
# 1 グループ: plans/${TODAY}-deps-<level>-<group-name>.md
# 2 グループ以上: plans/${TODAY}-deps-<level>.md
```

### E-2. 雛形置換

`templates/plan.md` の `{{var}}` プレースホルダを Phase A〜D の結果で埋める。怪しさチェック結果は各 Group の「怪しさ警告」セクションに🚨 込みで列挙する。

### E-3. ユーザーへ提示

生成した plan ファイルパスを Claude Code 会話上でユーザー＝サンへ報告し、「plan ファイルを確認してから承認してください」と明示的に伝える。

---

## Phase F: ユーザー承認（中断ポイント）

**plan ファイル提示直後に処理を中断し、ユーザー＝サンの明示的な GO サインを待つ**。

- 承認と認める発話: 「実行して」「go」「進めて」「OK」「お願いします」等
- 承認と認めない発話: 曖昧な相槌、「確認した」、「ふむ」等

`--dry-run` 指定時は Phase F で**必ず終了**し、Phase G は実行しない。

承認前に修正要求があれば plan ファイルを編集して再提示する。

---

## Phase G: 実行（グループ単位で順次）

### G-1. 開始前確認

```bash
git status
# 未コミット変更があれば停止してユーザー＝サンに報告
```

### G-2. ブランチ作成

```bash
git switch main
git pull
git switch -c deps/${TODAY}-<level>-<group-name>
```

### G-3. 更新実行

ルート側:

```bash
pnpm update <pkg>@<version> [<pkg>@<version> ...]
```

tools/ 側（該当時のみ）:

```bash
cd tools
pnpm update <pkg>@<version> [...]
cd -
```

推移的依存のみ直したい場合は `pnpm update <parent-pkg>` で親経由引き上げ。それでも解決しない場合のみ `package.json` の `pnpm.overrides` に追記（既存の `baseline-browser-mapping` キーとの衝突に注意）。

### G-4. 安全チェック（順番通り、全部通過するまで次へ進まない）

```bash
pnpm install
pnpm audit signatures
pnpm audit
pnpm run lint
pnpm run build-types
pnpm run build          # 60秒以上。タイムアウト厳禁
pnpm test
```

いずれかが失敗 → **PR 作成せず停止** → 原因分析してユーザー＝サンに報告。勝手に `--no-verify` や差分リセットなどの逃げ技を使わない。

### G-5. commit

```bash
# ルートのみ変更の場合
git add package.json pnpm-lock.yaml

# tools/ も含む場合
git add package.json pnpm-lock.yaml tools/package.json tools/pnpm-lock.yaml

# グループ 1 パッケージの場合
git commit -m "build: update <pkg> to <version>"

# グループ複数パッケージの場合
git commit -m "build: update <group-name> to <version>"
```

### G-6. push & PR 作成

```bash
git push -u origin HEAD
gh pr create --title "build: update <group-name>" --body "$(cat <<'EOF'
<Phase E の plan ファイルから該当 Group のセクションを転記>

## レビューチェックリスト
- [ ] 公開日が 7 日以上経過
- [ ] maintainer に不自然な変化なし
- [ ] release note / CHANGELOG に不審な変更なし
- [ ] post-install / install / prepare スクリプトの追加・変更なし
- [ ] bundle size / 依存数が急増していない
- [ ] license が許容範囲内
- [ ] 既存テスト通過

注: review-dependency-pr.yaml は手元発 PR では自動起動しません。
上記チェック結果は Phase D（skill 内）で収集済みです。
EOF
)"
```

### G-7. 完了報告

各グループ PR 作成後、URL をユーザー＝サンへ報告。複数グループある場合は全部処理してから完了報告をまとめて行う。

---

## 例外: 緊急脆弱性対応（`--emergency` モード）

`--emergency` 引数が指定され、かつ該当パッケージが GHSA High/Critical の場合のみ、`minimumReleaseAge: 7 days` 未達バージョンでも採用可能。ただし:

- plan ファイルに **"⚠️ EMERGENCY" セクションを追加**し、GHSA URL・severity・fixed バージョンを明記
- commit message に `[security-emergency]` タグを含める: `build: [security-emergency] update <pkg> to <version>`
- PR body 冒頭に GHSA リンクと対応理由を明記

---

## 関連ドキュメント

- ポリシー全体: `docs/DEPENDENCY_POLICY.md`
- 運用背景の記事: `src/content/posts/20260418_dependency_update_strategy.md`
- Renovate 設定: `renovate.json5`
- 既存 CI: `.github/workflows/dependency-review.yaml` / `ci.yaml` / `review-dependency-pr.yaml`
