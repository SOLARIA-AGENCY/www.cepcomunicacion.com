# VPS Setup & Migration Guide
# CEPComunicacion v2

**Version:** 1.0.0
**Date:** 2025-10-21
**Target:** System Administrators, DevOps Engineers

---

## Table of Contents

1. [Fresh VPS Setup](#1-fresh-vps-setup)
2. [Migration Between VPS](#2-migration-between-vps)
3. [Troubleshooting](#3-troubleshooting)
4. [Performance Tuning](#4-performance-tuning)
5. [Maintenance](#5-maintenance)

---

## 1. Fresh VPS Setup

### 1.1 VPS Provider Selection

**Recommended Providers:**

| Provider | Specs | Price/Month | Region | Notes |
|----------|-------|-------------|--------|-------|
| **Hostinger** | 4GB / 2 vCPU / 50GB | $12 | EU/US | ✅ Best value |
| **Hetzner** | 4GB / 2 vCPU / 40GB | €4.51 | EU | ✅ Cheapest EU |
| **DigitalOcean** | 4GB / 2 vCPU / 80GB | $24 | Global | ✅ Best uptime |
| **Vultr** | 4GB / 2 vCPU / 80GB | $18 | Global | ✅ Good performance |

**Minimum Requirements:**
- OS: Ubuntu 22.04 LTS or Ubuntu 24.04 LTS
- RAM: 4GB
- vCPU: 2 cores
- Storage: 50GB SSD
- IPv4: Public IP address
- Access: Root SSH access

### 1.2 Initial Server Preparation

**Step 1: Connect to VPS**

```bash
# From your local machine
ssh root@YOUR_VPS_IP

# If using SSH key
ssh -i ~/.ssh/id_rsa root@YOUR_VPS_IP
```

**Step 2: Update System**

```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# Reboot if kernel was updated
reboot

# Reconnect after reboot
ssh root@YOUR_VPS_IP
```

**Step 3: Set Hostname**

```bash
# Set hostname
hostnamectl set-hostname cepcomunicacion

# Update /etc/hosts
cat >> /etc/hosts <<EOF
127.0.0.1 cepcomunicacion
EOF

# Verify
hostname
```

**Step 4: Configure Timezone**

```bash
# Set to UTC (recommended for servers)
timedatectl set-timezone UTC

# Or set to Madrid time
timedatectl set-timezone Europe/Madrid

# Verify
timedatectl
```

**Step 5: Create Non-Root User (Optional but Recommended)**

```bash
# Create user
adduser deploy

# Add to sudo group
usermod -aG sudo deploy

# Add to docker group (we'll install Docker next)
usermod -aG docker deploy

# Copy SSH keys to new user
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# Test new user
su - deploy
```

### 1.3 Install Docker & Docker Compose

**Method 1: Automatic Installation (Recommended)**

```bash
# Download Docker installation script
curl -fsSL https://get.docker.com -o get-docker.sh

# Review script (optional but recommended)
cat get-docker.sh

# Run installation
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Enable Docker to start on boot
sudo systemctl enable docker

# Start Docker service
sudo systemctl start docker

# Verify installation
docker --version
docker compose version

# Test Docker
docker run hello-world
```

**Method 2: Manual Installation (Ubuntu)**

```bash
# Install prerequisites
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify
docker --version
docker compose version
```

**Expected Output:**

```
Docker version 24.0.7, build afdd53b
Docker Compose version v2.23.3
```

### 1.4 Configure Firewall

```bash
# Install UFW (if not installed)
sudo apt install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this before enabling firewall!)
sudo ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Optional: Allow MinIO console (restrict to your IP)
# sudo ufw allow from YOUR_IP to any port 9001

# Enable firewall
sudo ufw enable

# Verify rules
sudo ufw status verbose
```

**Expected Output:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

### 1.5 Install Additional Tools

```bash
# Install essential tools
sudo apt install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ncdu \
    tree \
    jq

# Install fail2ban for SSH protection
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 1.6 Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/solaria-agency/cepcomunicacion.git

# Or if private repository
git clone git@github.com:solaria-agency/cepcomunicacion.git

# Navigate to project
cd cepcomunicacion
```

### 1.7 Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Generate secrets
echo "Generating secure passwords..."
echo "POSTGRES_PASSWORD: $(openssl rand -base64 32)"
echo "REDIS_PASSWORD: $(openssl rand -base64 24)"
echo "MINIO_ROOT_PASSWORD: $(openssl rand -base64 24)"
echo "PAYLOAD_SECRET: $(openssl rand -base64 48)"
echo "BULLBOARD_PASSWORD: $(openssl rand -base64 16)"

# Edit .env with your favorite editor
nano .env

# Or use vim
vim .env
```

**Minimum Required .env Values:**

```env
# Database
POSTGRES_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Redis
REDIS_PASSWORD=<GENERATE_STRONG_PASSWORD>

# MinIO
MINIO_ROOT_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Payload CMS
PAYLOAD_SECRET=<GENERATE_STRONG_SECRET_32_CHARS_MIN>

# BullBoard
BULLBOARD_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Domain
VITE_API_URL=https://cepcomunicacion.com/api
CORS_ORIGINS=https://cepcomunicacion.com,https://www.cepcomunicacion.com

# SSL
DOMAIN=cepcomunicacion.com
LETSENCRYPT_EMAIL=admin@cepcomunicacion.com
```

### 1.8 Deploy Application

```bash
# Navigate to Docker directory
cd infra/docker

# Pull images (this may take 5-10 minutes)
docker compose pull

# Build custom images
docker compose build

# Start services in detached mode
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

**Expected Output:**

```
NAME                  STATUS              PORTS
cep-nginx            Up 2 minutes       0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
cep-frontend         Up 2 minutes
cep-cms              Up 2 minutes
cep-postgres         Up 2 minutes (healthy)
cep-redis            Up 2 minutes (healthy)
cep-minio            Up 2 minutes (healthy)
cep-worker-automation Up 2 minutes
cep-worker-llm       Up 2 minutes
cep-worker-stats     Up 2 minutes
cep-mailhog          Up 2 minutes       0.0.0.0:8025->8025/tcp
cep-bullboard        Up 2 minutes
cep-backup           Up 2 minutes
```

### 1.9 Setup SSL/TLS with Let's Encrypt

**Method 1: Using Certbot (Recommended)**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx container temporarily (to free port 80)
docker compose stop nginx

# Obtain certificate
sudo certbot certonly --standalone \
    -d cepcomunicacion.com \
    -d www.cepcomunicacion.com \
    --non-interactive \
    --agree-tos \
    -m admin@cepcomunicacion.com

# Certificate will be saved to:
# /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem
# /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem

# Copy certificates to project
sudo mkdir -p ~/cepcomunicacion/infra/nginx/ssl
sudo cp /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem \
    ~/cepcomunicacion/infra/nginx/ssl/
sudo cp /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem \
    ~/cepcomunicacion/infra/nginx/ssl/
sudo chown -R $USER:$USER ~/cepcomunicacion/infra/nginx/ssl

# Restart Nginx
docker compose start nginx

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

**Method 2: Manual Certificate (Development)**

```bash
# Generate self-signed certificate (for testing only)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ~/cepcomunicacion/infra/nginx/ssl/privkey.pem \
    -out ~/cepcomunicacion/infra/nginx/ssl/fullchain.pem \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=CEPComunicacion/CN=cepcomunicacion.com"

# Note: Browsers will show "Not Secure" warning with self-signed certificates
```

### 1.10 Verify Deployment

```bash
# Check if services are running
docker compose ps

# Test HTTP endpoint
curl http://localhost/

# Test API health
curl http://localhost/api/health

# Test HTTPS (if SSL configured)
curl https://cepcomunicacion.com/

# Check resource usage
docker stats --no-stream

# Check disk usage
docker system df

# View logs
docker compose logs --tail=50
```

### 1.11 Configure DNS

**Update DNS Records:**

```dns
# A Record (IPv4)
cepcomunicacion.com         IN A    YOUR_VPS_IP
www.cepcomunicacion.com     IN A    YOUR_VPS_IP

# AAAA Record (IPv6) - Optional
cepcomunicacion.com         IN AAAA YOUR_VPS_IPV6
www.cepcomunicacion.com     IN AAAA YOUR_VPS_IPV6
```

**Verify DNS Propagation:**

```bash
# Check A record
dig +short cepcomunicacion.com

# Check from external DNS
dig @8.8.8.8 cepcomunicacion.com

# Test HTTPS after DNS propagation
curl -I https://cepcomunicacion.com/
```

### 1.12 Post-Deployment Checklist

- [ ] All Docker containers running and healthy
- [ ] Frontend accessible via HTTP/HTTPS
- [ ] API health endpoint returning 200
- [ ] SSL certificate valid
- [ ] DNS pointing to VPS IP
- [ ] Firewall configured (ports 22, 80, 443 only)
- [ ] Backups configured and tested
- [ ] BullBoard accessible (with authentication)
- [ ] MinIO console accessible (optional)
- [ ] Email sending working (MailHog or SMTP)

---

## 2. Migration Between VPS

### 2.1 Pre-Migration Preparation

**On Old VPS:**

```bash
# 1. Lower DNS TTL (24 hours before migration)
# Set TTL to 300 seconds (5 minutes) in DNS provider

# 2. Create full backup
cd ~/cepcomunicacion/infra/scripts
./migrate-vps.sh export -o /tmp/migration-backup

# 3. Verify backup
ls -lh /tmp/migration-backup/
cat /tmp/migration-backup/MANIFEST.txt

# 4. Check backup integrity
cd /tmp/migration-backup
sha256sum -c checksums.txt
```

**Backup Size Estimate:**

```
Database dump:     100MB - 500MB (compressed)
PostgreSQL data:   500MB - 2GB
MinIO data:        1GB - 10GB
Total:             ~2GB - 15GB
Transfer time:     5-30 minutes (depending on bandwidth)
```

### 2.2 Transfer Backup to New VPS

**Method 1: Direct SCP Transfer**

```bash
# From old VPS to new VPS
scp -r /tmp/migration-backup root@NEW_VPS_IP:/tmp/

# Or with compression (faster for slow connections)
tar czf - /tmp/migration-backup | \
    ssh root@NEW_VPS_IP 'tar xzf - -C /tmp'
```

**Method 2: Via Intermediate Storage (MinIO/S3)**

```bash
# On old VPS: Upload to MinIO
docker compose exec backup sh -c \
    'aws s3 sync /tmp/migration-backup s3://cep-backups/migration/ \
    --endpoint-url http://minio:9000'

# On new VPS: Download from MinIO
docker compose exec backup sh -c \
    'aws s3 sync s3://cep-backups/migration/ /tmp/migration-backup \
    --endpoint-url http://OLD_VPS_IP:9000'
```

### 2.3 Setup New VPS

**Follow Section 1.1 - 1.6** to prepare new VPS.

### 2.4 Import Data to New VPS

```bash
# On new VPS
cd ~/cepcomunicacion/infra/scripts

# Import backup
./migrate-vps.sh import -i /tmp/migration-backup

# This will:
# - Restore .env file
# - Restore docker-compose.yml
# - Import database
# - Restore all volumes
# - Start all services
```

**Expected Duration:** 10-30 minutes (depending on data size)

### 2.5 Verify Migration

```bash
# Run verification script
./migrate-vps.sh verify

# Manual verification
docker compose ps
docker compose logs --tail=100

# Test endpoints
curl http://localhost/
curl http://localhost/api/health

# Check database
docker compose exec postgres psql -U cepadmin -d cepcomunicacion -c "\dt"

# Check MinIO
curl http://localhost:9000/minio/health/live
```

### 2.6 Update DNS

**Switch Traffic to New VPS:**

```bash
# Update A record to new VPS IP
# In your DNS provider dashboard:
# cepcomunicacion.com -> NEW_VPS_IP
# www.cepcomunicacion.com -> NEW_VPS_IP

# Verify DNS propagation
dig +short cepcomunicacion.com
# Should return NEW_VPS_IP after TTL expires (5 minutes)
```

**Monitor Traffic:**

```bash
# On new VPS: Watch Nginx access logs
docker compose logs -f nginx

# On old VPS: Watch for traffic decrease
docker compose logs -f nginx
```

### 2.7 Post-Migration Tasks

**Keep Old VPS Running for 24-48 hours**

Reasons:
- DNS propagation (some ISPs may cache longer)
- Rollback option if issues arise
- Comparison for debugging

**Checklist:**

- [ ] New VPS receiving traffic
- [ ] Old VPS traffic declining to zero
- [ ] No errors in new VPS logs
- [ ] Backups running on new VPS
- [ ] SSL certificates valid
- [ ] External integrations working (if configured)
- [ ] Email sending working
- [ ] Queue workers processing jobs

**After 48 Hours:**

```bash
# On old VPS: Stop services
docker compose down

# Keep old VPS for 1 week (for emergency rollback)
# Then decommission/delete old VPS
```

### 2.8 Migration Troubleshooting

**Issue: Database import fails**

```bash
# Check PostgreSQL logs
docker compose logs postgres

# Try manual restore
docker compose exec backup /scripts/restore.sh \
    -f /tmp/migration-backup/database/dump.sql.gz
```

**Issue: Services not starting**

```bash
# Check service logs
docker compose logs cms
docker compose logs worker-automation

# Check environment variables
docker compose exec cms env | grep -E 'DATABASE|REDIS|MINIO'

# Restart services
docker compose restart
```

**Issue: SSL certificates not working**

```bash
# Reissue certificates on new VPS
sudo certbot certonly --standalone \
    -d cepcomunicacion.com \
    -d www.cepcomunicacion.com
```

---

## 3. Troubleshooting

### 3.1 Common Issues

**Issue: Container keeps restarting**

```bash
# Check logs
docker compose logs <service-name>

# Check health
docker compose ps

# Inspect container
docker inspect <container-name>

# Check resource limits
docker stats
```

**Issue: Out of disk space**

```bash
# Check disk usage
df -h

# Check Docker disk usage
docker system df

# Clean up
docker system prune -a --volumes

# Remove old images
docker image prune -a
```

**Issue: Database connection refused**

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check PostgreSQL logs
docker compose logs postgres

# Test connection
docker compose exec postgres pg_isready -U cepadmin

# Restart PostgreSQL
docker compose restart postgres
```

**Issue: Redis connection refused**

```bash
# Check if Redis is running
docker compose ps redis

# Test connection
docker compose exec redis redis-cli ping

# Check password
docker compose exec redis redis-cli -a "$REDIS_PASSWORD" ping
```

### 3.2 Performance Issues

**High CPU Usage:**

```bash
# Identify heavy processes
docker stats

# Check individual container
docker exec <container-name> top

# Limit CPU (in docker-compose.yml)
deploy:
  resources:
    limits:
      cpus: '1.0'
```

**High Memory Usage:**

```bash
# Check memory usage
docker stats

# Increase swap (if needed)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Slow Database Queries:**

```bash
# Enable query logging (temporarily)
docker compose exec postgres psql -U cepadmin -d cepcomunicacion

# Inside PostgreSQL
SET log_statement = 'all';
SET log_min_duration_statement = 100; -- Log queries > 100ms

# Analyze slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

---

## 4. Performance Tuning

### 4.1 PostgreSQL Tuning

```bash
# Edit PostgreSQL configuration in docker-compose.yml
# Adjust these based on available RAM

# For 4GB RAM VPS:
shared_buffers=256MB           # 25% of RAM
effective_cache_size=1GB       # 50% of RAM
maintenance_work_mem=64MB
work_mem=2621kB
```

### 4.2 Redis Tuning

```bash
# In docker-compose.yml redis command:
maxmemory 512mb                # Adjust based on available RAM
maxmemory-policy allkeys-lru   # Evict least recently used keys
```

### 4.3 Nginx Tuning

```nginx
# In nginx.conf
worker_processes auto;         # Auto-detect CPU cores
worker_connections 2048;       # Max connections per worker

# Enable gzip
gzip on;
gzip_comp_level 6;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

---

## 5. Maintenance

### 5.1 Regular Maintenance Tasks

**Daily:**

```bash
# Check service health
docker compose ps

# Check disk space
df -h

# Check logs for errors
docker compose logs --tail=100 | grep -i error
```

**Weekly:**

```bash
# Update Docker images
docker compose pull
docker compose up -d

# Verify backups
docker compose exec backup ls -lh /backups | tail -10

# Clean up unused images
docker image prune -a
```

**Monthly:**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services (during low-traffic period)
docker compose restart

# Review and rotate logs
docker compose logs > /tmp/logs-$(date +%Y%m).txt
```

### 5.2 Backup Verification

```bash
# List backups
docker compose exec backup /scripts/restore.sh -l

# Test restore (in test environment)
docker compose exec backup /scripts/restore.sh \
    -f /backups/latest.sql.gz
```

### 5.3 Security Updates

```bash
# Enable automatic security updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# Manual security updates
sudo apt update
sudo apt upgrade -y
```

---

## 6. Emergency Procedures

### 6.1 Complete System Failure

```bash
# 1. Provision new VPS
# 2. Follow Migration Section 2
# 3. Restore from latest backup

# RTO: 2-4 hours
# RPO: Last backup (24 hours max)
```

### 6.2 Database Corruption

```bash
# 1. Stop all services except postgres
docker compose stop cms worker-automation worker-llm worker-stats

# 2. Restore from backup
docker compose exec backup /scripts/restore.sh -l
docker compose exec backup /scripts/restore.sh -f /backups/latest.sql.gz

# 3. Restart services
docker compose start
```

### 6.3 Rollback Deployment

```bash
# Using deployment script
./infra/scripts/deploy.sh --rollback

# Or manually
docker compose down
docker compose pull  # Previous tagged images
docker compose up -d
```

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Check all services
docker compose ps

# View logs
docker compose logs -f <service>

# Restart service
docker compose restart <service>

# Enter container shell
docker compose exec <service> sh

# Check resource usage
docker stats

# Clean up everything (WARNING: Destructive!)
docker system prune -a --volumes
```

### Important File Locations

```
/home/deploy/cepcomunicacion/          # Project root
/home/deploy/cepcomunicacion/.env      # Environment variables
/var/lib/docker/volumes/               # Docker volumes
/etc/letsencrypt/                      # SSL certificates
/var/log/nginx/                        # Nginx logs
```

### Support Contacts

- **Technical Support:** soporte@solaria.agency
- **Emergency:** +34 XXX XXX XXX
- **Documentation:** https://github.com/solaria-agency/cepcomunicacion

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-21
**Author:** SOLARIA AGENCY - Infrastructure Team
