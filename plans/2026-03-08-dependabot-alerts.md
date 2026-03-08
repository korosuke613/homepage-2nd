# Dependabot アラート対応プラン

## Context

GitHub Dependabotアラートが42件オープン状態。大半は推移的依存（transitive dependency）であり、直接アップデートできるものは限定的。このプランでは、直接対応可能なものはアップデートし、上流パッケージ側の問題で対応不可能なものはdismissする。

## アラート分析サマリー

### A. 直接アップデートで解決できるもの

| パッケージ | 現行ver | パッチver | 場所 | アラート# |
|---|---|---|---|---|
| `fast-xml-parser` | 5.2.5 | 5.4.1 | tools/package.json (直接依存) | #136,#137,#164,#165,#167,#168 |
| `axios` | 1.11.0 | 1.13.6 | tools/package.json (直接依存) | #149 |
| `glob` | 11.0.3 | 11.1.0 (package.json/lockともに11.1.0) | package.json (直接依存) | #102 |
| `storybook` | 9.1.17 | 9.1.19 | package.json (devDependencies) | #154,#155 |

### B. 上流アップデートで間接的に解決されうるもの

| パッケージ | 経由 | アラート# | 対応 |
|---|---|---|---|
| `fast-xml-parser` 5.2.5 | `@astrojs/rss` → fast-xml-parser | #164,#165,#167,#168 | tools側で直接解決。astrojs/rss側は上流待ち → dismiss |
| `rollup` 4.51.0 | vite 7.1.6 → rollup | #158 | vite/rollupのパッチ待ち → dismiss |
| `devalue` 5.3.2 | astro → devalue | #123,#125,#144,#145 | astroアップデート待ち → dismiss |
| `h3` 1.15.4 | astro → unstorage → h3 | #124 | astroアップデート待ち → dismiss |
| `mdast-util-to-hast` 13.2.0 | astro/mdx関連 → mdast-util-to-hast | #111 | パッチver 13.2.1、`pnpm update`で解決可能か確認 |
| `@modelcontextprotocol/sdk` 1.18.1 | textlint → @mcp/sdk | #112,#120,#135 | textlintアップデート待ち → dismiss |
| `body-parser` 2.2.0 | textlint → @mcp/sdk → express → body-parser | #109 | 同上 → dismiss |
| `qs` 6.14.0 | textlint → @mcp/sdk → express → qs/body-parser → qs | #118,#139 | 同上 → dismiss |
| `ajv` 6.12.6 / 8.17.1 | textlint → @mcp/sdk / table → ajv | #147,#148 | textlintアップデート待ち → dismiss |
| `lodash` 4.17.21 | textlint / kuromoji → lodash | #129 | 上流待ち → dismiss |
| `js-yaml` 3.14.1 / 4.1.0 | textlint / proofdict → js-yaml | #96,#97 | 上流待ち → dismiss |
| `diff` 4.0.2 / 5.2.0 | textlint / prh → diff | #126,#130,#131 | 上流待ち → dismiss |
| `minimatch` 各ver | tailwindcss/sucrase/glob/textlint等の推移的依存 | #151-#162 | 上流待ち → dismiss |
| `@isaacs/brace-expansion` 5.0.0 | minimatch → brace-expansion | #134 | 上流待ち → dismiss |
| `jws` 4.0.0 | @google-analytics/data → google-auth-library → jws | #113 | 上流待ち → dismiss |
| `vite` 6.x/7.x (Windows bypass) | devDependencies各種 | #89,#90 | macOS環境では影響なし → dismiss |

### C. Dismiss理由テンプレート

- **推移的依存で上流パッケージの対応待ち**: `Transitive dependency via [parent]. Awaiting upstream update.`
- **開発環境のみ＋OS非該当**: `Dev dependency only. Vulnerability is Windows-specific, not applicable to our macOS/Linux CI.`
- **開発環境のみ＋リスク低**: `Dev dependency only. Low risk in development context.`

## 実行手順

### Step 1: 直接依存パッケージのアップデート

```bash
# tools/ ディレクトリ
cd tools && pnpm update fast-xml-parser axios

# ルート
pnpm update glob storybook
```

### Step 2: lockfileの再生成確認

```bash
pnpm install
cd tools && pnpm install
```

### Step 3: ビルド・テスト検証

```bash
pnpm run build-types
pnpm run lint
pnpm run test:unit
```

### Step 4: Dependabotアラートのdismiss

以下のアラートを`gh api`でdismiss（理由: 推移的依存で直接制御不可）:

**推移的依存/上流待ち**: #89, #90, #96, #97, #102(glob更新で解決されなかった場合), #109, #111(更新で解決されなかった場合), #112, #113, #118, #120, #124, #125, #123, #126, #129, #130, #131, #134, #135, #139, #144, #145, #147, #148, #151, #152, #153, #156, #157, #158, #159, #160, #161, #162

※ アップデート後に自動クローズされるアラートはdismiss不要。まず更新してから残存アラートを確認し、残ったものをdismissする。

### Step 5: 最終確認

```bash
gh api repos/korosuke613/homepage-2nd/dependabot/alerts -q '[.[] | select(.state == "open")] | length'
```

## 検証方法

1. `pnpm run build-types` — 型チェック通過
2. `pnpm run lint` — リンティング通過
3. `pnpm run test:unit` — ユニットテスト通過
4. Dependabotアラートのオープン数が0件（またはアクション不可能なもののみ）

## 修正対象ファイル

- `tools/package.json` (fast-xml-parser, axios更新)
- `tools/pnpm-lock.yaml`
- `package.json` (glob, storybook更新の場合)
- `pnpm-lock.yaml`
