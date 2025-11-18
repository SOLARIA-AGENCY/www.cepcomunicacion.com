# SSH CONFIGURATION FIX - Execute in Hetzner Console
# This will enable password authentication and fix SSH access

echo "=== SSH CONFIGURATION FIX ==="
echo "Current time: $(date)"
echo ""

# 1. Check current SSH configuration
echo "🔍 Current SSH configuration:"
cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)" || echo "No SSH config found"
echo ""

# 2. Enable password authentication temporarily
echo "🔧 Enabling password authentication..."
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin yes/PermitRootLogin yes/' /etc/ssh/sshd_config

# 3. Ensure SSH is running on port 22
echo "🔧 Ensuring SSH runs on port 22..."
sed -i 's/#Port 22/Port 22/' /etc/ssh/sshd_config
sed -i 's/Port .*/Port 22/' /etc/ssh/sshd_config

# 4. Restart SSH service
echo "🔄 Restarting SSH service..."
systemctl restart sshd
systemctl status sshd --no-pager
echo ""

# 5. Show final configuration
echo "✅ Final SSH configuration:"
cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)"
echo ""

# 6. Check if SSH is listening
echo "🔍 Checking if SSH is listening:"
netstat -tulpn | grep :22
echo ""

# 7. Set a temporary root password if needed
echo "🔑 Setting temporary root password..."
echo "root:TempPass123!" | chpasswd
echo "Temporary password set: TempPass123!"
echo ""

# 8. Test SSH locally
echo "🔍 Testing SSH locally..."
ssh -o StrictHostKeyChecking=no root@localhost "echo 'Local SSH test successful'" || echo "Local SSH test failed"
echo ""

echo "=== SSH CONFIGURATION COMPLETE ==="
echo ""
echo "Now try SSH from your local machine:"
echo "ssh root@46.62.222.138"
echo "Password: TempPass123!"
echo ""
echo "After successful SSH connection, change the password immediately!"