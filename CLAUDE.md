# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定
このリポジトリでの作業時は、常に日本語で回答してください。

## 前提条件
- Node.js 20+
- pnpm 10+（`packageManager` フィールドで `pnpm@10.32.0` を指定）
- **重要**: このプロジェクトではパッケージマネージャーに **pnpm** を使用する。`npm` ではなく `pnpm` コマンドを使うこと

## 依存関係管理ポリシー

本リポジトリはサプライチェーン攻撃対策として、依存関係更新に Renovate Dependency Dashboard Approval 方式を採用しています（自動 PR 作成・自動マージは全廃止）。詳細:

- 内部ポリシー: [docs/DEPENDENCY_POLICY.md](./docs/DEPENDENCY_POLICY.md)
- 公開記事: [src/content/posts/20260418_dependency_update_strategy.md](./src/content/posts/20260418_dependency_update_strategy.md)

依存関係を追加・更新する場合はポリシーに従うこと。

## コマンド

### 開発
- `pnpm run dev` - 開発サーバーを起動（http://localhost:4321/）
- `pnpm run build` - サイトをビルド（型チェックとAstroチェックを含む）
- `pnpm run preview` - ビルドしたサイトをプレビュー

**タイムアウト注意**: ビルドは60秒以上かかることがある。途中キャンセル厳禁。

### テスト
- `pnpm test` - 全てのテスト実行（unit, component, e2e, storybook）
- `pnpm run test:unit` - カバレッジ付きでユニットテスト実行
- `pnpm run test:playwright-ct` - コンポーネントテスト実行
- `pnpm run test:playwright-e2e` - E2Eテスト実行
- `pnpm run test:storybook` - Storybookテスト実行
- `pnpm run vrt:init` - ビジュアルリグレッションテストのスナップショットを初期化
- `pnpm run vrt:regression` - ビジュアルリグレッションテスト実行

単一テストファイルの実行:
- `pnpm vitest run src/tests/unit/対象ファイル.test.ts` - 特定のユニットテストを実行

### コード品質
- `pnpm run lint` - Biomeリンティング実行（CIモード）
- `pnpm run lint:fix` - Biomeでリンティング問題を修正
- `pnpm run build-types` - ファイル出力なしで型チェック

**注意**: Edit/Write後にBiomeが自動実行されるPostToolUseフックが設定済み（`.claude/settings.json`）。手動での `pnpm run lint:fix` は通常不要。

## コミットタイプガイドライン

コミットメッセージには以下のConventional Commitsに従った適切なプレフィックスを使用すること：
コミットメッセージは英語で書くこと

- `feat:` - 新機能追加
- `fix:` - バグ修正
- `docs:` - ドキュメントのみの変更
- `style:` - コードの意味に影響しない変更（空白、フォーマット、セミコロンなど）
- `refactor:` - バグ修正や機能追加ではないコードの変更
- `perf:` - パフォーマンス改善
- `test:` - テストの追加や修正
- `build:` - ビルドシステムや外部依存関係に影響する変更
- `chore:` - その他の変更（ビルドプロセス、補助ツールなど）
- `ci:` - CI/CD設定ファイルやスクリプトの変更

**重要な判断基準**：
- GitHub ActionsやCI/CDパイプラインに関する変更は `ci:`
- Chromatic、Playwright、テスト設定の変更は `ci:`
- パッケージの依存関係更新は `build:`
- ソースコードのバグや動作不良の修正は `fix:`

### データベース
- `pnpm run db:update` - データベーススキーマをプッシュしてGA4データをリモート更新

### Storybook
- `pnpm run storybook` - Storybook開発サーバー起動（http://localhost:6006/）
- `pnpm run build-storybook` - Storybookビルド
- `pnpm run chromatic` - Chromaticビジュアルテスト実行

### 外部コンテンツ更新（toolsディレクトリ）
外部ブログ・スライドコンテンツの更新は `tools/` ディレクトリで実行：
- `cd tools && pnpm run update:hatena` - HatenaBlogデータを更新
- `cd tools && pnpm run update:zenn` - Zennデータを更新
- `cd tools && pnpm run update:zenn-scrap` - Zenn Scrapデータを更新
- `cd tools && pnpm run update:docswell` - Docswellスライドデータを更新

## アーキテクチャ

複数のソースからコンテンツを集約するAstroベースの個人ホームページです。

### TypeScript設定
- `astro/tsconfigs/strictest` を継承した厳密モード
- パスエイリアス: `@/*` → `./src/*`

### コンテンツ構造（4つのソース）
- **ローカル投稿**: `src/content/posts/`内のMarkdownファイル。フロントマターのスキーマは`src/content/config.ts`で定義
- **外部ブログ**: HatenaBlogとZennの記事を取得して`public/assets/`にJSONとして保存
- **外部スライド**: Docswell（RSS API）、SpeakerDeck、SlideShareのスライドを`public/assets/`にJSONとして保存
- **分析データ**: Astro DBがページビューとクリック数のGA4分析データを保存

### ビルド時データ生成の仕組み
`src/utils/Integration.mjs`の`setupKorosuke`インテグレーションが核心的な役割を果たす：
1. **タグ色生成**: 全投稿・ブログ・スライドのタグに対してランダムなTailwindカラーを割り当て
2. **年度集計**: 投稿・ブログ・スライドの年度別データを生成
3. **JSONファイル生成**: `generated/tags.json`と`generated/years.json`を出力

### データ統合アーキテクチャ
4つのコンテンツソースの統合処理：
- **ローカルMarkdown**: `src/utils/Posts.ts`で処理、frontmatterから投稿データを抽出
- **外部ブログ**: `src/utils/Blog.ts`で処理、HatenaBlog/Zenn/ZennScrapのJSONデータを変換
- **外部スライド**: `src/utils/Slide.ts`で処理、Docswell/SpeakerDeck/SlideShareのJSONデータを変換
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
- **Docswell**: RSS APIからスライド情報を取得

### テスト戦略
- **ユニットテスト**: Vitestによるユーティリティ関数のテスト
- **コンポーネントテスト**: Playwright CTによるReactコンポーネントの動作テスト
- **E2Eテスト**: Playwrightによる完全なユーザーフロー検証
- **ビジュアルリグレッション**: Playwrightによるスクリーンショット比較（詳細: [docs/VRT.md](./docs/VRT.md)）
- **Storybook**: コンポーネントの視覚的開発とドキュメント

### 重要な設定ファイル
- `astro.config.mjs`: Astro設定、インテグレーション定義、リハイププラグイン設定
- `biome.json`: リンター・フォーマッター設定、Astroファイル特別ルール含む
- `tailwind.config.mjs`: Tailwind CSS設定、カスタムスクリーンサイズ定義
- `tsconfig.json`: 厳密なTypeScript設定、パスエイリアス（`@/*`）設定
