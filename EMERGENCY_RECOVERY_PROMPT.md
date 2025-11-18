# 🚨 EMERGENCY: CEP Comunicación Server Recovery & Security Hardening

## 📋 **MISSION BRIEF**

**Server IP**: 46.62.222.138  
**Provider**: Hetzner Cloud  
**Current Status**: SSH filtered, HTTP/HTTPS closed, Docker services stopped  
**Objective**: Restore secure access, complete deployment, implement security hardening

---

## 🔍 **CURRENT SITUATION ANALYSIS**

### Network Status (Last Known)

```
PORT    STATE    SERVICE
22/tcp  filtered ssh     ← BLOCKED by firewall
80/tcp  closed   http    ← No services running
443/tcp closed   https   ← No services running
```

### What's Completed

- ✅ System cleaned and ready
- ✅ Latest code with HeroCarousel cloned
- ✅ Docker images and configuration ready
- ✅ Recovery commands prepared

### What's Blocked

- ❌ SSH access (filtered by firewall)
- ❌ HTTP/HTTPS services (not started)
- ❌ Docker containers (all stopped)
- ❌ HeroCarousel deployment (pending)

---

## 🎯 **PRIMARY MISSION OBJECTIVES**

### Phase 1: Access Recovery (IMMEDIATE)

1. **Restore SSH Access** - Open port 22 with security restrictions
2. **Setup Temporary FTP** - Port 21 for backup file transfers if needed
3. **Implement IP Whitelist** - Restrict access to specific IPs only
4. **Verify System Integrity** - Check if server is compromised

### Phase 2: Service Deployment

1. **Start Docker Services** - Execute recovery commands
2. **Verify HeroCarousel** - Ensure frontend displays carousel
3. **Test All Endpoints** - Frontend, CMS, Admin panels
4. **Configure SSL** - Setup HTTPS if not already done

### Phase 3: Security Hardening

1. **Implement Fail2Ban** - Block brute force attempts
2. **Configure UFW Firewall** - Restrictive rules only
3. **Setup SSH Key Authentication** - Disable password auth
4. **Create Security Audit** - Document all changes

---

## 🔧 **TECHNICAL EXECUTION PLAN**

### Step 1: Access Hetzner Console

```bash
# Go to https://console.hetzner.cloud/
# Login to your account
# Navigate to Servers → cepcomunicacion-vps
# Click "Console" or "Rescue" tab
# Launch VNC/Serial console
```

### Step 2: Initial System Diagnosis

```bash
# Check system status
whoami
pwd
uptime
free -h
df -h

# Check what's running
ps aux | grep -E "(ssh|docker|nginx|ufw|iptables)"
systemctl status ssh docker nginx ufw

# Check network interfaces
ip addr show
netstat -tulpn | grep LISTEN

# Check firewall rules
ufw status verbose
iptables -L -n
iptables -t nat -L -n

# Check recent logs for issues
journalctl -xe --since "1 hour ago" | grep -E "(ssh|firewall|network|docker)"
last -n 20
```

### Step 3: SSH Access Recovery & Security

```bash
# 1. Check SSH configuration
cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|AllowUsers)"

# 2. Ensure SSH is running on port 22
systemctl restart sshd
systemctl enable sshd

# 3. Configure UFW firewall with restrictive rules
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# 4. ALLOW SSH FROM YOUR IP ONLY (REPLACE WITH YOUR ACTUAL IP)
# Get your public IP first: curl -s ifconfig.me
YOUR_PUBLIC_IP="REPLACE_WITH_YOUR_IP"  # ← IMPORTANT: REPLACE THIS

ufw allow from $YOUR_PUBLIC_IP to any port 22 proto tcp comment "SSH from admin IP"
ufw allow from $YOUR_PUBLIC_IP to any port 21 proto tcp comment "FTP from admin IP"

# 5. Allow web traffic from anywhere
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"

# 6. Enable firewall
ufw --force enable
ufw status verbose

# 7. Test SSH connectivity (from another terminal)
# ssh root@46.62.222.138

# 8. Setup FTP for emergency access (if needed)
apt update && apt install -y vsftpd
systemctl start vsftpd
systemctl enable vsftpd

# Configure vsftpd for secure access
cat > /etc/vsftpd.conf << 'EOF'
listen=YES
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
allow_writeable_chroot=YES
pasv_min_port=40000
pasv_max_port=40100
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO
EOF

# Create FTP user list
echo "root" > /etc/vsftpd.userlist
systemctl restart vsftpd

# 9. Open FTP ports in firewall
ufw allow from $YOUR_PUBLIC_IP to any port 20:21 proto tcp comment "FTP from admin IP"
ufw allow from $YOUR_PUBLIC_IP to any port 40000:40100 proto tcp comment "FTP passive from admin IP"
```

### Step 4: Docker Service Recovery

```bash
# Navigate to project
cd /var/www/cepcomunicacion || cd /opt/cepcomunicacion

# Check if project exists
ls -la
cat docker-compose.yml | head -20

# Start services in sequence
echo "Starting core services..."
docker-compose up -d postgres redis minio

sleep 30
docker-compose ps

echo "Starting CMS..."
docker-compose up -d cms

sleep 30
docker-compose ps

echo "Starting applications..."
docker-compose up -d frontend admin

sleep 20
docker-compose ps

echo "Starting reverse proxy..."
docker-compose up -d nginx

# Final status
docker-compose ps
docker-compose logs --tail=10
```

### Step 5: Service Verification

```bash
# Check local services
curl -I http://localhost
curl -I http://localhost:3000
curl -I http://localhost:3001

# Check HeroCarousel
curl -s http://localhost | grep -i "carousel\|hero" || echo "HeroCarousel not found"

# Check public access
curl -I http://46.62.222.138/
curl -I http://46.62.222.138:3000
curl -I http://46.62.222.138:3001

# Test from external (your local machine)
# curl -I http://46.62.222.138/
# curl -s http://46.62.222.138/ | grep -i carousel
```

### Step 6: Security Hardening

```bash
# 1. Install and configure Fail2Ban
apt update && apt install -y fail2ban

# Configure Fail2Ban
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
destemail = admin@cepcomunicacion.com
sender = fail2ban@cepcomunicacion.com
mta = sendmail

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600
EOF

systemctl enable fail2ban
systemctl start fail2ban
fail2ban-client status

# 2. SSH Key Authentication Setup
mkdir -p /root/.ssh
chmod 700 /root/.ssh

# Generate SSH key if not exists
if [ ! -f /root/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -f /root/.ssh/id_rsa -N "" -C "admin@cepcomunicacion.com"
fi

# Configure SSH for key-only auth
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

# Restart SSH
systemctl restart sshd

# 3. Create security audit
cat > /root/security_audit_$(date +%Y%m%d_%H%M%S).log << 'EOF'
=== CEP COMUNICACIÓN SECURITY AUDIT ===
Date: $(date)
Server: 46.62.222.138

FIREWALL STATUS:
$(ufw status verbose)

SSH CONFIGURATION:
$(cat /etc/ssh/sshd_config | grep -E "(Port|PermitRootLogin|PasswordAuthentication|PubkeyAuthentication)")

FAIL2BAN STATUS:
$(fail2ban-client status)

DOCKER CONTAINERS:
$(docker-compose ps)

OPEN PORTS:
$(netstat -tulpn | grep LISTEN)

RECENT LOGINS:
$(last -n 10)

SYSTEM UPTIME:
$(uptime)

=== END AUDIT ===
EOF

echo "Security audit saved to /root/security_audit_*.log"
```

### Step 7: Final Verification & Cleanup

```bash
# 1. Remove FTP if no longer needed
systemctl stop vsftpd
systemctl disable vsftpd
apt remove --purge -y vsftpd
ufw delete allow from $YOUR_PUBLIC_IP to any port 20:21 proto tcp
ufw delete allow from $YOUR_PUBLIC_IP to any port 40000:40100 proto tcp

# 2. Final security check
echo "=== FINAL SECURITY STATUS ==="
ufw status verbose
fail2ban-client status
systemctl status sshd fail2ban

# 3. Final service check
echo "=== FINAL SERVICE STATUS ==="
docker-compose ps
curl -I http://46.62.222.138/
curl -s http://46.62.222.138/ | grep -i carousel

echo "=== RECOVERY COMPLETE ==="
echo "Frontend: http://46.62.222.138/"
echo "CMS: http://46.62.222.138:3000/admin"
echo "Admin: http://46.62.222.138:3001"
echo "SSH: ssh root@46.62.222.138 (from whitelisted IP only)"
```

---

## 🚨 **CRITICAL SECURITY NOTES**

### ⚠️ **IMMEDIATE ACTIONS REQUIRED**

1. **REPLACE `$YOUR_PUBLIC_IP`** with your actual public IP address
2. **Generate SSH keys** and disable password authentication
3. **Implement IP whitelisting** - don't allow SSH from anywhere
4. **Remove FTP** after emergency use - it's insecure

### 🔒 **SECURITY BEST PRACTICES**

- SSH port 22 only from whitelisted IPs
- Password authentication disabled
- Fail2Ban active and configured
- UFW firewall in deny-by-default mode
- Regular security audits
- Monitor logs for suspicious activity

### 📋 **VERIFICATION CHECKLIST**

- [ ] SSH access restored from whitelisted IP only
- [ ] Docker services running healthy
- [ ] HeroCarousel visible on frontend
- [ ] All endpoints responding correctly
- [ ] Firewall configured restrictively
- [ ] Fail2Ban active and blocking
- [ ] FTP removed after emergency use
- [ ] Security audit completed
- [ ] SSL certificates configured (if needed)

---

## 🎯 **SUCCESS CRITERIA**

### Technical Success

- ✅ SSH accessible only from whitelisted IP
- ✅ All Docker containers running healthy
- ✅ HeroCarousel displaying 6 images on frontend
- ✅ CMS API functional at port 3000
- ✅ Admin panel functional at port 3001
- ✅ Security hardening implemented

### Security Success

- ✅ No unauthorized access points
- ✅ Fail2Ban blocking brute force attempts
- ✅ Firewall in deny-by-default mode
- ✅ SSH key authentication only
- ✅ Complete security audit documented

---

**EXECUTION ORDER**: Hetzner Console → System Diagnosis → SSH Recovery → Docker Services → Security Hardening → Final Verification

**ESTIMATED TIME**: 30-45 minutes for complete recovery and hardening

**RISK LEVEL**: Medium - Server appears intact, just blocked by firewall rules
