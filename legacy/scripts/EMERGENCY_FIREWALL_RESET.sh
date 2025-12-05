#!/bin/bash

# EMERGENCY FIREWALL RESET - Execute in Hetzner Console
# This will reset all firewall rules and restore basic access

echo "=== EMERGENCY FIREWALL RESET ==="
echo "Current time: $(date)"
echo ""

# 1. Reset UFW firewall completely
echo "🔥 Resetting UFW firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "✅ UFW firewall reset and configured"
echo ""

# 2. Flush iptables rules
echo "🔥 Flushing iptables rules..."
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
echo "✅ iptables rules flushed"
echo ""

# 3. Restart SSH service
echo "🔄 Restarting SSH service..."
systemctl restart sshd
systemctl enable sshd
echo "✅ SSH service restarted"
echo ""

# 4. Check SSH configuration
echo "🔍 Checking SSH configuration..."
cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication)" || echo "SSH config not found"
echo ""

# 5. Check network interfaces
echo "🌐 Checking network interfaces..."
ip addr show
echo ""

# 6. Check listening ports
echo "🔍 Checking listening ports..."
netstat -tulpn | grep LISTEN | head -10
echo ""

# 7. Test local connectivity
echo "🔍 Testing local connectivity..."
curl -I http://localhost 2>/dev/null || echo "HTTP not responding locally"
echo ""

# 8. Show current firewall status
echo "🔥 Current firewall status:"
ufw status verbose
echo ""

echo "=== EMERGENCY RESET COMPLETE ==="
echo ""
echo "Now test SSH from your local machine:"
echo "ssh root@46.62.222.138"
echo ""
echo "If SSH works, then run the full recovery script."