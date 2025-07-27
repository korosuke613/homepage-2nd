---
title: 'korosuke613/homepage-2ndを構成する技術スタック全解剖'
description: 'Astroベースの個人ホームページを支える、フロントエンド・バックエンド・インフラ・CI/CDのすべての技術を詳しく解説します'
pubDate: 2025-07-27T09:00:00Z
tags: 
  - Astro
  - React
  - TypeScript
  - GitHub Actions
  - ホムペ
  - Pickup ⭐️
---

## はじめに

このブログサイト（korosuke613/homepage-2nd）の技術スタックの中でも、特に特筆すべき技術的実装について解説します。インタラクティブなアバター機能、類似記事推薦システム、独自ビルドシステム、ビジュアルリグレッションテストなど、一般的なサイトとは異なる独自の工夫を中心に紹介します。

## 特筆すべき技術実装

### 1. インタラクティブアバター「MyIcon」

サイトトップに配置されたアバター画像は、単なる装飾ではなく高度にインタラクティブなコンポーネントです。

**ソースコード**: [`src/components/MyIcon/index.tsx`](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/MyIcon/index.tsx)  
**仕様書**: [`src/components/MyIcon/SPEC.md`](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/MyIcon/SPEC.md)

#### 隠しキーボードコマンド機能

以下のコマンドをキーボードで入力することで、様々なモードを発動できます：

- **`mugen`**: No Limit Mode - 回転制限解除
- **`eien`**: Infinity Mode - 自動回転開始  
- **`clockup`**: 速度とインターバル加速
- **`kakku`**: DVD Mode - 跳ね返り移動
- **`oikake`**: Chase Mode - マウス追跡/回避

#### Chase Modeアルゴリズム

マウス追跡システムの動作フロー：

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Mouse as マウス
    participant MyIcon as MyIconコンポーネント
    participant Calc as 距離計算システム
    participant Move as 移動制御
    participant Wall as 壁衝突判定

    User->>Mouse: マウス移動
    Mouse->>MyIcon: mousemove イベント
    MyIcon->>MyIcon: mousePositionRef更新
    
    loop 60fps アニメーションループ
        MyIcon->>Calc: アイコン中心座標取得
        MyIcon->>Calc: マウス座標取得
        Calc->>Calc: 距離計算: √(Δx² + Δy²)
        
        alt 距離 > 50px（最小距離閾値）
            alt Follow Mode
                Calc->>Move: 正規化ベクトル * moveSpeed<br/>→ マウスに向かう方向
            else Avoid Mode  
                Calc->>Move: -正規化ベクトル * moveSpeed<br/>→ マウスから逃げる方向
            end
        else 近距離処理
            alt Follow Mode
                Calc->>Move: 減速処理 (speedFactor * 0.9)<br/>→ 停止に向かう
            else Avoid Mode
                alt 距離 > 0
                    Calc->>Move: 一定速度で逃避継続
                else 完全重複
                    Calc->>Move: ランダム角度生成<br/>→ ランダム方向逃避
                end
            end
        end
        
        Move->>Wall: 新しい位置で壁衝突チェック
        Wall->>Wall: handleCollision実行
        alt 壁に衝突
            Wall->>MyIcon: 色変更トリガー
            Wall->>Move: 跳ね返り処理 (Chase Modeでは停止)
        end
        
        Move->>MyIcon: position更新
        MyIcon->>MyIcon: CSS transform適用
    end
```

- **Follow**: マウスに向かって移動、近距離で減速停止
- **Avoid**: マウスから逃避、重複時はランダム方向
- **相互排他制御**: DVD ModeとChase Modeの自動切り替え

#### 隠しコマンド判別システム

MyIconコンポーネントの核心は、**キーバッファシステム**による巧妙なコマンド判別です。

**キーワード蓄積メカニズム**:

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant KB as キーボード
    participant MyIcon as MyIconコンポーネント
    participant Buffer as keyString Buffer
    participant Detector as コマンド判別器
    participant Mode as モード制御

    User->>KB: キー入力 (例: 'o','i','k','a','k','e')
    KB->>MyIcon: keydown イベント
    
    loop 各キー入力ごと
        MyIcon->>Buffer: 現在のバッファ長チェック
        alt バッファ長 > 9
            Buffer->>Buffer: slice(-(MAX_LENGTH-1))<br/>古い文字を削除
        end
        MyIcon->>Buffer: 新しい文字を末尾に追加
        Buffer-->>MyIcon: 更新されたkeyString
        
        MyIcon->>MyIcon: アイコン表示状態チェック<br/>(display !== 'none')
        alt アイコンが表示中
            MyIcon->>Detector: toLocaleLowerCase()で変換
            Detector->>Detector: includes()でパターンマッチング
            
            alt 'oikake' を検出
                Detector->>Mode: Chase Mode切り替え実行
                Mode->>Mode: none → follow → avoid → none
                Mode-->>MyIcon: コンソールログ出力
                MyIcon->>Buffer: keyString クリア
            else 'mugen' を検出  
                Detector->>Mode: No Limit Mode切り替え
                Mode-->>MyIcon: コンソールログ出力
                MyIcon->>Buffer: keyString クリア
            else その他のコマンド
                Note over Detector: eien, clockup, kakku等の処理
            else 該当なし
                Note over Buffer: バッファ更新のみ継続
            end
        end
    end
```

**実装の技術的特徴**:

- **循環バッファ**: 最大10文字の制限で古い入力を自動削除（[`src/components/MyIcon/index.tsx:207-211`](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/MyIcon/index.tsx#L207-L211)）
- **部分文字列マッチング**: `includes()`による柔軟なコマンド検出で、連続入力や前後の文字を無視
- **アイコン表示状態チェック**: 非表示時（`display: none`）はコマンド無効化で意図しない動作を防止
- **自然な日本語キーワード**: `oikake`（追いかけ）など、偶然の発動を防ぐ絶妙な長さと自然さ

**Chase Mode特有の3段階循環**:
```typescript
const nextMode: ChaseMode = 
  chaseMode === "none" ? "follow" : 
  chaseMode === "follow" ? "avoid" : "none";
```

この設計により、単純なキーコンビネーションではなく「隠された言葉を見つける楽しさ」を演出しています。

#### 技術的特徴

- **7種類の3D回転アニメーション**: Web Animations APIによる滑らかな回転
- **DVD Mode**: 画面端での跳ね返り動作＋13種類ビビッドカラー変更
- **60fpsアニメーション**: `requestAnimationFrame`による最適化
- **壁衝突検出**: [`handleCollision`関数](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/MyIcon/index.tsx#L93-L118)による物理演算

### 2. Algolia DocSearchによる全文検索システム

ナビゲーションバーの検索アイコンから利用できる、高速な全文検索機能です。

**ソースコード**: [`src/templates/Navbar.astro`](https://github.com/korosuke613/homepage-2nd/blob/main/src/templates/Navbar.astro#L39-L44)  
**設定ファイル**: [`algolia.json`](https://github.com/korosuke613/homepage-2nd/blob/main/algolia.json)  
**CI/CD**: [`.github/workflows/scraping.yaml`](https://github.com/korosuke613/homepage-2nd/blob/main/.github/workflows/scraping.yaml)

#### GitHub Actionsによる自動クローリングシステム

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GH as GitHub Actions
    participant Pages as GitHub Pages
    participant Docker as DocSearch Scraper
    participant Algolia as Algolia Service
    participant Site as korosuke613.dev

    Dev->>GH: git push to main
    Note over GH: pages.yml workflow
    
    GH->>GH: Build Astro site
    GH->>Pages: Deploy to GitHub Pages
    Pages-->>GH: Deployment complete
    
    Note over GH: call-scraping-workflow
    GH->>Docker: docker run algolia/docsearch-scraper
    
    Docker->>Docker: Load algolia.json config
    Note over Docker: Config: index_name, start_urls, selectors
    
    Docker->>Site: GET /posts (セレクタ: default)
    Site-->>Docker: HTML content
    Docker->>Docker: Extract: lvl1 (#contents_header)<br/>lvl2-4 (h2-h4), text (p,li,span,td)
    
    Docker->>Site: GET /blogs (セレクタ: blogs)  
    Site-->>Docker: HTML content
    Docker->>Docker: Extract: lvl1 (title)<br/>text (p.font-semibold)
    
    Docker->>Algolia: POST /indexes/draft_my_homepage
    Note over Algolia: Index update with extracted content
    Algolia-->>Docker: Update successful
    
    Docker-->>GH: Scraping complete
    GH->>GH: Workflow finished
```

#### 技術的特徴

- **Docker化されたスクレイピング**: `algolia/docsearch-scraper`による公式コンテナ実行
- **マルチページ対応**: PostsページとBlogsページで異なるセレクタ設定
- **階層構造抽出**: h1〜h4見出しを段階的に抽出してコンテンツ構造化
- **自動実行**: デプロイ完了後に必ず実行される`call-scraping-workflow`
- **停止URL指定**: タグページ・年度ページを除外する`stop_urls`設定

#### セレクタ設定の詳細

**Postsページ（default）**:
```json
{
  "lvl1": "#contents_header",      // 記事タイトル
  "lvl2": "#contents_data h2",     // 大見出し  
  "lvl3": "#contents_data h3",     // 中見出し
  "lvl4": "#contents_data h4",     // 小見出し
  "lvl5": "#contents div.contents_tag", // タグ情報
  "text": "#contents_data li, p, span, td" // 本文
}
```

**Blogsページ（blogs）**:
```json
{
  "lvl1": "title",                 // ページタイトル
  "text": "p.font-semibold"         // ブログ記事概要
}
```

#### フロントエンド統合

- **React コンポーネント**: `@docsearch/react`による検索UI
- **カスタムCSS**: [`DocSearch.css`](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/DocSearch.css)でダークテーマ対応
- **レスポンシブ対応**: 遅延ロード対策とサイズ固定レイアウト

### 3. 類似記事推薦システム

記事下部に表示される「あわせて読む」は、自然言語処理による類似度計算システムです。

**ソースコード**: [`src/utils/TextSimilarity.ts`](https://github.com/korosuke613/homepage-2nd/blob/main/src/utils/TextSimilarity.ts)  
**コンポーネント**: [`src/components/SimilarityPosts/index.tsx`](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/SimilarityPosts/index.tsx)

#### Jaro-Winkler距離アルゴリズムによる類似度計算

```mermaid
graph TD
    A[現在の記事] --> B[統合コンテンツ作成<br/>title + tags + body]
    
    C[ローカル投稿] --> D[記事リスト準備]
    E[HatenaBlog記事] --> D
    
    D --> F[各記事に対してJaro-Winkler距離計算]
    B --> F
    
    F --> G{natural.JaroWinklerDistance}
    G --> H[類似度スコア<br/>0.0 - 1.0]
    
    H --> I[スコア順ソート<br/>降順]
    I --> J[上位6件抽出]
    J --> K[表示: タイトル + 類似度]
```

#### 技術的特徴

- **マルチソース対応**: ローカルMarkdown投稿とHatenaBlog記事を統合分析
- **自然言語処理**: [`natural.js`](https://github.com/NaturalNode/natural)のJaro-Winkler距離アルゴリズムを使用
- **類似度可視化**: 計算結果のスコア（0.00-1.00）を併せて表示
- **外部リンク区別**: 内部記事と外部ブログの視覚的区別

### 4. 独自ビルドシステム「setupKorosukeインテグレーション」

Astroの`astro:config:setup`フックを活用した、カスタムビルド時処理システムです。

**ソースコード**: [`src/utils/Integration.mjs`](https://github.com/korosuke613/homepage-2nd/blob/main/src/utils/Integration.mjs)  
**設定**: [`astro.config.mjs`](https://github.com/korosuke613/homepage-2nd/blob/main/astro.config.mjs#L52)

#### 動的タグ色生成アルゴリズム

```mermaid
graph TD
    A[ビルド開始] --> B[setupKorosukeインテグレーション実行]
    
    B --> C[Markdownファイル解析<br/>src/content/posts/**/*.md]
    B --> D[外部ブログJSON読み込み<br/>public/assets/*.json]
    
    C --> E[タグ抽出]
    D --> E
    C --> F[年度抽出]
    D --> F
    
    E --> G[既存tags.json読み込み]
    G --> H{タグごとに色設定チェック}
    
    H -->|既存| I[既存色を保持]
    H -->|新規| J{特別タグ?}
    
    J -->|Pickup ⭐️| K[専用色設定<br/>bg-indigo-900]
    J -->|一般| L[22色からランダム選択]
    
    L --> M{色枯渇?}
    M -->|Yes| N[色リセット＋再選択]
    M -->|No| O[選択色を削除]
    
    I --> P[generated/tags.json生成]
    K --> P
    O --> P
    N --> P
    
    F --> Q[generated/years.json生成]
```

#### 技術的特徴

- **ビルド時実行**: Astroの`astro:config:setup`フックで自動実行
- **状態保持**: 既存のタグ色設定を保持しつつ新規タグにのみ色割り当て
- **枯渇対策**: 22色Tailwindカラー使い切った場合の再利用ロジック
- **特別扱い**: "Pickup ⭐️"タグの専用スタイル（`bg-indigo-900`）設定
- **マルチソース統合**: ローカルMarkdownと外部ブログの統合データ生成

### 5. 高度なビジュアルリグレッションテスト（VRT）

Playwrightを活用した、2段階の閾値設定による柔軟なVRTシステムです。

**ソースコード**: [`src/tests/vrt/`](https://github.com/korosuke613/homepage-2nd/tree/main/src/tests/vrt)  
**設定**: [`playwright-vrt.config.ts`](https://github.com/korosuke613/homepage-2nd/blob/main/playwright-vrt.config.ts)

#### VRTワークフロー

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CI as GitHub Actions
    participant VRT as VRTシステム
    participant Page as テスト対象ページ
    participant Images as 画像読み込み
    participant Snapshot as スナップショット
    participant Diff as 差分検出

    Dev->>CI: コード更新 (依存関係 or コンテンツ)
    CI->>VRT: VRTテスト開始
    
    alt 依存関係更新
        VRT->>VRT: 厳密テスト設定<br/>デフォルト閾値
    else コンテンツ追加
        VRT->>VRT: 緩和テスト設定<br/>maxDiffPixelRatio
    end
    
    VRT->>VRT: 対象ページ一覧取得
    
    loop 各ページに対して
        VRT->>Page: ページアクセス
        Page->>Page: domcontentloaded待機
        Page-->>VRT: 基本読み込み完了
        
        VRT->>Images: waitImagesLoaded実行
        Images->>Images: 全画像読み込み待機
        Images-->>VRT: 画像読み込み完了
        
        VRT->>Snapshot: フルページスクリーンショット取得
        Snapshot-->>VRT: スクリーンショット生成
        
        alt 初期化モード
            VRT->>Snapshot: 新しいベースライン生成<br/>updateSnapshots: all
            Snapshot-->>VRT: ベースライン保存完了
        else 比較モード
            VRT->>Diff: 既存スナップショットと比較
            Diff->>Diff: 差分計算
            
            alt 許容範囲内
                Diff-->>VRT: テスト成功
            else 閾値超過
                Diff->>Diff: 差分画像生成
                Diff-->>VRT: テスト失敗
            end
        end
    end
    
    VRT-->>CI: テスト結果報告
    CI-->>Dev: CI/CD完了 or 失敗通知
```

#### 技術的特徴

- **2段階閾値**: 依存関係更新時（厳密）とコンテンツ追加時（緩和）で異なる許容度
- **画像同期**: [`waitImagesLoaded`関数](https://github.com/korosuke613/homepage-2nd/blob/main/src/tests/vrt/utils.ts#L5-L16)による非同期画像読み込みの完全同期
- **CI/CD統合**: GitHub Actionsでの自動実行とスナップショット初期化
- **フルページ**: 縦スクロール全体のスクリーンショット比較

### 6. 自動デプロイフロー

高度な最適化を施したGitHub ActionsベースのCI/CDシステムです。

**ワークフロー**: [`.github/workflows/`](https://github.com/korosuke613/homepage-2nd/tree/main/.github/workflows)

#### デプロイフロー全体像

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub as GitHub Repository
    participant CI as GitHub Actions
    participant Builder as Astro Builder
    participant VRT as Visual Regression Test
    participant Pages as GitHub Pages
    participant Algolia as Algolia Search

    Dev->>GitHub: git push to main
    GitHub->>CI: Trigger ci.yaml workflow
    
    Note over CI: 並列実行開始
    par Tests
        CI->>CI: npm test (unit, component, e2e)
    and Build
        CI->>Builder: npm run build
        Builder->>Builder: Astroサイト生成
        Builder->>Builder: 型チェック・リント実行
        Builder-->>CI: dist/ 生成完了
    end
    
    CI->>CI: ビルド成果物ハッシュ計算
    CI->>CI: 前回デプロイとの変更検出
    
    alt 変更ありの場合
        CI->>Pages: GitHub Pagesデプロイ
        Pages-->>CI: デプロイ完了
        
        Note over CI: デプロイ後処理
        CI->>VRT: ビジュアルリグレッションテスト実行
        VRT->>VRT: 全ページスクリーンショット比較
        VRT-->>CI: テスト結果
        
        CI->>Algolia: call-scraping-workflow実行
        Algolia->>Algolia: 検索インデックス更新
        Algolia-->>CI: 更新完了
    else 変更なしの場合
        CI->>CI: デプロイスキップ（リソース節約）
    end
    
    CI-->>Dev: CI/CD完了通知
```

#### デプロイフロー最適化の特徴

**1. 並列処理による高速化**
- テスト実行とビルド処理の並列実行
- 各ステップの依存関係最適化による時間短縮

**2. 変更検出による効率化**
- ビルド成果物のSHA256ハッシュ比較
- 変更がない場合のデプロイスキップ
- GitHub Actions使用量の大幅削減

**3. 自動品質チェック**
- TypeScript型チェック（`npm run build-types`）
- Biomeリンティング（`npm run lint`）
- 全テストスイート実行（unit, component, e2e）

**4. デプロイ後自動化**
- VRTによる視覚的品質保証
- Algolia検索インデックスの自動更新
- 外部ブログコンテンツの定期同期

#### アーティファクト変更検出システム

```mermaid
sequenceDiagram
    participant CI as GitHub Actions
    participant Builder as Astro Builder
    participant Cache as GitHub Cache
    participant Deploy as GitHub Pages
    participant Hash as ハッシュ計算器

    CI->>Builder: npm run build 実行
    Builder->>Builder: Astroサイトビルド
    Builder-->>CI: dist/ 生成完了

    CI->>Hash: SHA256ハッシュ計算
    Hash->>Hash: 全ファイル対象にハッシュ生成
    Hash-->>CI: 現在のハッシュ値

    CI->>Cache: 前回デプロイ時のハッシュ取得
    Cache-->>CI: 前回ハッシュ値（または初回で空）

    CI->>CI: ハッシュ値比較
    
    alt ハッシュ値に変更あり
        CI->>Deploy: デプロイ実行
        Deploy->>Deploy: GitHub Pages更新
        Deploy-->>CI: デプロイ完了
        
        CI->>Cache: 新しいハッシュを保存
        Cache-->>CI: 保存完了
    else ハッシュ値に変更なし
        CI->>CI: デプロイスキップ
        Note over CI: リソース節約のため処理終了
    end
    
    CI->>CI: CI/CD完了
```

#### 技術的特徴

- **デプロイ最適化**: [`ci.yaml`](https://github.com/korosuke613/homepage-2nd/blob/main/.github/workflows/ci.yaml#L89-L95)でビルド成果物の変更検出
- **VRT自動初期化**: mainブランチ更新時のスナップショット自動更新
- **リソース節約**: 変更がない場合のデプロイスキップによるGitHub Actions使用量削減
- **ゼロダウンタイム**: GitHub Pagesによる瞬時切り替えデプロイ
- **自動ロールバック**: デプロイ失敗時の前バージョン自動復帰

### 7. 包括的テスト戦略システム

品質保証の要として、4層のテスト戦略を構築し、企業レベルの信頼性を実現しています。

**テスト構成**: [`package.json`](https://github.com/korosuke613/homepage-2nd/blob/main/package.json#L18-L27)、[`vite.config.mts`](https://github.com/korosuke613/homepage-2nd/blob/main/vite.config.mts)  
**設定ファイル**: [`playwright-*.config.ts`](https://github.com/korosuke613/homepage-2nd/tree/main)

#### 4層テスト戦略アーキテクチャ

```mermaid
graph TD
    A[コード変更] --> B{テスト戦略選択}
    
    B --> C[Unit Tests<br/>ユニットテスト]
    B --> D[Component Tests<br/>コンポーネントテスト] 
    B --> E[E2E Tests<br/>エンドツーエンドテスト]
    B --> F[Storybook Tests<br/>ストーリーテスト]
    B --> G[VRT<br/>ビジュアルリグレッション]
    
    C --> H[Vitest実行<br/>Node.js環境]
    D --> I[Playwright CT実行<br/>ブラウザ環境]
    E --> J[Playwright E2E実行<br/>開発サーバー統合]
    F --> K[Storybook Vitest実行<br/>ブラウザ環境]
    G --> L[Playwright VRT実行<br/>視覚比較]
    
    H --> M[カバレッジ生成<br/>cobertura形式]
    I --> N[コンポーネント動作確認]
    J --> O[ユーザーフロー検証]
    K --> P[ストーリー自動テスト]
    L --> Q[スクリーンショット比較]
    
    M --> R[CI/CD統合]
    N --> R
    O --> R
    P --> R
    Q --> R
```

#### テスト層別詳細

**1. ユニットテスト（Vitest）**
- **対象**: ユーティリティ関数、データ処理ロジック、GA4データフェッチャー
- **実行環境**: Node.js（`vite.config.mts`のunitプロジェクト）
- **カバレッジ**: `src/utils/`、`src/components/`、`db/utils/`を包括
- **テストファイル例**: [`src/tests/unit/TextSimilarity.spec.ts`](https://github.com/korosuke613/homepage-2nd/blob/main/src/tests/unit/TextSimilarity.spec.ts)

**2. コンポーネントテスト（Playwright CT）**
- **対象**: Reactコンポーネントの単体動作
- **実行環境**: Chromiumブラウザ（`playwright-ct.config.ts`）
- **独立性**: 外部依存なしのコンポーネント検証
- **テストファイル例**: [`src/tests/component/TweetButton.spec.tsx`](https://github.com/korosuke613/homepage-2nd/blob/main/src/tests/component/TweetButton.spec.tsx)

**3. E2Eテスト（Playwright）**
- **対象**: 完全なユーザーフロー検証
- **実行環境**: 開発サーバー（port 4321）統合（`playwright-e2e.config.ts`）
- **範囲**: ナビゲーション、ページ遷移、インタラクション
- **テストファイル例**: [`src/tests/e2e/navigation.spec.ts`](https://github.com/korosuke613/homepage-2nd/blob/main/src/tests/e2e/navigation.spec.ts)

**4. Storybookテスト（Vitest + Storybook）**
- **対象**: 全ストーリーの自動実行テスト
- **実行環境**: ブラウザ環境（`@storybook/addon-vitest`）
- **統合性**: Storybookの設定と完全連携
- **自動化**: 全`.stories.tsx`ファイルを自動検出・実行

#### テスト実行戦略

**並列実行による高速化**:
```json
{
  "test": "concurrently -P npm:test:*",
  "test:unit": "vitest run --project=unit --coverage",
  "test:playwright-ct": "playwright test -c playwright-ct.config.ts",
  "test:playwright-e2e": "playwright test -c playwright-e2e.config.ts", 
  "test:storybook": "vitest run --project=storybook --coverage"
}
```

**CI/CD統合フロー**:
```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CI as GitHub Actions
    participant Unit as Unit Tests
    participant CT as Component Tests
    participant E2E as E2E Tests
    participant SB as Storybook Tests
    participant VRT as Visual Tests
    
    Dev->>CI: git push
    CI->>CI: 並列テスト開始
    
    par ユニットテスト
        CI->>Unit: vitest run --project=unit
        Unit->>Unit: カバレッジ生成
        Unit-->>CI: 結果 + coverage/unit/
    and コンポーネントテスト
        CI->>CT: playwright test -c playwright-ct.config.ts
        CT->>CT: ブラウザでコンポーネント実行
        CT-->>CI: 結果 + test-results/ct.xml
    and E2Eテスト
        CI->>E2E: 開発サーバー起動
        E2E->>E2E: フルブラウザテスト
        E2E-->>CI: 結果 + test-results/e2e.xml
    and Storybookテスト
        CI->>SB: vitest run --project=storybook
        SB->>SB: 全ストーリー実行
        SB-->>CI: 結果 + coverage/storybook/
    end
    
    alt 全テスト成功
        CI->>VRT: デプロイ後ビジュアルテスト
        VRT->>VRT: スクリーンショット比較
        VRT-->>CI: 視覚回帰結果
    end
    
    CI-->>Dev: 統合テスト結果
```

#### テスト戦略の技術的特徴

**1. カバレッジ統合管理**
- **単体**: `coverage/unit/` - ユーティリティ関数とコンポーネントロジック
- **統合**: `coverage/storybook/` - Storybookストーリーによるコンポーネントカバレッジ
- **フォーマット**: Cobertura形式でCI/CD統合

**2. ブラウザ環境最適化**
- **Headless実行**: `--headless=new`フラグによる高速化
- **並列実行制限**: CI環境で`workers: 1`によるリソース最適化
- **リトライ戦略**: CI環境で`retries: 2`による安定性確保

**3. レポート統合**
- **JUnit XML**: 各テスト層でJUnit形式レポート生成
- **統一出力**: `test-results/`ディレクトリに集約
- **CI/CD連携**: GitHub Actionsでテスト結果可視化

**4. 設定分離と再利用性**
- **設定ファイル分離**: 各テスト種別で独立した設定ファイル
- **共通設定**: Vitestエイリアス設定の統一（`@/`パス）
- **環境固有最適化**: 開発・CI環境での動作差分対応

### 8. Claude Code統合開発環境

このプロジェクトの開発において、AI支援ツール「Claude Code」の本格的な活用環境を構築しています。

**ソースコード**: [`.claude/`](https://github.com/korosuke613/homepage-2nd/tree/main/.claude)、[`.devcontainer/`](https://github.com/korosuke613/homepage-2nd/tree/main/.devcontainer)  
**Claude Code**: [https://claude.ai/code](https://claude.ai/code)

#### 専用開発環境の構築

**DevContainer統合**:
```json
{
  "name": "Claude Code Sandbox",
  "customizations": {
    "vscode": {
      "extensions": [
        "Anthropic.claude-code",
        "biomejs.biome"
      ]
    }
  },
  "remoteEnv": {
    "CLAUDE_CONFIG_DIR": "/home/node/.claude"
  }
}
```

- **コンテナ化**: Docker環境でのClaude Code実行環境を構築
- **VS Code統合**: Claude Code拡張とBiome（リンター）の同時利用
- **セキュリティ**: NET_ADMIN/NET_RAW権限による制限付きネットワークアクセス

#### 専門エージェントシステム

`.claude/agents/`ディレクトリに6つの専門エージェントを定義：

**1. blog-content-reviewer**: ブログコンテンツレビュー専門家
```markdown
- 技術的正確性レビュー（コード例、API情報の検証）
- リンクと参照の検証（404エラー、古い情報の検出）
- コンテンツの新規性と価値評価
- 日本語技術文書の品質チェック
```

**2. repository-architect**: プロジェクト構造の理解専門家
```markdown
- Astroベースの個人ホームページプロジェクトの設計思想理解
- コンポーネント構造、データフロー分析
- 技術スタック間の整合性確認
```

**3. その他専門エージェント**:
- **tdd-refactoring-coach**: TDD・リファクタリング指導
- **decision-recorder**: 技術決定の文書化
- **code-reviewer**: コード品質レビュー
- **debugger**: エラー・テスト失敗の調査

#### カスタムコマンドシステム

`.claude/commands/`でプロジェクト固有のコマンドを定義：

```bash
/create-branch    # Git ブランチ作成の自動化
/create-commit    # コミットメッセージ生成とコミット実行
/update-readme    # README.md の構造化更新
```

#### セキュリティ・権限制御

`.claude/hooks/`による高度な制御システム：

**block-file-edits.sh**: ファイル編集制限
```bash
# GitHub Actions ワークフローファイルの編集をブロック
if [[ "$file_path" == *".github/workflows"* ]]; then
    echo "❌ エラー: workflow:write 権限が必要です"
    exit 2
fi

# Claude設定ファイルの編集をブロック  
if [[ "$file_path" == *".claude/hooks"* ]]; then
    echo "❌ エラー: Claude設定は編集できません"
    exit 2
fi
```

**権限設定**:
```json
{
  "permissions": {
    "allow": [
      "Bash(gh pr list:*)",
      "Bash(gh pr view:*)", 
      "Bash(gh pr diff:*)"
    ]
  },
  "hooks": {
    "PreToolUse": ["block-file-edits.sh"],
    "Notification": ["notify-require.sh"],
    "Stop": ["notify-finish.sh"]
  }
}
```

#### 開発フローでの実活用

**1. 機能開発時**:
- `repository-architect`エージェント: 既存アーキテクチャとの整合性確認
- カスタムコマンド: `/create-branch feature/new-component`
- 自動リンティング: Biome連携による品質保証

**2. コンテンツ作成時**:
- `blog-content-reviewer`エージェント: 技術記事の網羅的品質チェック
- リンク検証: 外部リンクの生存確認と関連性評価
- メタデータ検証: フロントマターとタグ付け規約の確認

**3. コードレビュー時**:
- `code-reviewer`エージェント: セキュリティ・保守性・品質の3観点評価
- `tdd-refactoring-coach`エージェント: テスト設計とリファクタリング提案

#### Claude Code統合の技術的メリット

**コンテキスト保持**:
- プロジェクト全体の構造と設計思想を理解したAI支援
- 既存コードベースの規約に従った実装提案

**品質保証の自動化**:
- 専門エージェントによる多角的レビュー
- セキュリティ制約下での安全な開発環境

**開発効率の向上**:
- 自然言語による要件記述から実装コード生成
- 複雑なアルゴリズム（MyIconのChase Mode等）の段階的実装支援

## まとめ

これらの特筆すべき技術実装により、単なる静的サイトを超えたインタラクティブで高品質な個人ホームページを実現しています：

### 技術的独自性
- **MyIcon**: キーバッファシステムによる隠しコマンド判別と多彩なインタラクション
- **全文検索**: Algolia DocSearchとGitHub Actions自動クローリングによる高速検索
- **類似記事推薦**: 自然言語処理による高精度なコンテンツマッチング
- **ビルドシステム**: 複数ソース統合とタグ色自動管理
- **VRT**: 用途別閾値設定による実用的な視覚回帰テスト
- **自動デプロイ**: 変更検出最適化と品質保証の完全自動化
- **テスト戦略**: 4層の包括的テスト環境による企業レベルの品質保証
- **AI統合開発**: Claude Code専門エージェントとセキュリティ制御による次世代開発環境

これらの実装は、個人サイトでありながら企業レベルの技術的複雑さと品質保証を実現し、AI支援ツールとの深い統合により、現代的な開発手法で訪問者に独特なユーザーエクスペリエンスを提供しています。