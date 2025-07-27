#!/bin/bash

# Claude Code Notification Hook
# デスクトップ通知を送る

## CI の場合は何もしない
if [ "$CI" = "true" ]; then
    exit 0
fi

## osascript、notify-send のどちらかが利用可能な場合に通知を送信。どちらもない場合は正常終了
if command -v osascript >/dev/null 2>&1; then
    # macOS の場合
    script="display notification \"$(jq -r .message)\" with title \"Claude Code\" sound name \"Ping\""
    osascript -e "$script"
elif command -v notify-send >/dev/null 2>&1; then
    # Linux の場合
    notify-send "Claude Code" "$(jq .message)"
fi

# 正常終了
exit 0
