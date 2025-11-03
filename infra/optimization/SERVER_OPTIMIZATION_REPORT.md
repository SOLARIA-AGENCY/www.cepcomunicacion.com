# SERVER OPTIMIZATION REPORT

**Project:** CEPComunicacion v2 Production Deployment
**Server:** CEPCOMUNICACION-PROD (Hetzner VPS)
**IP Address:** 46.62.222.138
**Date:** 2025-11-03
**Author:** SOLARIA AGENCY
**Status:** Production Optimization Plan

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Server Specifications](#server-specifications)
3. [Optimization Objectives](#optimization-objectives)
4. [Detailed Optimization Plan](#detailed-optimization-plan)
5. [Expected Performance Improvements](#expected-performance-improvements)
6. [Implementation Procedure](#implementation-procedure)
7. [Verification & Testing](#verification-testing)
8. [Monitoring Strategy](#monitoring-strategy)
9. [Rollback Procedures](#rollback-procedures)
10. [Maintenance & Tuning](#maintenance-tuning)

---

## Executive Summary

This document outlines a comprehensive optimization strategy for the CEPCOMUNICACION-PROD server before deploying the production stack (Next.js, PostgreSQL, Redis, Docker). The server is a fresh Ubuntu 24.04 installation requiring production-grade tuning.

### Critical Issues Identified

**CRITICAL (P0):**
- **No swap configured** - Server has 0 GB swap with only 3.7 GB RAM. This is dangerous for production.
- **Default kernel parameters** - Not optimized for web application workloads
- **Limited file descriptors** - Default 1024 limit insufficient for Docker + database + web server

**High Priority (P1):**
- Disk I/O not optimized for SSD
- Network stack using default settings
- Unnecessary services consuming resources
- No monitoring tools installed

### Optimization Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Swap | 0 GB | 4 GB | Emergency buffer added |
| File Descriptors | 1,024 | 65,536 | 64x increase |
| TCP Queue Size | 128 | 4,096 | 32x increase |
| Network Buffers | 212,992 | 16,777,216 | 78x increase |
| TCP Congestion Control | cubic | bbr | Modern algorithm |
| Max Open Files | ~1,000 | 2,097,152 | 2,000x increase |

---

## Server Specifications

### Hardware Configuration

```yaml
Provider: Hetzner
Location: Germany (likely)
Hostname: CEPCOMUNICACION-PROD
IP: 46.62.222.138
OS: Ubuntu 24.04.3 LTS (Noble Numbat)
Kernel: 6.8.0-71-generic
Architecture: x86_64
```

### Resource Allocation

```yaml
CPU:
  Cores: 2 vCores
  Processor: AMD (exact model not specified)
  Architecture: x86_64

Memory:
  Total RAM: 3.7 GB (3,812,340 KB)
  Available RAM: ~3.5 GB
  Swap: 0 GB (NOT CONFIGURED - CRITICAL)

Storage:
  Total: 38 GB SSD
  Used: 1.5 GB (4%)
  Available: 35 GB (96%)
  Type: SSD (block device: /dev/sda)
  Filesystem: ext4

Network:
  IPv4: 46.62.222.138
  IPv6: Enabled
  Bandwidth: Hetzner standard (likely 1 Gbps)
```

### Target Application Stack

```yaml
Applications:
  - Next.js 16 (Node.js 22.x)
  - PostgreSQL 16 (primary database)
  - Redis 7 (cache + BullMQ job queue)
  - Nginx (reverse proxy)
  - Docker Engine (containerization)
  - Docker Compose (orchestration)

Monitoring Stack (Future):
  - Prometheus (metrics collection)
  - Grafana (visualization)
  - Node Exporter (system metrics)
  - PostgreSQL Exporter
  - Redis Exporter
  - cAdvisor (container metrics)
```

---

## Optimization Objectives

### Primary Goals

1. **System Stability**
   - Prevent OOM (Out of Memory) kills
   - Handle memory pressure gracefully
   - Ensure application uptime

2. **Application Performance**
   - Fast response times (<200ms p95)
   - High concurrent connection handling (1,000+)
   - Efficient resource utilization

3. **Database Performance**
   - PostgreSQL optimized for 3.7 GB RAM
   - Efficient query execution
   - Proper shared memory allocation

4. **Network Throughput**
   - Optimize for HTTP/HTTPS traffic
   - Handle WebSocket connections
   - Support API request bursts

5. **Disk I/O Efficiency**
   - SSD-optimized I/O scheduler
   - Reduced write amplification
   - Efficient caching strategy

### Performance Targets

```yaml
Response Time:
  p50: < 50ms
  p95: < 200ms
  p99: < 500ms

Throughput:
  Requests/sec: 500+ (sustained)
  Concurrent connections: 1,000+
  Database queries/sec: 1,000+

Resource Utilization:
  CPU: < 70% average
  Memory: < 80% average
  Disk I/O: < 50% average
  Swap usage: < 5% (emergency only)

Availability:
  Uptime: 99.9% monthly
  MTTR: < 15 minutes
  Zero data loss on failures
```

---

## Detailed Optimization Plan

### 1. SWAP Configuration (CRITICAL)

#### Current State
- **Swap Size:** 0 GB
- **Risk Level:** CRITICAL
- **Impact:** Server will hard-crash on OOM events

#### Optimization Strategy

**Target Configuration:**
```bash
Swap Size: 4 GB
Swap File: /swapfile
Swappiness: 10 (minimize usage)
Cache Pressure: 50 (balanced)
```

**Rationale:**
- 4 GB = 1.08x RAM (recommended for systems with <4GB RAM)
- Swappiness=10 means swap will only be used when RAM is critically low
- This prevents OOM kills while minimizing swap I/O overhead

**Implementation:**
```bash
# Create swap file
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Make persistent
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Optimize swap behavior
sysctl -w vm.swappiness=10
sysctl -w vm.vfs_cache_pressure=50
```

**Verification:**
```bash
swapon --show
free -h
cat /proc/swaps
```

**Expected Results:**
- 4 GB swap available
- Swap usage: 0% under normal load
- Protection against memory spikes

---

### 2. Kernel Parameter Tuning (sysctl)

#### Network Optimization

**TCP Buffer Sizes:**
```bash
# Increase buffers for high-throughput connections
net.core.rmem_max=16777216          # 16MB receive buffer
net.core.wmem_max=16777216          # 16MB send buffer
net.ipv4.tcp_rmem=4096 87380 16777216  # Min, default, max
net.ipv4.tcp_wmem=4096 65536 16777216  # Min, default, max
```

**Rationale:** Default buffers (212 KB) are too small for modern networks. Larger buffers improve throughput for file uploads, API responses, and database queries.

**Connection Queue Sizes:**
```bash
net.core.somaxconn=4096             # Listen backlog
net.core.netdev_max_backlog=5000    # Network device backlog
net.ipv4.tcp_max_syn_backlog=8192   # SYN backlog
```

**Rationale:** Default queue sizes (128-512) cause connection drops under load. These values support 1,000+ concurrent connections.

**TCP Optimization:**
```bash
net.ipv4.tcp_fastopen=3              # Enable TFO (client + server)
net.ipv4.tcp_slow_start_after_idle=0 # Don't slow down idle connections
net.ipv4.tcp_tw_reuse=1              # Reuse TIME_WAIT sockets
net.ipv4.tcp_fin_timeout=15          # Reduce FIN timeout (default: 60)
net.ipv4.tcp_keepalive_time=300      # 5 minutes (default: 2 hours)
```

**Rationale:** These settings reduce latency, improve connection reuse, and handle connection churn efficiently.

**Port Range:**
```bash
net.ipv4.ip_local_port_range=1024 65535
```

**Rationale:** Increases available ephemeral ports from ~28,000 to ~64,000 for outbound connections.

**BBR Congestion Control:**
```bash
net.core.default_qdisc=fq           # Fair queueing
net.ipv4.tcp_congestion_control=bbr # Bottleneck Bandwidth and RTT
```

**Rationale:** BBR (developed by Google) provides better throughput and lower latency than cubic (default). Especially beneficial for high-latency connections.

#### Memory Management

**Swap Behavior:**
```bash
vm.swappiness=10                    # Minimize swap usage
vm.vfs_cache_pressure=50            # Balanced inode/dentry cache
```

**Rationale:**
- Swappiness=10: Only swap when RAM < 10% available
- Default (60) swaps too aggressively, causing unnecessary disk I/O

**Dirty Page Flushing:**
```bash
vm.dirty_ratio=15                   # Flush dirty pages at 15% RAM
vm.dirty_background_ratio=5         # Background flush at 5% RAM
vm.dirty_expire_centisecs=3000      # Expire dirty pages after 30s
vm.dirty_writeback_centisecs=500    # Check every 5s
```

**Rationale:** Reduces I/O latency spikes by flushing to disk more frequently. Critical for database write performance.

**Overcommit Strategy:**
```bash
vm.overcommit_memory=1              # Allow overcommit
vm.panic_on_oom=0                   # Don't panic on OOM
```

**Rationale:**
- Node.js and PostgreSQL allocate more virtual memory than they use
- Overcommit=1 allows this behavior
- Panic=0 prevents kernel panic (OOM killer will terminate processes instead)

#### File System Optimization

**File Descriptor Limits:**
```bash
fs.file-max=2097152                 # 2 million max open files
fs.inode-max=2097152                # 2 million max inodes
```

**Rationale:** Docker + PostgreSQL + Redis + Next.js can easily use 10,000+ file descriptors. Default (1024) is far too low.

**inotify Limits (Docker/Node.js):**
```bash
fs.inotify.max_user_watches=524288  # 500K watches (default: 8K)
fs.inotify.max_user_instances=512   # 512 instances (default: 128)
fs.inotify.max_queued_events=32768  # 32K queued events
```

**Rationale:** Docker and Node.js file watchers exhaust default limits. This prevents "too many open files" errors.

#### Shared Memory (PostgreSQL)

**Shared Memory Segments:**
```bash
kernel.shmmax=4294967296            # 4GB max segment size
kernel.shmall=1048576               # 4GB total (in pages)
```

**Rationale:** PostgreSQL uses shared memory for buffer cache. Default limits are too small for production databases.

#### Security Hardening

**SYN Flood Protection:**
```bash
net.ipv4.tcp_syncookies=1           # Enable SYN cookies
```

**Anti-Spoofing:**
```bash
net.ipv4.conf.all.rp_filter=1       # Reverse path filtering
net.ipv4.conf.default.rp_filter=1
```

**Ignore Malicious Packets:**
```bash
net.ipv4.conf.all.accept_redirects=0
net.ipv4.conf.all.accept_source_route=0
net.ipv4.conf.all.log_martians=1    # Log suspicious packets
```

---

### 3. File Descriptor Limits (ulimit)

#### Current State
```bash
Soft limit: 1024
Hard limit: 1024
```

#### Target Configuration
```bash
Soft limit: 65536
Hard limit: 65536
```

#### Implementation

**/etc/security/limits.conf:**
```bash
# All users
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536

# Root user
root soft nofile 65536
root hard nofile 65536

# PostgreSQL user (if exists)
postgres soft nofile 65536
postgres hard nofile 65536
```

**Rationale:**
- Docker containers inherit limits from host
- PostgreSQL needs high file descriptor count for connections
- Redis needs file descriptors for client connections
- Nginx needs file descriptors for concurrent requests

**Verification:**
```bash
ulimit -Sn  # Soft limit
ulimit -Hn  # Hard limit
cat /proc/$(pgrep postgres)/limits | grep "open files"
```

---

### 4. systemd Service Limits

#### Configuration Files

**/etc/systemd/system.conf:**
```ini
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
DefaultTasksMax=65536
```

**/etc/systemd/user.conf:**
```ini
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
```

**Rationale:** systemd services (Docker, PostgreSQL, Nginx) need higher limits. These settings apply to all systemd-managed services.

**Apply Changes:**
```bash
systemctl daemon-reload
```

---

### 5. Disk I/O Optimization

#### I/O Scheduler for SSD

**Current State:**
- Likely: `mq-deadline` or `none` (default for SSDs in newer kernels)

**Target Configuration:**
```bash
I/O Scheduler: mq-deadline (for SSD)
```

**Implementation:**

**/etc/udev/rules.d/60-scheduler.rules:**
```bash
# SSD optimization
ACTION=="add|change", KERNEL=="sd[a-z]", ATTR{queue/scheduler}="mq-deadline"
ACTION=="add|change", KERNEL=="nvme[0-9]n[0-9]", ATTR{queue/scheduler}="none"
```

**Immediate Application:**
```bash
echo "mq-deadline" > /sys/block/sda/queue/scheduler
```

**Rationale:**
- `mq-deadline` provides good balance for SSD workloads
- Better than `bfq` (designed for HDD) or `noop` (no scheduling)

#### SSD TRIM Support

**Enable Weekly TRIM:**
```bash
systemctl enable fstrim.timer
systemctl start fstrim.timer
```

**Rationale:** Periodic TRIM maintains SSD performance and longevity.

#### Filesystem Mount Options

**/etc/fstab Optimization:**
```bash
# Add noatime to root filesystem
/dev/sda1 / ext4 defaults,noatime,errors=remount-ro 0 1
```

**Rationale:**
- `noatime` disables access time updates (reduces writes by ~30%)
- Critical for SSD longevity and performance
- Safe for web applications (doesn't need access times)

**Apply Without Reboot:**
```bash
mount -o remount,noatime /
```

---

### 6. Disable Unnecessary Services

#### Services to Disable

```yaml
High Priority:
  - snapd.service (Snap package manager)
  - snapd.socket
  - ModemManager.service (USB modem support)

Medium Priority:
  - bluetooth.service (Bluetooth support)
  - cups.service (Print server)
  - cups-browsed.service
  - avahi-daemon.service (mDNS/Bonjour)
```

#### Implementation

```bash
# Disable and stop services
systemctl disable snapd.service snapd.socket
systemctl stop snapd.service snapd.socket
systemctl mask snapd.service  # Prevent auto-restart

systemctl disable ModemManager.service bluetooth.service
systemctl stop ModemManager.service bluetooth.service
```

**Expected RAM Savings:**
- snapd: ~80 MB
- ModemManager: ~20 MB
- bluetooth: ~10 MB
- **Total: ~110 MB** (3% of total RAM)

---

### 7. Journald Log Optimization

#### Current State
- Logs: Unlimited growth (can fill disk)

#### Target Configuration

**/etc/systemd/journald.conf:**
```ini
SystemMaxUse=500M        # Max 500MB disk usage
SystemMaxFileSize=100M   # Max 100MB per file
MaxRetentionSec=7day     # Keep logs for 7 days
```

**Rationale:**
- Default unlimited logs can fill 38 GB disk
- 500 MB is sufficient for troubleshooting
- 7-day retention balances disk space vs debugging needs

**Apply Changes:**
```bash
systemctl restart systemd-journald
```

**Verify:**
```bash
journalctl --disk-usage
```

---

### 8. Timezone & Time Synchronization

#### Timezone Configuration

```bash
timedatectl set-timezone Europe/Madrid
```

**Rationale:** CEP Formación is based in Spain. Correct timezone ensures:
- Accurate log timestamps
- Correct cron job execution
- Proper database timestamp handling

#### NTP Synchronization

**Enable systemd-timesyncd:**
```bash
timedatectl set-ntp true
```

**Or install chrony (better for VPS):**
```bash
apt-get install -y chrony
systemctl enable chrony
systemctl start chrony
```

**Verification:**
```bash
timedatectl
chronyc tracking  # If using chrony
```

---

### 9. Monitoring Tools Installation

#### Essential Tools

```yaml
Process Monitoring:
  - htop (interactive process viewer)
  - iotop (I/O by process)

Performance Analysis:
  - sysstat (iostat, mpstat, sar, pidstat)
  - dstat (versatile resource stats)

Network Monitoring:
  - nethogs (bandwidth by process)
  - bmon (network bandwidth monitor)

Disk Analysis:
  - ncdu (disk usage analyzer)
  - fio (disk I/O benchmarking)

General:
  - net-tools (netstat, ifconfig)
```

#### Installation

```bash
apt-get update
apt-get install -y htop iotop sysstat nethogs ncdu \
                   net-tools dstat bmon fio
```

#### Usage Examples

```bash
# CPU and memory
htop

# Disk I/O by process
iotop -o

# Network bandwidth by process
nethogs

# All-in-one stats
dstat -cdngy

# Disk usage
ncdu /

# I/O performance
iostat -x 1 5
```

---

### 10. Docker-Specific Optimizations

#### Docker Daemon Configuration

**/etc/docker/daemon.json:**
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 65536
    }
  },
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 5
}
```

**Rationale:**
- **Log rotation:** Prevents container logs from filling disk
- **overlay2:** Best storage driver for modern kernels
- **ulimits:** Ensures containers have sufficient file descriptors
- **Concurrency limits:** Prevents network saturation during pulls

#### Container Resource Limits

**Docker Compose Example:**
```yaml
services:
  postgres:
    image: postgres:16
    deploy:
      resources:
        limits:
          cpus: '1.0'      # 50% of 2 vCores
          memory: 1536M    # 40% of 3.7GB RAM
        reservations:
          cpus: '0.5'
          memory: 1024M
    ulimits:
      nofile:
        soft: 65536
        hard: 65536
```

---

### 11. Security Hardening

#### SSH Configuration

**/etc/ssh/sshd_config:**
```bash
PermitRootLogin prohibit-password  # Key-based auth only
PasswordAuthentication no          # Disable password login
PubkeyAuthentication yes
```

#### Automatic Security Updates

```bash
apt-get install -y unattended-upgrades
echo 'APT::Periodic::Update-Package-Lists "1";' > /etc/apt/apt.conf.d/20auto-upgrades
echo 'APT::Periodic::Unattended-Upgrade "1";' >> /etc/apt/apt.conf.d/20auto-upgrades
```

#### Restrictive umask

**/etc/profile:**
```bash
umask 027  # Files: 640, Directories: 750
```

#### Firewall (UFW) - Future Configuration

```bash
# To be configured after application deployment
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

---

## Expected Performance Improvements

### Memory Management

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| OOM Risk | High | Low | Emergency swap prevents crashes |
| Swap Usage | N/A | 0-5% | Only used under memory pressure |
| Cache Efficiency | Default | Optimized | Better inode/dentry cache balance |

### Network Performance

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Max Connections | ~500 | 4,096+ | 8x increase in concurrent connections |
| TCP Throughput | ~500 Mbps | ~900 Mbps | BBR congestion control |
| Connection Setup | ~1.5 ms | ~0.8 ms | TCP Fast Open |
| Port Exhaustion | Possible | Unlikely | 64K ephemeral ports |

### Disk I/O

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Random Read | Baseline | +15% | mq-deadline scheduler |
| Random Write | Baseline | +20% | Optimized dirty page flushing |
| SSD Lifespan | Baseline | +30% | TRIM + noatime |
| Write Latency | Variable | Consistent | Controlled dirty page ratio |

### Application Performance

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Next.js Response Time | Baseline | -20% | Network + disk optimizations |
| PostgreSQL QPS | Baseline | +40% | Shared memory + I/O tuning |
| Redis Latency | <1ms | <0.5ms | File descriptors + network |
| Docker Start Time | Baseline | -10% | Optimized storage driver |

### Resource Utilization

| Metric | Before | After | Impact |
|--------|--------|-------|--------|
| Idle RAM Usage | ~800 MB | ~690 MB | Disabled services (-110 MB) |
| Disk Space (Logs) | Unlimited | 500 MB | Journald limits |
| CPU Interrupts | Baseline | -15% | Network stack optimization |

---

## Implementation Procedure

### Phase 1: Pre-Optimization (15 minutes)

**Step 1.1: Backup Current Configuration**

```bash
# Create backup directory
mkdir -p /root/server-optimization/baseline
cd /root/server-optimization

# Backup configuration files
cp /etc/sysctl.conf baseline/sysctl.conf.bak
cp /etc/security/limits.conf baseline/limits.conf.bak
cp /etc/systemd/system.conf baseline/system.conf.bak
cp /etc/fstab baseline/fstab.bak

# Save all current sysctl values
sysctl -a > baseline/sysctl-all.txt 2>&1

# Save current resource usage
free -h > baseline/memory-before.txt
df -h > baseline/disk-before.txt
ulimit -a > baseline/ulimit-before.txt
```

**Step 1.2: Run Baseline Check Script**

```bash
# Make executable
chmod +x pre-optimization-check.sh

# Run baseline capture
./pre-optimization-check.sh

# Review output
cat /root/server-optimization/baseline/baseline-report-*.txt
```

**Expected Duration:** 10-15 minutes
**Risk Level:** None (read-only operations)

---

### Phase 2: Apply Optimizations (30 minutes)

**Step 2.1: Run Optimization Script**

```bash
# Make executable
chmod +x optimize-server.sh

# Run optimization (requires confirmation)
./optimize-server.sh
```

**The script will:**
1. Create 4 GB swap file
2. Apply kernel parameters to `/etc/sysctl.conf`
3. Configure file descriptor limits
4. Set systemd limits
5. Optimize disk I/O
6. Disable unnecessary services
7. Configure journald
8. Set timezone to Europe/Madrid
9. Enable NTP synchronization
10. Install monitoring tools
11. Configure Docker daemon
12. Apply security hardening

**Expected Duration:** 20-30 minutes
**Risk Level:** Low (all changes are reversible)

---

### Phase 3: Reboot & Verification (10 minutes)

**Step 3.1: Reboot Server**

```bash
# Reboot to apply all changes
reboot
```

**Wait:** 2-3 minutes for server to come back online

**Step 3.2: Verify Boot**

```bash
# SSH back into server
ssh root@46.62.222.138

# Check uptime
uptime

# Verify no errors in boot logs
journalctl -b | grep -i error
```

**Step 3.3: Run Post-Optimization Checks**

```bash
cd /root/server-optimization

# Make executable
chmod +x post-optimization-check.sh

# Run verification
./post-optimization-check.sh

# Review reports
cat /root/server-optimization/post-optimization/post-optimization-report-*.txt
cat /root/server-optimization/post-optimization/comparison-report-*.txt
```

**Expected Duration:** 5-10 minutes
**Risk Level:** None (verification only)

---

### Phase 4: Application Deployment Testing (variable)

**Step 4.1: Deploy Application Stack**

```bash
# Clone repository
git clone <repository-url>
cd cepcomunicacion

# Start Docker Compose
docker-compose up -d

# Monitor startup
docker-compose logs -f
```

**Step 4.2: Monitor Resource Usage**

```bash
# Watch system resources
htop

# Monitor Docker containers
docker stats

# Check swap usage (should be minimal)
watch -n 5 'free -h && swapon --show'
```

**Step 4.3: Load Testing**

```bash
# Install Apache Bench
apt-get install -y apache2-utils

# Test Next.js (adjust URL)
ab -n 1000 -c 50 http://localhost:3000/

# Test API endpoint
ab -n 1000 -c 50 http://localhost:3000/api/health
```

---

## Verification & Testing

### Automated Verification

The `post-optimization-check.sh` script verifies:

```yaml
Swap Configuration:
  - ✓ 4 GB swap file exists
  - ✓ Swap is active
  - ✓ Swappiness = 10
  - ✓ Cache pressure = 50
  - ✓ Entry in /etc/fstab

Kernel Parameters:
  - ✓ All sysctl values match targets
  - ✓ BBR congestion control active
  - ✓ File descriptor limits correct
  - ✓ Network buffers increased

File Descriptors:
  - ✓ Soft limit >= 65536
  - ✓ Hard limit >= 65536
  - ✓ /etc/security/limits.conf configured

systemd Limits:
  - ✓ DefaultLimitNOFILE = 65536
  - ✓ DefaultLimitNPROC = 65536

Disk I/O:
  - ✓ I/O scheduler = mq-deadline
  - ✓ fstrim.timer enabled
  - ✓ noatime in mount options

Services:
  - ✓ Unnecessary services disabled
  - ✓ RAM savings confirmed

Monitoring:
  - ✓ All tools installed
  - ✓ Commands available
```

### Manual Verification Commands

```bash
# Check swap
swapon --show
free -h

# Check kernel parameters
sysctl vm.swappiness
sysctl net.core.somaxconn
sysctl fs.file-max
sysctl net.ipv4.tcp_congestion_control

# Check file descriptors
ulimit -Sn
ulimit -Hn

# Check I/O scheduler
cat /sys/block/sda/queue/scheduler

# Check disabled services
systemctl list-units --type=service --state=running | grep -E "snapd|bluetooth|cups"

# Check journald
journalctl --disk-usage

# Check timezone
timedatectl

# Check open file descriptor usage
lsof | wc -l
```

### Performance Benchmarks

**Memory Performance:**
```bash
# Install sysbench
apt-get install -y sysbench

# Memory bandwidth test
sysbench memory --memory-total-size=1G run
```

**Disk Performance:**
```bash
# Sequential read
fio --name=seqread --rw=read --bs=1M --size=1G --runtime=30

# Sequential write
fio --name=seqwrite --rw=write --bs=1M --size=1G --runtime=30

# Random read IOPS
fio --name=randread --rw=randread --bs=4k --size=1G --runtime=30

# Random write IOPS
fio --name=randwrite --rw=randwrite --bs=4k --size=1G --runtime=30
```

**Network Performance:**
```bash
# Install iperf3
apt-get install -y iperf3

# Internal loopback test
iperf3 -s &  # Start server
iperf3 -c localhost -t 30  # Run test for 30 seconds
```

**Expected Benchmark Results:**

| Test | Expected Result |
|------|-----------------|
| Sequential Read | 300-500 MB/s (SSD) |
| Sequential Write | 250-400 MB/s (SSD) |
| Random Read IOPS | 20,000-40,000 IOPS |
| Random Write IOPS | 10,000-20,000 IOPS |
| Network Loopback | 10+ Gbps |

---

## Monitoring Strategy

### Real-Time Monitoring

**System Resources:**
```bash
# CPU, Memory, Disk, Network (all-in-one)
htop

# Detailed stats with history
dstat -cdngy 5

# I/O by process
iotop -o

# Network by process
nethogs eth0
```

**Application Monitoring:**
```bash
# Docker containers
docker stats

# PostgreSQL connections
docker exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Redis info
docker exec redis redis-cli info stats

# Next.js logs
docker-compose logs -f web
```

### Logging & Alerts

**Journald Queries:**
```bash
# Errors in last hour
journalctl --since "1 hour ago" -p err

# Follow all logs
journalctl -f

# Docker service logs
journalctl -u docker -f

# OOM events
journalctl -k | grep -i "out of memory"
```

**Log Files to Monitor:**
```bash
/var/log/syslog           # System events
/var/log/kern.log         # Kernel messages
/var/log/auth.log         # Authentication attempts
/var/log/nginx/access.log # Web traffic
/var/log/nginx/error.log  # Nginx errors
```

### Key Metrics to Track

**System Metrics:**
```yaml
CPU:
  - Load average (1, 5, 15 min)
  - CPU utilization by core
  - Context switches/sec
  - Interrupts/sec

Memory:
  - RAM usage (total, used, free, cached)
  - Swap usage (should be <5%)
  - OOM kills (should be 0)
  - Page faults/sec

Disk:
  - Disk usage (should be <80%)
  - I/O wait percentage
  - Read/Write throughput
  - IOPS (read + write)
  - Average latency

Network:
  - Bandwidth (in/out)
  - Packets/sec (in/out)
  - Errors/drops
  - Connection count
  - TCP retransmits
```

**Application Metrics:**
```yaml
Next.js:
  - Response time (p50, p95, p99)
  - Requests/sec
  - Error rate
  - Active connections
  - Memory usage (Node.js heap)

PostgreSQL:
  - Active connections
  - Queries/sec
  - Cache hit ratio (should be >95%)
  - Transaction rate
  - Deadlocks
  - Slow queries

Redis:
  - Memory usage
  - Hit rate (should be >90%)
  - Commands/sec
  - Connected clients
  - Evicted keys

Docker:
  - Container CPU usage
  - Container memory usage
  - Container restarts
  - Image disk usage
```

### Automated Monitoring Setup (Future)

**Prometheus + Grafana Stack:**

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"
    deploy:
      resources:
        limits:
          memory: 256M

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=<secure-password>
    deploy:
      resources:
        limits:
          memory: 128M

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    deploy:
      resources:
        limits:
          memory: 64M

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:latest
    environment:
      - DATA_SOURCE_NAME=postgresql://user:pass@postgres:5432/db?sslmode=disable
    deploy:
      resources:
        limits:
          memory: 64M

  redis-exporter:
    image: oliver006/redis_exporter:latest
    environment:
      - REDIS_ADDR=redis:6379
    deploy:
      resources:
        limits:
          memory: 64M

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    deploy:
      resources:
        limits:
          memory: 128M

volumes:
  prometheus-data:
  grafana-data:
```

**Alert Rules (prometheus.yml):**

```yaml
groups:
  - name: system_alerts
    interval: 30s
    rules:
      # CPU alerts
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        annotations:
          summary: "High CPU usage detected"

      # Memory alerts
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        annotations:
          summary: "High memory usage detected"

      # Swap alerts
      - alert: SwapUsage
        expr: (1 - (node_memory_SwapFree_bytes / node_memory_SwapTotal_bytes)) * 100 > 10
        for: 10m
        annotations:
          summary: "Swap is being used (should be minimal)"

      # Disk alerts
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 20
        for: 5m
        annotations:
          summary: "Disk space below 20%"

      # Application alerts
      - alert: PostgreSQLDown
        expr: pg_up == 0
        for: 1m
        annotations:
          summary: "PostgreSQL is down"

      - alert: RedisDown
        expr: redis_up == 0
        for: 1m
        annotations:
          summary: "Redis is down"
```

---

## Rollback Procedures

### Emergency Rollback (if system unstable)

**Step 1: Restore Configuration Files**

```bash
# Navigate to backup directory
cd /root/server-optimization/config-backups

# Find backup timestamp
ls -lh

# Restore sysctl
cp sysctl.conf.20251103_HHMMSS.bak /etc/sysctl.conf
sysctl -p

# Restore limits
cp limits.conf.20251103_HHMMSS.bak /etc/security/limits.conf

# Restore systemd
cp system.conf.20251103_HHMMSS.bak /etc/systemd/system.conf
cp user.conf.20251103_HHMMSS.bak /etc/systemd/user.conf
systemctl daemon-reload

# Restore fstab (if modified)
cp fstab.20251103_HHMMSS.bak /etc/fstab
```

**Step 2: Disable Swap**

```bash
# Turn off swap
swapoff /swapfile

# Remove swap file
rm /swapfile

# Remove from fstab
sed -i '/swapfile/d' /etc/fstab
```

**Step 3: Re-enable Services**

```bash
# Re-enable if needed
systemctl unmask snapd.service
systemctl enable snapd.service
systemctl start snapd.service
```

**Step 4: Reboot**

```bash
reboot
```

### Selective Rollback (individual components)

**Rollback Swap Only:**
```bash
swapoff /swapfile
rm /swapfile
sed -i '/swapfile/d' /etc/fstab
sysctl -w vm.swappiness=60  # Restore default
```

**Rollback Kernel Parameters:**
```bash
# Restore original sysctl.conf
cp /root/server-optimization/config-backups/sysctl.conf.*.bak /etc/sysctl.conf
sysctl -p
```

**Rollback File Descriptor Limits:**
```bash
# Restore original limits.conf
cp /root/server-optimization/config-backups/limits.conf.*.bak /etc/security/limits.conf
# Re-login for changes to take effect
```

**Rollback I/O Scheduler:**
```bash
# Revert to default (often 'none' for SSD)
echo "none" > /sys/block/sda/queue/scheduler

# Remove udev rule
rm /etc/udev/rules.d/60-scheduler.rules
```

### Validation After Rollback

```bash
# Verify swap disabled
swapon --show  # Should be empty

# Verify sysctl restored
sysctl -a | grep -E "swappiness|somaxconn|file-max"

# Verify limits restored
ulimit -a

# Check system stability
uptime
free -h
df -h
```

---

## Maintenance & Tuning

### Daily Checks (automated or manual)

```bash
#!/bin/bash
# /root/scripts/daily-health-check.sh

echo "=== Daily Health Check: $(date) ===" | tee -a /var/log/health-check.log

# Disk space
echo "Disk Usage:" | tee -a /var/log/health-check.log
df -h / | tee -a /var/log/health-check.log

# Memory
echo "Memory Usage:" | tee -a /var/log/health-check.log
free -h | tee -a /var/log/health-check.log

# Swap usage (should be minimal)
echo "Swap Usage:" | tee -a /var/log/health-check.log
swapon --show | tee -a /var/log/health-check.log

# Load average
echo "Load Average:" | tee -a /var/log/health-check.log
uptime | tee -a /var/log/health-check.log

# Docker containers
echo "Docker Status:" | tee -a /var/log/health-check.log
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Size}}" | tee -a /var/log/health-check.log

# Check for errors
echo "Recent Errors (last 24h):" | tee -a /var/log/health-check.log
journalctl --since "24 hours ago" -p err --no-pager | wc -l | tee -a /var/log/health-check.log

# Database connections
echo "PostgreSQL Connections:" | tee -a /var/log/health-check.log
docker exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tee -a /var/log/health-check.log

echo "========================================" | tee -a /var/log/health-check.log
```

**Schedule with cron:**
```bash
# Add to crontab
crontab -e

# Run daily at 9 AM
0 9 * * * /root/scripts/daily-health-check.sh
```

### Weekly Maintenance

**Week 1: Performance Review**
```bash
# Generate weekly report
sar -A > /root/reports/weekly-performance-$(date +%Y%m%d).txt

# Check disk I/O trends
iostat -x 1 10 > /root/reports/iostat-$(date +%Y%m%d).txt

# Review slow queries (PostgreSQL)
docker exec postgres psql -U postgres -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

**Week 2: Security Updates**
```bash
# Update packages
apt-get update
apt-get upgrade -y

# Check for security updates
apt-get upgrade -s | grep -i security

# Review auth logs
grep "Failed password" /var/log/auth.log | tail -50
```

**Week 3: Cleanup**
```bash
# Clean Docker
docker system prune -a --volumes --force

# Clean journald (keep last 7 days)
journalctl --vacuum-time=7d

# Clean package cache
apt-get autoclean
apt-get autoremove -y
```

**Week 4: Backup Verification**
```bash
# Test database backup restoration
# Verify backup files exist
# Check backup size and age
```

### Monthly Tuning

**Analyze Swap Usage:**
```bash
# Review swap usage over last month
sar -S | tail -30

# If swap usage consistently >5%, consider:
# 1. Reducing application memory limits
# 2. Optimizing code for memory efficiency
# 3. Adding more RAM (upgrade VPS tier)
```

**Review File Descriptor Usage:**
```bash
# Check peak file descriptor usage
lsof | wc -l

# If approaching 65,536:
# 1. Increase limits to 131,072
# 2. Investigate file descriptor leaks
```

**Network Performance Review:**
```bash
# Check TCP retransmits
netstat -s | grep retransmit

# If high retransmit rate:
# 1. Check network latency
# 2. Increase TCP buffer sizes
# 3. Review application connection pooling
```

**Database Tuning:**
```bash
# Analyze PostgreSQL performance
docker exec postgres psql -U postgres -c "
  SELECT
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
  FROM pg_stat_user_tables
  ORDER BY n_dead_tup DESC
  LIMIT 10;
"

# If high dead tuple count:
# 1. Tune autovacuum settings
# 2. Run manual VACUUM ANALYZE
```

### Quarterly Reviews

**Performance Baseline Update:**
```bash
# Run comprehensive benchmarks
# Compare against initial baseline
# Document performance trends
# Adjust optimizations based on workload changes
```

**Capacity Planning:**
```bash
# Review resource usage trends
# Project growth over next quarter
# Plan for scaling (vertical vs horizontal)
# Budget for infrastructure upgrades
```

### Parameter Tuning Based on Workload

**High CPU Workload (compute-intensive):**
```bash
# Reduce I/O scheduling overhead
echo "none" > /sys/block/sda/queue/scheduler

# Increase CPU scheduler granularity
sysctl -w kernel.sched_latency_ns=10000000
sysctl -w kernel.sched_min_granularity_ns=2000000
```

**High I/O Workload (database-heavy):**
```bash
# Increase dirty page ratio for better batching
sysctl -w vm.dirty_ratio=40
sysctl -w vm.dirty_background_ratio=10

# Reduce swappiness even further
sysctl -w vm.swappiness=5

# Increase I/O scheduler queue depth
echo 512 > /sys/block/sda/queue/nr_requests
```

**High Network Workload (API-heavy):**
```bash
# Increase connection tracking
sysctl -w net.netfilter.nf_conntrack_max=524288

# Increase local port range
sysctl -w net.ipv4.ip_local_port_range="1024 65535"

# Reduce TIME_WAIT timeout
sysctl -w net.ipv4.tcp_fin_timeout=10
```

**Memory-Constrained Workload:**
```bash
# Aggressive cache reclaim
sysctl -w vm.vfs_cache_pressure=150

# More aggressive dirty page flushing
sysctl -w vm.dirty_ratio=10
sysctl -w vm.dirty_background_ratio=3

# Consider increasing swap
# Consider reducing application memory limits
```

---

## Appendix A: Complete sysctl.conf

**Location:** `/etc/sysctl.conf`

```bash
################################################################################
# SERVER OPTIMIZATIONS FOR CEPCOMUNICACION-PROD
# Applied: 2025-11-03
# Target: Next.js + PostgreSQL + Redis + Docker workloads
################################################################################

# SWAP BEHAVIOR
vm.swappiness=10
vm.vfs_cache_pressure=50

# MEMORY MANAGEMENT
vm.overcommit_memory=1
vm.panic_on_oom=0
vm.dirty_ratio=15
vm.dirty_background_ratio=5
vm.dirty_expire_centisecs=3000
vm.dirty_writeback_centisecs=500

# NETWORK PERFORMANCE
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_rmem=4096 87380 16777216
net.ipv4.tcp_wmem=4096 65536 16777216
net.ipv4.tcp_window_scaling=1
net.core.somaxconn=4096
net.core.netdev_max_backlog=5000
net.ipv4.tcp_max_syn_backlog=8192
net.ipv4.tcp_fastopen=3
net.ipv4.tcp_slow_start_after_idle=0
net.ipv4.tcp_tw_reuse=1
net.ipv4.tcp_fin_timeout=15
net.ipv4.tcp_keepalive_time=300
net.ipv4.tcp_keepalive_probes=5
net.ipv4.tcp_keepalive_intvl=15
net.ipv4.ip_local_port_range=1024 65535
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr

# FILE SYSTEM PERFORMANCE
fs.file-max=2097152
fs.inode-max=2097152
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512
fs.inotify.max_queued_events=32768

# SHARED MEMORY (PostgreSQL)
kernel.shmmax=4294967296
kernel.shmall=1048576

# MESSAGE QUEUES
kernel.msgmnb=65536
kernel.msgmax=65536

# NETFILTER CONNECTION TRACKING
net.netfilter.nf_conntrack_max=262144
net.netfilter.nf_conntrack_tcp_timeout_established=1800

# SECURITY
net.ipv4.tcp_syncookies=1
net.ipv4.conf.all.accept_redirects=0
net.ipv4.conf.default.accept_redirects=0
net.ipv6.conf.all.accept_redirects=0
net.ipv6.conf.default.accept_redirects=0
net.ipv4.conf.all.accept_source_route=0
net.ipv4.conf.default.accept_source_route=0
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.default.rp_filter=1
net.ipv4.conf.all.log_martians=1
```

---

## Appendix B: Complete limits.conf

**Location:** `/etc/security/limits.conf`

```bash
################################################################################
# FILE DESCRIPTOR LIMITS - CEPCOMUNICACION-PROD
# Applied: 2025-11-03
################################################################################

# All users (including application users)
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536

# Root user
root soft nofile 65536
root hard nofile 65536

# Specific limits for PostgreSQL (if postgres user exists)
postgres soft nofile 65536
postgres hard nofile 65536
```

---

## Appendix C: Troubleshooting Guide

### Issue: High Swap Usage (>10%)

**Symptoms:**
- Swap usage consistently above 10%
- Slow application performance
- High I/O wait times

**Diagnosis:**
```bash
# Check what's using swap
for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file; done | sort -k 2 -n -r | head

# Check memory pressure
vmstat 1 10

# Check for OOM events
journalctl -k | grep -i "out of memory"
```

**Resolution:**
```bash
# Option 1: Reduce application memory usage
docker-compose down
# Adjust memory limits in docker-compose.yml
docker-compose up -d

# Option 2: Increase swappiness threshold
sysctl -w vm.swappiness=5

# Option 3: Clear swap and cache
swapoff -a && swapon -a
echo 3 > /proc/sys/vm/drop_caches
```

---

### Issue: High Load Average

**Symptoms:**
- Load average > number of CPU cores (2.0)
- Slow response times
- High CPU usage

**Diagnosis:**
```bash
# Check load average
uptime

# Identify CPU-heavy processes
htop
ps aux --sort=-%cpu | head -20

# Check I/O wait
iostat -x 1 5

# Check for disk bottleneck
iotop -o
```

**Resolution:**
```bash
# If CPU-bound:
# - Optimize application code
# - Add more CPU cores (upgrade VPS)
# - Enable caching

# If I/O-bound:
# - Optimize database queries
# - Add database indexes
# - Increase dirty page ratio
sysctl -w vm.dirty_ratio=40
```

---

### Issue: Connection Refused / Timeouts

**Symptoms:**
- "Connection refused" errors
- Intermittent timeouts
- Failed health checks

**Diagnosis:**
```bash
# Check connection queue
ss -s

# Check for dropped SYN packets
netstat -s | grep -i listen

# Check somaxconn
sysctl net.core.somaxconn

# Check application listen backlog
ss -ltn | grep -E "Recv-Q|Send-Q"
```

**Resolution:**
```bash
# Increase connection queue
sysctl -w net.core.somaxconn=8192

# Increase application backlog (in app code)
# Node.js example: server.listen(3000, { backlog: 4096 })

# Check for firewall blocking
ufw status
iptables -L -n
```

---

### Issue: Disk Space Full

**Symptoms:**
- "No space left on device"
- Application crashes
- Cannot write to disk

**Diagnosis:**
```bash
# Check disk usage
df -h

# Find large files
ncdu /

# Check Docker disk usage
docker system df

# Check logs
journalctl --disk-usage
du -sh /var/log/*
```

**Resolution:**
```bash
# Clean Docker
docker system prune -a --volumes --force

# Clean journald logs
journalctl --vacuum-size=100M

# Clean package cache
apt-get clean
apt-get autoclean

# Remove old kernels
apt-get autoremove -y
```

---

### Issue: File Descriptor Limit Reached

**Symptoms:**
- "Too many open files" errors
- Cannot create new connections
- Application errors

**Diagnosis:**
```bash
# Check current limit
ulimit -n

# Check usage
lsof | wc -l

# Find processes with many open files
lsof | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

**Resolution:**
```bash
# Verify limits.conf
cat /etc/security/limits.conf | grep nofile

# Re-login for changes to take effect
exit
ssh root@46.62.222.138

# Increase limits if needed
echo "* soft nofile 131072" >> /etc/security/limits.conf
echo "* hard nofile 131072" >> /etc/security/limits.conf
```

---

### Issue: PostgreSQL Performance Degradation

**Symptoms:**
- Slow queries
- High database CPU usage
- Connection timeouts

**Diagnosis:**
```bash
# Check active connections
docker exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check slow queries
docker exec postgres psql -U postgres -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds';"

# Check cache hit ratio
docker exec postgres psql -U postgres -c "SELECT sum(heap_blks_read) as heap_read, sum(heap_blks_hit) as heap_hit, sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio FROM pg_statio_user_tables;"
```

**Resolution:**
```bash
# Tune PostgreSQL shared_buffers (in docker-compose.yml)
# Set to 25% of RAM: 1024M for 3.7GB RAM
command: postgres -c shared_buffers=1024MB -c effective_cache_size=2GB

# Run VACUUM ANALYZE
docker exec postgres psql -U postgres -c "VACUUM ANALYZE;"

# Add indexes for slow queries
# Review query plans with EXPLAIN ANALYZE
```

---

### Issue: Redis Memory Usage High

**Symptoms:**
- Redis using >1GB memory
- Evicted keys
- Out of memory errors

**Diagnosis:**
```bash
# Check Redis memory usage
docker exec redis redis-cli INFO memory

# Check eviction policy
docker exec redis redis-cli CONFIG GET maxmemory-policy

# Check number of keys
docker exec redis redis-cli DBSIZE
```

**Resolution:**
```bash
# Set memory limit (in docker-compose.yml)
command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru

# Clear old keys
docker exec redis redis-cli FLUSHDB

# Review application caching strategy
# Consider using Redis clustering for larger datasets
```

---

## Appendix D: Quick Reference Commands

### System Information
```bash
# OS and kernel
lsb_release -a
uname -r

# Hardware info
lscpu
free -h
df -h
lsblk

# Network info
ip addr
ip route
ss -s
```

### Resource Monitoring
```bash
# All-in-one view
htop

# CPU usage by core
mpstat -P ALL 1

# Memory details
free -h
cat /proc/meminfo

# Disk I/O
iostat -x 1 5
iotop -o

# Network bandwidth
nethogs
bmon

# All stats
dstat -cdngy
```

### Docker Commands
```bash
# Container status
docker ps
docker stats

# View logs
docker-compose logs -f

# Restart service
docker-compose restart <service>

# Rebuild and restart
docker-compose up -d --build <service>

# Clean up
docker system prune -a --volumes
```

### Database Commands
```bash
# PostgreSQL
docker exec -it postgres psql -U postgres

# Redis
docker exec -it redis redis-cli

# Backup database
docker exec postgres pg_dump -U postgres dbname > backup.sql

# Restore database
cat backup.sql | docker exec -i postgres psql -U postgres dbname
```

### Performance Testing
```bash
# HTTP load test
ab -n 1000 -c 50 http://localhost:3000/

# Disk benchmark
fio --name=randread --rw=randread --bs=4k --size=1G --runtime=30

# Network benchmark
iperf3 -c <server-ip> -t 30
```

---

## Appendix E: Related Documentation

### Official Documentation

- [sysctl documentation](https://www.kernel.org/doc/Documentation/sysctl/)
- [TCP BBR](https://github.com/google/bbr)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/runtime-config-resource.html)
- [Docker Resource Constraints](https://docs.docker.com/config/containers/resource_constraints/)
- [systemd Unit Files](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)

### Hetzner-Specific

- [Hetzner Cloud Documentation](https://docs.hetzner.com/cloud/)
- [Hetzner Network Performance](https://docs.hetzner.com/cloud/networks/faq/)

### Tools Documentation

- [htop manual](https://htop.dev/)
- [iotop](https://github.com/Tomas-M/iotop)
- [nethogs](https://github.com/raboof/nethogs)
- [fio benchmark](https://fio.readthedocs.io/)

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-03 | SOLARIA AGENCY | Initial optimization plan created |

---

**END OF DOCUMENT**

For questions or support:
- **Email:** charlie@solaria.agency
- **Project:** CEPComunicacion v2
- **Server:** CEPCOMUNICACION-PROD (46.62.222.138)
