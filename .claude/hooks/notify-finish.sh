#!/bin/bash

# Claude Code Stop Hook
# デスクトップ通知を送る

## CI の場合は何もしない
if [ "$CI" = "true" ]; then
    exit 0
fi

## osascript、notify-send のどちらかが利用可能な場合に通知を送信。どちらもない場合は正常終了
if command -v osascript >/dev/null 2>&1; then
    # macOS の場合
    osascript -e "display notification \"Task finished.\" with title \"Claude Code\" sound name \"Ping\""
elif command -v notify-send >/dev/null 2>&1; then
    # Linux の場合
    notify-send "Claude Code" "Task finished."
fi

# 正常終了
exit 0
