---
allowed-tools: Read, Glob, Grep, Bash(npm run lint:*), Bash(npm run build-types:*)
description: ブログ記事の内容をレビューし品質をチェック
---

# やること
指定されたブログ記事またはdraftの記事をレビューし、以下の点をチェックしてください。
@.claude/agents/blog-reviewer.md を利用

# レビュー項目

## 1. frontmatterの検証
- title: わかりやすく魅力的なタイトルか
- pubDate: 適切な日付形式（ISO 8601）か
- imgSrc: カバー画像パスが正しいか
- imgAlt: アクセシビリティを考慮したalt textか
- tags: 適切で一貫性のあるタグか

## 2. コンテンツの品質チェック
- 文章の読みやすさと一貫性
- 技術的な内容の正確性
- リンクの有効性
- 画像パスの正確性
- コードブロックの適切な言語指定

## 3. 既存記事との一貫性
- `src/content/posts/` 内の他の記事と比較
- 文体やトーンの統一性
- タグの使用方法の一貫性

## 4. SEOとアクセシビリティ
- メタデータの最適化
- 見出し構造の適切性（H2, H3の階層）
- alt textの品質

## 5. 技術的チェック
- Markdownの構文エラー
- frontmatterのスキーマ準拠性（`src/content/config.ts` 参考）
- lint エラーの確認

# レビュー結果の提示
各項目について以下の形式で結果を報告：
- ✅ 良好
- ⚠️ 改善提案あり
- ❌ 修正が必要

改善点がある場合は、具体的な修正案を提示してください。
