# SERVER OPTIMIZATION CHECKLIST

**Project:** CEPComunicacion v2
**Server:** CEPCOMUNICACION-PROD (Hetzner VPS - 46.62.222.138)
**Date:** 2025-11-03
**Operator:** _______________ (Sign/Initial)

---

## Overview

This checklist provides a step-by-step procedure for optimizing the production server. Follow each step sequentially and check off completed items. **Do not skip steps.**

**Estimated Total Time:** 60-90 minutes
**Required Access:** Root SSH access
**Prerequisites:**
- [ ] SSH access confirmed
- [ ] Baseline backup of server configuration
- [ ] Downtime window scheduled (if needed)
- [ ] Rollback plan reviewed

---

## Phase 1: Pre-Optimization (15-20 minutes)

### 1.1 Access & Verification

- [ ] SSH into server: `ssh root@46.62.222.138`
- [ ] Verify correct server: `hostname` → should show `CEPCOMUNICACION-PROD`
- [ ] Check available disk space: `df -h /` → need 5+ GB free
- [ ] Check current uptime: `uptime`
- [ ] Note current time: _____________ (for reference)

**Expected Results:**
- Hostname matches `CEPCOMUNICACION-PROD`
- At least 5 GB free disk space
- Server responsive and accessible

**Stop if:** Unable to access server or insufficient disk space

---

### 1.2 Download Optimization Scripts

- [ ] Create working directory: `mkdir -p /root/server-optimization && cd /root/server-optimization`
- [ ] Upload scripts to server (via SCP, Git, or copy-paste):
  - [ ] `pre-optimization-check.sh`
  - [ ] `optimize-server.sh`
  - [ ] `post-optimization-check.sh`
- [ ] Make scripts executable:
  ```bash
  chmod +x pre-optimization-check.sh
  chmod +x optimize-server.sh
  chmod +x post-optimization-check.sh
  ```
- [ ] Verify scripts exist: `ls -lh *.sh`

**Expected Results:**
- All 3 scripts present
- Scripts have execute permissions (rwxr-xr-x)

**Stop if:** Scripts missing or cannot be made executable

---

### 1.3 Run Baseline Check

- [ ] Start baseline capture: `./pre-optimization-check.sh`
- [ ] Wait for completion (5-10 minutes)
- [ ] Verify report generated: `ls -lh baseline/baseline-report-*.txt`
- [ ] Quick review of report: `cat baseline/baseline-report-*.txt | less`

**Key Items to Note from Baseline:**
- [ ] Current swap: _______ GB (should be 0)
- [ ] Current swappiness: _______ (default likely 60)
- [ ] Current file-max: _______ (default ~100K)
- [ ] Current somaxconn: _______ (default 128-4096)
- [ ] TCP congestion control: _______ (default cubic)

**Expected Results:**
- Baseline report created
- No errors during capture
- All critical metrics documented

**Stop if:** Baseline script fails or reports errors

---

### 1.4 Review Current State

- [ ] Check current memory usage: `free -h`
  - Total RAM: _______ (should be ~3.7 GB)
  - Used RAM: _______
  - Swap: _______ (should be 0)

- [ ] Check current resource usage: `htop` (press q to quit)
  - CPU usage: _______%
  - Memory usage: _______%

- [ ] Check running services: `systemctl list-units --type=service --state=running | wc -l`
  - Running services: _______

- [ ] Check disk usage: `df -h /`
  - Used: _______
  - Available: _______

**Document Baseline Metrics:**
```
Date/Time: _________________
CPU Load: _________________
Memory Used: ______________
Disk Used: ________________
Running Services: _________
```

**Stop if:** Server under heavy load (CPU >80% or Memory >90%) - wait for quiet period

---

## Phase 2: Apply Optimizations (20-30 minutes)

### 2.1 Pre-Optimization Safety Check

- [ ] Verify no critical applications running: `docker ps` (should be empty or only monitoring)
- [ ] Verify sufficient disk space: `df -h /` → need 5+ GB
- [ ] Verify SSH session stable (no network issues)
- [ ] Open secondary SSH session as backup (in case primary disconnects)

**IMPORTANT:** Keep at least 2 SSH sessions open during optimization

**Stop if:** Critical applications running or network unstable

---

### 2.2 Run Optimization Script

- [ ] Navigate to optimization directory: `cd /root/server-optimization`
- [ ] Start optimization: `./optimize-server.sh`
- [ ] **Read the warning message**
- [ ] Confirm when prompted: Type `y` and press Enter
- [ ] Monitor progress (script will output color-coded status messages)

**Script will perform:**
1. [ ] Create 4 GB swap file (takes 2-3 minutes)
2. [ ] Apply kernel parameters
3. [ ] Configure file descriptor limits
4. [ ] Set systemd limits
5. [ ] Optimize disk I/O
6. [ ] Disable unnecessary services
7. [ ] Configure journald
8. [ ] Set timezone to Europe/Madrid
9. [ ] Enable NTP synchronization
10. [ ] Install monitoring tools
11. [ ] Configure Docker daemon
12. [ ] Apply security hardening
13. [ ] Run verification
14. [ ] Generate summary

**Expected Duration:** 20-30 minutes

**Watch for:**
- Green checkmarks (✓) = success
- Yellow warnings (⚠) = non-critical issues
- Red errors (✗) = critical issues (script should stop)

**Stop if:** Red errors appear - review error message and consult troubleshooting section

---

### 2.3 Verify Optimization Completion

- [ ] Script completed without errors
- [ ] Summary displayed at end
- [ ] Optimization log exists: `ls -lh optimization-*.log`
- [ ] Review summary: `cat /root/server-optimization/optimization-summary-*.txt`

**Key Verifications (from script output):**
- [ ] Swap created: 4 GB
- [ ] Swappiness set: 10
- [ ] BBR enabled: yes
- [ ] File-max increased: 2,097,152
- [ ] Monitoring tools installed: yes

**Expected Results:**
- All steps show green checkmarks
- Summary report generated
- No critical errors

**Stop if:** Critical errors in summary or missing components

---

### 2.4 Final Pre-Reboot Check

- [ ] Verify swap active: `swapon --show` → should show /swapfile 4G
- [ ] Verify kernel params written: `tail -50 /etc/sysctl.conf` → should see optimizations
- [ ] Verify limits configured: `tail -20 /etc/security/limits.conf` → should see 65536
- [ ] Check backup files exist: `ls -lh /root/server-optimization/config-backups/`

**Expected Results:**
- All configuration files modified
- Backups created with timestamps
- Swap active (but usage should be 0%)

**Stop if:** Configuration files not modified or backups missing

---

## Phase 3: Reboot & Verification (10-15 minutes)

### 3.1 Prepare for Reboot

- [ ] Close all non-essential applications
- [ ] Note current time: _____________
- [ ] Ensure you have alternative access method (if needed)
- [ ] **IMPORTANT:** You will lose SSH connection - this is expected

**Reboot Command:**
```bash
reboot
```

- [ ] Execute reboot: `reboot`
- [ ] Note time of reboot: _____________

**Expected:** SSH connection will drop immediately

---

### 3.2 Wait for Server Recovery

- [ ] Wait 2-3 minutes for server to restart
- [ ] Attempt SSH reconnection: `ssh root@46.62.222.138`
- [ ] If connection refused, wait another 1-2 minutes and retry
- [ ] Maximum wait time: 5 minutes

**Expected:** Server boots within 2-3 minutes

**Escalate if:** Server not accessible after 5 minutes (contact Hetzner support)

---

### 3.3 Verify Boot Success

- [ ] Successfully connected via SSH
- [ ] Check uptime: `uptime` → should show recent boot time
- [ ] Check for boot errors: `journalctl -b | grep -i error | wc -l`
  - Error count: _______ (should be low, <10)
- [ ] Review critical errors (if any): `journalctl -b | grep -i error | less`

**Expected Results:**
- Server booted successfully
- Minimal/no errors in boot logs
- Uptime shows recent restart

**Stop if:** Many errors (>20) or critical service failures

---

### 3.4 Verify Core Services

- [ ] Check systemd status: `systemctl status` → should be "running"
- [ ] Check disk mounted: `df -h /` → should show filesystem
- [ ] Check network: `ip addr` → should show IP 46.62.222.138
- [ ] Check DNS resolution: `ping -c 3 google.com` → should work

**Expected Results:**
- All core services operational
- Network connectivity confirmed

**Stop if:** Core services failed or no network connectivity

---

### 3.5 Run Post-Optimization Check

- [ ] Navigate to directory: `cd /root/server-optimization`
- [ ] Run verification script: `./post-optimization-check.sh`
- [ ] Wait for completion (5-10 minutes)
- [ ] Review output for any red errors (✗)

**Script will verify:**
1. [ ] Swap configuration
2. [ ] Kernel parameters
3. [ ] File descriptor limits
4. [ ] systemd limits
5. [ ] Disk I/O optimization
6. [ ] Network optimization
7. [ ] Service optimization
8. [ ] Timezone configuration
9. [ ] Monitoring tools
10. [ ] Performance metrics collection
11. [ ] Generate comparison report

**Expected Results:**
- All verifications pass (green checkmarks)
- Comparison report shows improvements
- No critical errors

**Stop if:** Multiple verification failures - proceed to rollback section

---

### 3.6 Verify Optimization Success

**Swap Configuration:**
- [ ] Check swap active: `swapon --show`
  - Size: _______ (should be 4G)
  - Used: _______ (should be 0B or very low)
- [ ] Check swappiness: `sysctl vm.swappiness`
  - Value: _______ (should be 10)

**Kernel Parameters:**
- [ ] Check BBR: `sysctl net.ipv4.tcp_congestion_control`
  - Value: _______ (should be bbr)
- [ ] Check somaxconn: `sysctl net.core.somaxconn`
  - Value: _______ (should be 4096)
- [ ] Check file-max: `sysctl fs.file-max`
  - Value: _______ (should be 2097152)

**File Descriptors:**
- [ ] Check limits: `ulimit -Sn` and `ulimit -Hn`
  - Soft: _______ (should be 65536)
  - Hard: _______ (should be 65536)

**Disk I/O:**
- [ ] Check scheduler: `cat /sys/block/sda/queue/scheduler`
  - Value: _______ (should have [mq-deadline] in brackets)
- [ ] Check fstrim: `systemctl status fstrim.timer`
  - Status: _______ (should be active/enabled)

**Services:**
- [ ] Verify snapd disabled: `systemctl is-enabled snapd.service 2>/dev/null || echo "disabled"`
  - Status: _______ (should be disabled or command fails)

**Monitoring Tools:**
- [ ] Check htop: `which htop` → should return /usr/bin/htop
- [ ] Check iotop: `which iotop` → should return /usr/bin/iotop
- [ ] Check nethogs: `which nethogs` → should return /usr/bin/nethogs

**Expected Results:**
- All parameters match target values
- All tools installed and accessible

**Stop if:** Critical parameters not applied (swap, BBR, file limits)

---

## Phase 4: Performance Testing (15-20 minutes)

### 4.1 Baseline Performance Metrics

**Memory Performance:**
- [ ] Check memory usage: `free -h`
  - Total: _______
  - Used: _______
  - Available: _______
  - Swap used: _______ (should be 0 or minimal)

**CPU Performance:**
- [ ] Check load average: `uptime`
  - 1 min: _______
  - 5 min: _______
  - 15 min: _______
  - Note: Should be <2.0 for 2 vCore system

**Disk I/O Performance:**
- [ ] Run I/O test: `dd if=/dev/zero of=/tmp/test.img bs=1M count=1024 oflag=direct`
  - Write speed: _______ MB/s
  - Expected: 200-500 MB/s for SSD
- [ ] Cleanup: `rm /tmp/test.img`

**Network Performance (loopback):**
- [ ] Install iperf3 (if not present): `apt-get install -y iperf3`
- [ ] Run server: `iperf3 -s -D` (daemon mode)
- [ ] Run test: `iperf3 -c localhost -t 10`
  - Throughput: _______ Gbps
  - Expected: >10 Gbps for loopback
- [ ] Kill server: `pkill iperf3`

**Document Performance Metrics:**
```
Date/Time: _________________
Memory Available: __________
CPU Load (1m): ____________
Disk Write: _______________
Network Throughput: _______
```

---

### 4.2 System Stability Check

- [ ] Monitor system for 5 minutes: `htop` (watch for anomalies)
  - CPU stable: _____ (yes/no)
  - Memory stable: _____ (yes/no)
  - No swap usage: _____ (yes/no)

- [ ] Check for errors in last 10 minutes: `journalctl --since "10 minutes ago" -p err --no-pager | wc -l`
  - Error count: _______ (should be 0)

- [ ] Check for OOM events: `journalctl -k | grep -i "out of memory" | wc -l`
  - OOM count: _______ (should be 0)

**Expected Results:**
- System stable
- No errors or OOM events
- Resources within normal ranges

**Stop if:** System unstable or frequent errors

---

### 4.3 Service Functionality Check

**If Docker is installed:**
- [ ] Check Docker status: `systemctl status docker`
  - Status: _______ (should be active)
- [ ] Test Docker: `docker run hello-world`
  - Result: _______ (should succeed)

**If PostgreSQL will be used:**
- [ ] Verify shared memory available: `cat /proc/sys/kernel/shmmax`
  - Value: _______ (should be 4294967296 = 4GB)

**If Nginx will be used:**
- [ ] Check file descriptor limits sufficient: `ulimit -n`
  - Value: _______ (should be 65536)

**Expected Results:**
- All services that will be used can access necessary resources
- No errors when testing

---

## Phase 5: Comparison & Documentation (10 minutes)

### 5.1 Review Comparison Report

- [ ] Open comparison report: `cat /root/server-optimization/post-optimization/comparison-report-*.txt`
- [ ] Review "KEY IMPROVEMENTS" section
- [ ] Verify all optimizations marked as complete (✓)

**Key Improvements to Verify:**
- [ ] Swap: Before (not configured) → After (4GB active)
- [ ] vm.swappiness: Before (60) → After (10)
- [ ] net.core.somaxconn: Before (128-4096) → After (4096)
- [ ] fs.file-max: Before (~100K) → After (2,097,152)
- [ ] TCP congestion control: Before (cubic) → After (bbr)

---

### 5.2 Document Final State

**Server Information:**
```
Hostname: CEPCOMUNICACION-PROD
IP: 46.62.222.138
Optimization Date: _______________
Optimization Time: _______________
Operator: _______________
```

**Optimization Results:**
```
Swap Created: _____ (4GB expected)
Kernel Parameters: _____ (applied/failed)
File Descriptors: _____ (65536 expected)
BBR Enabled: _____ (yes/no)
Monitoring Tools: _____ (installed/missing)
Services Disabled: _____ (list)
```

**Performance Comparison:**
```
Memory Available: Before _____ → After _____
CPU Load: Before _____ → After _____
Disk Write Speed: Before _____ → After _____
Open File Limit: Before _____ → After _____
```

**Issues Encountered:**
```
1. _________________________________
2. _________________________________
3. _________________________________
None: [ ]
```

---

### 5.3 Save Reports

- [ ] Copy reports to safe location: `cp -r /root/server-optimization ~/optimization-backup-$(date +%Y%m%d)`
- [ ] Verify backup: `ls -lh ~/optimization-backup-*/`
- [ ] Optional: Download reports to local machine via SCP:
  ```bash
  # From local machine
  scp -r root@46.62.222.138:/root/server-optimization ./server-optimization-backup
  ```

**Expected Results:**
- All reports backed up
- Backup verified and accessible

---

## Phase 6: Monitoring Setup (10 minutes)

### 6.1 Configure Daily Health Check

- [ ] Create scripts directory: `mkdir -p /root/scripts`
- [ ] Create health check script: `nano /root/scripts/daily-health-check.sh`
- [ ] Paste health check script (from documentation)
- [ ] Make executable: `chmod +x /root/scripts/daily-health-check.sh`
- [ ] Test script: `/root/scripts/daily-health-check.sh`
- [ ] Review output: `cat /var/log/health-check.log`

**Expected Results:**
- Script runs without errors
- Log file created with current status

---

### 6.2 Schedule Automated Checks

- [ ] Open crontab: `crontab -e`
- [ ] Add daily health check (runs at 9 AM):
  ```
  0 9 * * * /root/scripts/daily-health-check.sh
  ```
- [ ] Save and exit
- [ ] Verify cron job: `crontab -l`

**Expected Results:**
- Cron job scheduled
- Will run daily at 9:00 AM Europe/Madrid time

---

### 6.3 Set Up Monitoring Aliases

- [ ] Add helpful aliases to .bashrc: `nano ~/.bashrc`
- [ ] Add these lines at the end:
  ```bash
  # Server monitoring aliases
  alias memcheck='free -h && echo && swapon --show'
  alias diskcheck='df -h && echo && journalctl --disk-usage'
  alias loadcheck='uptime && echo && htop -d 50'
  alias dockercheck='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Size}}" && echo && docker stats --no-stream'
  ```
- [ ] Reload bashrc: `source ~/.bashrc`
- [ ] Test aliases: `memcheck`, `diskcheck`, `loadcheck`

**Expected Results:**
- Aliases work and display formatted information
- Easy access to monitoring commands

---

## Phase 7: Final Sign-Off (5 minutes)

### 7.1 Final Verification Checklist

**Critical Systems:**
- [ ] Server accessible via SSH
- [ ] Network connectivity working
- [ ] Disk space sufficient (>30 GB free)
- [ ] Memory usage normal (<70%)
- [ ] Swap configured but not used (<5%)
- [ ] No errors in system logs
- [ ] All core services running

**Optimization Verification:**
- [ ] Swap: 4 GB configured, swappiness=10
- [ ] Kernel parameters: all applied correctly
- [ ] File descriptors: 65,536 limit
- [ ] BBR congestion control: enabled
- [ ] Monitoring tools: all installed
- [ ] Unnecessary services: disabled
- [ ] Timezone: Europe/Madrid
- [ ] NTP: synchronized

**Documentation:**
- [ ] Baseline report saved
- [ ] Optimization log saved
- [ ] Post-optimization report saved
- [ ] Comparison report saved
- [ ] Backups verified
- [ ] Reports downloaded to local machine (optional but recommended)

---

### 7.2 Known Limitations & Notes

**Document any limitations or issues:**
```
1. _________________________________
2. _________________________________
3. _________________________________
None: [ ]
```

**Notes for future reference:**
```
__________________________________
__________________________________
__________________________________
```

---

### 7.3 Sign-Off

**Optimization Completed By:**
```
Name: _________________________
Date: _________________________
Time: _________________________
Signature: ____________________
```

**Verification Completed By:** (if different)
```
Name: _________________________
Date: _________________________
Time: _________________________
Signature: ____________________
```

**Status:** (check one)
- [ ] ✅ Optimization SUCCESSFUL - Production ready
- [ ] ⚠️ Optimization PARTIAL - Some issues remain (document above)
- [ ] ❌ Optimization FAILED - Rolled back (document reason)

**Next Steps:**
- [ ] Monitor server for 24-48 hours
- [ ] Deploy application stack
- [ ] Run application-specific performance tests
- [ ] Configure application monitoring (Prometheus/Grafana)
- [ ] Schedule first backup
- [ ] Document application deployment

---

## Emergency Rollback Procedure

**If critical issues arise, follow these steps immediately:**

### Immediate Rollback

1. **Restore sysctl parameters:**
   ```bash
   cd /root/server-optimization/config-backups
   cp sysctl.conf.*.bak /etc/sysctl.conf
   sysctl -p
   ```

2. **Restore limits:**
   ```bash
   cp limits.conf.*.bak /etc/security/limits.conf
   ```

3. **Restore systemd configs:**
   ```bash
   cp system.conf.*.bak /etc/systemd/system.conf
   cp user.conf.*.bak /etc/systemd/user.conf
   systemctl daemon-reload
   ```

4. **Disable swap:**
   ```bash
   swapoff /swapfile
   rm /swapfile
   sed -i '/swapfile/d' /etc/fstab
   ```

5. **Reboot:**
   ```bash
   reboot
   ```

**Document rollback:**
```
Rollback Date/Time: _______________
Reason: __________________________
Operator: _________________________
Systems Restored: _________________
```

---

## Troubleshooting Quick Reference

### Issue: Cannot SSH after reboot
**Solution:**
1. Wait full 5 minutes
2. Try ping: `ping 46.62.222.138`
3. Check Hetzner console (web-based access)
4. Contact Hetzner support if no response after 10 minutes

### Issue: High swap usage (>10%)
**Solution:**
1. Identify processes: `for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file; done | sort -k 2 -n -r | head`
2. Restart heavy processes
3. Consider reducing application memory limits

### Issue: "Too many open files" errors
**Solution:**
1. Verify limits: `ulimit -n` (should be 65536)
2. Re-login if limits not applied
3. Check application-specific limits

### Issue: Slow disk I/O
**Solution:**
1. Check scheduler: `cat /sys/block/sda/queue/scheduler`
2. Verify noatime: `mount | grep "on / "`
3. Run disk benchmark: `fio --name=test --rw=randread --bs=4k --size=1G --runtime=30`

### Issue: Network performance degraded
**Solution:**
1. Verify BBR: `sysctl net.ipv4.tcp_congestion_control`
2. Check for packet loss: `netstat -s | grep -i retrans`
3. Test with iperf3

---

## Post-Optimization Monitoring Schedule

### First 24 Hours
- [ ] Hour 1: Check all metrics
- [ ] Hour 4: Review logs for errors
- [ ] Hour 12: Performance check
- [ ] Hour 24: Full system review

### First Week
- [ ] Day 2: Resource usage trends
- [ ] Day 4: Swap usage check (should be minimal)
- [ ] Day 7: Weekly performance report

### First Month
- [ ] Week 2: Fine-tune parameters if needed
- [ ] Week 4: Monthly maintenance and review

---

## Appendix: Quick Command Reference

**System Status:**
```bash
uptime                  # Load average
free -h                 # Memory usage
df -h                   # Disk usage
htop                    # Interactive monitor
```

**Swap:**
```bash
swapon --show           # Swap status
swapon /swapfile        # Enable swap
swapoff /swapfile       # Disable swap
```

**Kernel Parameters:**
```bash
sysctl -a               # All parameters
sysctl vm.swappiness    # Check swappiness
sysctl -p               # Apply from file
```

**Limits:**
```bash
ulimit -a               # All limits
ulimit -n               # File descriptors
ulimit -Hn              # Hard limit
```

**Services:**
```bash
systemctl status <service>      # Service status
systemctl restart <service>     # Restart service
systemctl disable <service>     # Disable service
```

**Logs:**
```bash
journalctl -f                   # Follow logs
journalctl -b                   # Boot logs
journalctl -p err               # Errors only
journalctl --since "1 hour ago" # Recent logs
```

**Performance:**
```bash
iostat -x 1 5           # Disk I/O
iotop -o                # I/O by process
nethogs                 # Network by process
dstat -cdngy            # All-in-one stats
```

---

**END OF CHECKLIST**

**For support:** charlie@solaria.agency
**Documentation:** See SERVER_OPTIMIZATION_REPORT.md
**Scripts Location:** /root/server-optimization/
