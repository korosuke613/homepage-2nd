# 技術スタック

## コアフレームワーク
- [Astro](https://astro.build/) - メインWebフレームワーク
- [React](https://react.dev/) - コンポーネントライブラリ
- [TypeScript](https://www.typescriptlang.org/) - プログラミング言語

## スタイリング
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - 文章スタイリング
- [@tailwindcss/aspect-ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio) - アスペクト比ユーティリティ

## データベース
- [Astro DB](https://docs.astro.build/en/guides/astro-db/) - データベース統合

## コンテンツ
- [MDX](https://mdxjs.com/) - JSXサポート付きMarkdown
- [Rehype](https://github.com/rehypejs/rehype) - HTMLプロセッサ
- [Remark](https://github.com/remarkjs/remark) - Markdownプロセッサ

## テスト
- [Playwright](https://playwright.dev/) - E2Eおよびコンポーネントテスト
- [Vitest](https://vitest.dev/) - ユニットテスト
- Visual Regression Testing (VRT) - カスタム実装

## 開発ツール
- [Biome](https://biomejs.dev/) - リンターとフォーマッター
- [Storybook](https://storybook.js.org/) - コンポーネント開発環境
- [Chromatic](https://www.chromatic.com/) - ビジュアルテストプラットフォーム

## その他の統合
- [Google Analytics](https://analytics.google.com/) - アナリティクス
- [Algolia DocSearch](https://docsearch.algolia.com/) - 検索機能
- [RSS](https://www.rssboard.org/rss-specification) - フィード生成

## よく使うコマンド

### 開発
```bash
# 開発サーバー起動
npm run dev

# リンティング実行
npm run lint

# リンティング問題の修正
npm run lint:fix
```

### テスト
```bash
# 全テスト実行
npm test

# 特定のテストスイート実行
npm run test:unit
npm run test:playwright-ct
npm run test:playwright-e2e

# ビジュアルリグレッションテスト
npm run vrt:init
npm run vrt:regression
```

### ビルド
```bash
# 型チェックとビルド
npm run build

# 型チェックのみ
npm run build-types

# ビルドプレビュー
npm run preview
```

### Storybook
```bash
# Storybook実行
npm run storybook

# Storybookビルド
npm run build-storybook

# Chromaticにデプロイ
npm run chromatic
```

### データベース
```bash
# リモートデータベース更新
npm run db:update
```
