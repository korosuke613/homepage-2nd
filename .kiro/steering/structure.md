---
inclusion: always
---

# プロジェクト構造とファイル配置規則

## ファイル配置パターン

### コンポーネント作成規則
新しいコンポーネントを作成する際は以下の規則に従う：

**複雑なコンポーネント（フォルダ構成）:**
```
src/components/ComponentName/
├── index.tsx              # メインコンポーネント実装
└── ComponentName.stories.tsx  # Storybookストーリー
```

**シンプルなコンポーネント（単一ファイル）:**
```
src/components/ComponentName.tsx
```

### ページ作成規則
- 静的ページ: `src/pages/pagename.astro`
- 動的ページ: `src/pages/[param].astro` または `src/pages/[...slug].astro`
- ページネーション: `src/pages/category/[...page].astro`

### テスト配置規則
- コンポーネントテスト: `src/tests/component/ComponentName.spec.tsx`
- ユニットテスト: `src/tests/unit/ModuleName.test.ts`
- E2Eテスト: `src/tests/e2e/feature.spec.ts`
- VRTテスト: `src/tests/vrt/regression.spec.ts`

## ディレクトリ構造

### ルートディレクトリ
- `.astro/` - ビルドキャッシュと生成された型定義（編集禁止）
- `.storybook/` - Storybook設定
- `db/` - Astro DBスキーマとユーティリティ
- `generated/` - 自動生成データ（tags.json, years.json）
- `public/` - 静的アセット（画像、JSON、favicon等）
- `src/` - メインソースコード
- `tools/` - データ生成スクリプト
- `test-results/` - テスト出力（編集禁止）

### ソースコード構成 (`src/`)

**`src/components/`** - 再利用可能なUIコンポーネント
- フォルダ構成または単一ファイル
- 必要に応じてStorybookストーリーを含む

**`src/content/`** - Astro Content Collections
- `config.ts` - コレクション定義
- `posts/` - Markdown/MDXブログ投稿

**`src/pages/`** - ルーティング対象ページ
- Astroファイルベースルーティング
- 動的ルートとページネーション対応

**`src/templates/`** - レイアウトテンプレート
- サイト全体の共通レイアウト

**`src/partials/`** - ページセクション
- 複数ページで再利用されるセクション

**`src/utils/`** - ユーティリティ関数
- `AppConfig.ts` - サイト設定
- ビジネスロジックとヘルパー関数

**`src/types/`** - TypeScript型定義
- インターフェースと型エイリアス

**`src/styles/`** - グローバルスタイル
- `global.css` - Tailwind CSSとカスタムスタイル

## 命名規則

### ファイル・フォルダ命名
- コンポーネント: `PascalCase` (例: `BlogCard`, `SocialLinks`)
- ページ: `kebab-case` (例: `blog-list.astro`)
- ユーティリティ: `PascalCase` (例: `AppConfig.ts`, `Posts.ts`)
- テスト: `ComponentName.spec.tsx` または `moduleName.test.ts`
- ストーリー: `ComponentName.stories.tsx`

### コード内命名
- 変数・関数: `camelCase`
- 定数: `UPPER_SNAKE_CASE`
- 型・インターフェース: `PascalCase`
- CSS クラス: Tailwind CSS ユーティリティを優先

## 開発時の注意事項

### 新規ファイル作成時
1. 適切なディレクトリに配置
2. 命名規則に従う
3. 必要に応じてテストファイルも作成
4. TypeScript型定義を明確にする

### インポート規則
- 相対パス (`./`, `../`) を使用
- `src/` からの絶対パスは避ける
- 型のみのインポートは `import type` を使用

### エクスポート規則
- デフォルトエクスポートを優先
- 複数エクスポートが必要な場合は名前付きエクスポート
- `index.ts` ファイルでの再エクスポートは最小限に
