# プロジェクト構造

## ルートディレクトリ

- `.astro/` - Astroビルドキャッシュと生成された型定義
- `.storybook/` - Storybookの設定
- `db/` - データベース設定とユーティリティ
- `generated/` - 生成されたデータファイル（タグ、年）
- `public/` - そのまま配信される静的アセット
- `src/` - ソースコード
- `tools/` - データ生成用のユーティリティスクリプト
- `test-results/` - テスト出力ファイル
- `playwright/` - Playwrightテスト設定

## ソースコード構成 (`src/`)

### コンポーネント
`src/components/` に配置
- ストーリーを持つコンポーネントファイルは独自のフォルダに整理
- 各コンポーネントフォルダには以下が含まれる：
  - `index.tsx` - メインコンポーネント実装
  - `ComponentName.stories.tsx` - Storybookストーリー
- シンプルなコンポーネントは単一ファイルの場合もある

### コンテンツ
`src/content/` に配置
- `config.ts` - コンテンツコレクション設定
- `posts/` - Markdown/MDXブログ投稿

### ページ
`src/pages/` に配置
- `index.astro` - ホームページ
- `blogs/` - ブログ一覧ページとフィルター
- `posts/` - 投稿ページ、履歴、ランキング
- `random.astro` - ランダム記事ページ
- `rss.xml.ts` - RSSフィード生成器

### テンプレート
`src/templates/` に配置
- サイト全体で使用されるベースレイアウトテンプレート

### パーシャル
`src/partials/` に配置
- 再利用可能なページセクション

### ユーティリティ
`src/utils/` に配置
- ユーティリティ関数と設定
- `AppConfig.ts` - サイト全体の設定

### 型定義
`src/types/` に配置
- TypeScript型定義

### テスト
`src/tests/` に配置
- `component/` - コンポーネントテスト
- `e2e/` - エンドツーエンドテスト
- `unit/` - ユニットテスト
- `vrt/` - ビジュアルリグレッションテスト

## パブリックアセット (`public/`)

- `assets/` - 画像とJSONデータファイル
- `.well-known/` - Well-known URL

## コードスタイル規約

- 2スペースインデントを使用（Biomeで設定）
- TypeScriptのベストプラクティスに従う
- コンポーネントはPascalCaseを使用
- ユーティリティはcamelCaseを使用
- 単一コンポーネントを含むファイルはコンポーネント名を使用
- テストファイルは `.test.ts` または `.spec.ts` サフィックスを使用
- ストーリーファイルは `.stories.tsx` サフィックスを使用
