#!/usr/bin/env bash
#
# fetch-dependabot-alerts.sh
#
# 目的:
#   Dependabot alerts の open な項目を整形済み JSON 配列で取得する。
#   /deps-update Skill の Phase A-3 から呼ばれる。
#
# 使い方:
#   ./fetch-dependabot-alerts.sh [<owner/repo>]
#
# 引数:
#   $1: owner/repo（省略時は git origin から自動推定）
#
# 出力（標準出力）:
#   open な alert の配列（JSON）。alert ゼロなら空配列 `[]`。
#   各要素の形状:
#     {
#       "number": 42,
#       "severity": "high",
#       "package": "axios",
#       "ecosystem": "npm",
#       "vulnerable": "<1.6.0",
#       "fixed": "1.6.0",
#       "ghsa": "GHSA-wf5p-g6vw-rhxx",
#       "cvss": 7.5,
#       "url": "https://github.com/..."
#     }
#
# 終了コード:
#   0: 正常（alert ゼロでも 0）
#   1: 引数エラー
#   その他: gh 実行エラー

set -euo pipefail

repo="${1:-}"

if [ -z "$repo" ]; then
  if ! remote_url=$(git config --get remote.origin.url 2>/dev/null); then
    echo "ERROR: remote.origin.url が取得できない。引数で <owner/repo> を指定してください。" >&2
    exit 1
  fi
  # git@github.com:owner/repo.git / https://github.com/owner/repo.git 両対応
  repo=$(echo "$remote_url" | sed -E 's#(git@github\.com:|https://github\.com/)([^/]+/[^/.]+)(\.git)?.*$#\2#')
fi

if [[ ! "$repo" =~ ^[^/]+/[^/]+$ ]]; then
  echo "ERROR: repo 形式が不正: '$repo'（owner/repo 形式で指定）" >&2
  exit 1
fi

gh api "/repos/${repo}/dependabot/alerts" \
  --jq '[.[] | select(.state=="open") | {
    number,
    severity: .security_advisory.severity,
    package: .security_vulnerability.package.name,
    ecosystem: .security_vulnerability.package.ecosystem,
    vulnerable: .security_vulnerability.vulnerable_version_range,
    fixed: (.security_vulnerability.first_patched_version.identifier // null),
    ghsa: .security_advisory.ghsa_id,
    cvss: (.security_advisory.cvss.score // null),
    url: .html_url
  }]'
