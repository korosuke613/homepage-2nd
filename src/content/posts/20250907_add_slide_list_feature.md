---
title: 'スライド一覧を見られるようにしました'
description: 'ホームページにスライド一覧機能を追加し、Docswellのスライドを表示できるようになりました'
pubDate: 2025-09-07T00:00:00Z
imgSrc: '/assets/images/cover/slides.webp'
imgAlt: 'ホームページのスライド一覧機能画面'
tags: 
  - ホムペ
  - Astro
  - AI
  - Docswell
---

## はじめに

本ホームページにスライド一覧機能を追加しました。これまでブログ記事の情報は表示していましたが、勉強会やカンファレンスで発表したスライドの情報も同じようにサイト内で確認できるようになりました。

## 変更箇所
- [トップページ](/)の「Recent Slides」セクション（最新3件表示）
- [専用の slides ページ](/slides)（全てのスライド一覧）
- [random ページ](/random)でランダムにスライドも表示されるようになりました

今回の実装は、既存の blogs ページの仕組みをそのまま流用する形で進めました。GitHub Copilot Coding Agent[^cca]に任せたところ、非常に良い感じに作ってくれました。楽〜

[^cca]: [GitHub Copilot Coding Agent 探求](https://zenn.dev/link/comments/98276e3c2285c5)の一環でした

具体的には以下のような流れでした：

1. [次の要望を Copilot に伝える](https://github.com/korosuke613/homepage-2nd/issues/1145)
    ```
    Recent Slides ページを作る。SlideShare、SpeakerDeck、Docswell のスライドを対象とする。
    Recent Blogs と似たような仕組みで実装する。
    自動更新もするようにする。ただし、Docswell の RSS のみを対象とする（SlideShare、SpeakerDeck はもはやスライドをあげる予定がないからだ）
    ```
2. できたプルリクエストを手直しする
   - SlideShare、SpeakerDeck の JSON を手動で作る
   - Docswell の JSON を自動生成する
   - その他いらん変更を直す
   - Algolia の全文検索に載るようにする
3. ランダム記事機能でもスライドを表示できるようにするのを手元でやる

実装で特に苦労した点は...正直ありませんでした。Copilot が良い感じにやってくれました。

## プルリクエスト

- **[PR #1146](https://github.com/korosuke613/homepage-2nd/pull/1146)**: Recent Slides機能の追加（1668行追加、4行削除）
  - SlideShare、SpeakerDeck、Docswellの3プラットフォーム対応
  - ホームページの「Recent Slides」セクション実装
  - 専用の `/slides` ページ作成（ページネーション、フィルタリング機能付き）
  - 自動コンテンツ更新機能の実装
- **[PR #1148](https://github.com/korosuke613/homepage-2nd/pull/1148)**: RandomArticle機能への統合（160行追加、35行削除）  
  - ランダムコンテンツにスライド追加
  - スライドのみ表示モード対応
  - タイプバッジとボタンテキストの適応的変更

## おわりに
いやー、スライド一覧を出してみましたが、古いスライドは結構内容が恥ずかしいですね。まあ全文検索できるようになったので過去のスライドを探しやすくなって良いですね。
