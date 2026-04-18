---
name: deps-update
description: 依存関係を1レベル単位（security / patch / minor / major のいずれか）でグルーピング更新する。Dependency Dashboard 参照、minimumReleaseAge 7日尊重、怪しさチェック付き。security は「対応 / overrides / dismiss」の3択で判断。グループごとに PR 化、dismiss はAPIで記録。
when_to_use: ユーザーが「依存関係を更新して」「patch 更新」「依存パッケージの最新化」「Dependabot アラートを対応して」等の依頼をした時、または `/deps-update` で明示起動された時。
argument-hint: "[--level security|patch|minor|major] [--emergency] [--dry-run]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - LS
  - TaskCreate
  - TaskUpdate
  - TaskList
  - Bash(gh issue list:*)
  - Bash(.claude/skills/deps-update/scripts/fetch-dependabot-alerts.sh:*)
  - Bash(.claude/skills/deps-update/scripts/dismiss-dependabot-alert.sh:*)
  - Bash(pnpm view:*)
  - Bash(pnpm outdated:*)
  - Bash(pnpm update:*)
  - Bash(pnpm install:*)
  - Bash(pnpm add:*)
  - Bash(pnpm audit:*)
  - Bash(pnpm run:*)
  - Bash(pnpm test:*)
  - Bash(pnpm why:*)
  - Bash(pnpm ls:*)
  - Bash(jq:*)
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

手元 Claude Code 主導の依存関係更新ワークフロー。Renovate Dependency Dashboard を情報源として参照しつつ、1 セッション 1 レベル（security / patch / minor / major のいずれか1種類）でグルーピング更新し、怪しさチェック結果と**対応可否判定**を含む plan ファイルをユーザー承認してから実行する。

## 参照ファイル（必読）

@docs/DEPENDENCY_POLICY.md
@renovate.json5
@.npmrc
@package.json
@tools/package.json

## 原則（絶対に崩さない）

1. **`minimumReleaseAge: 7 days` を尊重**: npm 公開から 7 日未満のバージョンは原則採用しない
2. **1 レベルのみ対応**: security / patch / minor / major のうち優先度最高のレベル 1 種類のみを今回対応する（複数レベル混在は禁止）
3. **ユーザー承認を必須**: plan ファイル生成後、明示的な GO サインを受けてから `pnpm update` / dismiss を実行
4. **`.npmrc: ignore-scripts=true` を前提**: 手元 `pnpm install` でも尊重される
5. **60 秒以上のビルド途中キャンセル厳禁**: `pnpm run build` は完走を待つ（CLAUDE.md オキテ）
6. **公開操作は都度承認**: `gh pr create`・`git push` は `allowed-tools` に含めない設計。実行時に permission prompt が出るので、ユーザー＝サンの明示承認なしに副作用を起こさない。pre-approve しているのは以下のみ:
   - `gh issue list`（read-only）
   - `scripts/fetch-dependabot-alerts.sh`（endpoint と jq 式を固定）
   - `scripts/dismiss-dependabot-alert.sh`（endpoint と HTTP method、reason 値を固定）

   `gh api` 全域の pre-approve は任意エンドポイント書き込みを許すため採用しない。新たに gh API が必要になったら、同様にスクリプト化してエンドポイントを固定化してから `allowed-tools` に追加する。
7. **npm コマンドは禁止、pnpm を使う**: プロジェクトは pnpm 専用で hook が `npm` 直呼び出しを block する。registry 照会は `pnpm view` を使う（`npm view` ではない）。
8. **security は必ずしも「対応」ではない**: GHSA があっても `対応 / overrides / dismiss` の 3 択で判断する（Phase D-2）。dev-only / 実影響なし / fix 未リリース等は正当な dismiss 対象。

## 引数解釈

起動時に `$ARGUMENTS` を以下のルールで解釈する:

| 引数 | 意味 | 既定 |
|---|---|---|
| `--level security\|patch\|minor\|major` | 対応レベルを明示指定 | 自動選定（優先度最高） |
| `--emergency` | GHSA High/Critical 時のみ `minimumReleaseAge: 7 days` 未達許容 | false |
| `--dry-run` | Phase A〜E のみ実施（`pnpm update` / dismiss 実行を行わない） | false |

引数なしは「自動選定 + Phase A〜E 実施 + 承認後 Phase F〜G」。

## 実行順序と進捗可視化

**Skill 起動直後に `TaskCreate` で以下の初期タスクを登録する**。進行に応じて `TaskUpdate` で `in_progress` / `completed` を設定し、ユーザーに進捗を可視化する。

初期タスク（subject / activeForm）:

1. `Phase A: 情報収集` / `情報収集中`
2. `Phase B: レベル選定` / `レベル選定中`
3. `Phase C: グルーピング` / `グルーピング中`
4. `Phase D: 怪しさチェック` / `怪しさチェック中`
5. `Phase D-2: 対応可否判定`（security レベル時のみ） / `対応可否判定中`
6. `Phase E: plan ファイル生成` / `plan 生成中`
7. `Phase F: ユーザー承認待ち` / `承認待ち`
8. `Phase G: 実行`（`--dry-run` 時は除外） / `実行中`

Phase G のグループごとのサブタスクは、Phase E 完了後に動的に `TaskCreate` で追加する（各グループに対し「ブランチ作成」「更新」「安全チェック」「commit」「push & PR」など、dismiss グループの場合は「API 呼び出し」）。

各 Phase 開始時にも 1 行で「Phase X 開始」を会話でも報告する（TaskList だけに頼らない）。

---

## Phase A: 情報収集（3 点突合）

情報源は Dashboard / pnpm outdated / GHSA の 3 つ。

### A-1. Dependency Dashboard Issue の取得

```bash
gh issue list --state open --search "Dependency Dashboard in:title" --json number,title,body --limit 5
```

取得した Issue 本文から「Pending Approval」「Open」「Ignored」等のセクションを解析し、候補パッケージ名とバージョンを抽出する。

### A-2. pnpm outdated（ルートと `tools/`）

`pnpm outdated` は **outdated 項目があると exit 1 を返す仕様**。並列実行で他コマンドを cancel しないよう `|| true` を付ける。

```bash
pnpm outdated --format json || true
cd tools && (pnpm outdated --format json || true) && cd -
```

各パッケージの `current` / `wanted` / `latest` を取得。

### A-3. GHSA / Dependabot alerts

専用スクリプトで取得する。endpoint と jq 式を固定化することで、`Bash(gh api:*)` を全域 pre-approve する危険を避けている。

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

候補 `pkg@target` ごとに publish 日時を照会。**`npm view` は hook で block されるため `pnpm view` を使う**。

```bash
pnpm view <pkg>@<target> time --json | jq '."<target>"'
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

### C-1. 推移的依存の親特定

選定レベルの各候補について、direct / 推移的を判別する。推移的な場合は**親パッケージを特定**する。

#### 親特定の手順

1. `pnpm why <pkg>` で親候補を取得
2. **空出力の場合のフォールバック**（top-level importer でない推移的依存では空になる）:
   - `grep -B 3 "^  <pkg>@" pnpm-lock.yaml` で該当バージョンの resolution 箇所を特定
   - `pnpm ls --recursive --depth=infinity --json` の結果を jq で traverse
   - `tools/` の場合は `tools/pnpm-lock.yaml` も対象
3. 親が direct なら → 「親経由 update」候補
4. 親も推移的なら → `pnpm.overrides` 候補

### C-2. 解決手段の暫定決定

各候補（特に security の GHSA 対象）に対し、以下優先順で暫定解決方針を決める。**確定は Phase D-2 で行う**。

1. **direct update**: パッケージ自体が direct dependency → `pnpm update <pkg>@<fix-version>`
2. **親経由 update**: 親が direct で、親の最新版が fix 済みパッケージを使う → `pnpm update <parent>@<latest>`
3. **overrides**: direct ではなく親経由でも解決しない → `package.json` の `pnpm.overrides` に追記
4. **dismiss 候補**: 上記 1〜3 がすべて適用不可、または実影響がない可能性 → Phase D-2 で判定

### C-3. グループ化ルール

選定レベル内で、以下の優先順にグループ化:

1. **モノレポ関連は 1 グループ**:
   - `astro` + `@astrojs/*` + `astro-*`
   - `@biomejs/*`
   - `vitest` + `@vitest/*`
   - `@playwright/*` + `playwright` + `playwright-*`
   - `storybook` + `@storybook/*`
2. **ルートと `tools/` は別グループ**（`tools/package.json` の依存は別 PR）
3. **major は必ず単独グループ**（1 PR 1 パッケージ）
4. **overrides による解決は 1 グループにまとめる**（強制引き上げの副作用が相関するため）
5. **dismiss は 1 グループにまとめる**（PR なし、API 呼び出しのみ）
6. **それ以外は個別グループ**
7. `@types/*` は対応する本体パッケージに相乗り

### C-4. グループ命名

- モノレポ: `astro-monorepo` / `biome` / `vitest` / `playwright` / `storybook`
- 単独: `<pkg-name>`（scope 部の `@` は除去、例: `@astrojs/react` → `astrojs-react`）
- overrides: `security-overrides`
- dismiss: `security-dismiss`（PR 不要、API 呼び出しのみ）

---

## Phase D: 怪しさチェック（各候補）

各候補に対し以下 7 項目をチェックし、結果を Phase E の plan ファイルに横並び表で記載する。

**すべて `pnpm view` を使う**（`npm view` は hook で block される）。

| 項目 | コマンド | 🚨 条件 |
|---|---|---|
| 公開日 | `pnpm view <pkg>@<target> time --json \| jq '."<target>"'` | 7 日未満（`--emergency` 時のみ許容） |
| maintainer 変化 | `pnpm view <pkg> maintainers --json` と `pnpm view <pkg>@<previous> maintainers --json` の比較 | 前版から新規 maintainer 追加、または主要 maintainer の削除 |
| install scripts | `pnpm view <pkg>@<target> scripts --json` | `install` / `postinstall` / `preinstall` / `prepare` / `prepublish` のいずれか存在 |
| bundle size | `pnpm view <pkg>@<target> dist.unpackedSize` と前版比較 | 2 倍以上に膨張 |
| direct dependencies | `pnpm view <pkg>@<target> dependencies --json` と前版比較 | 新規 direct 依存が追加されている |
| repository URL | `pnpm view <pkg>@<target> repository.url` と前版比較 | URL が変化している |
| release note | `pnpm view <pkg>@<target> homepage` / GitHub Releases / CHANGELOG.md | URL 取得不能 or release note が空 |

**判定方針**: 1 つでも fail したら plan 内で 🚨 マークで警告する。**自動ブロックはしない**（ユーザー＝サンの最終判断に委ねる）。

### 前版バージョンの取得方法

- top-level の場合: `pnpm ls <pkg> --depth=0 --json`（ルート）、`cd tools && pnpm ls <pkg> --depth=0 --json`（tools）
- top-level でない推移的依存: `grep "^  <pkg>@" pnpm-lock.yaml`（`tools/pnpm-lock.yaml` も対象）

---

## Phase D-2: 対応可否判定（security レベル時必須）

security レベルで Phase D を終えた後、**各 GHSA について対応方針を 1 つ確定する**。Phase C で付けた暫定判定を見直し、現実的に対応可能か判断する。

### D-2-1. 判定軸

各 GHSA について以下を評価:

| 項目 | 確認方法 |
|---|---|
| fix バージョンの存在 | `fetch-dependabot-alerts.sh` の `fixed` フィールド |
| direct / 推移的 | Phase C の解析結果 |
| 親の fix 対応状況 | 親の最新版が fix バージョンの依存を持つか（`pnpm view <parent>@latest dependencies`） |
| overrides の副作用 | peerDependency 衝突、メジャー跨ぎの有無 |
| dev-only か | `devDependencies` / build tool / test tool のみで使われるか |
| 実影響の有無 | attack vector が本プロジェクトの使い方で再現しうるか（release note / GHSA 本文を読む） |

### D-2-2. 4 択の判定ツリー

```
fix バージョンあるか？
├─ No → dismiss 候補（reason: fix_started or tolerable_risk）
└─ Yes
   ├─ direct dependency？
   │   ├─ Yes → 【対応】direct update
   │   └─ No → 推移的
   │       ├─ 親の最新版で解決？
   │       │   ├─ Yes → 【対応】親経由 update
   │       │   └─ No → overrides 検討
   │       │       ├─ overrides で壊れない？
   │       │       │   ├─ Yes → 【対応】overrides 追加
   │       │       │   └─ No → dismiss 候補
   │       │       │       ├─ dev-only で production 影響なし？
   │       │       │       │   ├─ Yes → dismiss (reason: not_used)
   │       │       │       │   └─ No → dismiss (reason: tolerable_risk)
```

### D-2-3. dismiss の reason

Dependabot API で受け付ける `dismissed_reason` は以下 5 つのいずれか:

| reason | 用途 |
|---|---|
| `fix_started` | 別途対応中（PR 作成済み、次 skill セッションで対応予定など） |
| `inaccurate` | 報告内容が本プロジェクトに該当しない |
| `no_bandwidth` | 対応リソースがない（一時的） |
| `not_used` | 該当コードパスを使用していない（dev-only 含む） |
| `tolerable_risk` | リスクは認識しているが許容する |

`dismissed_comment` は任意だが、**skill では必ず記入する**（将来の自分への根拠記録）。

### D-2-4. plan への反映

Phase D-2 の結果は Phase E で plan ファイルに以下形式で記載:

```
| GHSA | severity | package | 判定 | 理由 |
|---|---|---|---|---|
| GHSA-xxxx-xxxx-xxxx | high | axios | 【対応】direct update | tools/ の direct 依存、fix 済み 1.15.0 が 10 日経過 |
| GHSA-yyyy-yyyy-yyyy | critical | protobufjs | 【対応】overrides | 推移的、親の最新版で未解決、overrides で影響軽微 |
| GHSA-zzzz-zzzz-zzzz | medium | some-dev-tool | 【dismiss】not_used | devDependencies のみ、production build に含まれない |
```

---

## Phase E: plan ファイル生成

雛形: `.claude/skills/deps-update/templates/plan.md`

### E-1. ファイル名決定

```bash
TODAY=$(date +%Y-%m-%d)
# グループ数による命名
# 1 グループ: plans/${TODAY}-deps-<level>-<group-name>.md
# 2 グループ以上: plans/${TODAY}-deps-<level>.md
```

### E-2. 雛形置換

`templates/plan.md` の `{{var}}` プレースホルダを Phase A〜D-2 の結果で埋める。怪しさチェック結果は各 Group の「怪しさ警告」セクションに🚨 込みで列挙、D-2 の判定は「対応可否判定」表として独立セクションで記載。

### E-3. ユーザーへ提示

生成した plan ファイルパスを会話で報告し、「plan ファイルを確認してから承認してください」と明示的に伝える。TaskList でも `Phase F: ユーザー承認待ち` を `in_progress` に更新する。

---

## Phase F: ユーザー承認（中断ポイント）

**plan ファイル提示直後に処理を中断し、ユーザー＝サンの明示的な GO サインを待つ**。

- 承認と認める発話: 「実行して」「go」「進めて」「OK」「お願いします」等
- 承認と認めない発話: 曖昧な相槌、「確認した」、「ふむ」等

`--dry-run` 指定時は Phase F で**必ず終了**し、Phase G は実行しない。

承認前に修正要求があれば plan ファイルを編集して再提示する。

---

## Phase G: 実行（グループ単位で順次）

Phase C-4 で命名したグループごとに以下を実行する。グループ種別に応じてサブフェーズが分岐する。

### G-1. 開始前確認

```bash
git status
# 未コミット変更があれば停止してユーザー＝サンに報告
```

### G-A. update グループ（direct update / 親経由 update / overrides）

#### G-A-1. ブランチ作成

```bash
git switch main && git pull
git switch -c deps/${TODAY}-<level>-<group-name>
```

#### G-A-2. 更新実行

**direct update / 親経由 update の場合**:

```bash
pnpm update <pkg>@<version> [<pkg>@<version> ...]
# tools/ 該当時
cd tools && pnpm update <pkg>@<version> [...] && cd -
```

**overrides の場合**:

`package.json` の `pnpm.overrides` に追記（既存の `baseline-browser-mapping` 等のキーとの衝突に注意）。Edit で JSON を更新。その後 `pnpm install` で lockfile に反映。

#### G-A-3. 安全チェック（順番通り、全部通過するまで次へ進まない）

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

#### G-A-4. commit & push & PR

```bash
git add package.json pnpm-lock.yaml [tools/package.json tools/pnpm-lock.yaml]
git commit -m "build: update <group-name> to <version>"
git push -u origin HEAD
gh pr create --title "build: update <group-name>" --body "<Phase E 該当セクション + レビューチェックリスト>"
```

### G-D. dismiss グループ（PR なし、API 呼び出し）

Phase D-2 で dismiss と判定した GHSA を、スクリプト経由で 1 件ずつ dismiss する。

```bash
.claude/skills/deps-update/scripts/dismiss-dependabot-alert.sh <alert_number> <reason> "<comment>"
```

- `<alert_number>`: Phase A-3 の出力 `number` フィールド
- `<reason>`: Phase D-2-3 の 5 種類のいずれか
- `<comment>`: Phase D-2 で決めた根拠（必ず記入する）

`--dry-run` 時は実行せず、実行予定コマンドを plan ファイルに列挙するのみ。

### G-Z. 完了報告

各グループ処理後、以下を含めてユーザー＝サンへ報告:

- 作成した PR URL（update グループの場合）
- dismiss した GHSA 番号と reason（dismiss グループの場合）
- 失敗したグループと原因（該当時）

複数グループある場合は全部処理してから完了報告をまとめて行う。TaskList も全タスク `completed` に更新する。

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
- Dependabot alerts API（dismiss 用）: https://docs.github.com/en/rest/dependabot/alerts
