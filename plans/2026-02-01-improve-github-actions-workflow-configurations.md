# GitHub Actions ワークフロー改善プラン

## 概要
ワークフローレビュー結果に基づき、高・中優先度の改善を実施する。

## 対象ファイル
- `.github/workflows/ci.yaml`
- `.github/workflows/pages.yml`
- `.github/workflows/copilot-setup-steps.yml`
- `.github/workflows/vrt-regression.yaml`
- `.github/workflows/vrt-init.yaml`
- `.github/workflows/update-blogs-data.yaml`
- `.github/workflows/dry-renovate.yaml`
- `.github/workflows/monthly-pr-metrics.yaml`
- `.github/workflows/claude-code-action.yaml`
- `.github/workflows/review-dependency-pr.yaml`
- `.github/actions/setup-node-pnpm/action.yml` (新規作成)

---

## 改善項目

### 1. キャッシュ保存の追加 [高優先度]

#### 1.1 copilot-setup-steps.yml
- Astroキャッシュとvitestキャッシュは`restore`のみで`save`がない
- **対応**: このワークフローはCopilot用のセットアップで、キャッシュ保存は不要（cache.yamlで保存済み）
- **結論**: 変更不要

#### 1.2 pages.yml:87-91
- Astroビルドキャッシュの`restore`のみで`save`がない
- **対応**: ビルド後にキャッシュを保存するステップを追加
- **場所**: buildジョブの最後に`actions/cache/save@v4`を追加

### 2. timeout-minutes設定 [高優先度]

以下のジョブにtimeout-minutesを追加：

| ファイル | ジョブ | 推奨値 |
|---------|-------|-------|
| ci.yaml | 各テストジョブ | 15分 |
| ci.yaml | build, chromatic | 20分 |
| pages.yml | 各ジョブ | 20分 |
| cache.yaml | cache | 30分 |
| copilot-setup-steps.yml | copilot-setup-steps | 10分 |
| vrt-regression.yaml | vrt-regression-test | 20分 |
| vrt-init.yaml | vrt-init | 30分 |
| update-blogs-data.yaml | update | 15分 |
| dry-renovate.yaml | dry-run | 15分 |
| monthly-pr-metrics.yaml | build | 10分 |

### 3. name未設定ステップへの名前追加 [高優先度]

#### pages.yml
- L27: `uses: Kesin11/actions-timeline` → `name: Show actions timeline`
- L42: `uses: actions/checkout@v6` → `name: Checkout repository`
- L47: `uses: google-github-actions/auth@v2` → `name: Authenticate to Google Cloud`
- L56: `uses: actions/setup-node@v6` → `name: Setup Node.js`
- L81: `uses: actions/checkout@v6` → `name: Checkout repository`
- L87: `uses: actions/cache/restore@v4` → `name: Restore Astro build cache`
- L96: `uses: actions/setup-node@v6` → `name: Setup Node.js`
- L150: `uses: actions/checkout@v6` → `name: Checkout repository`
- L162: `uses: actions/create-github-app-token@v2` → `name: Create GitHub App token`
- L204: `uses: actions/checkout@v6` → `name: Checkout repository`
- L216: `uses: actions/create-github-app-token@v2` → `name: Create GitHub App token`

#### vrt-init.yaml
- L55: `uses: Kesin11/actions-timeline` → `name: Show actions timeline`

### 4. concurrency設定の追加 [中優先度]

以下のワークフローにconcurrency設定を追加：

| ファイル | 設定 |
|---------|------|
| ci.yaml | `group: ci-${{ github.ref }}`, `cancel-in-progress: true` |
| copilot-setup-steps.yml | `group: copilot-${{ github.ref }}`, `cancel-in-progress: true` |
| dry-renovate.yaml | `group: dry-renovate-${{ github.ref }}`, `cancel-in-progress: true` |
| monthly-pr-metrics.yaml | `group: monthly-metrics`, `cancel-in-progress: false` |
| claude-code-action.yaml | `group: claude-${{ github.event.issue.number || github.event.pull_request.number }}`, `cancel-in-progress: false` |
| review-dependency-pr.yaml | `group: review-pr-${{ github.event.number }}`, `cancel-in-progress: false` |
| vrt-init.yaml | `group: vrt-init-${{ github.ref }}`, `cancel-in-progress: false` |
| vrt-regression.yaml | `group: vrt-regression-${{ github.ref }}`, `cancel-in-progress: false` |

### 5. bash条件分岐の簡素化 [中優先度]

以下のパターンで改善を行う：

#### 5.1 ci.yaml:109-114 - ステップレベルif条件への移行

**現状:**
```yaml
- name: Add label to PR
  run: |
    if [[ "${{ github.event_name }}" == "pull_request" ]]; then
      gh pr edit ${{ github.event.number }} --add-label '...'
      gh pr edit ${{ github.event.number }} --remove-label '...'
    else
      echo "Skipping label update (not a pull request)"
    fi
```

**改善後:**
```yaml
- name: Add label to PR
  if: github.event_name == 'pull_request'
  run: |
    gh pr edit ${{ github.event.number }} --add-label '${{ steps.calcurate-hash.outputs.add_label }}'
    gh pr edit ${{ github.event.number }} --remove-label '${{ steps.calcurate-hash.outputs.remove_label }}'
```

#### 5.2 ci.yaml:89-97 - case関数でラベル値を設定

**現状:** SHA256比較をbashのif文で行い、add_label/remove_labelを設定

**改善後:**
1. SHA256を計算してGITHUB_OUTPUTに出力するステップを維持
2. 次のステップでcase関数を使ってラベル値を決定
3. GITHUB_STEP_SUMMARYの出力も同様にcase関数で改善

```yaml
- name: Calculate hash
  id: sha256
  run: |
    SHA256_OUTPUT=$(find ./dist -type f -print0 | sort --zero-terminated | xargs -0 sha256sum | cut -d ' ' -f 1 | sha256sum | cut -d ' ' -f 1)
    echo "value=$SHA256_OUTPUT" >> $GITHUB_OUTPUT

- name: Set label outputs
  id: calcurate-hash
  env:
    IS_CHANGED: ${{ vars.RECENT_ARTIFACTS_SHA256 != steps.sha256.outputs.value }}
  run: |
    echo "add_label=${{ case(env.IS_CHANGED == 'true', vars.LABEL_CHANGES, vars.LABEL_NO_CHANGES) }}" >> $GITHUB_OUTPUT
    echo "remove_label=${{ case(env.IS_CHANGED == 'true', vars.LABEL_NO_CHANGES, vars.LABEL_CHANGES) }}" >> $GITHUB_OUTPUT

    echo "${{ case(env.IS_CHANGED == 'true', '### 🚨 Changes to the artifacts', '### ✅ No changes to the artifacts') }}" >> ${{ runner.temp }}/tmp_artifacts_result.txt
    echo "building commit: \`${{ github.sha }}\`" >> ${{ runner.temp }}/tmp_artifacts_result.txt
    # ... 残りの出力
```

#### 5.3 vrt-regression.yaml:90-96 - case関数で--grepオプションを設定

**現状:**
```yaml
run: |
  if [[ -z "${{ steps.changed-files.outputs.contents_all_changed_and_modified_files }}" ]]; then
    pnpm run vrt:regression --retries=1 --grep="update dependencies"
  else
    pnpm run vrt:regression --retries=1 --grep="add contents"
  fi
```

**改善後:**
```yaml
run: |
  pnpm run vrt:regression --retries=1 --grep="${{
    case(
      steps.changed-files.outputs.contents_all_changed_and_modified_files != '',
      'add contents',
      'update dependencies'
    )
  }}"
```

#### 5.4 維持する箇所（case関数適用不可）

以下はシェルコマンドの結果を使用しているため、case関数では置き換えられない：

- **ci.yaml:147-153** - `gh pr view`の結果を使用（シェル変数skip_vrt_label）
- **update-blogs-data.yaml:60-65** - `git status`の結果を使用
- **update-blogs-data.yaml:82-88** - `gh pr view`の結果を使用
- **vrt-regression.yaml:80-85** - `ls -A`でファイル存在確認

### 6. Composite Action作成 [中優先度]

**検討の結果、以下の理由で現状維持を推奨：**

- すでに`.github/actions/setup-playwright`が存在し、パターンは確立されている
- pnpm/action-setupのバージョンはrenovateで自動更新されている
- セットアップステップは各ワークフローで微妙に異なる（cache-dependency-pathなど）
- 抽象化のコストに対してメリットが限定的

---

## 実装手順

### Step 1: ci.yamlの改善
1. concurrency設定を追加
2. 各ジョブにtimeout-minutesを追加
3. **bash条件分岐の簡素化:**
   - L89-103: SHA256比較をcase関数に変更（ステップ分割）
   - L105-115: イベント名分岐をステップレベルif条件に移行

### Step 2: vrt-regression.yamlの改善
1. concurrency設定を追加
2. timeout-minutesを追加
3. **bash条件分岐の簡素化:**
   - L90-96: --grepオプションをcase関数で設定

### Step 3: pages.ymlの改善
1. 全ステップにnameを追加
2. buildジョブにAstroキャッシュ保存を追加
3. 各ジョブにtimeout-minutesを追加

### Step 4: その他ワークフローの改善
1. copilot-setup-steps.yml: timeout-minutes, concurrency追加
2. vrt-init.yaml: name追加, timeout-minutes, concurrency追加
3. update-blogs-data.yaml: timeout-minutes追加（concurrencyは既存）
4. dry-renovate.yaml: timeout-minutes, concurrency追加
5. monthly-pr-metrics.yaml: timeout-minutes, concurrency追加
6. claude-code-action.yaml: concurrency追加（timeout-minutesは既存）
7. review-dependency-pr.yaml: concurrency追加（timeout-minutesは既存）

---

## 検証方法

1. `npm run lint` でYAML構文エラーがないことを確認
2. 各ワークフローファイルをローカルでYAMLとしてパース可能か確認
3. GitHub Actions UIでワークフローが正常に表示されることを確認（PRで確認）
