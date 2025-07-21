# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定
このリポジトリでの作業時は、常に日本語で回答してください。

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

## アーキテクチャ

複数のソースからコンテンツを集約するAstroベースの個人ホームページです。

### コンテンツ構造
- **投稿**: `src/content/posts/`内のローカルmarkdownファイル。フロントマターのスキーマは`src/content/config.ts`で定義
- **外部ブログ**: HatenaBlogとZennの記事を取得して`public/assets/`に保存
- **データベース**: Astro DBがページビューとクリック数のGA4分析データを保存

### 主要なインテグレーション
- **カスタムsetupKorosukeインテグレーション** (`src/utils/Integration.mjs`): ビルド時にタグの色を生成してmarkdownフロントマターを処理
- **外部コンテンツ取得**: `tools/`ディレクトリのツールがHatenaBlogとZennのコンテンツを取得・処理
- **GA4インテグレーション**: `db/updateGA4Data.ts`がGoogle Analyticsデータを取得・保存

### コンポーネント構成
- コンポーネントは`index.tsx` + `ComponentName.stories.tsx`のStorybookパターンに従う
- `src/partials/`のPartialsは大きなページセクション
- `src/templates/`のTemplatesはレイアウトコンポーネント

### データフロー
1. ビルド時: `setupKorosuke`インテグレーションがmarkdownを処理して`generated/tags.json`と`generated/years.json`を生成
2. 外部コンテンツはツールで取得して`public/assets/`に保存
3. GA4データはAstro DBで定期的に更新
4. ページは全ソースからコンテンツを動的に集約

### テスト戦略
- ユーティリティのVitestによるユニットテスト
- ReactコンポーネントのPlaywright CTによるコンポーネントテスト
- 完全なユーザーフローのPlaywrightによるE2Eテスト
- UI一貫性のためのビジュアルリグレッションテスト
- コンポーネント開発とビジュアルテストのためのStorybook

### データベーススキーマ
Astro DBテーブルが分析データを追跡:
- `Posts`: ローカル投稿のページビュー
- `Blogs`: 外部ブログリンクのクリック数
- `Zenns`: Zenn記事のページビュー
- `Playground`: DB操作のテストテーブル