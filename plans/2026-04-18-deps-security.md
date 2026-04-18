# 依存関係更新プラン: security / 2026-04-18

> このファイルは `/deps-update --dry-run` により自動生成されました（skill 実地検証の初回 output）。
> 生成元: `.claude/skills/deps-update/templates/plan.md`
> `--dry-run` 指定のため、Phase F で処理は終了し、Phase G（実行）は行いません。

## 情報源サマリ

- **Dependency Dashboard Issue**: [#535](https://github.com/korosuke613/homepage-2nd/issues/535)（候補: Pending Approval 41 件 + Open 9 件）
- **pnpm outdated**: ルート 36 件 / tools 5 件
- **GHSA open**: 13 件（全件本プロジェクト該当）

## 今回対応レベル

**security**

理由: GHSA で open alert が 13 件存在し、全て本プロジェクトの依存ツリー（直接 or 推移的）に該当。優先度最高の security レベルを選定、patch/minor/major は全件見送り。

## 見送り候補（次回以降 or Dashboard 残置）

### patch レベル（次回セッションで対応）
- `@astrojs/db` 0.20.0 → 0.20.1
- `@astrojs/partytown` 2.1.5 → 2.1.6
- `@astrojs/sitemap` 3.7.1 → 3.7.2
- `astro-meta-tags` 0.4.0 → 0.4.1

### minor レベル（次次回以降）
- `@biomejs/biome` 2.3.8 → 2.4.11
- `@playwright/*` + `playwright` 1.58.2 → 1.59.1（playwright-monorepo group）
- `@types/react` 19.1.14 → 19.2.14
- `emoji-regex` 10.4.0 → 10.6.0
- `react` + `react-dom` 19.1.1 → 19.2.5（react-monorepo group）
- `react-icons` 5.5.0 → 5.6.0
- `simple-git` 3.32.3 → 3.35.2
- `strip-ansi` 7.1.2 → 7.2.0
- `textlint-filter-rule-comments` 1.2.2 → 1.3.0
- `fast-xml-parser` 5.5.7 → 5.5.11 (tools)

### major レベル（個別単独 PR）
- `@astrojs/mdx` 4.3.14 → 5.0.3（astro-monorepo major）
- `@astrojs/react` 4.4.2 → 5.0.3（astro-monorepo major）
- `@chromatic-com/storybook` 4.1.3 → 5.1.1
- `@docsearch/css` / `@docsearch/react` 3.9.0 → 4.6.2
- `@google-analytics/data` 4.12.1 → 5.2.1
- `@storybook/*` + `storybook` 9.1.20 → 10.3.5（storybook-monorepo major）
- `@vitest/*` + `vitest` 3.2.4 → 4.1.4（vitest-monorepo major）
- `astro` 5.18.1 → 6.1.5
- `chromatic` 11.29.0 → 16.2.0
- `glob` 11.1.0 → 13.0.6
- `tailwindcss` 3.4.19 → 4.2.2
- `textlint` 14.8.4 → 15.5.4
- `textlint-rule-preset-ja-technical-writing` 10.0.2 → 12.0.2
- `typescript` 5.9.3 → 6.0.2
- `@types/jsdom` 21.1.7 → 28.0.1 (tools)
- `jsdom` 27.4.0 → 29.0.2 (tools)

## 実行グループ一覧

### Group 1: axios (tools, direct security update)

| パッケージ | 現在 | 更新先 | 公開日 | maintainer | scripts | bundle | release note |
|---|---|---|---|---|---|---|---|
| axios | 1.13.6 | 1.15.0 | 2026-04-08（10日経過）✅ | 🚨 4人→1人 | 🚨 prepare: husky | +1% ✅ | [releases](https://github.com/axios/axios/releases/tag/v1.15.0) ✅ |

**解消される GHSA**:
- [GHSA-3p68-rc4w-qgx5](https://github.com/korosuke613/homepage-2nd/security/dependabot/217)（axios medium, cvss 4.8）
- [GHSA-fvcv-3m26-pcqx](https://github.com/korosuke613/homepage-2nd/security/dependabot/214)（axios medium, cvss 4.8）
- [GHSA-r4q5-vmmm-2653](https://github.com/korosuke613/homepage-2nd/security/dependabot/213)（follow-redirects medium, axios 経由の推移的依存、axios 更新で自動解消）

#### 怪しさ警告

- 🚨 **maintainer が 4 人 → 1 人に激減**: mzabriskie / nickuraltsev / emilyemorehouse が除外され、jasonsaayman のみが残っている。Axios は有名プロジェクトで jasonsaayman は長年の主要 maintainer だが、他 maintainer の除外が正当な整理か要確認（[axios contributors](https://github.com/axios/axios/graphs/contributors) や リリースタグ history でクロスチェック）。
- 🚨 **`prepare: husky` script が存在**: ただし本プロジェクトは `.npmrc` で `ignore-scripts=true` 設定済み、かつ `pnpm.onlyBuiltDependencies: []` でビルドスクリプト全ブロックしているため、**実害はない**。他プロジェクトで ignore-scripts 未設定だと husky が走るので警告対象。

#### 実行コマンド（Phase G 実行時）

```bash
git switch main && git pull
git switch -c deps/2026-04-18-security-axios
cd tools
pnpm update axios@1.15.0
cd -
pnpm install
pnpm audit signatures
pnpm audit
pnpm run lint
pnpm run build-types
pnpm run build
pnpm test
git add tools/package.json tools/pnpm-lock.yaml
git commit -m "build: update axios to 1.15.0 (security: GHSA-3p68-rc4w-qgx5, GHSA-fvcv-3m26-pcqx)"
git push -u origin HEAD
gh pr create --title "build: update axios to 1.15.0 (security)" --body "<サマリ>"
```

---

### Group 2: 推移的依存の pnpm.overrides 対応（ルート）

推移的依存で direct update では解消しない GHSA 対象パッケージ群。`package.json` の `pnpm.overrides` に最小 fix バージョンを追記して強制引き上げする。

| パッケージ | 現バージョン | override で最低保証 | severity | 解消される GHSA |
|---|---|---|---|---|
| protobufjs | 7.5.4 | `>=7.5.5` | **critical** | [GHSA-xq3m-2v4x-88gg](https://github.com/korosuke613/homepage-2nd/security/dependabot/216) |
| drizzle-orm | 0.42.0 | `>=0.45.2` | high (cvss 7.5) | [GHSA-gpj5-g38j-94v9](https://github.com/korosuke613/homepage-2nd/security/dependabot/205) |
| lodash | 4.17.21 | `>=4.18.0` | high (cvss 8.1) + medium (cvss 6.5) | [GHSA-r5fr-rjxr-66jc](https://github.com/korosuke613/homepage-2nd/security/dependabot/200), [GHSA-f23m-r3pf-42rh](https://github.com/korosuke613/homepage-2nd/security/dependabot/199) |
| defu | 6.1.4 | `>=6.1.5` | high (cvss 7.5) | [GHSA-737v-mqg7-c878](https://github.com/korosuke613/homepage-2nd/security/dependabot/198) |
| vite (6.x) | 6.4.1 | `>=6.4.2` | high + medium | [GHSA-p9ff-h696-f583](https://github.com/korosuke613/homepage-2nd/security/dependabot/204), [GHSA-4w7w-66w2-5vf9](https://github.com/korosuke613/homepage-2nd/security/dependabot/207) |
| vite (7.x) | 7.1.6 | `>=7.3.2` | high×2 + medium | [GHSA-p9ff-h696-f583](https://github.com/korosuke613/homepage-2nd/security/dependabot/202), [GHSA-v2wj-q39q-566r](https://github.com/korosuke613/homepage-2nd/security/dependabot/201), [GHSA-4w7w-66w2-5vf9](https://github.com/korosuke613/homepage-2nd/security/dependabot/203) |

#### 怪しさ警告

- 🚨 **overrides は強制引き上げ**のため、親パッケージ側の peerDependency 制約と衝突してビルド/実行時エラーを起こす可能性がある（特に vite はメジャー跨ぎ）。
- 🚨 各 fix バージョン自体の **minimumReleaseAge 検証は Phase G 実行時に行う必要あり**（dry-run では未実施、axios のみ検証済み）。
- Phase G 実行前に `pnpm why <各パッケージ>` の代替手段で親を特定し、親経由 `pnpm update <parent>` で解決できるならそちらを優先する。overrides は最終手段。

#### 既存 overrides との衝突確認

現在の `package.json` の `pnpm.overrides`:

```json
"overrides": {
  "baseline-browser-mapping": "^2.10.8"
}
```

キー衝突なし（新規追加のみ）。

#### 実行コマンド（Phase G 実行時）

```bash
git switch main && git pull
git switch -c deps/2026-04-18-security-overrides
# package.json の pnpm.overrides に以下を追記:
#   "protobufjs": ">=7.5.5",
#   "drizzle-orm": ">=0.45.2",
#   "lodash": ">=4.18.0",
#   "defu": ">=6.1.5",
#   "vite": ">=6.4.2 <7.0.0 || >=7.3.2"   # 6.x と 7.x の両 range を許容
pnpm install
pnpm audit signatures
pnpm audit
pnpm run lint
pnpm run build-types
pnpm run build
pnpm test
git add package.json pnpm-lock.yaml
git commit -m "build: apply pnpm.overrides for security fixes (protobufjs, drizzle-orm, lodash, defu, vite)"
git push -u origin HEAD
gh pr create --title "build: pnpm.overrides for security fixes" --body "<サマリ>"
```

---

## 承認を要する判断

- [ ] 対応レベル: **security** で良いか（他レベル候補 40 件以上は見送り前提）
- [ ] Group 1（axios）: maintainer 激減 🚨 + prepare script 🚨 を個別に許容するか
- [ ] Group 2（overrides）: 強制引き上げによる peerDependency 衝突リスクを承知で進めるか、または親経由引き上げを先に試すか
- [ ] vite の override range `>=6.4.2 <7.0.0 || >=7.3.2` の書き方で良いか（7.x と 6.x の並存保持）
- [ ] 実行順序（Group 1 → Group 2 の順、または並行）

## dry-run での気づき（Skill 改良候補）

実地検証で判明した skill の改善点:

1. **`npm view` → `pnpm view` に置換**: プロジェクトの hook が `npm` 直呼び出しを block しているため、SKILL.md 本文の `npm view` コマンド例を全て `pnpm view` に変更する必要がある。`allowed-tools` の `Bash(npm view:*)` → `Bash(pnpm view:*)`。
2. **`pnpm why` が top-level importer のない推移的依存でゼロ出力**: 代替手段として `pnpm-lock.yaml` の grep、または `pnpm ls --recursive --depth=infinity` を使うロジックを skill に書き足す。
3. **推移的依存の親特定ロジックを具体化**: 現在の Phase C/G は「親経由引き上げ or overrides」と書いているだけで、判定手順が具体化されていない。親特定 → `pnpm update <parent>` で解決するか試行 → ダメなら overrides、の判定ツリーを skill に追記する。
4. **pnpm outdated は exit 1 を返す仕様**: 並列実行で他コマンドを cancel しないよう、`pnpm outdated || true` 等の処理を skill に書く。
5. **security も「対応 or dismiss」の判断フローを組み込む**: 現 skill は「security があれば必ず対応」の片道設計だが、実際には以下のケースで **dismiss が正当**な判断になる:
   - 親パッケージ側に fix が未リリース、かつ overrides で壊れる
   - dev-only 依存で production に影響しない（例: storybook 配下の vite）
   - 実行パスに含まれない（例: `scripts` 配下のツールのみで使われる）
   - 脆弱性の attack vector が本プロジェクトで再現不可能
   
   対応策:
   - Phase D の怪しさチェックの後に **Phase D-2「対応可否判定」**を新設
   - 各 GHSA について `対応する / overrides で強制引き上げ / dismiss（理由付き）` の 3 択をユーザーに提示
   - dismiss と判定した場合は `gh api --method PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}` で dismiss 実行（都度プロンプト）
   - dismiss 用の reason と comment を skill が候補提示（例: `tolerable_risk`, `no_bandwidth`, `inaccurate`, `not_used`）
6. **TaskCreate/TaskUpdate による進捗可視化**: 現 skill は「Phase X 開始」を 1 行で知らせるだけで、長尺な Phase A-G 全体の進捗がユーザーに見えない。skill 起動時に以下相当の TodoList を作るようにすれば、ユーザーが今どこまで進んだか把握しやすくなる:
   - Phase A: 情報収集（Dashboard / outdated / alerts）
   - Phase B: レベル選定
   - Phase C: グルーピング
   - Phase D: 怪しさチェック
   - Phase D-2: 対応可否判定（上記改良 5 と連動）
   - Phase E: plan ファイル生成
   - Phase F: ユーザー承認待ち
   - Phase G-*: グループごとに「ブランチ作成 / update / 安全チェック / commit / push / PR」をサブタスク化

## ユーザー＝サンへの依頼

この plan ファイルを確認した上で、以下のいずれかを選んでください:

- **`--dry-run` 版で終了**: 今回は実装せず、skill 改良（上記 4 点）を先に行う
- **Group 1 のみ実行**: axios security だけ Phase G で実施、overrides 対応は次回
- **Group 1 + Group 2 両方実行**: 全 security 対応を今回実施
- **plan 修正要望**: 警告や判定基準の調整

`--dry-run` で起動したため、ここで処理は終了します（Phase G は実行しません）。
