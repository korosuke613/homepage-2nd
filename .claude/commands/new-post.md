---
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(ls:*), Bash(git status:*), Bash(git branch), Bash(git log:*)
description: 新しいブログ記事のMarkdownファイルを作成
---

# やること
新しいブログ記事のMarkdownファイルを `src/content/posts/` ディレクトリに作成してください。

# 記事作成の手順
1. **インタビュー**: @.claude/agents/blog-interviewer.md を用いてユーザーにインタビューを実施。blog-interviewer エージェントは質問をしてくるので、それをユーザーに問いかけてください
1. **ファイル名の決定**: 現在の日付を基に `YYYYMMDD_記事タイトル.md` の形式でファイル名を生成
2. **frontmatter の作成**: 以下のフィールドを含める（ @.claude/agents/blog-writer.md を利用 ）
   - title: 記事タイトル
   - pubDate: 公開日時（ISO 8601形式）
   - imgSrc: カバー画像パス（`/assets/images/cover/` 内）
   - imgAlt: カバー画像の alt テキスト
   - tags: タグリスト（既存のタグを参考に）
3. **記事テンプレートの提供**: 基本的な記事構成を含む（ @.claude/agents/blog-writer.md を利用 ）

# frontmatter の参考
既存記事を参考に、適切なfrontmatterを生成してください：
- `src/content/posts/` 内の既存記事
- `src/content/config.ts` のスキーマ定義

# 記事構成のテンプレート
```markdown
## はじめに

## 詳細

## まとめ
```

# タグの候補
既存記事から使用されているタグを確認し、適切なタグを提案してください。本ホームページ（korosuke613.dev）に関するの記事には「ホムペ」、特に注目すべき記事には「Pickup ⭐️」を追加。
