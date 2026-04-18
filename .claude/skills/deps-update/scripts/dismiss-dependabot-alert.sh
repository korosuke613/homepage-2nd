#!/usr/bin/env bash
#
# dismiss-dependabot-alert.sh
#
# 目的:
#   対応困難と判断した Dependabot alert を理由付きで dismiss する。
#   /deps-update Skill の Phase G-D から呼ばれる。
#
# 使い方:
#   ./dismiss-dependabot-alert.sh <alert_number> <reason> [<comment>] [<owner/repo>]
#
# 引数:
#   $1: alert 番号（Dependabot alert の number フィールド、fetch-dependabot-alerts.sh の出力を参照）
#   $2: reason（以下のいずれか）
#         tolerable_risk / no_bandwidth / inaccurate / not_used / fix_started
#   $3: comment（任意、推奨: 判定根拠を記入）
#   $4: owner/repo（省略時は git origin 自動推定）
#
# 終了コード:
#   0: 正常
#   1: 引数エラー
#   その他: gh 実行エラー

set -euo pipefail

alert_number="${1:-}"
reason="${2:-}"
comment="${3:-}"
repo="${4:-}"

if [ -z "$alert_number" ] || [ -z "$reason" ]; then
  echo "ERROR: alert_number と reason は必須" >&2
  echo "Usage: $0 <alert_number> <reason> [<comment>] [<owner/repo>]" >&2
  exit 1
fi

if [[ ! "$alert_number" =~ ^[0-9]+$ ]]; then
  echo "ERROR: alert_number は数値で指定すること: '$alert_number'" >&2
  exit 1
fi

case "$reason" in
  tolerable_risk|no_bandwidth|inaccurate|not_used|fix_started) ;;
  *)
    echo "ERROR: invalid reason '$reason'" >&2
    echo "  valid: tolerable_risk | no_bandwidth | inaccurate | not_used | fix_started" >&2
    exit 1
    ;;
esac

if [ -z "$repo" ]; then
  if ! remote_url=$(git config --get remote.origin.url 2>/dev/null); then
    echo "ERROR: remote.origin.url が取得できない。引数で <owner/repo> を指定してください。" >&2
    exit 1
  fi
  repo=$(echo "$remote_url" | sed -E 's#(git@github\.com:|https://github\.com/)([^/]+/[^/.]+)(\.git)?.*$#\2#')
fi

if [[ ! "$repo" =~ ^[^/]+/[^/]+$ ]]; then
  echo "ERROR: repo 形式が不正: '$repo'（owner/repo 形式で指定）" >&2
  exit 1
fi

args=(
  --method PATCH
  "/repos/${repo}/dependabot/alerts/${alert_number}"
  -f "state=dismissed"
  -f "dismissed_reason=${reason}"
)

if [ -n "$comment" ]; then
  args+=(-f "dismissed_comment=${comment}")
fi

gh api "${args[@]}"
