#!/bin/bash

# 特定ファイルの編集を禁止する制限フック

# CI 環境変数が true でない場合は GitHub Actionsの実行ではないため、スクリプトを終了
if [[ "$CI" != "true" ]]; then
    exit 0
fi

# 標準入力からJSONデータを読み取り
input=$(cat)

# jqを使ってfile_pathを抽出（jqが利用できない場合の代替手段も含む）
if command -v jq >/dev/null 2>&1; then
    file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
else
    # jqが利用できない場合のpython代替
    file_path=$(echo "$input" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('tool_input', {}).get('file_path', ''))")
fi

# .github/workflows ディレクトリ以下のファイル編集はブロック
if [[ "$file_path" == *".github/workflows"* ]]; then
    echo "❌ エラー: .github/workflows ディレクトリ以下のファイルは編集できません。"
    echo "GitHub Actionsワークフローファイルを変更したコミットを push するには workflow:write 権限が必要ですが、あなたはその権限を持っていません。"
    echo "ユーザーにはワークフローの変更差分をテキストで提示するようにしてください。"
    exit 2  # 操作をブロックするために非ゼロで終了
fi

# .claude/hooks および .claude/settings.json の編集はブロック
if [[ "$file_path" == *".claude/hooks"* ]] || [[ "$file_path" == *".claude/settings.json"* ]]; then
    echo "❌ エラー: .claude/hooks または .claude/settings.json ディレクトリ以下のファイルは編集できません。"
    echo "ユーザーには変更差分をテキストで提示するようにしてください。"
    exit 2  # 操作をブロックするために非ゼロで終了
fi

# その他のファイルは編集を許可
exit 0
