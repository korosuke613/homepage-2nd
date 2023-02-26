---

title: 'compare-renovate-logs'
description: ''
pubDate: 2022-12-23T00:00:00Z
imgSrc: '/assets/images/cover/compare_renovate_logs_workflow.webp'
imgAlt: ''
tags:
  - Pickup ⭐️
  - OSS
  - TypeScript
  - Deno
  - Renovate
  - GitHub Actions
---

トピックブランチとベースブランチでそれぞれ Renovate を dry-run してそのログの比較をする GitHub Actions の reusable workflow です。Renovate むずいっすよね。

詳しくは [Zenn](https://zenn.dev/cybozu_ept/articles/compare-renovate-dry-run) の記事を参照ください。

- [korosuke613/compare-renovate-logs-workflow: Compare Renovate logs for GitHub Actions reusable workflow](https://github.com/korosuke613/compare-renovate-logs-workflow)
- [Renovate config の変更が想定通りか確認する 〜真の dry-run を求めて〜](https://zenn.dev/cybozu_ept/articles/compare-renovate-dry-run)
- [korosuke613/analyze-renovate-log: Analyze Renovate json logs.](https://github.com/korosuke613/analyze-renovate-log)
  - 内部的には Deno でログを解析してます
