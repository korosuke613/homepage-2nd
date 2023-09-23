module.exports = {
  plugins: {
    "@textlint/markdown": {
      extensions: [".md"],
    },
  },
  filters: {
    comments: true,
  },
  rules: {
    "preset-ja-technical-writing": true, // 日本語技術書向けプリセット
    "preset-ja-spacing": {
      "ja-space-between-half-and-full-width": {
        // 半角文字と全角文字の間に半角スペースを挿入する
        space: "always",
        exceptPunctuation: true,
      },
      "ja-space-around-code": {
        // インラインコードの前後に半角スペースを入れる
        before: true,
        after: true,
      },
    },
    "ja-technical-writing/no-exclamation-question-mark": false, // !?文字制限を無効化
    "ja-technical-writing/ja-no-mixed-period": {
      // 読点（。）で文が終わるようにする
      allowPeriodMarks: [":", "."],
      allowEmojiAtEnd: true, // 末尾の絵文字を許可
    },
    "ja-technical-writing/sentence-length": false, //100文字数制限の無効化
    "ja-technical-writing/max-kanji-continuous-len": false, // 漢字6文字制限の無効化
    "@proofdict/proofdict": {
      // 表記揺れを検知する
      dictURL: "https://azu.github.io/proof-dictionary/",
    },
  },
};
