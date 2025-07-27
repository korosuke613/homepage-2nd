# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定
このリポジトリでの作業時は、常に日本語で回答してください。

## Claude Code エージェント設定

このプロジェクトでは、開発ワークフローを効率化するために以下の専門エージェントが設定されています（`.claude/agents/`）：

### コンテンツ品質管理
- **blog-content-reviewer** - ブログコンテンツの技術的正確性、リンク整合性、価値を包括的にレビュー
- **decision-recorder** - プロジェクトの重要な意思決定を`docs/tasks/`に体系的に記録・文書化

### コード品質保証  
- **code-reviewer** - コードの品質、セキュリティ、保守性を積極的にレビュー
- **debugger** - システムの問題診断と効率的なデバッグ支援

### アーキテクチャ・設計
- **repository-architect** - プロジェクトの設計思想、実装詳細、データフローに関する専門知識提供
- **tdd-refactoring-coach** - テスト駆動開発とリファクタリングのベストプラクティス指導

**使用指針**: 各エージェントは特定のタスクに特化しており、該当する作業を行う際に適切なエージェントを選択することで、より高品質で一貫性のある開発成果を得られます。

## コマンド

### 開発
- `npm run dev` - 開発サーバーを起動
- `npm run build` - サイトをビルド（型チェックとAstroチェックを含む）
- `npm run preview` - ビルドしたサイトをプレビュー

### テスト
- `npm test` - 全てのテスト実行（unit, component, e2e）
- `npm run test:unit` - カバレッジ付きでユニットテスト実行
- `npm run test:playwright-ct` - コンポーネントテスト実行
- `npm run test:playwright-e2e` - E2Eテスト実行
- `npm run test:storybook` - Storybookテスト実行
- `npm run vrt:init` - ビジュアルリグレッションテストのスナップショットを初期化
- `npm run vrt:regression` - ビジュアルリグレッションテスト実行

### コード品質
- `npm run lint` - Biomeリンティング実行（CIモード）
- `npm run lint:fix` - Biomeでリンティング問題を修正
- `npm run build-types` - ファイル出力なしで型チェック

**重要**: ソースコードを変更した際は、必ず `npm run lint:fix` を実行してコードフォーマットとリンティング問題を修正してください。

### データベース
- `npm run db:update` - データベーススキーマをプッシュしてGA4データをリモート更新

### Storybook
- `npm run storybook` - Storybook開発サーバー起動
- `npm run build-storybook` - Storybookビルド
- `npm run chromatic` - Chromaticビジュアルテスト実行

### 外部コンテンツ更新（toolsディレクトリ）
外部ブログコンテンツの更新は `tools/` ディレクトリで実行：
- `cd tools && npm run update:hatena` - HatenaBlogデータを更新
- `cd tools && npm run update:zenn` - Zennデータを更新
- `cd tools && npm run update:zenn-scrap` - Zenn Scrapデータを更新

## アーキテクチャ

複数のソースからコンテンツを集約するAstroベースの個人ホームページです。

### コンテンツ構造
- **ローカル投稿**: `src/content/posts/`内のMarkdownファイル。フロントマターのスキーマは`src/content/config.ts`で定義
- **外部ブログ**: HatenaBlogとZennの記事を取得して`public/assets/`にJSONとして保存
- **データベース**: Astro DBがページビューとクリック数のGA4分析データを保存

### ビルド時データ生成の仕組み
`src/utils/Integration.mjs`の`setupKorosuke`インテグレーションが核心的な役割を果たす：
1. **タグ色生成**: 全投稿・ブログのタグに対してランダムなTailwindカラーを割り当て
2. **年度集計**: 投稿とブログの年度別データを生成
3. **JSONファイル生成**: `generated/tags.json`と`generated/years.json`を出力

### データ統合アーキテクチャ
3つのコンテンツソースの統合処理：
- **ローカルMarkdown**: `src/utils/Posts.ts`で処理、frontmatterから投稿データを抽出
- **外部ブログ**: `src/utils/Blog.ts`で処理、HatenaBlog/Zenn/ZennScrapのJSONデータを変換
- **統合表示**: 日付順ソート、タグシステム、カテゴリ分類で統一的に表示

### コンポーネント設計パターン
- **Storybookパターン**: 全コンポーネントは`index.tsx` + `ComponentName.stories.tsx`のペア
- **階層構造**: 
  - `src/components/` - 再利用可能な小コンポーネント
  - `src/partials/` - ページレベルの大きなセクション
  - `src/templates/` - レイアウトテンプレート

### データベーススキーマ詳細
Astro DBテーブル構成（`db/config.ts`）：
- `Posts`: ローカル投稿のページビュー数追跡
- `Blogs`: 外部ブログリンクのクリック数追跡  
- `Zenns`: Zenn記事のページビュー数追跡
- `Playground`: 開発・テスト用テーブル

### 外部コンテンツ取得システム
`tools/`ディレクトリの独立したNode.jsツール群：
- **HatenaBlog**: AtomXMLフィードから記事情報を取得・パース
- **Zenn**: 記事URLからOGP情報をスクレイピング
- **ZennScrap**: スクラップ情報を専用APIから取得

### テスト戦略
- **ユニットテスト**: Vitestによるユーティリティ関数のテスト
- **コンポーネントテスト**: Playwright CTによるReactコンポーネントの動作テスト
- **E2Eテスト**: Playwrightによる完全なユーザーフロー検証
- **ビジュアルリグレッション**: Playwrightによるスクリーンショット比較
- **Storybook**: コンポーネントの視覚的開発とドキュメント

### 重要な設定ファイル
- `astro.config.mjs`: Astro設定、インテグレーション定義、リハイププラグイン設定
- `biome.json`: リンター・フォーマッター設定、Astroファイル特別ルール含む
- `tailwind.config.mjs`: Tailwind CSS設定、カスタムスクリーンサイズ定義
- `tsconfig.json`: 厳密なTypeScript設定、エイリアスパス設定