---

title: 'ランダムページを追加しました'
pubDate: 2025-05-06T23:40:00Z
imgSrc: '/assets/images/cover/random_page.webp'
imgAlt: 'ランダムページ'
tags: 
  - ホムペ
---

## はじめに

このたび、ホームページにランダムページを追加しました。このページは、サイト内のすべての記事（ブログとポスト）からランダムに1つの記事を表示する機能を提供します。新しいコンテンツとの偶然の出会いを促進するための仕組みです。

実際のページは https://korosuke613.dev/random です。

## 特徴

ランダムページの主な特徴は以下の通りです：

- サイト内のすべての記事（ポストとブログ）から無作為に記事を1つ表示
- 「別の記事を表示」ボタンで、クリックごとに新しいランダム記事を表示
- 記事のタイトル、投稿日、説明、タイプ（ポストかブログか）を表示
- 記事の画像がある場合はそれも表示
- 記事へのリンクを提供
- ナビゲーションバーからサイコロアイコンでアクセス可能

## 実装の詳細

ランダムページの実装には、以下のような実装技術を使用しています：

### ランダム記事の選択ロジック

`getRandomArticle`関数を作成し、すべての記事（ポストとブログ）を一つの配列に統合した後、ランダムなインデックスを選択して記事を表示します。これにより、ポストとブログのどちらからも公平に記事が選ばれます。

### コンポーネント化

`RandomArticleCard`コンポーネントを作成し、ランダム記事の表示ロジックをカプセル化しました。これにより、UI の一貫性が保たれ、今後の機能追加や修正も容易になります。

### UI/UX の改善

- レスポンシブデザインを採用し、様々なデバイスサイズに対応
- 記事がない場合のフォールバック表示を実装
- 「別の記事を表示」ボタンで新しい記事をリロード

### SEOへの配慮

ランダムページは検索エンジンにインデックスされないよう、`noindex`メタタグを設定しました。これは、動的に変わるコンテンツであるためSEO的に価値が低いと判断したためです。

## PR での変更点

この機能は複数のPRを通じて実装されました：

### [PR #1049](https://github.com/korosuke613/homepage-2nd/pull/1049): 基本的な機能の追加

- ランダム記事機能のコア機能を実装
- ExternalLinkコンポーネントを改良（`title`プロパティから`children`プロパティへの変更）
- ナビゲーションバーにランダムページへのリンクを追加

### [PR #1050](https://github.com/korosuke613/homepage-2nd/pull/1050): RandomArticleCardコンポーネントの実装

- ランダム記事表示をコンポーネント化
- Storybook対応の追加
- SEO配慮のためのnoindexメタタグ追加

### [PR #1051](https://github.com/korosuke613/homepage-2nd/pull/1051): 修正とパフォーマンス改善

- パフォーマンス向上のためにランダム記事選択ロジックを同期処理に変更
- URL構築のための`joinPaths`関数追加
- UI/UXの細かい改善（レスポンシブ対応など）

## まとめ

ランダムページの追加により、ユーザーは予期せぬ記事と出会うことができるようになりました。特に過去の記事など、通常のナビゲーションでは見つけにくいコンテンツへのアクセスが容易になり、サイト全体のコンテンツ発見性が向上したと考えています。

また、これを機に`ExternalLink`コンポーネントのAPIも改善され、より柔軟なリンク表示が可能になりました。

今後も、ユーザー体験を向上させるような機能を随時追加していきたいと思います。


---

実はこの記事は GitHub Copilot Agent に書かせました。先に関連する PR を渡して、「「ランダムページを追加しました」という記事を追加します。プルリクエストを参考に記事を書いて」とお願いした感じっすね。

返答は以下でした。

```markdown
ランダムページを追加した記事を書くために、まずプルリクエストの内容を調べて、詳細を把握しましょう。プルリクエストの内容を確認しました。3つのPRを元に記事を書きます。ランダムページの追加について、詳しく解説する記事を作成しましょう。

変更を行いました。

記事を作成しました。プルリクエスト（#1049、#1050、#1051）の内容を参考に、ランダムページの追加について以下の点を詳しく解説しています：

1. ランダムページの機能と特徴
   - サイト内のすべての記事からランダムで1つ表示
   - 「別の記事を表示」ボタンでの更新機能
   - ナビゲーションバーのサイコロアイコン

2. 技術的な実装の詳細
   - ランダム記事選択ロジックの実装方法
   - コンポーネント化によるメンテナンス性の向上
   - レスポンシブデザインやSEO対策などのUX改善点

3. 3つのPRにわたる段階的な実装と改良プロセス
   - 基本機能の実装（PR #1049）
   - コンポーネント化と改良（PR #1050）
   - パフォーマンス向上と修正（PR #1051）

この記事によって、単にランダムページを追加したという事実だけでなく、その背景や技術的な工夫、段階的な改良プロセスも読者に伝わるようになっています。

何か追加や修正が必要でしたら、お知らせください。
```

便利っすね。
