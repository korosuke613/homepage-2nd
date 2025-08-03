# Squidプロキシベースファイアウォールシステム

このディレクトリには、Squidプロキシサーバーを使用したワイルドカードドメイン対応のファイアウォールシステムが含まれています。

## 概要

従来のnftables/iptablesベースの方式から、Squidプロキシベースに移行することで、真のワイルドカードドメイン制御と詳細なアクセスログ機能を実現しています。

## ファイル構成

### Squidシステム
- `init-firewall-squid.sh` - Squidベースのファイアウォール初期化スクリプト
- `squid.conf` - Squid設定ファイル（ワイルドカードドメイン定義）
- `Dockerfile.squid` - Squid対応Docker環境
- `devcontainer.squid.json` - Squid用devcontainer設定

## 機能比較

| 機能 | nftables版 | Squid版 |
|------|------------|---------|
| ワイルドカードドメイン | 限定的 | ✅ 完全対応 |
| ドメイン正規表現 | ❌ | ✅ |
| 詳細アクセスログ | 限定的 | ✅ |
| リアルタイム制御 | ❌ | ✅ |
| 設定の動的変更 | ❌ | ✅ |
| 透明プロキシモード | ❌ | ✅ |

## ドメインの追加
`squid.conf` にドメインを追加：
```bash
# 新しいワイルドカードドメイン
acl new_domains dstdomain .example.com

# アクセス許可ルールに追加
http_access allow new_domains
http_access allow CONNECT SSL_ports new_domains
```

設定変更後は Squid を再起動：
```bash
sudo squid -k reconfigure
```

## デバッグ

### 事前準備: コンテナIDの確認
```bash
# 実行中のコンテナを確認
docker ps

# VS Codeのdevcontainerを特定
CONTAINER_ID=$(docker ps --format "{{.ID}}\t{{.Image}}" | grep vsc- | head -1 | cut -f1)
echo "Container ID: $CONTAINER_ID"

# または手動でコンテナIDを設定
# CONTAINER_ID="4d4a25f829c2"
```

### ログ

```bash
# リアルタイムでアクセスログを監視
docker exec -u root $CONTAINER_ID tail -f /var/log/squid/access.log

# 特定のドメインへのアクセス確認
docker exec -u root $CONTAINER_ID bash -c "grep 'visualstudio.com' /var/log/squid/access.log"

# アクセス拒否ログの確認
docker exec -u root $CONTAINER_ID bash -c "grep 'TCP_DENIED' /var/log/squid/access.log"

# Squidエラーログ
docker exec -u root $CONTAINER_ID tail -f /var/log/squid/cache.log
```

### Tips

#### Squidプロセス状態の確認
```bash
# Squidプロセスの実行状況
docker exec -u root $CONTAINER_ID bash -c "ps aux | grep squid"

# 期待される出力:
# proxy        729  0.0  0.1  74424 18068 ?  S  20:24  0:00 squid -N -d1

# プロセスのPIDを記録
docker exec -u root $CONTAINER_ID bash -c "pgrep squid && echo 'Squid is running' || echo 'Squid is not running'"
```

#### ポート・接続状況の確認
```bash
# Squidが3128ポートでリッスンしているか確認
docker exec -u root $CONTAINER_ID bash -c "netstat -tlnp | grep 3128"
# 期待される出力: tcp ... 127.0.0.1:3128 ... LISTEN

# プロキシ経由での基本接続テスト
docker exec -u root $CONTAINER_ID bash -c "curl -x http://127.0.0.1:3128 --connect-timeout 5 -I https://github.com"
```

#### リアルタイムログ監視
```bash
# アクセスログをリアルタイムで監視（別ターミナルで実行）
docker exec -u root $CONTAINER_ID tail -f /var/log/squid/access.log

# ログの書式理解:
# [timestamp] [duration] [client] [status] [bytes] [method] [url] [user] [hierarchy] [content-type]
# 例: 1754220739.594  83 127.0.0.1 TCP_TUNNEL/200 570338 CONNECT github.com:443 - HIER_DIRECT/20.27.177.113 -
```

#### 設定ファイルの確認
```bash
# Squid設定の構文チェック
docker exec -u root $CONTAINER_ID bash -c "squid -k parse"

# 使用中の設定ファイルを確認
docker exec -u root $CONTAINER_ID bash -c "cat /etc/squid/squid.conf | grep -E '(acl|http_access)' | head -20"

# ACL定義の確認
docker exec -u root $CONTAINER_ID bash -c "grep -A 5 -B 2 'container_clients' /etc/squid/squid.conf"
docker exec -u root $CONTAINER_ID bash -c "grep -A 5 -B 2 'github_domains' /etc/squid/squid.conf"
```

#### 接続テストの実行
```bash
# 許可されるべきドメインのテスト
echo "=== 許可ドメインテスト ==="
docker exec -u root $CONTAINER_ID bash -c "curl -x http://127.0.0.1:3128 --connect-timeout 5 -s https://github.com >/dev/null 2>&1; tail -1 /var/log/squid/access.log | cut -d' ' -f4"
echo "GitHub接続結果: 上記"

docker exec -u root $CONTAINER_ID bash -c "curl -x http://127.0.0.1:3128 --connect-timeout 5 -s https://marketplace.visualstudio.com >/dev/null 2>&1; tail -1 /var/log/squid/access.log | cut -d' ' -f4"
echo "VS Code Marketplace接続結果: 上記"

# ブロックされるべきドメインのテスト
echo "=== 拒否ドメインテスト ==="
docker exec -u root $CONTAINER_ID bash -c "curl -x http://127.0.0.1:3128 --connect-timeout 5 -s https://example.com >/dev/null 2>&1; tail -1 /var/log/squid/access.log | cut -d' ' -f4"
echo "example.com接続結果: 上記"
```

## トラブルシューティング

#### 全てのドメインが403で拒否される
```bash
# 症状: github.comなど許可されるべきドメインも TCP_DENIED/403
# 原因: container_clientsのACLが正しく定義されていない

# 診断:
echo "クライアントIP確認:"
docker exec -u root $CONTAINER_ID bash -c "ip addr show | grep -E 'inet.*127|inet.*192\.168|inet.*172\.'"

# 修正: container_clientsにlocalhostを追加
docker exec -u root $CONTAINER_ID bash -c "grep 'container_clients.*127.0.0.1' /etc/squid/squid.conf || echo 'localhost設定が不足'"
```

#### HTTPSサイトに接続できない
```bash
# 症状: curlで接続タイムアウトやCONNECT tunnel failed
# 原因: CONNECTメソッドのACL順序問題

# 診断:
docker exec -u root $CONTAINER_ID bash -c "grep -n 'CONNECT.*container_clients' /etc/squid/squid.conf"
echo "↑の行でcontainer_clients, SSL_ports, domain_name の順序を確認"

# 正しい順序例:
# http_access allow CONNECT container_clients SSL_ports github_domains
```

#### 設定変更が反映されない
```bash
# Squid設定の構文チェック
docker exec -u root $CONTAINER_ID bash -c "squid -k parse"

# 設定の再読み込み
docker exec -u root $CONTAINER_ID bash -c "squid -k reconfigure"

# 完全再起動
docker exec -u root $CONTAINER_ID bash -c "pkill squid"
docker exec -u root $CONTAINER_ID bash -c "/workspace/.devcontainer/init-firewall-squid.sh"
```

## 高度な機能

### 正規表現ドメインマッチング
```bash
acl regex_domains dstdom_regex ^.*\\.visualstudio\\.(com|net|org)$
```

## パフォーマンス最適化

### キャッシュ無効化
```bash
cache deny all
```

### メモリ使用量調整
```bash
cache_mem 64 MB
maximum_object_size_in_memory 1 MB
```

### ワーカープロセス数
```bash
workers 1
cpu_affinity_map process_numbers=1 cores=1
```

## セキュリティ考慮事項

1. **ポート制限**: 安全なポート（80, 443）のみ許可
2. **メソッド制限**: CONNECTメソッドはHTTPS（443）のみ
3. **ローカルネットワーク**: 内部通信は許可
4. **デフォルト拒否**: 明示的に許可されていないアクセスは拒否

## 利点とトレードオフ

### 利点
- 🎯 **精密な制御**: ドメインレベルでの詳細制御
- 📊 **詳細ログ**: すべてのアクセスを記録
- 🔄 **動的変更**: 設定変更を即座に反映
- 🌐 **ワイルドカード**: 真のワイルドカードドメイン対応

### トレードオフ
- 📈 **リソース使用**: プロキシサーバーによる若干のオーバーヘッド
- 🔧 **複雑性**: 設定がやや複雑
- 🐛 **デバッグ**: ネットワーク問題の診断が複雑

VS Codeの拡張機能エコシステムのような頻繁にドメインが追加される環境では、Squid方式が最も適しています。