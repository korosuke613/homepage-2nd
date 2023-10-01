---
title: Tweet ボタンを設置
description: ホムペに Tweet ボタンを設置しました。みんなツイートしよう
pubDate: 2023-10-01T09:00:00Z
imgSrc: '/assets/images/cover/tweet_button.png'
tags: 
  - React
  - ホムペ
  - HTML
---

## 概要

各記事ページに Tweet ボタンを設置しました。記事下部にあります。
ついでに OGP 対応しました。

<iframe width="720" height="480" src="https://www.youtube.com/embed/dxmM2yeAiLw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## プルリクエストと解説
- [feat: improve twitter by korosuke613 · Pull Request #337 · korosuke613/homepage-2nd](https://github.com/korosuke613/homepage-2nd/pull/337)
  - `twitter:card` などの Twitter OGP 関連のメタタグを設置
  - ついでにツイートボタンを設置
- [fix: twitter ogp by korosuke613 · Pull Request #338 · korosuke613/homepage-2nd](https://github.com/korosuke613/homepage-2nd/pull/338)
  - ogp の画像がうまく表示されないので `korosuke613.dev` から画像を読むように修正
  - `twitter:image` などを `og:image` といった汎用的なものに変更
- [fix: ogp path by korosuke613 · Pull Request #339 · korosuke613/homepage-2nd](https://github.com/korosuke613/homepage-2nd/pull/339)
  - やっぱり ogp の画像が表示されない
  - `path.join()` してたせいで `https://korosuke613.dev/assets/...` が `https:/korosuke613.dev/assets/...` になってた
    - スラッシュが足りねぇ
    - マヌケだった
  - `URL()` を使うように修正
- [fix: not use twitter script by korosuke613 · Pull Request #340 · korosuke613/homepage-2nd](https://github.com/korosuke613/homepage-2nd/pull/340)
  - 画面遷移した際に Tweet ボタンが表示されないことに気づく。多分 Astro が JS 埋め込んでない
    - リロードしたら直る
  - そもそも Twitter の謎スクリプトを埋め込んでるのが気持ち悪いので、自前でボタンを作った
  - こんな感じで URL 組み立てるだけでいいよ
    ```typescript
    const url = new URL("https://twitter.com/intent/tweet");
    const params = new URLSearchParams({
      hashtags: "korosuke613dev",
      text: props.text,
      url: props.url,
      related: "shitimi_613",
    });
    const href = `${url.href}?${params.toString()}`;
    ```
  - 心スッキリだ


[^tweet]: 俺は 𝕏 を認めない
