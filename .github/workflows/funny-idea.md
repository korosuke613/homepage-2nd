---
# Trigger - when should this workflow run?
on:
  workflow_dispatch:  # Manual trigger
  pull_request:
    paths:
      - '.github/workflows/funny-idea.md'

# Alternative triggers (uncomment to use):
# on:
#   issues:
#     types: [opened, reopened]
#   pull_request:
#     types: [opened, synchronize]
#   schedule:
#     - cron: "0 9 * * 1"  # Every Monday at 9 AM UTC

# Permissions - what can this workflow access?
permissions:
  contents: read
  discussions: write

# うまく動かなかったので無効化！！！
# Outputs - what APIs and tools can the AI use?
# safe-outputs:
#   # ref: https://github.com/githubnext/gh-aw/blob/7f2e53cdf6138b11d9708bdcf4fd38d4a99b2ea9/docs/src/content/docs/reference/safe-outputs.md#new-discussion-creation-create-discussion
#   create-discussion:
#     title-prefix: "[ai] "            # Optional: prefix for discussion titles
#     max: 3                           # Optional: maximum number of discussions (default: 1)

---

# funny-idea

本リポジトリは korosuke613 のホームページを管理するためのものです。
korosuke613 のホームページ、`https://korosuke613.dev` には面白い機能がたくさんあります。
しかしまだ見つけてないもっと面白い機能が他にもあるはずです。
それを見つけ、Discussions に投稿してください。

## Instructions

1. 本リポジトリ、および、`https://korosuke613.dev` を確認
2. まだ実装されていない面白い機能を考える
3. その面白い機能を GitHub Discussions に投稿する

## Notes

- Run `gh aw compile` to generate the GitHub Actions workflow
- See https://github.com/githubnext/gh-aw/blob/main/docs/index.md for complete configuration options and tools documentation
