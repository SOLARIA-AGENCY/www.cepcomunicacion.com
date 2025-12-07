# Server Optimization for Multi-Tenant (5 Tenants)

**Date:** 2025-12-07
**Server:** 46.62.222.138 (Hetzner VPS CX22)
**Target Capacity:** Up to 5 simultaneous tenants

---

## Executive Summary

Server optimized for multi-tenant SaaS operation with PostgreSQL, Redis, and Node.js stack. All optimizations applied and verified working.

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| SWAP | 4GB | 4GB | 4GB ✅ |
| PostgreSQL shared_buffers | 128MB | 512MB | 512MB ✅ |
| PostgreSQL max_connections | 100 | 150 | 150 ✅ |
| Redis maxmemory | Unlimited | 256MB | 256MB ✅ |
| Kernel swappiness | 60 | 10 | 10 ✅ |

---

## 1. PostgreSQL Optimization

**Config File:** `/etc/postgresql/16/main/conf.d/multitenant.conf`

```ini
# PostgreSQL Multi-Tenant Optimization (5 tenants)
# Memory - Conservative for 3.7GB RAM VPS
shared_buffers = 512MB
effective_cache_size = 1536MB
maintenance_work_mem = 128MB
work_mem = 32MB

# Connections - Room for 5 tenants × 20 connections each
max_connections = 150

# Write-Ahead Log
wal_buffers = 16MB
checkpoint_completion_target = 0.9
min_wal_size = 256MB
max_wal_size = 1GB

# Query Planner
random_page_cost = 1.1
effective_io_concurrency = 200
default_statistics_target = 100

# Parallel Query (2 vCPU)
max_parallel_workers_per_gather = 1
max_parallel_workers = 2

# Logging
log_min_duration_statement = 1000
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on

# Row-Level Security Performance
row_security = on
```

### Connection Pool Calculation

```
5 tenants × 20 connections/tenant = 100 connections
+ 50 buffer for admin/background jobs = 150 total
```

---

## 2. Redis Optimization

**Config:** `/etc/redis/redis.conf`

```ini
# Redis Multi-Tenant Optimization
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence - AOF for BullMQ job queue reliability
appendonly yes
appendfsync everysec
```

### Memory Allocation

- **256MB** reserved for Redis
- LRU eviction prevents memory overflow
- AOF persistence ensures job queue durability

---

## 3. Kernel Optimization

**Config File:** `/etc/sysctl.d/99-multitenant.conf`

```ini
# Kernel Optimization for Multi-Tenant SaaS

# Memory management
vm.swappiness = 10
vm.dirty_ratio = 60
vm.dirty_background_ratio = 5
vm.overcommit_memory = 0

# Network performance
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_tw_buckets = 2000000
net.ipv4.ip_local_port_range = 10240 65535

# Connection tracking
net.netfilter.nf_conntrack_max = 262144

# File descriptors
fs.file-max = 2097152
fs.nr_open = 2097152
```

### Key Settings Explained

| Setting | Value | Purpose |
|---------|-------|---------|
| `vm.swappiness` | 10 | Prefer RAM over SWAP |
| `net.core.somaxconn` | 65535 | Handle connection bursts |
| `tcp_fin_timeout` | 30 | Faster connection cleanup |
| `fs.file-max` | 2097152 | Support many open files |

---

## 4. SWAP Configuration

**Already configured:** 4GB swapfile

```bash
# Verify SWAP
swapon --show
# NAME      TYPE SIZE   USED PRIO
# /swapfile file   4G  ~200M   -2
```

SWAP prevents Out-of-Memory kills during traffic spikes.

---

## 5. Health Check Script

**Location:** `/opt/scripts/health-check.sh`

```bash
#!/bin/bash
# CEPComunicacion Multi-Tenant Health Check

echo "╔═══════════════════════════════════════════════════╗"
echo "║     CEP Multi-Tenant Health Check                 ║"
echo "╚═══════════════════════════════════════════════════╝"

# System resources
CPU_LOAD=$(cat /proc/loadavg | awk '{print $1}')
MEM_USED=$(free -m | awk '/Mem:/ {printf "%.0f", $3/$2*100}')
SWAP_USED=$(free -m | awk '/Swap:/ {if ($2>0) printf "%.0f", $3/$2*100; else print "0"}')
DISK_USED=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

echo "CPU Load:    $CPU_LOAD"
echo "Memory:      ${MEM_USED}%"
echo "SWAP:        ${SWAP_USED}%"
echo "Disk:        ${DISK_USED}%"

# Services status
systemctl is-active --quiet postgresql && echo "PostgreSQL: ✅" || echo "PostgreSQL: ❌"
systemctl is-active --quiet redis-server && echo "Redis:      ✅" || echo "Redis:      ❌"
systemctl is-active --quiet nginx && echo "Nginx:      ✅" || echo "Nginx:      ❌"
pm2 jlist 2>/dev/null | grep -q online && echo "PM2 CMS:    ✅" || echo "PM2 CMS:    ❌"

# PostgreSQL connections
sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | xargs echo "PG Connections:"

# Redis memory
redis-cli info memory 2>/dev/null | grep "used_memory_human" | cut -d: -f2 | xargs echo "Redis Memory:"

echo "Timestamp: $(date)"
```

### Usage

```bash
# Run health check
ssh root@46.62.222.138 "/opt/scripts/health-check.sh"

# Or remotely
ssh -i ~/.ssh/cepcomunicacion root@46.62.222.138 "/opt/scripts/health-check.sh"
```

---

## 6. Monitoring Thresholds

### Warning Levels

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU Load | > 2.0 | > 3.0 | Investigate processes |
| Memory | > 80% | > 90% | Consider upgrade |
| SWAP | > 30% | > 50% | Upgrade VPS RAM |
| Disk | > 70% | > 85% | Clean logs/backups |
| PG Connections | > 100 | > 130 | Add connection pooling |

### Upgrade Path

| Tenants | VPS Plan | RAM | Cost/month |
|---------|----------|-----|------------|
| 1-5 | CX22 (current) | 4GB | €4.51 |
| 5-15 | CX32 | 8GB | €8.98 |
| 15-40 | CX42 | 16GB | €17.97 |
| 40-100 | CX52 | 32GB | €35.88 |

---

## 7. Quick Commands Reference

```bash
# Check server status
ssh root@46.62.222.138 "/opt/scripts/health-check.sh"

# Restart services
ssh root@46.62.222.138 "systemctl restart postgresql redis-server && pm2 restart all"

# View logs
ssh root@46.62.222.138 "pm2 logs cepcomunicacion-cms --lines 50"

# PostgreSQL connections
ssh root@46.62.222.138 "sudo -u postgres psql -c 'SELECT count(*) FROM pg_stat_activity;'"

# Redis memory
ssh root@46.62.222.138 "redis-cli info memory | grep used_memory_human"
```

---

## 8. Configuration Files Location

| Component | Config Path |
|-----------|-------------|
| PostgreSQL | `/etc/postgresql/16/main/conf.d/multitenant.conf` |
| Redis | `/etc/redis/redis.conf` |
| Kernel | `/etc/sysctl.d/99-multitenant.conf` |
| SWAP | `/swapfile` (4GB) |
| Health Script | `/opt/scripts/health-check.sh` |
| PM2 | `/opt/apps/cms/ecosystem.config.cjs` |

---

## 9. Rollback Instructions

If issues occur, revert to defaults:

```bash
# PostgreSQL - remove custom config
rm /etc/postgresql/16/main/conf.d/multitenant.conf
systemctl restart postgresql

# Kernel - remove custom sysctl
rm /etc/sysctl.d/99-multitenant.conf
sysctl --system

# Redis - edit and remove maxmemory lines
nano /etc/redis/redis.conf
systemctl restart redis-server
```

---

**Document Version:** 1.0
**Last Updated:** 2025-12-07
**Author:** SOLARIA AGENCY
