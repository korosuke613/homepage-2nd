#!/bin/bash
set -euo pipefail

# VS Code拡張機能関連ドメインのリアルタイム解決とnftset追加

LOG_FILE="/var/log/vscode-resolver.log"
NFTSET_V4="inet firewall allowed_domains_v4"

# ログ関数
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') [VSCODE-RESOLVER] $1" | tee -a "$LOG_FILE" >&2
}

# ドメインを解決してnftsetに追加
resolve_and_add() {
    local domain="$1"
    
    log_message "Resolving $domain..."
    
    # digでAレコードを取得（CNAMEも自動的に辿られる）
    local ips=$(dig +short "$domain" | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
    
    if [ -z "$ips" ]; then
        log_message "No A records found for $domain"
        return 0
    fi
    
    local added_count=0
    for ip in $ips; do
        if nft add element $NFTSET_V4 { "$ip" timeout 2h } 2>/dev/null; then
            log_message "Added $ip for $domain (timeout: 2h)"
            added_count=$((added_count + 1))
        else
            log_message "Failed to add $ip for $domain (may already exist)"
        fi
    done
    
    log_message "Added $added_count IP(s) for $domain"
}

# VS Code拡張機能関連ドメインのリスト
resolve_vscode_domains() {
    local domains=(
        # 現在アクセスに失敗しているドメイン
        "denoland.gallerycdn.vsassets.io"
        
        # その他のVS Code拡張機能で使われる可能性の高いドメイン
        "marketplace.visualstudio.com"
        "vsmarketplacebadges.dev"
        
        # ワイルドカードドメインの具体例
        "ms-python.gallerycdn.vsassets.io"
        "ms-vscode.gallerycdn.vsassets.io"
        "github.gallerycdn.vsassets.io"
        "redhat.gallerycdn.vsassets.io"
        "esbenp.gallerycdn.vsassets.io"
    )
    
    log_message "Starting VS Code domain resolution..."
    
    for domain in "${domains[@]}"; do
        resolve_and_add "$domain"
        sleep 0.5  # レート制限を避けるため
    done
    
    log_message "VS Code domain resolution completed"
}

# ネットワーク接続監視
monitor_vscode_connections() {
    log_message "Starting VS Code connection monitoring..."
    
    # VS Code関連のHTTPS接続を監視
    netstat -tn 2>/dev/null | grep :443 | while read -r line; do
        # 接続先IPアドレスを抽出
        remote_ip=$(echo "$line" | awk '{print $5}' | cut -d: -f1)
        
        if [ -n "$remote_ip" ] && [[ "$remote_ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            # 逆引きでドメイン名を確認
            domain=$(dig +short -x "$remote_ip" 2>/dev/null | head -1 | sed 's/\.$//')
            
            if [[ "$domain" =~ (gallerycdn|gallery|marketplace|vscode) ]]; then
                log_message "Detected VS Code connection to $remote_ip ($domain)"
                
                # IPアドレスを直接nftsetに追加
                if nft add element $NFTSET_V4 { "$remote_ip" timeout 1h } 2>/dev/null; then
                    log_message "Added detected IP $remote_ip to nftset"
                fi
            fi
        fi
    done
}

# メイン処理
main() {
    case "${1:-resolve}" in
        "resolve")
            resolve_vscode_domains
            ;;
        "monitor")
            monitor_vscode_connections
            ;;
        "domain")
            if [ $# -lt 2 ]; then
                echo "Usage: $0 domain <domain_name>"
                exit 1
            fi
            resolve_and_add "$2"
            ;;
        *)
            echo "Usage: $0 [resolve|monitor|domain <domain_name>]"
            echo "  resolve: Resolve common VS Code domains"
            echo "  monitor: Monitor VS Code connections"
            echo "  domain:  Resolve specific domain"
            exit 1
            ;;
    esac
}

main "$@"