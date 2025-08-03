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
- `vscode-proxy-settings.json` - VS Code用プロキシ設定

## 機能比較

| 機能 | nftables版 | Squid版 |
|------|------------|---------|
| ワイルドカードドメイン | 限定的 | ✅ 完全対応 |
| ドメイン正規表現 | ❌ | ✅ |
| 詳細アクセスログ | 限定的 | ✅ |
| リアルタイム制御 | ❌ | ✅ |
| 設定の動的変更 | ❌ | ✅ |
| 透明プロキシモード | ❌ | ✅ |

## ワイルドカードドメイン対応

### 基本記法
```bash
# /etc/squid/squid.conf
acl vscode_domains dstdomain .visualstudio.com
acl vscode_domains dstdomain .microsoft.com
```

### 対応ドメイン例
- `.visualstudio.com` → `*.visualstudio.com`（全サブドメイン）
  - `code.visualstudio.com` ✅
  - `update.code.visualstudio.com` ✅
  - `marketplace.visualstudio.com` ✅
  
- `.github.com` → `*.github.com`
  - `api.github.com` ✅
  - `raw.githubusercontent.com` ✅
  - `user.github.io` ✅

## 使用方法

### 1. Squidシステムの起動

#### オプション1: 新しいdevcontainer設定を使用
```bash
# devcontainer.squid.json を devcontainer.json にリネーム
mv .devcontainer/devcontainer.squid.json .devcontainer/devcontainer.json
mv .devcontainer/Dockerfile.squid .devcontainer/Dockerfile

# devcontainerを再ビルド
```

#### オプション2: 手動でSquidシステムを起動
```bash
# Squidファイアウォールスクリプトを実行
sudo .devcontainer/init-firewall-squid.sh
```

### 2. プロキシ設定の確認
```bash
# 環境変数の確認
echo $http_proxy
echo $https_proxy

# Squidプロセスの確認
ps aux | grep squid

# プロキシ経由でのテスト
curl -x http://127.0.0.1:3128 https://code.visualstudio.com
```

### 3. ドメインの追加
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

## 設定済みドメイン

### VS Code関連
- `*.visualstudio.com` - VS Code公式サイト、マーケットプレイス
- `*.microsoft.com` - Microsoft関連サービス
- `*.vsassets.io` - VS Code拡張機能アセット
- `*.vscode-cdn.net` - VS Code CDN
- `*.vscode-unpkg.net` - Web拡張機能

### 開発ツール
- `*.github.com` - GitHub関連
- `*.npmjs.org` - NPMパッケージ
- `*.anthropic.com` - Claude関連

### CDN・インフラ
- `*.akamai.net` - Akamai CDN
- `*.cloudfront.net` - AWS CloudFront
- `*.azure.com` - Microsoft Azure

## ログ機能

### アクセスログの確認
```bash
# リアルタイムでアクセスログを監視
sudo tail -f /var/log/squid/access.log

# 特定のドメインへのアクセス確認
sudo grep "visualstudio.com" /var/log/squid/access.log

# アクセス拒否ログの確認
sudo grep "TCP_DENIED" /var/log/squid/access.log
```

### エラーログの確認
```bash
# Squidエラーログ
sudo tail -f /var/log/squid/cache.log
```

## トラブルシューティング

### 1. プロキシ接続の問題
```bash
# Squidプロセス確認
ps aux | grep squid

# ポート確認
netstat -tlnp | grep 3128

# 手動接続テスト
curl -x http://127.0.0.1:3128 -v https://www.google.com
```

### 2. VS Code拡張機能の問題
```bash
# VS Code設定確認
cat ~/.vscode/settings.json | grep proxy

# 拡張機能関連ドメインテスト
curl -x http://127.0.0.1:3128 https://marketplace.visualstudio.com
```

### 3. 設定変更が反映されない
```bash
# Squid設定の構文チェック
sudo squid -k parse

# 設定の再読み込み
sudo squid -k reconfigure

# 完全再起動
sudo pkill squid
sudo .devcontainer/init-firewall-squid.sh
```

## 高度な機能

### 1. 時間ベースの制御
```bash
acl work_hours time MTWHF 09:00-18:00
http_access allow vscode_domains work_hours
```

### 2. 正規表現ドメインマッチング
```bash
acl regex_domains dstdom_regex ^.*\\.visualstudio\\.(com|net|org)$
```

### 3. ユーザーベースの制御
```bash
acl dev_users proxy_auth developer1 developer2
http_access allow vscode_domains dev_users
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

## 移行ガイド

### nftables版からの移行
1. 現在のdevcontainer停止
2. `devcontainer.squid.json` を `devcontainer.json` にリネーム
3. `Dockerfile.squid` を `Dockerfile` にリネーム
4. devcontainerを再ビルド

### 設定の比較テスト
```bash
# 両方式での同一ドメインアクセステスト
curl https://marketplace.visualstudio.com
```

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