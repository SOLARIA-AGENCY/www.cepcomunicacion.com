# Server Optimization - Deployment Guide

**Quick Reference for Uploading and Executing Optimization Package**

---

## Method 1: Upload via SCP (Recommended)

### From Local Machine

```bash
# Navigate to project root
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com

# Upload entire optimization directory
scp -r infra/optimization root@46.62.222.138:/root/server-optimization

# Verify upload
ssh root@46.62.222.138 "ls -lh /root/server-optimization/"
```

### Make Scripts Executable

```bash
ssh root@46.62.222.138

cd /root/server-optimization
chmod +x pre-optimization-check.sh
chmod +x optimize-server.sh
chmod +x post-optimization-check.sh

# Verify permissions
ls -lh *.sh
```

---

## Method 2: Direct Git Clone on Server

### On Server

```bash
ssh root@46.62.222.138

# Install git if not present
apt-get update && apt-get install -y git

# Clone repository
cd /root
git clone https://github.com/your-repo/cepcomunicacion.git

# Copy optimization files
cp -r cepcomunicacion/infra/optimization /root/server-optimization
cd /root/server-optimization

# Make executable
chmod +x *.sh
```

---

## Method 3: Manual Copy-Paste (if network issues)

### On Server

```bash
ssh root@46.62.222.138

# Create directory
mkdir -p /root/server-optimization
cd /root/server-optimization

# Create first script
cat > pre-optimization-check.sh << 'EOFSCRIPT'
# (paste entire contents of pre-optimization-check.sh here)
EOFSCRIPT

# Create second script
cat > optimize-server.sh << 'EOFSCRIPT'
# (paste entire contents of optimize-server.sh here)
EOFSCRIPT

# Create third script
cat > post-optimization-check.sh << 'EOFSCRIPT'
# (paste entire contents of post-optimization-check.sh here)
EOFSCRIPT

# Make executable
chmod +x *.sh

# Verify
ls -lh *.sh
```

---

## Execution Sequence

### Step-by-Step

```bash
# 1. SSH into server
ssh root@46.62.222.138

# 2. Navigate to directory
cd /root/server-optimization

# 3. Run baseline check (10 minutes)
./pre-optimization-check.sh

# 4. Review baseline report
cat baseline/baseline-report-*.txt | less

# 5. Run optimization (30 minutes)
./optimize-server.sh
# When prompted, type 'y' to confirm

# 6. Reboot server (5 minutes downtime)
reboot

# 7. Wait 2-3 minutes, then reconnect
ssh root@46.62.222.138

# 8. Verify optimizations (10 minutes)
cd /root/server-optimization
./post-optimization-check.sh

# 9. Review results
cat post-optimization/comparison-report-*.txt
```

---

## One-Liner Execution (After Upload)

```bash
ssh root@46.62.222.138 "cd /root/server-optimization && ./pre-optimization-check.sh && ./optimize-server.sh && echo 'Reboot required: sudo reboot'"
```

**Note:** Still requires manual reboot and post-check.

---

## Verification Commands

### Verify Upload Success

```bash
ssh root@46.62.222.138 "ls -lh /root/server-optimization/"
```

**Expected output:**
- 3 shell scripts (*.sh)
- 4 markdown files (*.md)
- All files should be present

### Verify Execute Permissions

```bash
ssh root@46.62.222.138 "ls -l /root/server-optimization/*.sh"
```

**Expected output:**
- `-rwxr-xr-x` (executable flag set)

### Verify Disk Space

```bash
ssh root@46.62.222.138 "df -h /"
```

**Expected output:**
- At least 5 GB available (for 4 GB swap + overhead)

---

## Troubleshooting Upload

### Issue: Permission Denied

```bash
# Ensure SSH key is loaded
ssh-add -l

# Try with password if key fails
scp -r -o PreferredAuthentications=password infra/optimization root@46.62.222.138:/root/server-optimization
```

### Issue: Connection Refused

```bash
# Verify server is accessible
ping 46.62.222.138

# Check SSH service
ssh -v root@46.62.222.138
```

### Issue: Files Not Executable

```bash
# Fix permissions remotely
ssh root@46.62.222.138 "chmod +x /root/server-optimization/*.sh"

# Verify
ssh root@46.62.222.138 "ls -l /root/server-optimization/*.sh"
```

---

## Post-Deployment Checklist

After running all scripts:

- [ ] Baseline report generated
- [ ] Optimization completed without errors
- [ ] Server rebooted successfully
- [ ] Post-optimization report shows all green checkmarks
- [ ] Swap active: `swapon --show` → 4 GB
- [ ] Swappiness set: `sysctl vm.swappiness` → 10
- [ ] BBR enabled: `sysctl net.ipv4.tcp_congestion_control` → bbr
- [ ] File descriptors: `ulimit -n` → 65536
- [ ] No errors in logs: `journalctl -p err --since "1 hour ago"`

---

## Quick Health Check

```bash
# One command to check everything
ssh root@46.62.222.138 "echo '=== SWAP ===' && swapon --show && echo && echo '=== MEMORY ===' && free -h && echo && echo '=== KERNEL PARAMS ===' && sysctl vm.swappiness net.ipv4.tcp_congestion_control fs.file-max && echo && echo '=== FILE DESCRIPTORS ===' && ulimit -n && echo && echo '=== LOAD ===' && uptime"
```

---

## Rollback (If Needed)

```bash
ssh root@46.62.222.138

cd /root/server-optimization/config-backups

# Restore all configs
cp sysctl.conf.*.bak /etc/sysctl.conf
cp limits.conf.*.bak /etc/security/limits.conf
cp system.conf.*.bak /etc/systemd/system.conf
cp user.conf.*.bak /etc/systemd/user.conf

# Apply
sysctl -p
systemctl daemon-reload

# Remove swap
swapoff /swapfile
rm /swapfile
sed -i '/swapfile/d' /etc/fstab

# Reboot
reboot
```

---

## File Locations After Deployment

```
Server: root@46.62.222.138

/root/server-optimization/
├── Scripts (executable)
│   ├── pre-optimization-check.sh
│   ├── optimize-server.sh
│   └── post-optimization-check.sh
│
├── Documentation (reference)
│   ├── SERVER_OPTIMIZATION_REPORT.md
│   ├── OPTIMIZATION_CHECKLIST.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── README.md
│   └── DEPLOY.md (this file)
│
├── Generated Reports (after execution)
│   ├── baseline/
│   ├── post-optimization/
│   ├── config-backups/
│   ├── optimization-*.log
│   └── optimization-summary-*.txt
│
└── Monitoring (after optimization)
    └── /root/scripts/daily-health-check.sh
```

---

## Support

**Issues during deployment:**
- Email: charlie@solaria.agency
- Server: CEPCOMUNICACION-PROD (46.62.222.138)
- Documentation: See SERVER_OPTIMIZATION_REPORT.md

---

**Deployment Status:** Ready for Upload
**Estimated Upload Time:** < 1 minute (small text files)
**Total Package Size:** ~200 KB
