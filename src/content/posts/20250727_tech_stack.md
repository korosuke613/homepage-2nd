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
graph TD
    A[キーボード入力 'oikake'] --> B{現在のモード}
    B -->|none| C[Follow Mode]
    B -->|follow| D[Avoid Mode]  
    B -->|avoid| E[Chase Mode OFF]
    
    C --> F[マウス位置取得]
    D --> F
    F --> G[距離計算: √((mx-ix)² + (my-iy)²)]
    G --> H{距離 > 50px?}
    
    H -->|Yes| I{Follow Mode?}
    H -->|No| J{Follow Mode?}
    
    I -->|Yes| K[正規化ベクトル * 速度<br/>→ マウスに向かって移動]
    I -->|No| L[正規化ベクトル * -速度<br/>→ マウスから逃避]
    
    J -->|Yes| M[減速して停止]
    J -->|No| N[ランダム方向に逃避]
    
    K --> O[壁衝突判定]
    L --> O
    M --> O
    N --> O
    O --> P[次フレーム]
    P --> F
```

- **Follow**: マウスに向かって移動、近距離で減速停止
- **Avoid**: マウスから逃避、重複時はランダム方向
- **相互排他制御**: DVD ModeとChase Modeの自動切り替え

#### 技術的特徴

- **7種類の3D回転アニメーション**: Web Animations APIによる滑らかな回転
- **DVD Mode**: 画面端での跳ね返り動作＋13種類ビビッドカラー変更
- **60fpsアニメーション**: `requestAnimationFrame`による最適化
- **壁衝突検出**: [`handleCollision`関数](https://github.com/korosuke613/homepage-2nd/blob/main/src/components/MyIcon/index.tsx#L93-L118)による物理演算

### 2. 類似記事推薦システム

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
    
    style G fill:#e1f5fe
    style H fill:#f3e5f5
```

#### 技術的特徴

- **マルチソース対応**: ローカルMarkdown投稿とHatenaBlog記事を統合分析
- **自然言語処理**: [`natural.js`](https://github.com/NaturalNode/natural)のJaro-Winkler距離アルゴリズムを使用
- **類似度可視化**: 計算結果のスコア（0.00-1.00）を併せて表示
- **外部リンク区別**: 内部記事と外部ブログの視覚的区別

### 3. 独自ビルドシステム「setupKorosukeインテグレーション」

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
    
    style K fill:#3f51b5
    style L fill:#ff9800
```

#### 技術的特徴

- **ビルド時実行**: Astroの`astro:config:setup`フックで自動実行
- **状態保持**: 既存のタグ色設定を保持しつつ新規タグにのみ色割り当て
- **枯渇対策**: 22色Tailwindカラー使い切った場合の再利用ロジック
- **特別扱い**: "Pickup ⭐️"タグの専用スタイル（`bg-indigo-900`）設定
- **マルチソース統合**: ローカルMarkdownと外部ブログの統合データ生成

### 4. 高度なビジュアルリグレッションテスト（VRT）

Playwrightを活用した、2段階の閾値設定による柔軟なVRTシステムです。

**ソースコード**: [`src/tests/vrt/`](https://github.com/korosuke613/homepage-2nd/tree/main/src/tests/vrt)  
**設定**: [`playwright-vrt.config.ts`](https://github.com/korosuke613/homepage-2nd/blob/main/playwright-vrt.config.ts)

#### VRTワークフロー

```mermaid
graph TD
    A[VRTトリガー] --> B{テスト種別}
    
    B -->|依存関係更新| C[厳密テスト<br/>デフォルト閾値]
    B -->|コンテンツ追加| D[緩和テスト<br/>maxDiffPixelRatio設定]
    
    C --> E[対象ページ一覧取得]
    D --> E
    
    E --> F[各ページに対してテスト実行]
    F --> G[ページ読み込み<br/>waitUntil: domcontentloaded]
    
    G --> H[全画像読み込み完了待機<br/>waitImagesLoaded]
    H --> I[フルページスクリーンショット]
    
    I --> J{初期化モード?}
    J -->|Yes| K[新しいベースライン生成<br/>updateSnapshots: all]
    J -->|No| L[既存スナップショットと比較]
    
    L --> M{差分チェック}
    M -->|許容範囲内| N[テスト成功]
    M -->|閾値超過| O[テスト失敗<br/>差分画像生成]
    
    K --> P[CI/CD完了]
    N --> P
    O --> Q[失敗通知]
    
    style C fill:#ffcdd2
    style D fill:#c8e6c9
    style H fill:#e1f5fe
```

#### 技術的特徴

- **2段階閾値**: 依存関係更新時（厳密）とコンテンツ追加時（緩和）で異なる許容度
- **画像同期**: [`waitImagesLoaded`関数](https://github.com/korosuke613/homepage-2nd/blob/main/src/tests/vrt/utils.ts#L5-L16)による非同期画像読み込みの完全同期
- **CI/CD統合**: GitHub Actionsでの自動実行とスナップショット初期化
- **フルページ**: 縦スクロール全体のスクリーンショット比較

### 5. CI/CDでの特殊な最適化

**ワークフロー**: [`.github/workflows/`](https://github.com/korosuke613/homepage-2nd/tree/main/.github/workflows)

#### アーティファクト変更検出システム

```mermaid
graph LR
    A[ビルド成果物<br/>dist/] --> B[SHA256ハッシュ計算<br/>全ファイル対象]
    B --> C[前回デプロイ時のハッシュと比較]
    C --> D{変更あり?}
    
    D -->|Yes| E[デプロイ実行]
    D -->|No| F[デプロイスキップ<br/>リソース節約]
    
    E --> G[新しいハッシュを保存]
    F --> H[CI/CD完了]
    G --> H
    
    style F fill:#c8e6c9
    style E fill:#ffcdd2
```

#### 技術的特徴

- **デプロイ最適化**: [`ci.yaml`](https://github.com/korosuke613/homepage-2nd/blob/main/.github/workflows/ci.yaml#L89-L95)でビルド成果物の変更検出
- **VRT自動初期化**: mainブランチ更新時のスナップショット自動更新
- **リソース節約**: 変更がない場合のデプロイスキップによるGitHub Actions使用量削減

## まとめ

これらの特筆すべき技術実装により、単なる静的サイトを超えたインタラクティブで高品質な個人ホームページを実現しています：

### 技術的独自性
- **MyIcon**: 隠しコマンドによる多彩なインタラクション
- **類似記事推薦**: 自然言語処理による高精度なコンテンツマッチング
- **ビルドシステム**: 複数ソース統合とタグ色自動管理
- **VRT**: 用途別閾値設定による実用的な視覚回帰テスト

これらの実装は、個人サイトでありながら企業レベルの技術的複雑さと品質保証を実現し、訪問者に独特なユーザーエクスペリエンスを提供しています。