---
title: 'korosuke613/homepage-2ndを構成する技術スタック全解剖'
description: 'Astroベースの個人ホームページを支える、フロントエンド・バックエンド・インフラ・CI/CDのすべての技術を詳しく解説します'
pubDate: 2025-07-27T09:00:00Z
imgSrc: '/assets/images/cover/tech_stack.webp'
imgAlt: 'homepage-2ndの技術スタック図'
tags: 
  - Astro
  - React
  - TypeScript
  - GitHub Actions
  - ホムペ
  - Pickup ⭐️
---

## はじめに

このブログサイト（korosuke613/homepage-2nd）で使用している技術スタックについて、フロントエンド・バックエンド・インフラ・CI/CDの全てを網羅的に解説します。複数のソースからコンテンツを集約する個人ホームページとして、どのような技術選択をし、どう組み合わせているのかを詳しく紹介します。

## アーキテクチャ概要

このサイトは**Astro**をベースとした静的サイトジェネレータで、以下の特徴を持っています：

- **複数コンテンツソース**: ローカルMarkdown、HatenaBlog、Zenn記事の統合表示
- **データ駆動**: Astro DBによるページビュー・クリック数の分析データ保存
- **モダンフロントエンド**: React + TypeScript + Tailwind CSSでのコンポーネント開発
- **品質保証**: 多層テスト戦略とビジュアルリグレッションテスト
- **自動化**: GitHub Actionsによる包括的CI/CD

## フロントエンド技術

### Core Framework

**Astro 5.10.1**
- 静的サイト生成の中核技術
- Islands Architecture採用でハイドレーション最適化
- ビルド時データ生成による高パフォーマンス

**React 19.1.0**
- インタラクティブコンポーネントの開発
- サーバーコンポーネントとクライアントコンポーネントの使い分け
- Astroのアイランドアーキテクチャと組み合わせた部分的ハイドレーション

### スタイリング・UI

**Tailwind CSS 3.4.17**
```javascript
// tailwind.config.mjs
export default {
  content: ["./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
    screens: {
      xs: "460px",  // カスタムブレークポイント
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
```

**Storybook 9.0.14**
- コンポーネント駆動開発
- 全コンポーネントが`index.tsx` + `ComponentName.stories.tsx`のペアで構成
- アクセシビリティテスト（@storybook/addon-a11y）
- Chromatic連携によるビジュアルリグレッションテスト

### TypeScript設定

**厳密なTypeScript設定**
```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "exactOptionalPropertyTypes": false,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // パスエイリアス設定
    },
    "types": ["astro/client", "@astrojs/db"]
  }
}
```

### コンポーネントアーキテクチャ

**階層化されたコンポーネント設計**
- `src/components/` - 再利用可能な小コンポーネント
- `src/partials/` - ページレベルの大きなセクション
- `src/templates/` - レイアウトテンプレート

**主要コンポーネント例**
- `BlogCard` - 外部ブログ記事表示
- `PostCard` - ローカル投稿表示
- `RandomArticleCard` - ランダム記事表示機能
- `SimilarityPosts` - 類似記事推薦

## バックエンド・データ層

### データベース

**Astro DB**
```typescript
// db/config.ts
const Posts = defineTable({
  columns: {
    pagePath: column.text({ unique: true, primaryKey: true }),
    screenPageViews: column.number({ optional: false }),
  },
});

const Blogs = defineTable({
  columns: {
    linkUrl: column.text({ unique: true, primaryKey: true }),
    click: column.number({ optional: false }),
  },
});

const Zenns = defineTable({
  columns: {
    pagePath: column.text({ unique: true, primaryKey: true }),
    screenPageViews: column.number({ optional: false }),
  },
});
```

**Google Analytics 4統合**
- `@google-analytics/data`によるGA4データ取得
- ページビュー数・クリック数の自動収集・更新
- データベース更新は日次バッチで実行

### コンテンツ管理

**ローカルコンテンツ**
```typescript
// src/content/config.ts
const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    order: z.number().optional(),
    imgSrc: z.string().optional(),
    imgAlt: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});
```

**外部コンテンツ取得（tools/ディレクトリ）**

**HatenaBlog取得**
```bash
cd tools && npm run update:hatena
```
- AtomXMLフィードからのデータパース
- `HatenaXML.ts`での構造化データ変換

**Zenn記事取得**
```bash
cd tools && npm run update:zenn      # 記事データ
cd tools && npm run update:zenn-scrap  # スクラップデータ
```
- OGP情報スクレイピング
- 専用APIからのスクラップ情報取得

### ビルド時データ生成

**setupKorosukeインテグレーション**
`src/utils/Integration.mjs`で以下を自動生成：

1. **タグ色生成**: 全投稿・ブログのタグに対してランダムなTailwindカラーを割り当て
2. **年度集計**: 投稿とブログの年度別データを生成
3. **JSONファイル生成**: `generated/tags.json`と`generated/years.json`を出力

```javascript
// astro.config.mjs
integrations: [
  react(),
  tailwind({}),
  sitemap(),
  robotsTxt(),
  partytown(),
  setupKorosuke(),  // カスタムインテグレーション
  mdx(),
  metaTags(),
  db(),
],
```

## インフラストラクチャ

### ホスティング

**GitHub Pages**
- 静的サイト配信
- カスタムドメイン（korosuke613.dev）
- HTTPS自動対応

**デプロイメント戦略**
```yaml
# .github/workflows/pages.yml
- name: Build
  env: 
    ASTRO_DB_REMOTE_URL: ${{ secrets.ASTRO_DB_REMOTE_URL }}
    ASTRO_DB_APP_TOKEN: ${{ secrets.ASTRO_DB_APP_TOKEN }}
  run: npm run build -- --remote
```

### 外部サービス連携

**Google Cloud Platform**
- Workload Identity連携による認証
- Google Analytics 4データアクセス
- サービスアカウントベースのセキュア認証

**Chromatic**
- Storybookの自動ビルド・公開
- ビジュアルリグレッションテストの実行
- UIレビューフローの自動化

## CI/CD パイプライン

### GitHub Actions構成

**メインワークフロー**

**CI Pipeline（ci.yaml）**
```yaml
jobs:
  lint: # Biomeリンティング
  build: # Astroビルド + アーティファクトハッシュ計算
  unit-test: # Vitestユニットテスト
  e2e-test: # Playwright E2Eテスト 
  ct-test: # Playwrightコンポーネントテスト
  vrt: # ビジュアルリグレッションテスト
  chromatic: # Chromaticビジュアルテスト
  tools: # 外部コンテンツ取得ツールのテスト
```

**Pages Deploy（pages.yml）**
```yaml
jobs:
  update-astro-db: # GA4データ更新
  build: # リモートDB接続でのビルド
  deploy: # GitHub Pagesデプロイ
  call-scraping-workflow: # 外部コンテンツ更新
  call-vrt-init: # VRTスナップショット初期化
```

### 自動化されたコンテンツ更新

**定期実行スケジュール**
```yaml
on:
  schedule:
    - cron: '33 5 * * *'  # 日次でGA4データ・外部コンテンツ更新
```

**更新対象**
- HatenaBlogフィード（update-blogs-data.yaml）
- Zenn記事データ（scraping.yaml）
- GA4分析データ（pages.yml内のupdate-astro-db）

### パフォーマンス最適化

**ビルドキャッシュ戦略**
```yaml
- name: Restore astro build cache
  uses: actions/cache/restore@v4
  with:
    path: .astro/cache
    key: astro-build-${{ hashFiles('**/astro.config.mjs', '**/package-lock.json') }}
    restore-keys: |
      astro-build-${{ hashFiles('**/astro.config.mjs') }}-
      astro-build-
```

**アーティファクト変更検出**
- ビルド成果物のSHA256ハッシュ計算
- 変更がない場合はデプロイスキップ
- PRラベル自動付与による可視化

## テスト戦略

### 多層テストアプローチ

**1. ユニットテスト（Vitest）**
```json
"test:unit": "vitest run --project=unit --coverage"
```
- ユーティリティ関数のテスト
- ビジネスロジックの検証
- カバレッジレポート生成

**2. コンポーネントテスト（Playwright CT）**
```json
"test:playwright-ct": "playwright test -c playwright-ct.config.ts"
```
- Reactコンポーネントの単体テスト
- ブラウザ環境での実際の動作確認

**3. E2Eテスト（Playwright）**
```json
"test:playwright-e2e": "playwright test -c playwright-e2e.config.ts"
```
- 完全なユーザーフロー検証
- ナビゲーション・ページ遷移のテスト

**4. ビジュアルリグレッションテスト**
```json
"vrt:init": "playwright test -c playwright-vrt.config.ts ./src/tests/vrt/init.spec.ts"
"vrt:regression": "playwright test -c playwright-vrt.config.ts ./src/tests/vrt/regression.spec.ts"
```
- スクリーンショット比較による視覚的変更検出
- CI/CD内での自動回帰テスト

**5. Storybookテスト**
```json
"test:storybook": "vitest run --project=storybook --coverage"
```
- コンポーネントストーリーの検証
- アクセシビリティテスト統合

### テスト最適化

**並列実行・キャッシュ戦略**
```yaml
- name: E2E testing
  run: npm run test:playwright-e2e -- --retries=2 --workers=2
  
- name: Cache playwright binaries
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ steps.npm-install.outputs.PLAYWRIGHT_VERSION }}
```

## 品質保証・開発体験

### コード品質管理

**Biome統合**
```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "indentStyle": "space"
  },
  "overrides": [
    {
      "includes": ["**/*.astro"],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off",
            "useImportType": "off"
          }
        }
      }
    }
  ]
}
```

**実行コマンド**
```bash
npm run lint      # CIモードでのリンティング
npm run lint:fix  # 自動修正付きリンティング
```

### 依存関係管理

**Renovate自動更新**
- 依存関係の定期的な自動更新
- セキュリティパッチの迅速適用
- テスト結果に基づく自動マージ

**パッケージ管理戦略**
- npm ci による確定的インストール
- package-lock.json による厳密なバージョン管理
- セキュリティ監査の定期実行

### 開発効率化

**Hot Module Replacement**
```bash
npm run dev  # 開発サーバーでのライブリロード
```

**型安全性**
- 厳密TypeScript設定
- Astro型サポート
- ビルド時型チェック

## セキュリティ対策

### 認証・認可

**GitHub Actions Secrets管理**
- GA4アクセス用認証情報
- Astro DB接続情報
- 外部サービス連携トークン

**Workload Identity**
- パスワードレス認証
- 最小権限の原則
- トークン自動ローテーション

### コンテンツセキュリティ

**外部リンク処理**
```javascript
rehypePlugins: [
  [
    rehypeExternalLinks,
    {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    },
  ],
],
```

**XSS対策**
- Astroの自動エスケープ
- CSPヘッダー設定
- ユーザー入力の適切なサニタイゼーション

## パフォーマンス最適化

### ビルド時最適化

**Islands Architecture**
- 必要な部分のみJavaScript配信
- 静的コンテンツの最大化
- ハイドレーション最小化

**アセット最適化**
- 画像の最適化・遅延読み込み
- CSS/JSの最小化
- CDN活用による配信最適化

### ランタイム最適化

**キャッシュ戦略**
- ビルドキャッシュによる高速ビルド
- ブラウザキャッシュ最適化
- CDNエッジキャッシュ活用

**パフォーマンス監視**
- Core Web Vitalsの追跡
- ビルド時間監視
- デプロイサイズ監視

## 運用・監視

### 分析・メトリクス

**Google Analytics 4統合**
- ページビュー自動追跡
- カスタムイベント設定
- リアルタイムデータ分析

**GitHub Actions監視**
- actions-timelineによる実行時間可視化
- 失敗通知のSlack連携
- メトリクス収集・分析

### 継続的改善

**A/Bテスト基盤**
- 機能フラグ対応
- パフォーマンス比較
- ユーザーエクスペリエンス最適化

**アクセシビリティ**
- Storybook a11yアドオン
- セマンティックHTML
- スクリーンリーダー対応

## まとめ

korosuke613/homepage-2ndは、モダンな技術スタックを活用した包括的な個人ホームページシステムです。主な技術的成果：

### 技術的成果
- **フロントエンド**: Astro + React + TypeScript + Tailwind CSSによるモダンな開発体験
- **バックエンド**: Astro DB + GA4統合による分析データ駆動型サイト
- **インフラ**: GitHub Pages + GitHub Actionsによるフルマネージド運用
- **品質保証**: 多層テスト戦略による高品質コード維持

### 特徴的な実装
- 複数コンテンツソースの統合アーキテクチャ
- Islands Architectureによるパフォーマンス最適化
- 包括的CI/CDパイプライン
- ビジュアルリグレッションテストによる品質保証

このような技術構成により、高パフォーマンス・高品質・運用効率を両立した個人ホームページを実現しています。各技術の選択理由や組み合わせ方法が、同様のプロジェクトを構築する際の参考になれば幸いです。

今後も新しい技術の採用や既存システムの改善を通じて、より良いユーザーエクスペリエンスと開発者エクスペリエンスの実現を目指していきます。