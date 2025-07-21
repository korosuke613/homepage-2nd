---

title: 'Git/GitHub 研修を行いました'
pubDate: 2025-07-08T12:00:00Z
imgSrc: '/assets/images/cover/git-github-top.webp'
imgAlt: 'Git/GitHub研修のスライドトップページ'
tags: 
  - サイボウズ
  - GitHub
  - Pickup ⭐️
---

## はじめに

- 今年もサイボウズのエンジニア研修があり、講義資料が公開されました
  - [2025年のエンジニア新人研修の講義資料を公開しました - Cybozu Inside Out | サイボウズエンジニアのブログ](https://blog.cybozu.io/entry/2025/07/08/171543)
- 今年もサイボウズでは開運研修[^kaiun]がありましたが、Git に関する研修をやってほしいと頼まれたので、今年は Git、および、GitHub に関する研修を行いました[^internal-system]
- その名も「Git/GitHub 知っておくと便利かも Tips」です
- 本ページの最後にスライド資料と動画を載せているので、気になる人は見てください

## いろいろ
- ターゲット
  - すでに Git/GitHub を使っている方をターゲットに、もう少し＋α知っておくと今後嬉しいかもしれない tips を紹介する内容としました
  - Git の基礎を知るための資料はそこらじゅうに転がっているからです
  - チーム開発や大規模リポジトリにおける便利テクニックやパフォーマンス向上、セキュリティ向上に関するノウハウを盛り込んだつもりです
- GitHub の章
  - 今回 GitHub の話も入れました。GitHub を使ったことがある人でも、可視性（特に internal）や Organization, Enterprise といった概念、大規模開発・チーム開発に必要なガバナンス・セキュリティ強化機能まで知っている人はなかなかいないと感じているためです
  - とはいえ、正直 Git の研修に加えたのは量が多くなりすぎてミスったなって思っています。講義時間も 1.5 時間となったため、これ分けた方が良かったなと思いました
    - 来年もやることになったら Git と GitHub は分けて、GitHub の内容はもっとモリモリにしたいお気持ちです
- スライド作成
  - スライドは [Slidev](https://sli.dev/) で作りました。便利ですねぇ
  - GitHub Copilot や GitHub Actions の話もしたかったのですが、これは別の方が研修を行なった関係で省きました。でもやっぱ話したいから来年は入れるかもね
- YouTube 動画
  - 今回スライドだけでなく、YouTube に動画も出しています
  - 動画は Slidev をスライドショーしたものを Mac の画面録画機能で録画しました。ちゃんと音声を入れる設定にしないと動画しか撮れなくて後でミスったことに気づいて悲しくなるので注意です
  - 動画を撮った後、動画編集ソフトで BGM をつけたりカットしたりノイズを取ったりしました
  - なお、字幕は自動で生成された字幕テキストを生成 AI に食わしていい感じに校正しました。AI 便利すぎる

## おわりに
- 元々学生時代バージョン管理の研究したいなって思ってたくらい Git は好きでしたし、GitHub も追っかけもしてるくらい[^changelog]には好きなので、今回 Git/GitHub 研修の話が舞い込んできたのはとても良かったです
- 次回やるなら Git と GitHub は分けた上で GitHub の話はもっとモリモリしたいですね（GitHub Copilot や GitHub Actions など）
- 読んでくれた人いたらコメントください

[^changelog]: GitHub Changelog の更新を見るのが日課という程度。

## 資料

### スライド
<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/dd3ecf4be4604ccfb0997af775118ee4" title="Git/GitHub を使う上で知っておくと嬉しいかも Tips【サイボウズ新人研修2025】" allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

### 動画

<iframe width="100%" style="aspect-ratio: 720 / 405;" data-ratio="1.7777777777777777" src="https://www.youtube.com/embed/S12kVTAvG1U?si=HmSc6c8UflVomf2o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


[^kaiun]: 開発と運用を合わせて開運と呼んでいる。
[^internal-system]: 実はここ数年「社内システム入門」という研修もやっています（が、こちらは社外公開していません）。
