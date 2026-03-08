# VRT失敗画像アップロードのマトリクスジョブ化

## Context

PR #1252 で `upload-artifact@v7` の `archive: false` を使い、VRT失敗画像を個別にアップロードする仕組みを導入した。しかし `archive: false` は1ファイル/1ステップの制約があるため、9ページ × 3種類 = 27個の upload ステップが必要となり、YAML が冗長でメンテナンス性が低い。

Copilot レビュー (Comment 3) でも指摘されたこの冗長さを、**後続マトリクスジョブ**で解決する。

## 方針: 2ジョブ・アーキテクチャ

### Job 1: `vrt-regression-test` (既存・修正)
- 27個の upload ステップを削除
- 失敗時に全画像を **1つのアーカイブ済みアーティファクト** としてアップロード（通常の `archive: true`）
- `retention-days: 1` で中間アーティファクトは1日で自動削除

### Job 2: `vrt-upload-individual` (新規・マトリクス)
- `needs: vrt-regression-test` + `if: failure()` で失敗時のみ起動
- `strategy.matrix` で 9ページ × 3種類 = 27組を展開
- 中間アーティファクトをダウンロードし、個別ファイルを `archive: false` で再アップロード

## 修正対象ファイル

- `.github/workflows/vrt-regression.yaml` — **唯一の変更対象**
- `ci.yaml` — 変更不要（reusable workflow の内部ジョブ追加は呼び出し元に透過的）

## 参照ファイル

- `src/tests/vrt/testdata.ts` — 9ページ名の定義元（matrix の `page` 配列と同期必須）

## 具体的な変更内容

### 1. `vrt-regression-test` ジョブの修正

#### outputs ブロックを追加
```yaml
outputs:
  has-failure-images: ${{ steps.prepare-images.outputs.has-images }}
```

#### "Prepare VRT failure images" ステップを修正
- `id: prepare-images` を追加
- 画像収集後に `has-images` output を設定

```yaml
- name: Prepare VRT failure images
  id: prepare-images
  if: failure()
  run: |
    mkdir -p /tmp/vrt-images
    if [ -d test-results ]; then
      find test-results \( -name "*-actual.png" -o -name "*-expected.png" -o -name "*-diff.png" \) -exec cp {} /tmp/vrt-images/ \;
    fi
    if [ -n "$(ls -A /tmp/vrt-images/ 2>/dev/null)" ]; then
      echo "has-images=true" >> $GITHUB_OUTPUT
    else
      echo "has-images=false" >> $GITHUB_OUTPUT
    fi
```

#### 27個の upload ステップを1つに置換
```yaml
- name: Upload VRT failure images (archived)
  if: failure() && steps.prepare-images.outputs.has-images == 'true'
  uses: actions/upload-artifact@v7
  with:
    name: vrt-failure-images-archived
    path: /tmp/vrt-images/
    retention-days: 1
```

### 2. `vrt-upload-individual` ジョブを追加

```yaml
vrt-upload-individual:
  name: Upload VRT image (${{ matrix.page }}-${{ matrix.type }})
  needs: vrt-regression-test
  if: failure() && needs.vrt-regression-test.outputs.has-failure-images == 'true'
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      # Keep in sync with src/tests/vrt/testdata.ts
      page: [index, dormitory-introduction, post, posts, posts-tag, posts-year, blogs, blogs-tag, blogs-year]
      type: [actual, expected, diff]
  steps:
    - name: Download archived VRT failure images
      uses: actions/download-artifact@v4
      with:
        name: vrt-failure-images-archived
        path: /tmp/vrt-images

    - name: Upload ${{ matrix.page }}-${{ matrix.type }}
      uses: actions/upload-artifact@v7
      with:
        path: /tmp/vrt-images/${{ matrix.page }}-${{ matrix.type }}.png
        archive: false
        if-no-files-found: ignore
```

## 設計判断

| 判断 | 理由 |
|------|------|
| `fail-fast: false` | 一部ページのみ失敗が通常。未失敗ページの matrix インスタンスが `ignore` で正常終了する必要あり |
| `retention-days: 1` | 中間アーティファクトは matrix ジョブ完了後不要。最短で自動削除 |
| `has-failure-images` output | 画像なしの場合に27個の matrix ジョブの無駄なスピンアップを防止 |
| `download-artifact@v4` | アーカイブ済みアーティファクトのダウンロードには v4 で十分。v8 は非アーカイブ用 |

## エッジケース

- **全テスト成功**: テストジョブ成功 → `failure()` = false → matrix ジョブはスキップ
- **一部ページのみ失敗**: 27 matrix インスタンスすべて起動するが、画像が存在しないインスタンスは `if-no-files-found: ignore` で無害に完了
- **`inputs.skip: true`**: テストジョブは失敗しない → matrix ジョブはスキップ
- **Playwright クラッシュ（test-results 未生成）**: `if [ -d test-results ]` ガードにより `has-images=false` → matrix ジョブはスキップ

## 検証方法

1. ワークフローの YAML 構文チェック: `actionlint .github/workflows/vrt-regression.yaml`（ローカルに actionlint がある場合）
2. PR にプッシュして CI で VRT テストが実行されることを確認
3. VRT テストが成功した場合: matrix ジョブがスキップされることを確認
4. VRT テストが失敗した場合: 個別の PNG が `archive: false` でアップロードされ、ブラウザで直接閲覧可能であることを確認

## PR レビューコメント (Comment 3) への返信更新

修正完了後、Comment 3 (ID: 2867503795) のスレッドに追加返信を投稿する:
- マトリクスジョブ化で対応した旨とコミットハッシュを記載
