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

tools: 
  # ref: https://github.com/githubnext/gh-aw/blob/7f2e53cdf6138b11d9708bdcf4fd38d4a99b2ea9/docs/src/content/docs/reference/tools.md
  web-fetch:    # Web content fetching
  web-search:   # Web search capabilities

# うまく動かなかったので無効化！！！
# Outputs - what APIs and tools can the AI use?
safe-outputs:
  # ref: https://github.com/githubnext/gh-aw/blob/7f2e53cdf6138b11d9708bdcf4fd38d4a99b2ea9/docs/src/content/docs/reference/safe-outputs.md#new-discussion-creation-create-discussion
  create-discussion:
    title-prefix: "[ai] "            # Optional: prefix for discussion titles
    max: 3                           # Optional: maximum number of discussions (default: 1)

---

# funny-idea

本リポジトリは korosuke613 のホームページを管理するためのものです。
korosuke613 のホームページ、`https://korosuke613.dev` には面白い機能がたくさんあります。
しかしまだ見つけてないもっと面白い機能が他にもあるはずです。
それを見つけてください！

## Instructions

1. 本リポジトリ、および、`https://korosuke613.dev` を確認
2. まだ実装されていない面白い機能を考える
3. ここから先の指示（英語）を実行する（例えば、あなたは `/tmp/aw_output_` から始まるファイルを作成するよう指示されるはずです）
