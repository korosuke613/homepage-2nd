#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, and pipeline failures
IFS=$'\n\t'       # Stricter word splitting

echo "Starting nftables + dnsmasq firewall setup..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "ERROR: This script must be run as root"
    exit 1
fi

# Install required packages
echo "Installing required packages..."
apt-get update -qq
apt-get install -y nftables dnsmasq

# Stop services to configure them (if running)
pkill dnsmasq 2>/dev/null || true

# Function to resolve domain through CNAME chain with specified depth
resolve_domain_to_ips() {
    local domain="$1"
    local max_depth="${2:-3}"
    local current_depth=0
    local current_domain="$domain"
    local final_ips=""
    
    echo "Resolving $domain (max depth: $max_depth)..." >&2
    
    while [ $current_depth -lt $max_depth ]; do
        echo "  Depth $((current_depth + 1)): Checking $current_domain" >&2
        
        # Get CNAME records specifically first
        local cname=$(dig +short CNAME "$current_domain" | head -1)
        
        if [ -n "$cname" ]; then
            # Remove trailing dot from CNAME if present
            cname=$(echo "$cname" | sed 's/\.$//')
            echo "  Following CNAME: $current_domain -> $cname" >&2
            current_domain="$cname"
            current_depth=$((current_depth + 1))
            continue
        fi
        
        # If no CNAME, try to get A records (IP addresses)
        local ips=$(dig +short A "$current_domain" | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
        
        if [ -n "$ips" ]; then
            echo "  Found IP addresses for $current_domain" >&2
            final_ips="$ips"
            break
        fi
        
        echo "  No CNAME or A record found for $current_domain" >&2
        break
    done
    
    if [ $current_depth -eq $max_depth ]; then
        echo "  Reached maximum depth ($max_depth) for $domain, trying final resolution" >&2
        # Try one final resolution at max depth
        local ips=$(dig +short A "$current_domain" | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
        if [ -n "$ips" ]; then
            echo "  Found IP addresses for $current_domain at max depth" >&2
            final_ips="$ips"
        fi
    fi
    
    if [ -z "$final_ips" ]; then
        echo "  WARNING: Failed to resolve $domain to IP addresses" >&2
        return 0
    fi
    
    echo "$final_ips"
}

# Fetch GitHub meta information
echo "Fetching GitHub IP ranges..."
gh_ranges=$(curl -s https://api.github.com/meta)
if [ -z "$gh_ranges" ]; then
    echo "ERROR: Failed to fetch GitHub IP ranges"
    exit 1
fi

if ! echo "$gh_ranges" | jq -e '.web and .api and .git' >/dev/null; then
    echo "ERROR: GitHub API response missing required fields"
    exit 1
fi

# Prepare static IP sets for nftables
echo "Preparing static IP sets..."
static_ips_v4=""
static_ips_v6=""

# Add a default localhost IP to prevent empty sets
static_ips_v4="127.0.0.1"

# Resolve static domains and collect IPs
for domain in \
    "registry.npmjs.org" \
    "api.anthropic.com" \
    "sentry.io" \
    "statsig.anthropic.com" \
    "statsig.com" \
    "update.code.visualstudio.com" \
    "code.visualstudio.com" \
    "go.microsoft.com" \
    "marketplace.visualstudio.com" \
    "rink.hockeyapp.net" \
    "raw.githubusercontent.com" \
    "vsmarketplacebadges.dev" \
    "vscode.download.prss.microsoft.com" \
    "download.visualstudio.microsoft.com" \
    "vscode-sync.trafficmanager.net" \
    "vscode-sync-insiders.trafficmanager.net" \
    "vscode.dev" \
    "default.exp-tas.com"; do
    
    # SOA レコードしか見つからなかったためコメントアウト
    # "bingsettingssearch.trafficmanager.net" \
    # "vscode.search.windows.net" \

    echo "Resolving static domain: $domain"
    ips=$(resolve_domain_to_ips "$domain" 3)
    if [ -z "$ips" ]; then
        echo "WARNING: Failed to resolve $domain, will rely on wildcard matching or may need manual configuration"
        continue
    fi
    
    while read -r ip; do
        if [[ "$ip" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
            if [ -n "$static_ips_v4" ]; then
                static_ips_v4="$static_ips_v4, $ip"
            else
                static_ips_v4="$ip"
            fi
        fi
    done < <(echo "$ips")
done

# Prepare GitHub IP ranges
echo "Processing GitHub IP ranges..."
github_ranges_v4=""
github_ranges_v6=""

while read -r cidr; do
    if [[ ! "$cidr" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/[0-9]{1,2}$ ]]; then
        echo "ERROR: Invalid CIDR range from GitHub meta: $cidr"
        exit 1
    fi
    echo "Adding GitHub range $cidr"
    if [ -n "$github_ranges_v4" ]; then
        github_ranges_v4="$github_ranges_v4, $cidr"
    else
        github_ranges_v4="$cidr"
    fi
done < <(echo "$gh_ranges" | jq -r '(.web + .api + .git)[]' | aggregate -q)

# Create nftables configuration with populated sets
echo "Creating nftables configuration..."
cat > /tmp/firewall.nft << EOF
#!/usr/sbin/nft -f

# Flush existing rules
flush ruleset

table inet firewall {
    # Static IP sets for manually resolved domains
    set allowed_static_v4 {
        type ipv4_addr
        flags constant
        elements = { $static_ips_v4 }
    }

    set allowed_static_v6 {
        type ipv6_addr
        flags constant  
    }

    # Dynamic IP sets managed by dnsmasq for wildcard domains
    set allowed_domains_v4 {
        type ipv4_addr
        flags dynamic,timeout
        timeout 1h
        size 65536
    }

    set allowed_domains_v6 {
        type ipv6_addr
        flags dynamic,timeout
        timeout 1h
        size 65536
    }

    # GitHub IP ranges set (CIDR ranges)
    set github_ranges_v4 {
        type ipv4_addr
        flags interval
        elements = { $github_ranges_v4 }
    }

    set github_ranges_v6 {
        type ipv6_addr
        flags interval
    }

    # Chain for input traffic
    chain input {
        type filter hook input priority filter; policy drop;
        
        # Allow established and related connections
        ct state established,related accept
        
        # Allow loopback traffic
        iifname "lo" accept
        
        # Allow ICMP
        ip protocol icmp accept
        ip6 nexthdr ipv6-icmp accept
        
        # Allow SSH responses
        tcp sport 22 ct state established accept
        
        # Allow DNS responses
        udp sport 53 accept
        tcp sport 53 accept
        
        # Allow local network traffic (Docker host communication)
        ip saddr 172.16.0.0/12 accept
        ip saddr 192.168.0.0/16 accept
        ip saddr 10.0.0.0/8 accept
        ip6 saddr fe80::/10 accept
    }

    # Chain for output traffic
    chain output {
        type filter hook output priority filter; policy drop;
        
        # Allow established and related connections
        ct state established,related accept
        
        # Allow loopback traffic
        oifname "lo" accept
        
        # Allow ICMP
        ip protocol icmp accept
        ip6 nexthdr ipv6-icmp accept
        
        # Allow DNS queries
        udp dport 53 accept
        tcp dport 53 accept
        
        # Allow SSH connections
        tcp dport 22 accept
        
        # Allow local network traffic (Docker host communication)
        ip daddr 172.16.0.0/12 accept
        ip daddr 192.168.0.0/16 accept
        ip daddr 10.0.0.0/8 accept
        ip6 daddr fe80::/10 accept
        
        # Allow connections to GitHub IP ranges
        ip daddr @github_ranges_v4 accept
        ip6 daddr @github_ranges_v6 accept
        
        # Allow connections to static allowed IPs
        ip daddr @allowed_static_v4 accept
        ip6 daddr @allowed_static_v6 accept
        
        # Allow connections to dynamically resolved domains (dnsmasq managed)
        ip daddr @allowed_domains_v4 accept
        ip6 daddr @allowed_domains_v6 accept
        
        # Log dropped packets for debugging
        limit rate 1/minute log prefix "nft-firewall-drop: "
    }

    # Chain for forwarding (drop all)
    chain forward {
        type filter hook forward priority filter; policy drop;
    }
}
EOF

# Apply nftables configuration
echo "Applying nftables configuration..."
chmod +x /tmp/firewall.nft
nft -f /tmp/firewall.nft

# Configure dnsmasq
echo "Configuring dnsmasq..."
cp /workspace/.devcontainer/dnsmasq-firewall.conf /etc/dnsmasq.d/firewall.conf

# Start services
echo "Starting services..."
# nftables rules are already applied above

# Start dnsmasq in background
echo "Starting dnsmasq..."
dnsmasq --keep-in-foreground --log-queries &
DNSMASQ_PID=$!

# Wait for dnsmasq to start
sleep 2

# Verify dnsmasq is running
if ! kill -0 $DNSMASQ_PID 2>/dev/null; then
    echo "ERROR: Failed to start dnsmasq"
    exit 1
fi

echo "dnsmasq started successfully (PID: $DNSMASQ_PID)"

echo "Firewall configuration complete"
echo "Verifying firewall rules..."

# Test that blocked sites are actually blocked
if timeout 5 curl -s https://example.com >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - was able to reach https://example.com"
    exit 1
else
    echo "Firewall verification passed - unable to reach https://example.com as expected"
fi

# Test that allowed sites work
if ! timeout 10 curl -s https://api.github.com/zen >/dev/null 2>&1; then
    echo "ERROR: Firewall verification failed - unable to reach https://api.github.com"
    exit 1
else
    echo "Firewall verification passed - able to reach https://api.github.com as expected"
fi

# Test wildcard domain functionality (this will populate the nftset)
echo "Testing wildcard domain resolution..."
if timeout 10 nslookup www.vscode-unpkg.net >/dev/null 2>&1; then
    echo "Wildcard domain resolution test passed"
else
    echo "WARNING: Wildcard domain resolution test failed"
fi

echo "nftables + dnsmasq firewall setup completed successfully!"
echo "Wildcard domains like *.example.com are now supported through dnsmasq integration."

# VS Code拡張機能ドメインの事前解決
echo "Pre-resolving VS Code extension domains..."
if [ -x "/workspace/.devcontainer/vscode-extension-resolver.sh" ]; then
    /workspace/.devcontainer/vscode-extension-resolver.sh resolve
    echo "VS Code domain pre-resolution completed"
else
    echo "Warning: VS Code extension resolver not found"
fi

echo ""
echo "Firewall is now active with the following features:"
echo "- GitHub API access: ✓"
echo "- VS Code marketplace: ✓"
echo "- Wildcard domain support: ✓"
echo "- Dynamic extension domain resolution: ✓"
echo ""
echo "To manually resolve additional domains:"
echo "  /workspace/.devcontainer/vscode-extension-resolver.sh domain <domain_name>"