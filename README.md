# korosuke613 homepage

複数のソースからコンテンツを集約するAstroベースの個人ホームページです。このリポジトリは開発者向けドキュメントとして、技術的詳細と開発ワークフローを重視した構成になっています。

## 技術スタック

### コア技術
- **Astro 5.x** - 静的サイトジェネレーター、パフォーマンス最適化
- **React 19** - UIコンポーネント開発
- **TypeScript** - 厳密な型安全性（strictestモード）
- **Tailwind CSS** - ユーティリティファーストCSS
- **Astro DB** - データベース（分析データ保存）

### 開発・テストツール
- **Biome** - リンター・フォーマッター（ESLint/Prettier代替）
- **Vitest** - ユニットテスト・Storybookテスト
- **Playwright** - E2E・コンポーネント・ビジュアルリグレッションテスト
- **Storybook** - コンポーネント開発・ドキュメント
- **Chromatic** - ビジュアルテスト自動化

### 外部統合
- **Google Analytics 4** - アクセス解析データ取得
- **HatenaBlog** - XML APIによる記事取得
- **Zenn** - OGPスクレイピングによる記事取得

## セットアップ

### 前提条件
- Node.js 18+
- npm

### 初期セットアップ
```bash
# 依存関係インストール
npm install

# 外部コンテンツツール用依存関係
cd tools && npm install && cd ..

# 環境変数設定（必要に応じて）
# .env.local を作成し、HatenaBlog認証情報を設定
```

### 環境変数
```bash
# HatenaBlog API認証（外部コンテンツ取得時）
HATENA_NAME=your_username
HATENA_PASS=your_api_key
```

## 開発ワークフロー

### 基本的な開発フロー
```bash
# 開発サーバー起動
npm run dev

# コード変更後の品質チェック
npm run lint:fix

# 型チェック
npm run build-types

# ビルド確認
npm run build
```

### テスト実行
```bash
# 全てのテスト実行
npm test

# 個別テスト実行
npm run test:unit           # ユニットテスト（カバレッジ付き）
npm run test:playwright-ct  # コンポーネントテスト
npm run test:playwright-e2e # E2Eテスト
npm run test:storybook      # Storybookテスト

# ビジュアルリグレッションテスト
npm run vrt:init            # 初回スナップショット生成
npm run vrt:regression      # リグレッション検出
```

### Storybook開発
```bash
# Storybook開発サーバー
npm run storybook

# Storybookビルド
npm run build-storybook

# Chromaticビジュアルテスト
npm run chromatic
```

### データベース操作
```bash
# GA4データ更新（リモート）
npm run db:update
```

### 外部コンテンツ更新
```bash
# toolsディレクトリで実行
cd tools

# HatenaBlogデータ更新
npm run update:hatena

# Zennデータ更新  
npm run update:zenn

# Zenn Scrapデータ更新
npm run update:zenn-scrap

# Docswellスライドデータ更新
npm run update:docswell
```

## アーキテクチャ概要

### データ統合アーキテクチャ
このプロジェクトは3つの独立したコンテンツソースを統合：

1. **ローカルMarkdown** (`src/content/posts/`)
   - フロントマター設定: `src/content/config.ts`
   - 処理ロジック: `src/utils/Posts.ts`

2. **外部ブログ** (`public/assets/*.json`)
   - HatenaBlog: XML API → JSON変換
   - Zenn: OGPスクレイピング → JSON変換
   - 処理ロジック: `src/utils/Blog.ts`

3. **分析データ** (Astro DB)
   - GA4データ取得・保存
   - ページビュー・クリック数追跡

### ビルド時データ生成
`src/utils/Integration.mjs`の`setupKorosuke`インテグレーションが実行：

```mjs
// astro:config:setup フックで実行
1. 全Markdownファイル解析
2. 外部ブログJSONファイル読み込み
3. タグシステム生成（Tailwindカラー自動割り当て）
4. 年度別データ集計
5. generated/tags.json, generated/years.json出力
```

### コンポーネント設計原則

#### Storybookパターン
全コンポーネントは以下の構造：
```
src/components/ComponentName/
├── index.tsx              # メインコンポーネント
└── ComponentName.stories.tsx # Storybook定義
```

#### 階層設計
- `src/components/` - 再利用可能な小さなUI部品
- `src/partials/` - ページレベルの大きなセクション
- `src/templates/` - レイアウトテンプレート
- `src/pages/` - Astroページファイル

### テスト戦略

#### 多層テスト構成
```bash
src/tests/
├── unit/           # Vitestユニットテスト
├── component/      # Playwright CTコンポーネントテスト  
├── e2e/           # Playwright E2Eテスト
└── vrt/           # ビジュアルリグレッションテスト
```

#### カバレッジ対象
- `src/utils/` - ユーティリティ関数
- `src/components/` - Reactコンポーネント
- `db/utils/` - データベースユーティリティ

### 継続的インテグレーション
GitHub Actionsワークフロー（`.github/workflows/`）：
- `ci.yaml` - 品質チェック・テスト実行
- `pages.yml` - GitHub Pagesデプロイ
- `vrt-*.yaml` - ビジュアルリグレッションテスト
- `update-blogs-data.yaml` - 外部コンテンツ自動更新

## 開発ガイドライン

### コード品質
- **必須**: 変更後は `npm run lint:fix` 実行
- TypeScript厳密モード準拠
- Biome設定による統一フォーマット

### コンポーネント開発
1. `src/components/NewComponent/index.tsx` 作成
2. `src/components/NewComponent/NewComponent.stories.tsx` 作成
3. Storybookで動作確認: `npm run storybook`
4. コンポーネントテスト追加（必要に応じて）

### データベース変更
1. `db/config.ts` でスキーマ更新
2. `npm run db:update` でリモート反映
3. 関連するユーティリティ関数更新

### 外部コンテンツ追加
1. `tools/` で新しい取得スクリプト作成
2. `src/types/` で型定義追加
3. `src/utils/Blog.ts` で統合処理追加
4. `src/utils/Integration.mjs` でビルド時処理追加

## トラブルシューティング

### よくある問題
- **ビルドエラー**: `npm run build-types` で型エラー確認
- **テスト失敗**: 個別テスト実行で問題箇所特定
- **外部データ取得失敗**: 環境変数・認証情報確認

### デバッグ方法
- Astro Dev Toolbar活用（開発時）
- Storybook Interactionsでコンポーネント動作確認
- PlaywrightのUIモード: `npx playwright test --ui`
