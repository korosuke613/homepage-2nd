# 依存関係更新プラン: {{level}} / {{date}}

<!--
このファイルは `/deps-update` skill によって自動生成されました。
生成元: .claude/skills/deps-update/templates/plan.md
承認後、SKILL.md Phase G の実行コマンドに従って更新作業を実施します。
-->

## 情報源サマリ

- **Dependency Dashboard Issue**: #{{issue_number}}（候補 {{total_candidates}} 件）
- **pnpm outdated**: ルート {{root_count}} 件 / tools {{tools_count}} 件
- **GHSA open**: {{ghsa_count}} 件（うち本プロジェクト該当 {{relevant_ghsa_count}} 件）

## 今回対応レベル

**{{level}}**

理由: {{reason}}

<!-- 例: "GHSA High の open alert が 1 件あり security を最優先で対応" -->
<!-- 例: "security/patch なし、minor 候補 3 件のため minor を対応" -->

## 見送り候補（次回以降 or Dashboard 残置）

{{deferred_list}}

<!-- パッケージ名 / 対象バージョン / 見送り理由 を箇条書きで
例:
- `astro@5.4.0`: minor 更新のため今回の patch スコープ外
- `vite@5.4.10`: minimumReleaseAge 未達（publish 日 2026-04-15, 残り 4 日）
-->

## 実行グループ一覧

### Group 1: {{group_name}}

| パッケージ | 現在 | 更新先 | 公開日 | maintainer | scripts | bundle | release note |
|---|---|---|---|---|---|---|---|
{{rows}}

<!-- 例:
| astro | 5.2.0 | 5.3.1 | 2026-04-10 | 変化なし | なし | +3% | [link](https://github.com/withastro/astro/releases/tag/astro%405.3.1) |
| @astrojs/react | 4.1.0 | 4.2.0 | 2026-04-09 | 変化なし | なし | ±0% | [link](https://github.com/withastro/astro/releases) |
-->

#### 怪しさ警告

{{warnings}}

<!-- 該当なしの場合は「該当なし」
🚨 がある場合は項目ごとに列挙:
- 🚨 `<pkg>`: install script `postinstall` が追加されています（前版にはなし）
- 🚨 `<pkg>`: bundle size が前版比 +215% と急増
-->

#### 実行コマンド

```bash
git switch main && git pull
git switch -c deps/{{date}}-{{level}}-{{group_name}}
pnpm update {{packages_args}}
# tools/ 該当時
# cd tools && pnpm update {{packages_args_tools}} && cd -
pnpm install
pnpm audit signatures
pnpm audit
pnpm run lint
pnpm run build-types
pnpm run build
pnpm test
git add package.json pnpm-lock.yaml
git commit -m "build: update {{group_name}} to {{version_summary}}"
git push -u origin HEAD
gh pr create --title "build: update {{group_name}}" --body "<上記サマリ>"
```

<!-- グループが複数ある場合は ### Group 2, Group 3 ... と続ける -->

## 承認を要する判断

- [ ] 対応レベルが **{{level}}** で良いか
- [ ] 🚨 怪しさ警告がある場合、個別に許容するか
- [ ] 実行順序（今回 1 レベルのみ対応）で進めてよいか
- [ ] `--emergency` 指定時: `minimumReleaseAge` 未達バージョン採用を許容するか（該当時のみ）

## ユーザー＝サンへの依頼

この plan ファイルを確認した上で、「実行して」「go」「進めて」等の明示的な GO サインをお願いします。

修正要望があれば指示してください。skill が plan を更新して再提示します。

`--dry-run` で起動した場合、ここで処理は終了します（Phase G の更新実行は行いません）。
