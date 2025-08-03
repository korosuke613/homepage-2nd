# ファイアウォール設定 - nftables + dnsmasq

このディレクトリには、ワイルドカードドメイン対応のファイアウォール設定が含まれています。

## 概要

従来の iptables + ipset ベースのファイアウォールから、nftables + dnsmasq ベースに移行することで、`*.example.com` のようなワイルドカードドメインフィルタリングが可能になります。

## ファイル構成

### 従来システム（iptables）
- `init-firewall.sh` - iptables + ipset ベースのファイアウォール
- 個別ドメインのIPアドレス解決のみ対応

### 新システム（nftables + dnsmasq）
- `init-firewall-nftables.sh` - nftables + dnsmasq ベースのファイアウォール
- `dnsmasq-firewall.conf` - dnsmasq設定ファイル
- `nftables-firewall.nft` - nftablesルールテンプレート
- ワイルドカードドメイン対応

## 機能比較

| 機能 | iptables版 | nftables版 |
|------|------------|------------|
| 個別ドメイン | ✅ | ✅ |
| CNAMEチェーン追跡 | ✅ | ✅ |
| ワイルドカードドメイン | ❌ | ✅ |
| 動的IP更新 | ❌ | ✅ |
| TTL管理 | ❌ | ✅ |

## ワイルドカードドメイン対応例

### 設定例
```bash
# dnsmasq-firewall.conf に以下を追加
nftset=/example.com/4#inet#firewall#allowed_domains_v4
```

### 対応ドメイン
- `example.com`
- `sub.example.com` 
- `api.example.com`
- `*.example.com`（任意のサブドメイン）

## 使用方法

### 1. 新システムのテスト
```bash
# iptablesファイアウォールを停止
sudo ./init-firewall.sh stop

# nftablesファイアウォールを開始
sudo ./init-firewall-nftables.sh
```

### 2. devcontainer.json の更新
```json
{
  "postCreateCommand": ".devcontainer/init-firewall-nftables.sh"
}
```

### 3. ワイルドカードドメインの追加
`dnsmasq-firewall.conf` を編集してドメインを追加：
```bash
nftset=/新しいドメイン.com/4#inet#firewall#allowed_domains_v4
nftset=/新しいドメイン.com/6#inet#firewall#allowed_domains_v6
```

## 動作確認

### 1. サービス状態確認
```bash
sudo systemctl status nftables
sudo systemctl status dnsmasq
```

### 2. nftables設定確認
```bash
sudo nft list ruleset
sudo nft list set inet firewall allowed_domains_v4
```

### 3. dnsmasq動作確認
```bash
# ログ確認
sudo journalctl -u dnsmasq -f

# DNS解決テスト
nslookup test.example.com
```

## トラブルシューティング

### ドメインが解決されない
1. dnsmasq設定確認: `/etc/dnsmasq.d/firewall.conf`
2. nftables設定確認: `sudo nft list set inet firewall allowed_domains_v4`
3. DNS解決ログ確認: `sudo journalctl -u dnsmasq`

### 通信がブロックされる
1. nftablesルール確認: `sudo nft list ruleset`
2. ドロップログ確認: `sudo dmesg | grep "nft-firewall-drop"`
3. セット内容確認: 対象IPがセットに含まれているか

## 設定済みワイルドカードドメイン

現在以下のワイルドカードドメインが設定済み：
- `*.vscode-unpkg.net`
- `*.anthropic.com`
- `*.npmjs.org`
- `*.sentry.io`
- `*.statsig.com`
- `*.github.com`
- `*.githubusercontent.com`
- `*.githubassets.com`

## 移行計画

1. **テスト段階**: 新システムの動作確認
2. **並行運用**: 両システムでの比較テスト
3. **完全移行**: devcontainer.jsonの更新
4. **旧ファイル削除**: iptables版ファイルの削除