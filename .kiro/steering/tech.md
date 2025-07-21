---
inclusion: always
---

# 技術スタック・開発規約

## コアフレームワーク
- **Astro** - 静的サイト生成、ファイルベースルーティング
- **React** - UIコンポーネント（.tsx拡張子）
- **TypeScript** - 厳密な型チェック必須

## スタイリング規約
- **Tailwind CSS** - ユーティリティクラス優先、カスタムCSSは最小限
- **@tailwindcss/typography** - 記事コンテンツのスタイリング
- **@tailwindcss/aspect-ratio** - 画像・動画のアスペクト比制御
- **レスポンシブ設計** - モバイルファーストアプローチ

## データ・コンテンツ管理
- **Astro DB** - 構造化データ（GA4データ、外部記事情報）
- **MDX** - ブログ投稿、JSXコンポーネント埋め込み可能
- **Content Collections** - 型安全なコンテンツ管理

## テスト戦略
- **Vitest** - ユニットテスト（`*.test.ts`）
- **Playwright** - E2E（`*.spec.ts`）・コンポーネントテスト（`*.spec.tsx`）
- **VRT** - ビジュアルリグレッションテスト
- **Storybook** - コンポーネント単体テスト・ドキュメント

## コード品質
- **Biome** - リンター・フォーマッター（ESLint/Prettier代替）
- **TypeScript strict mode** - 型安全性の徹底
- **アクセシビリティ** - ARIA属性、キーボード操作対応必須

## 開発ワークフロー

### 基本開発コマンド
```bash
npm run dev          # 開発サーバー起動（http://localhost:4321）
npm run lint         # コード品質チェック
npm run lint:fix     # 自動修正可能な問題を修正
npm run build        # 本番ビルド（型チェック含む）
npm run preview      # ビルド結果のプレビュー
```

### テスト実行
```bash
npm test                    # 全テストスイート実行
npm run test:unit          # ユニットテスト（Vitest）
npm run test:playwright-ct # コンポーネントテスト
npm run test:playwright-e2e # E2Eテスト
npm run vrt:regression     # ビジュアルリグレッションテスト
```

### コンポーネント開発
```bash
npm run storybook          # Storybook起動（http://localhost:6006）
npm run build-storybook    # Storybookビルド
npm run chromatic          # ビジュアルテスト実行
```

### データ管理
```bash
npm run db:update          # 外部データ取得・DB更新
```

## 技術的制約・ベストプラクティス

### ファイル構成
- **コンポーネント**: `src/components/ComponentName/index.tsx` + `ComponentName.stories.tsx`
- **ページ**: `src/pages/*.astro`（ファイルベースルーティング）
- **ユーティリティ**: `src/utils/*.ts`（純粋関数、副作用なし）
- **型定義**: `src/types/*.ts`（インターフェース・型エイリアス）

### コーディング規約
- **インポート順序**: 外部ライブラリ → 内部モジュール → 相対パス
- **型定義**: `interface` 優先、`type` は複合型・ユニオン型で使用
- **Props**: デフォルト値設定、必須プロパティの明確化
- **エラーハンドリング**: 適切な例外処理とユーザーフィードバック

### パフォーマンス
- **画像最適化**: WebP/AVIF形式、適切なサイズ指定
- **コード分割**: 動的インポート活用
- **SEO**: メタデータ、構造化データの適切な設定
