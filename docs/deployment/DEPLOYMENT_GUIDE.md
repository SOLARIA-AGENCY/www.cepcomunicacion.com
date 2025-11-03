# CEPComunicacion v2 - Production Deployment Guide

**Version:** 1.0.0
**Target Environment:** Hostinger VPS srv943151 (148.230.118.124)
**Application Stack:** Next.js 16 + Payload CMS 3 + PostgreSQL 16 + Redis 7
**Last Updated:** 2025-10-31
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Server Specifications](#server-specifications)
4. [Deployment Architecture](#deployment-architecture)
5. [Pre-Deployment Checklist](#pre-deployment-checklist)
6. [Deployment Phases](#deployment-phases)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring](#monitoring)
11. [Maintenance](#maintenance)

---

## Overview

This guide provides comprehensive step-by-step instructions for deploying CEPComunicacion v2 to production on the Hostinger VPS. The deployment uses a **blue-green strategy** to ensure zero-downtime updates and quick rollback capability.

### Deployment Strategy

**Blue-Green Deployment:**
- **Blue Environment:** Current production (stable)
- **Green Environment:** New deployment (testing)
- **Cutover:** Traffic switch from blue to green after validation
- **Rollback:** Keep blue environment for 24 hours as rollback option

### Estimated Deployment Time

| Phase | Duration | Critical Path |
|-------|----------|---------------|
| Pre-flight checks | 15 min | Yes |
| Server preparation | 45 min | Yes |
| Application build | 20 min | Yes |
| Database migration | 15 min | Yes |
| Green deployment | 30 min | Yes |
| Health checks | 15 min | Yes |
| Traffic cutover | 5 min | Yes |
| Post-deployment validation | 20 min | No |
| **Total** | **2h 45min** | **2h 5min** |

### Success Criteria

- ✅ All services healthy (10/10 health checks passing)
- ✅ SSL A+ rating on SSLLabs
- ✅ Security headers A+ on SecurityHeaders.com
- ✅ Response time < 500ms (p95)
- ✅ Zero application errors in first 30 minutes
- ✅ Database migrations successful with no data loss
- ✅ All GDPR endpoints operational
- ✅ Backup system functional
- ✅ Monitoring dashboards showing green status
- ✅ Rollback procedure tested and verified

---

## Prerequisites

### Required Access

1. **SSH Access to VPS**
   ```bash
   ssh root@148.230.118.124
   # Key: charlie@solaria.agency (Ed25519)
   # Fingerprint: SHA256:iD53mBSiDygUxVDTph2nruGb+mAaT7rBHIKQhEJNlrE
   ```

2. **GitHub Repository Access**
   - Repository: https://github.com/SOLARIA-AGENCY/cepcomunicacion.git
   - Branch: `main` or `production`
   - SSH Key configured for deployment user

3. **DNS Management Access**
   - Provider: [Your DNS Provider]
   - Required records: A, AAAA, CNAME for cepcomunicacion.com

4. **Email Access**
   - For Let's Encrypt certificate notifications
   - For deployment notifications
   - For alert notifications

### Required Credentials

Prepare these credentials before starting:

```bash
# Database
POSTGRES_PASSWORD=<generate: openssl rand -base64 32>
POSTGRES_BACKUP_PASSWORD=<generate: openssl rand -base64 32>

# Redis
REDIS_PASSWORD=<generate: openssl rand -base64 24>

# Payload CMS
PAYLOAD_SECRET=<generate: openssl rand -base64 48>  # MUST be 32+ chars

# MinIO S3
MINIO_ROOT_PASSWORD=<generate: openssl rand -base64 32>

# BullBoard (Queue Monitoring)
BULLBOARD_PASSWORD=<generate: openssl rand -base64 16>

# Session/JWT
SESSION_SECRET=<generate: openssl rand -base64 32>
JWT_SECRET=<generate: openssl rand -base64 48>

# Grafana (Monitoring)
GRAFANA_PASSWORD=<generate: openssl rand -base64 16>
```

### Required Tools (Local Machine)

```bash
# Verify tools are installed
ssh -V                  # OpenSSH 7.4+
git --version          # Git 2.20+
docker --version       # Docker 20.10+
docker-compose --version  # Docker Compose 1.29+
curl --version         # cURL 7.50+
openssl version        # OpenSSL 1.1.1+
```

### Knowledge Requirements

- ✅ Basic Linux system administration
- ✅ Docker and Docker Compose basics
- ✅ Nginx configuration fundamentals
- ✅ PostgreSQL database management
- ✅ Git version control
- ✅ Understanding of web application deployment
- ✅ Familiarity with Next.js and React

---

## Server Specifications

### Hardware Configuration

| Resource | Specification | Usage Target |
|----------|--------------|--------------|
| **CPU** | 1 vCore AMD EPYC 9354P | < 80% average |
| **RAM** | 3.8 GB | < 3.2 GB (leave 600MB for system) |
| **Storage** | 48 GB SSD | < 35 GB (leave 13GB free) |
| **Network** | Unmetered bandwidth | N/A |

### Operating System

```
OS: Ubuntu 25.04 LTS (Plucky Puffin)
Kernel: Linux 6.14.0-27-generic
Architecture: x86_64
```

### Existing Services (Pre-Deployment)

| Service | Version | Port | Status | Action Required |
|---------|---------|------|--------|-----------------|
| Apache2 | 2.4.x | 80 | Active | **DISABLE** (conflicts with Nginx) |
| MariaDB | 11.4.7 | 3306 | Active | Keep for other sites |
| PHP | 8.4.5 | - | Active | Keep for other sites |
| Node.js | v22.20.0 | - | Active | **UPGRADE to latest LTS if needed** |
| PM2 | 6.0.13 | - | Active | Use for process management |
| Git | 2.48.1 | - | Active | OK |
| Nginx | 1.26.3 | 80/443 | Inactive | **ACTIVATE** |
| UFW | - | - | Inactive | **ENABLE** (firewall) |

### Services to Install

| Service | Version | Port | Purpose |
|---------|---------|------|---------|
| PostgreSQL | 16+ | 5432 | Primary database |
| Redis | 7.2+ | 6379 | Cache & job queue |
| Certbot | Latest | - | SSL certificate management |
| Docker | 24.0+ | - | Container orchestration |
| Docker Compose | 2.20+ | - | Multi-container deployment |
| Fail2Ban | Latest | - | Intrusion prevention |

---

## Deployment Architecture

### Application Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS (443)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    NGINX (SSL Termination)                   │
│  - SSL/TLS certificates (Let's Encrypt)                     │
│  - Rate limiting                                             │
│  - Security headers                                          │
│  - Reverse proxy                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP (3001)
                         │
┌────────────────────────▼────────────────────────────────────┐
│              NEXT.JS 16 + PAYLOAD CMS 3                      │
│  (Port 3001)                                                 │
│  - Public Frontend Routes                                    │
│  - Admin Dashboard (/admin)                                  │
│  - REST API (/api)                                           │
│  - GraphQL API (/api/graphql)                                │
│  - GDPR Endpoints (/api/gdpr/*)                              │
└─────────┬─────────────────────────────┬────────────────────┘
          │                             │
          │ PostgreSQL                  │ Redis
          │                             │
┌─────────▼─────────┐         ┌─────────▼─────────┐
│   PostgreSQL 16   │         │     Redis 7.2     │
│   (Port 5432)     │         │   (Port 6379)     │
│   localhost only  │         │   localhost only  │
│                   │         │                   │
│ - Users           │         │ - BullMQ Queues   │
│ - Students        │         │ - Session Store   │
│ - Leads           │         │ - Cache Layer     │
│ - Courses         │         │                   │
│ - Campaigns       │         │ Queues:           │
│ - Audit Logs      │         │ - lead-processing │
│                   │         │ - email-automation│
└───────────────────┘         │ - stat-aggregation│
                              │ - backup-jobs     │
                              └───────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  MONITORING STACK (Optional)                 │
├──────────────────────────┬──────────────────────────────────┤
│   Prometheus (9090)      │   Grafana (3003)                 │
│   - Metrics collection   │   - Dashboards                   │
│   - Alert rules          │   - Visualization                │
└──────────────────────────┴──────────────────────────────────┘
```

### Network Security

```
┌────────────────────────────────────────────────────────────┐
│                      UFW FIREWALL                           │
├────────────────────────────────────────────────────────────┤
│  ALLOWED INCOMING:                                          │
│  - Port 22  (SSH)            - Source: Any                 │
│  - Port 80  (HTTP)           - Source: Any                 │
│  - Port 443 (HTTPS)          - Source: Any                 │
│                                                             │
│  DENIED INCOMING:                                           │
│  - Port 5432 (PostgreSQL)    - Localhost only              │
│  - Port 6379 (Redis)         - Localhost only              │
│  - Port 9090 (Prometheus)    - Localhost only              │
│  - Port 3003 (Grafana)       - VPN/SSH tunnel only         │
│  - All other ports           - Denied                      │
│                                                             │
│  ALLOWED OUTGOING:                                          │
│  - All connections          - For updates, APIs, etc.      │
└────────────────────────────────────────────────────────────┘
```

### File System Structure

```
/var/www/cepcomunicacion/
├── apps/
│   ├── web-next/                    # Next.js + Payload application
│   │   ├── .next/                   # Build artifacts
│   │   ├── public/                  # Static assets
│   │   ├── src/                     # Application source
│   │   ├── .env.production          # Production environment (SECRET)
│   │   ├── package.json
│   │   └── ecosystem.config.js      # PM2 configuration
│   └── cms/                         # Payload CMS collections (embedded)
├── infra/
│   ├── nginx/
│   │   ├── nginx-prod.conf          # Production Nginx config
│   │   └── ssl/                     # SSL certificates (symlink)
│   ├── postgres/
│   │   └── migrations/              # Database migrations
│   ├── monitoring/
│   │   └── docker-compose.monitoring.yml
│   └── scripts/
│       ├── deploy-production.sh     # Deployment script
│       ├── backup.sh                # Backup script
│       └── healthcheck.sh           # Health check script
├── logs/                            # Application logs
│   ├── nginx/
│   ├── app/
│   └── pm2/
└── backups/                         # Database backups
    ├── postgresql/
    └── uploads/

/etc/nginx/
├── nginx.conf                       # Main Nginx config
├── sites-available/
│   └── cepcomunicacion-prod         # Site configuration
├── sites-enabled/
│   └── cepcomunicacion-prod -> ../sites-available/
└── ssl/
    └── cepcomunicacion.com -> /etc/letsencrypt/live/cepcomunicacion.com/

/etc/letsencrypt/
├── live/
│   └── cepcomunicacion.com/
│       ├── fullchain.pem            # SSL certificate
│       ├── privkey.pem              # Private key
│       └── chain.pem
└── renewal/
    └── cepcomunicacion.com.conf     # Auto-renewal config

/var/backups/
├── postgresql/
│   ├── daily/
│   │   └── cepcomunicacion_YYYYMMDD.sql.gz
│   ├── weekly/
│   └── monthly/
└── uploads/
    └── cepcomunicacion_uploads_YYYYMMDD.tar.gz
```

### Resource Allocation

Total RAM: 3.8 GB (Target: < 3.2 GB usage)

| Service | RAM Allocation | CPU Priority | Restart Policy |
|---------|----------------|--------------|----------------|
| Next.js (PM2) | 800-1200 MB | High | On failure |
| PostgreSQL 16 | 512-768 MB | High | Always |
| Redis 7.2 | 256-512 MB | Medium | Always |
| Nginx | 64-128 MB | High | Always |
| PM2 | 32-64 MB | Medium | Always |
| System | 600-800 MB | - | - |
| **Total** | **~3.0 GB** | - | - |

Storage Allocation: 48 GB SSD (Target: < 35 GB usage)

| Data Type | Storage Allocation | Retention |
|-----------|-------------------|-----------|
| Application code | 500 MB | Current + 2 previous |
| Database | 2-5 GB | Current |
| Uploads | 5-10 GB | Permanent |
| Backups | 10-15 GB | 30 days |
| Logs | 1-2 GB | 14 days |
| System | 5-8 GB | - |
| **Total** | **24-40 GB** | - |

---

## Pre-Deployment Checklist

### 1. Server Access Verification

```bash
# Test SSH access
ssh root@148.230.118.124 "echo 'SSH access confirmed'"

# Verify sudo access
ssh root@148.230.118.124 "sudo whoami"
# Expected: root

# Check system resources
ssh root@148.230.118.124 "free -h && df -h"
# Verify: RAM > 2GB free, Storage > 15GB free
```

### 2. DNS Configuration

Verify DNS records are configured and propagated:

```bash
# Check A record
dig cepcomunicacion.com +short
# Expected: 148.230.118.124

# Check WWW CNAME
dig www.cepcomunicacion.com +short
# Expected: 148.230.118.124 or cepcomunicacion.com

# Check AAAA record (IPv6)
dig cepcomunicacion.com AAAA +short
# Expected: 2a02:4780:28:b773::1

# Test from multiple DNS servers
dig @8.8.8.8 cepcomunicacion.com +short
dig @1.1.1.1 cepcomunicacion.com +short
dig @208.67.222.222 cepcomunicacion.com +short
```

**Required DNS Records:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | cepcomunicacion.com | 148.230.118.124 | 3600 |
| A | www.cepcomunicacion.com | 148.230.118.124 | 3600 |
| AAAA | cepcomunicacion.com | 2a02:4780:28:b773::1 | 3600 |
| AAAA | www.cepcomunicacion.com | 2a02:4780:28:b773::1 | 3600 |

### 3. Repository Preparation

```bash
# Clone repository locally
git clone https://github.com/SOLARIA-AGENCY/cepcomunicacion.git
cd cepcomunicacion

# Verify production branch
git branch -a | grep production
# Expected: remotes/origin/production

# Check for uncommitted changes
git status
# Expected: "working tree clean"

# Verify build scripts exist
ls -la apps/web-next/package.json
cat apps/web-next/package.json | grep '"build"'
# Expected: "build": "next build"

# Test build locally (optional but recommended)
cd apps/web-next
npm install
npm run build
# Expected: Build completed successfully
```

### 4. Environment Variables Preparation

Create `.env.production` file with all required variables:

```bash
# Copy example file
cp .env.example .env.production

# Generate secrets
openssl rand -base64 48 > /tmp/payload_secret.txt
openssl rand -base64 32 > /tmp/postgres_password.txt
openssl rand -base64 24 > /tmp/redis_password.txt
openssl rand -base64 32 > /tmp/minio_password.txt
openssl rand -base64 16 > /tmp/bullboard_password.txt
openssl rand -base64 32 > /tmp/session_secret.txt

# Edit .env.production with generated values
nano .env.production
```

See [Production Environment Template](#production-environment-template) below for complete example.

### 5. Backup Existing Data (If Applicable)

If this is an update to existing deployment:

```bash
# SSH to server
ssh root@148.230.118.124

# Backup database
sudo -u postgres pg_dump cepcomunicacion > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql

# Backup uploads
tar -czf /tmp/uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/cepcomunicacion/uploads/

# Backup .env file
cp /var/www/cepcomunicacion/apps/web-next/.env.production /tmp/env_backup_$(date +%Y%m%d_%H%M%S)

# Download backups to local machine
exit
scp root@148.230.118.124:/tmp/backup_*.sql .
scp root@148.230.118.124:/tmp/uploads_backup_*.tar.gz .
scp root@148.230.118.124:/tmp/env_backup_* .
```

### 6. Team Notification

Send deployment notification to team:

```
Subject: Production Deployment Starting - CEPComunicacion v2

Deployment Details:
- Date: [DATE]
- Time: [TIME] UTC
- Duration: ~2 hours
- Impact: Zero downtime (blue-green deployment)
- Deployer: [NAME]

Expected Downtime: None

Monitoring:
- Status: https://status.cepcomunicacion.com
- Grafana: SSH tunnel to https://localhost:3003

Rollback Plan: Blue environment kept for 24 hours

Contact: [EMAIL/PHONE] for urgent issues during deployment
```

### 7. Production Checklist Confirmation

Mark each item as completed before proceeding:

- [ ] SSH access verified
- [ ] DNS records configured and propagated
- [ ] Repository cloned and build tested
- [ ] Environment variables prepared
- [ ] Backups completed (if applicable)
- [ ] Team notified
- [ ] Rollback plan understood
- [ ] Emergency contacts available
- [ ] Monitoring dashboard access tested
- [ ] At least 2 hours available for deployment

---

## Deployment Phases

### Phase 1: Server Preparation (45 minutes)

#### Step 1.1: System Updates

```bash
# SSH to server
ssh root@148.230.118.124

# Update package lists
sudo apt update

# Upgrade system packages (non-interactive)
sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y

# Install essential tools
sudo apt install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  net-tools \
  lsof \
  ufw \
  fail2ban \
  postgresql-client \
  redis-tools

# Verify kernel version
uname -r
# Expected: 6.14.0-27-generic or newer

# Check available disk space
df -h /
# Expected: > 15 GB available
```

#### Step 1.2: Install Docker

```bash
# Remove old Docker versions (if any)
sudo apt remove -y docker docker-engine docker.io containerd runc

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Docker installation
docker --version
# Expected: Docker version 24.0+ or higher

docker compose version
# Expected: Docker Compose version v2.20+ or higher

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Test Docker
docker run hello-world
# Expected: "Hello from Docker!"
```

#### Step 1.3: Install PostgreSQL 16

```bash
# Add PostgreSQL APT repository
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-client-16

# Verify installation
psql --version
# Expected: psql (PostgreSQL) 16.x

# Check PostgreSQL status
sudo systemctl status postgresql
# Expected: active (running)

# Verify PostgreSQL listens on localhost only
sudo ss -tlnp | grep 5432
# Expected: 127.0.0.1:5432 (NOT 0.0.0.0:5432)
```

#### Step 1.4: Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create production database
CREATE DATABASE cepcomunicacion
  WITH
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_ES.UTF-8'
  LC_CTYPE = 'es_ES.UTF-8'
  TEMPLATE = template0;

# Create database user
CREATE USER cepcomunicacion_user WITH ENCRYPTED PASSWORD '<USE_GENERATED_PASSWORD>';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cepcomunicacion TO cepcomunicacion_user;

# Connect to database
\c cepcomunicacion

# Grant schema privileges
GRANT ALL ON SCHEMA public TO cepcomunicacion_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cepcomunicacion_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cepcomunicacion_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO cepcomunicacion_user;

# Exit psql
\q

# Test connection
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -W
# Enter password when prompted
# Expected: Successfully connected

# Exit
\q
```

**Save Connection String:**
```
postgresql://cepcomunicacion_user:<PASSWORD>@localhost:5432/cepcomunicacion
```

#### Step 1.5: Install and Configure Redis

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis to listen on localhost only
sudo sed -i 's/bind 127.0.0.1 ::1/bind 127.0.0.1/g' /etc/redis/redis.conf

# Set Redis password
sudo sed -i "s/# requirepass foobared/requirepass <USE_GENERATED_PASSWORD>/g" /etc/redis/redis.conf

# Enable persistence
sudo sed -i 's/# appendonly no/appendonly yes/g' /etc/redis/redis.conf
sudo sed -i 's/# appendfsync everysec/appendfsync everysec/g' /etc/redis/redis.conf

# Set memory limit (512MB)
echo "maxmemory 512mb" | sudo tee -a /etc/redis/redis.conf
echo "maxmemory-policy allkeys-lru" | sudo tee -a /etc/redis/redis.conf

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test Redis connection
redis-cli -a <REDIS_PASSWORD> ping
# Expected: PONG

# Verify Redis listens on localhost only
sudo ss -tlnp | grep 6379
# Expected: 127.0.0.1:6379
```

#### Step 1.6: Disable Apache2 (Port Conflict)

```bash
# Stop Apache2
sudo systemctl stop apache2

# Disable Apache2 from starting on boot
sudo systemctl disable apache2

# Verify Apache2 is stopped
sudo systemctl status apache2
# Expected: inactive (dead)

# Verify port 80 is free
sudo ss -tlnp | grep :80
# Expected: No output (port free)
```

#### Step 1.7: Configure UFW Firewall

```bash
# Reset UFW to default
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (CRITICAL - do not lock yourself out!)
sudo ufw allow 22/tcp comment 'SSH'

# Allow HTTP
sudo ufw allow 80/tcp comment 'HTTP'

# Allow HTTPS
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable UFW
sudo ufw --force enable

# Verify status
sudo ufw status verbose

# Expected output:
# Status: active
#
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW IN    Anywhere                  # SSH
# 80/tcp                     ALLOW IN    Anywhere                  # HTTP
# 443/tcp                    ALLOW IN    Anywhere                  # HTTPS
```

#### Step 1.8: Install and Configure Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Configure SSH protection
sudo tee /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5
destemail = admin@cepcomunicacion.com
sendername = Fail2Ban-CEP
action = %(action_mwl)s

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
EOF

# Start Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Verify Fail2Ban status
sudo fail2ban-client status
# Expected: "Number of jail: 3"

sudo fail2ban-client status sshd
# Expected: Currently banned: 0
```

---

### Phase 2: SSL Certificate Setup (20 minutes)

#### Step 2.1: Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
# Expected: certbot 2.x or higher
```

#### Step 2.2: Obtain SSL Certificate

```bash
# Ensure ports 80 and 443 are available
sudo systemctl stop nginx  # If Nginx is running
sudo systemctl stop apache2  # If Apache is running

# Verify ports are free
sudo ss -tlnp | grep -E ':80|:443'
# Expected: No output

# Obtain certificate using standalone mode
sudo certbot certonly --standalone \
  -d cepcomunicacion.com \
  -d www.cepcomunicacion.com \
  --email admin@cepcomunicacion.com \
  --agree-tos \
  --no-eff-email \
  --non-interactive

# Expected output:
# Successfully received certificate.
# Certificate is saved at: /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem
# Key is saved at:         /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem

# Verify certificates exist
sudo ls -la /etc/letsencrypt/live/cepcomunicacion.com/
# Expected: fullchain.pem, privkey.pem, chain.pem, cert.pem
```

#### Step 2.3: Configure Auto-Renewal

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run
# Expected: "Congratulations, all simulated renewals succeeded"

# Certbot installs systemd timer for auto-renewal
sudo systemctl status certbot.timer
# Expected: active (running)

# Check renewal configuration
sudo cat /etc/letsencrypt/renewal/cepcomunicacion.com.conf

# Add post-renewal hook to reload Nginx
sudo tee /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh <<'EOF'
#!/bin/bash
systemctl reload nginx
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

#### Step 2.4: Set Certificate Permissions

```bash
# Create SSL directory for Nginx
sudo mkdir -p /etc/nginx/ssl

# Create symlink to Let's Encrypt certificates
sudo ln -sf /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem /etc/nginx/ssl/fullchain.pem
sudo ln -sf /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem /etc/nginx/ssl/privkey.pem

# Set permissions
sudo chmod 755 /etc/nginx/ssl
sudo chmod 644 /etc/nginx/ssl/fullchain.pem
sudo chmod 600 /etc/nginx/ssl/privkey.pem
```

---

### Phase 3: Application Deployment (45 minutes)

#### Step 3.1: Create Deployment Directory

```bash
# Create application directory
sudo mkdir -p /var/www/cepcomunicacion
cd /var/www/cepcomunicacion

# Set ownership
sudo chown -R $USER:$USER /var/www/cepcomunicacion
```

#### Step 3.2: Clone Repository

```bash
# Option 1: Clone via HTTPS
git clone https://github.com/SOLARIA-AGENCY/cepcomunicacion.git /var/www/cepcomunicacion

# Option 2: Clone via SSH (preferred for CI/CD)
# First, add deploy key to GitHub repository
# Then clone:
git clone git@github.com:SOLARIA-AGENCY/cepcomunicacion.git /var/www/cepcomunicacion

# Navigate to repository
cd /var/www/cepcomunicacion

# Checkout production branch
git checkout production
# Or: git checkout main

# Verify branch
git branch
# Expected: * production (or * main)

# Pull latest changes
git pull origin production
```

#### Step 3.3: Create Production Environment File

```bash
# Navigate to Next.js app
cd /var/www/cepcomunicacion/apps/web-next

# Create production environment file
nano .env.production
```

**Paste the following (replace placeholders):**

```bash
# ========================================
# CEPComunicacion v2 - Production Environment
# ========================================
# IMPORTANT: Keep this file secure - never commit to Git
# Generated: 2025-10-31
# ========================================

# ========================================
# ENVIRONMENT
# ========================================
NODE_ENV=production
PORT=3001

# ========================================
# DATABASE - PostgreSQL
# ========================================
DATABASE_URL=postgresql://cepcomunicacion_user:<POSTGRES_PASSWORD>@localhost:5432/cepcomunicacion
POSTGRES_DB=cepcomunicacion
POSTGRES_USER=cepcomunicacion_user
POSTGRES_PASSWORD=<USE_GENERATED_PASSWORD>

# Connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_STATEMENT_TIMEOUT=30000

# ========================================
# REDIS - Cache & Queue
# ========================================
REDIS_URL=redis://:<REDIS_PASSWORD>@localhost:6379/0
REDIS_PASSWORD=<USE_GENERATED_PASSWORD>

# ========================================
# PAYLOAD CMS
# ========================================
PAYLOAD_SECRET=<USE_GENERATED_SECRET_MIN_32_CHARS>
NEXT_PUBLIC_SERVER_URL=https://cepcomunicacion.com
PAYLOAD_PUBLIC_SERVER_URL=https://cepcomunicacion.com

# ========================================
# CORS CONFIGURATION
# ========================================
CORS_ORIGINS=https://cepcomunicacion.com,https://www.cepcomunicacion.com

# ========================================
# SMTP - Email Configuration
# ========================================
# Production SMTP (e.g., Brevo, Mailgun, SendGrid)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=admin@cepcomunicacion.com
SMTP_PASSWORD=<SMTP_API_KEY>
SMTP_FROM=noreply@cepcomunicacion.com
SMTP_SECURE=true

# ========================================
# SECURITY
# ========================================
SESSION_SECRET=<USE_GENERATED_SECRET>
JWT_SECRET=<USE_GENERATED_SECRET>

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ========================================
# ANALYTICS (OPTIONAL)
# ========================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=cepcomunicacion.com

# ========================================
# CAPTCHA (OPTIONAL)
# ========================================
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=<HCAPTCHA_SITE_KEY>
HCAPTCHA_SECRET_KEY=<HCAPTCHA_SECRET_KEY>

# ========================================
# EXTERNAL INTEGRATIONS (ALL OPTIONAL)
# ========================================
# Meta Ads API
ENABLE_META_INTEGRATION=false
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
META_PIXEL_ID=

# Mailchimp
ENABLE_MAILCHIMP_INTEGRATION=false
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_LIST_ID=

# WhatsApp Cloud API
ENABLE_WHATSAPP_INTEGRATION=false
WHATSAPP_PHONE_ID=
WHATSAPP_ACCESS_TOKEN=

# LLM APIs
ENABLE_LLM_INTEGRATION=false
LLM_PROVIDER=none
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# ========================================
# MONITORING (OPTIONAL)
# ========================================
SENTRY_DSN=
SENTRY_ENVIRONMENT=production

# ========================================
# BACKUP CONFIGURATION
# ========================================
BACKUP_SCHEDULE=0 3 * * *
BACKUP_RETENTION_DAYS=30

# ========================================
# FEATURE FLAGS
# ========================================
NEXT_PUBLIC_ENABLE_LLM=false
NEXT_PUBLIC_ENABLE_WHATSAPP=false

# ========================================
# END OF CONFIGURATION
# ========================================
```

**Secure the environment file:**

```bash
# Set restrictive permissions
chmod 600 .env.production

# Verify permissions
ls -la .env.production
# Expected: -rw------- 1 root root ... .env.production
```

#### Step 3.4: Install Dependencies

```bash
# Navigate to root of monorepo
cd /var/www/cepcomunicacion

# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies using pnpm workspace
pnpm install --frozen-lockfile --prod

# Expected output:
# Lockfile is up to date, resolution step is skipped
# Packages: +XXX
# Progress: resolved XXX, reused XXX, downloaded XXX, added XXX
# Done in Xs
```

#### Step 3.5: Build Application

```bash
# Navigate to Next.js app
cd /var/www/cepcomunicacion/apps/web-next

# Build Next.js application
NODE_ENV=production pnpm build

# Expected output:
# > cepcomunicacion-web-next@2.0.0 build
# > next build
#
# info  - Loaded env from /var/www/cepcomunicacion/apps/web-next/.env.production
# info  - Linting and checking validity of types...
# info  - Creating an optimized production build...
# info  - Compiled successfully
# info  - Collecting page data...
# info  - Generating static pages (0/XX)
# info  - Generating static pages (XX/XX)
# info  - Finalizing page optimization...
#
# Route (app)                              Size     First Load JS
# ┌ ○ /                                    XXX kB        XXX kB
# ├ ○ /admin                               XXX kB        XXX kB
# ├ ○ /api/health                          0 B           0 B
# └ ○ /cursos                              XXX kB        XXX kB
#
# ○  (Static)  automatically rendered as static HTML
#
# Build completed successfully

# Verify build artifacts exist
ls -la .next/
# Expected: standalone/ static/ server/ etc.

# Check build size
du -sh .next/
# Expected: < 500 MB
```

#### Step 3.6: Run Database Migrations

```bash
# Navigate to Payload app
cd /var/www/cepcomunicacion/apps/web-next

# Generate Payload types
pnpm payload generate:types

# Run Payload database migrations (if any)
# Note: Payload 3.x auto-migrates on startup, but we can force it:
NODE_ENV=production pnpm payload migrate

# Expected output:
# Connecting to database...
# Running migrations...
# ✓ Migration 001_create_users completed
# ✓ Migration 002_create_students completed
# ✓ Migration 003_create_leads completed
# ✓ All migrations completed successfully

# Verify database tables exist
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -W -c "\dt"

# Expected output:
#                 List of relations
#  Schema |       Name        | Type  |        Owner
# --------+-------------------+-------+---------------------
#  public | _payload_migrations | table | cepcomunicacion_user
#  public | users              | table | cepcomunicacion_user
#  public | students           | table | cepcomunicacion_user
#  public | leads              | table | cepcomunicacion_user
#  public | courses            | table | cepcomunicacion_user
#  public | campaigns          | table | cepcomunicacion_user
#  public | audit_logs         | table | cepcomunicacion_user
#  ...
```

#### Step 3.7: Seed Initial Data (Optional)

```bash
# Seed database with initial data
# Only run this on first deployment, not on updates!

NODE_ENV=production pnpm run seed

# Expected output:
# Seeding database...
# ✓ Created admin user: admin@cepcomunicacion.com
# ✓ Created 5 sample students
# ✓ Created 10 sample courses
# ✓ Created 3 campuses
# Database seeded successfully
```

**Important:** Save the generated admin credentials:
```
Admin User Created:
Email: admin@cepcomunicacion.com
Password: <GENERATED_PASSWORD>

CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!
```

---

### Phase 4: Nginx Configuration (20 minutes)

#### Step 4.1: Create Nginx Main Configuration

```bash
# Backup original nginx.conf
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Create optimized nginx.conf
sudo nano /etc/nginx/nginx.conf
```

**Paste the following:**

```nginx
# Nginx Configuration - CEPComunicacion v2 Production
# Optimized for 1 vCore, 3.8GB RAM

user www-data;
worker_processes auto;  # Auto-detect CPU cores
pid /var/run/nginx.pid;
error_log /var/log/nginx/error.log warn;

# Worker settings
worker_rlimit_nofile 4096;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Buffers
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 16k;
    output_buffers 2 32k;
    postpone_output 1460;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        font/truetype
        font/opentype
        application/vnd.ms-fontobject
        image/svg+xml
        image/x-icon;

    # Security headers (defense in depth with Next.js)
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting zones
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=gdpr_limit:10m rate=1r/h;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/m;

    # Connection limiting
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # Hide Nginx version
    server_tokens off;

    # Include site configurations
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

#### Step 4.2: Create Site Configuration

```bash
# Create sites-available directory if not exists
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Create site configuration
sudo nano /etc/nginx/sites-available/cepcomunicacion-prod
```

**Paste the following:**

```nginx
# CEPComunicacion v2 - Production Site Configuration

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name cepcomunicacion.com www.cepcomunicacion.com;

    # ACME challenge for Let's Encrypt renewal
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server - Primary
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cepcomunicacion.com www.cepcomunicacion.com;

    # SSL Certificate
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # SSL Configuration (Mozilla Modern)
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/cepcomunicacion.com/chain.pem;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Security Headers (HSTS applied by Next.js, but add here for defense in depth)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Logs
    access_log /var/log/nginx/cepcomunicacion_access.log main;
    error_log /var/log/nginx/cepcomunicacion_error.log warn;

    # Connection limiting
    limit_conn conn_limit 20;

    # Health check endpoint (no rate limiting)
    location = /api/health {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }

    # GDPR export endpoint (strict rate limiting - 1 request per hour)
    location = /api/gdpr/export {
        limit_req zone=gdpr_limit burst=2 nodelay;
        limit_req_status 429;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;  # GDPR export may take time
    }

    # Authentication endpoints (moderate rate limiting)
    location ~ ^/api/(login|register|forgot-password|reset-password) {
        limit_req zone=auth_limit burst=3 nodelay;
        limit_req_status 429;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # General API endpoints (standard rate limiting)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Admin dashboard (authentication required by Payload)
    location /admin {
        limit_req zone=general_limit burst=50 nodelay;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js static assets (_next/static/)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        # Cache static assets for 1 year
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Favicon and robots.txt
    location ~ ^/(favicon\.ico|robots\.txt|sitemap\.xml)$ {
        proxy_pass http://127.0.0.1:3001;
        expires 7d;
        add_header Cache-Control "public";
        access_log off;
    }

    # All other routes (Next.js SSR)
    location / {
        limit_req zone=general_limit burst=50 nodelay;

        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### Step 4.3: Enable Site and Test Configuration

```bash
# Remove default Nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Enable CEPComunicacion site
sudo ln -sf /etc/nginx/sites-available/cepcomunicacion-prod /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# If test fails, check error messages and fix configuration
# Common issues:
# - Missing semicolons
# - Incorrect file paths
# - SSL certificate not found
```

---

### Phase 5: PM2 Process Management (15 minutes)

#### Step 5.1: Create PM2 Ecosystem Configuration

```bash
# Navigate to Next.js app
cd /var/www/cepcomunicacion/apps/web-next

# Create PM2 ecosystem file
nano ecosystem.config.js
```

**Paste the following:**

```javascript
module.exports = {
  apps: [
    {
      // Application configuration
      name: 'cepcomunicacion-prod',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/cepcomunicacion/apps/web-next',

      // Cluster mode (recommended for production)
      instances: 1,  // Use 1 instance on 1 vCore server
      exec_mode: 'cluster',

      // Restart settings
      autorestart: true,
      watch: false,  // Don't watch files in production
      max_memory_restart: '1G',  // Restart if exceeds 1GB
      min_uptime: '10s',  // Consider app errored if crashes within 10s
      max_restarts: 10,  // Max 10 restarts within 1 minute

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_file: '/var/www/cepcomunicacion/apps/web-next/.env.production',

      // Logs
      error_file: '/var/log/pm2/cepcomunicacion-error.log',
      out_file: '/var/log/pm2/cepcomunicacion-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Process management
      kill_timeout: 5000,  // Wait 5s before force kill
      wait_ready: true,  // Wait for 'ready' event before considering app launched
      listen_timeout: 10000,  // Wait max 10s for app to be ready

      // Advanced
      instance_var: 'INSTANCE_ID',
      source_map_support: true,

      // Graceful reload
      shutdown_with_message: true,
    }
  ],

  // Deployment configuration (optional - for future CI/CD)
  deploy: {
    production: {
      user: 'root',
      host: '148.230.118.124',
      ref: 'origin/production',
      repo: 'git@github.com:SOLARIA-AGENCY/cepcomunicacion.git',
      path: '/var/www/cepcomunicacion',
      'pre-deploy-local': '',
      'post-deploy': 'pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    }
  }
};
```

#### Step 5.2: Create Log Directory

```bash
# Create PM2 log directory
sudo mkdir -p /var/log/pm2

# Set permissions
sudo chown -R $USER:$USER /var/log/pm2
sudo chmod 755 /var/log/pm2
```

#### Step 5.3: Start Application with PM2

```bash
# Navigate to app directory
cd /var/www/cepcomunicacion/apps/web-next

# Start application
pm2 start ecosystem.config.js --env production

# Expected output:
# [PM2][WARN] Applications cepcomunicacion-prod not running, starting...
# [PM2] App [cepcomunicacion-prod] launched (1 instances)
# ┌─────┬──────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
# │ id  │ name                     │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
# ├─────┼──────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
# │ 0   │ cepcomunicacion-prod     │ default     │ 2.0.0   │ cluster │ 12345    │ 0s     │ 0    │ online    │ 0%       │ 50.0mb   │ root     │ disabled │
# └─────┴──────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

# Wait 30 seconds for app to fully initialize
sleep 30

# Check application status
pm2 status

# Expected: status should be "online"

# View logs
pm2 logs cepcomunicacion-prod --lines 50

# Check for errors
pm2 logs cepcomunicacion-prod --err --lines 20
```

#### Step 5.4: Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Expected output:
# [PM2] Saving current process list...
# [PM2] Successfully saved in /root/.pm2/dump.pm2

# Setup PM2 to start on system boot
pm2 startup systemd

# Expected output will include a command like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

# Run the command it outputs (copy-paste the entire line)
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root

# Expected:
# [PM2] Init System found: systemd
# [PM2] Successfully generated systemd unit
# [PM2] systemd successfully enabled
```

#### Step 5.5: Verify PM2 Service

```bash
# Check PM2 systemd service status
sudo systemctl status pm2-root

# Expected:
# ● pm2-root.service - PM2 process manager
#      Loaded: loaded (/etc/systemd/system/pm2-root.service; enabled; vendor preset: enabled)
#      Active: active (running) since...
#    Main PID: XXXXX (PM2 v6.0.13: God Daemon)
#       Tasks: XX
#      Memory: XXX.XMB
#         CPU: Xs
#      CGroup: /system.slice/pm2-root.service
#              ├─XXXXX PM2 v6.0.13: God Daemon (/root/.pm2)
#              └─XXXXX node /var/www/cepcomunicacion/apps/web-next/node_modules/next/dist/bin/next start

# Test auto-restart on reboot (optional - only if you're confident)
# sudo reboot
# Wait 2 minutes, then SSH back in
# pm2 status
# Expected: cepcomunicacion-prod still running
```

---

### Phase 6: Start Nginx and Go Live (10 minutes)

#### Step 6.1: Start Nginx

```bash
# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# Expected:
# ● nginx.service - A high performance web server and a reverse proxy server
#      Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
#      Active: active (running) since...
#    Main PID: XXXXX (nginx)
#       Tasks: 2 (limit: 4915)
#      Memory: XX.XMB
#         CPU: XXXms
#      CGroup: /system.slice/nginx.service
#              ├─XXXXX nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
#              └─XXXXX nginx: worker process

# Verify Nginx is listening on correct ports
sudo ss -tlnp | grep nginx

# Expected:
# LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=XXXXX,fd=6))
# LISTEN 0      511          0.0.0.0:443       0.0.0.0:*    users:(("nginx",pid=XXXXX,fd=7))
# LISTEN 0      511             [::]:80           [::]:*    users:(("nginx",pid=XXXXX,fd=8))
# LISTEN 0      511             [::]:443          [::]:*    users:(("nginx",pid=XXXXX,fd=9))
```

#### Step 6.2: Test Application Access

```bash
# Test HTTP to HTTPS redirect
curl -I http://cepcomunicacion.com

# Expected:
# HTTP/1.1 301 Moved Permanently
# Location: https://cepcomunicacion.com/

# Test HTTPS connection
curl -I https://cepcomunicacion.com

# Expected:
# HTTP/2 200
# content-type: text/html; charset=utf-8
# strict-transport-security: max-age=31536000; includeSubDomains; preload
# x-frame-options: SAMEORIGIN
# x-content-type-options: nosniff

# Test API health endpoint
curl https://cepcomunicacion.com/api/health

# Expected:
# {"status":"ok","timestamp":"2025-10-31T12:00:00.000Z","database":"connected","redis":"connected"}
```

#### Step 6.3: Test Admin Dashboard Access

```bash
# From local machine browser, open:
# https://cepcomunicacion.com/admin

# Expected: Payload CMS login page

# Log in with admin credentials (from seed step)
# Email: admin@cepcomunicacion.com
# Password: <GENERATED_PASSWORD>

# After login, you should see Payload admin dashboard
```

---

## Post-Deployment Verification

### Automated Health Checks

Create a health check script:

```bash
# Create health check script
sudo nano /usr/local/bin/healthcheck-cep.sh
```

**Paste the following:**

```bash
#!/bin/bash
# CEPComunicacion v2 - Health Check Script
# Run this after deployment to verify all services

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DOMAIN="https://cepcomunicacion.com"
CHECKS_PASSED=0
CHECKS_FAILED=0

echo "========================================="
echo "CEPComunicacion v2 - Health Check"
echo "========================================="
echo ""

# Function to check HTTP response
check_http() {
    local url=$1
    local expected_code=$2
    local check_name=$3

    echo -n "Checking $check_name... "

    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$http_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $http_code)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check service status
check_service() {
    local service=$1
    local check_name=$2

    echo -n "Checking $check_name... "

    if systemctl is-active --quiet "$service"; then
        echo -e "${GREEN}✓ PASS${NC} (running)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (not running)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check PM2 process
check_pm2() {
    local app_name=$1
    local check_name=$2

    echo -n "Checking $check_name... "

    if pm2 describe "$app_name" | grep -q "status.*online"; then
        echo -e "${GREEN}✓ PASS${NC} (online)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (offline)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check database connection
check_database() {
    echo -n "Checking PostgreSQL database... "

    if psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -c "SELECT 1" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (connected)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (connection failed)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check Redis connection
check_redis() {
    echo -n "Checking Redis... "

    if redis-cli -a "$REDIS_PASSWORD" ping >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (PONG)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (connection failed)"
        ((CHECKS_FAILED++))
    fi
}

# Function to check SSL certificate
check_ssl() {
    echo -n "Checking SSL certificate... "

    expiry=$(echo | openssl s_client -servername cepcomunicacion.com -connect cepcomunicacion.com:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
    expiry_epoch=$(date -d "$expiry" +%s)
    now_epoch=$(date +%s)
    days_until_expiry=$(( ($expiry_epoch - $now_epoch) / 86400 ))

    if [ $days_until_expiry -gt 7 ]; then
        echo -e "${GREEN}✓ PASS${NC} (valid for $days_until_expiry days)"
        ((CHECKS_PASSED++))
    elif [ $days_until_expiry -gt 0 ]; then
        echo -e "${YELLOW}⚠ WARNING${NC} (expires in $days_until_expiry days)"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (expired)"
        ((CHECKS_FAILED++))
    fi
}

# Run all checks
echo "1. System Services"
echo "-------------------"
check_service "nginx" "Nginx service"
check_service "postgresql" "PostgreSQL service"
check_service "redis-server" "Redis service"
check_service "pm2-root" "PM2 service"
check_service "ufw" "UFW firewall"
check_service "fail2ban" "Fail2Ban service"

echo ""
echo "2. Application Processes"
echo "------------------------"
check_pm2 "cepcomunicacion-prod" "Next.js application"
check_database
check_redis

echo ""
echo "3. HTTP Endpoints"
echo "-----------------"
check_http "$DOMAIN" 200 "Homepage"
check_http "$DOMAIN/admin" 200 "Admin dashboard"
check_http "$DOMAIN/api/health" 200 "Health API"
check_http "$DOMAIN/cursos" 200 "Courses page"

echo ""
echo "4. Security"
echo "-----------"
check_http "http://cepcomunicacion.com" 301 "HTTP to HTTPS redirect"
check_ssl

echo ""
echo "========================================="
echo "Results: $CHECKS_PASSED passed, $CHECKS_FAILED failed"
echo "========================================="

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All checks passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some checks failed! ✗${NC}"
    exit 1
fi
```

**Make executable and run:**

```bash
# Make executable
sudo chmod +x /usr/local/bin/healthcheck-cep.sh

# Run health checks
sudo /usr/local/bin/healthcheck-cep.sh

# Expected: All checks passed
```

### Manual Verification Checklist

- [ ] Homepage loads (https://cepcomunicacion.com)
- [ ] HTTPS certificate valid (green padlock in browser)
- [ ] HTTP redirects to HTTPS
- [ ] Admin dashboard accessible (/admin)
- [ ] Can log in to admin with credentials
- [ ] API health endpoint returns 200
- [ ] All collections visible in admin (Students, Leads, Courses, etc.)
- [ ] Can create a test student record
- [ ] Can create a test lead record
- [ ] GDPR export endpoint returns data (test with test@example.com)
- [ ] Rate limiting works (try API endpoint 20 times, should get 429)
- [ ] Security headers present (check with browser dev tools)
- [ ] PM2 process running and stable
- [ ] PostgreSQL connected and responding
- [ ] Redis connected and responding
- [ ] Nginx logs show no errors
- [ ] Application logs show no errors
- [ ] Disk space sufficient (>10GB free)
- [ ] Memory usage normal (<3GB)
- [ ] CPU usage normal (<80%)
- [ ] UFW firewall active and configured correctly

### External Security Scans

Run these scans from external services:

1. **SSL Labs SSL Test**
   - URL: https://www.ssllabs.com/ssltest/analyze.html?d=cepcomunicacion.com
   - Target: Grade A or A+
   - Wait for scan to complete (~2 minutes)
   - Verify:
     - Certificate valid
     - TLS 1.3 supported
     - Forward Secrecy supported
     - HSTS enabled

2. **Security Headers Check**
   - URL: https://securityheaders.com/?q=https://cepcomunicacion.com
   - Target: Grade A or A+
   - Verify headers:
     - Strict-Transport-Security
     - X-Frame-Options
     - X-Content-Type-Options
     - Content-Security-Policy (set by Next.js)
     - Referrer-Policy

3. **SSL Certificate Checker**
   - URL: https://www.sslshopper.com/ssl-checker.html#hostname=cepcomunicacion.com
   - Verify:
     - Certificate valid
     - Chain complete
     - No common name mismatch
     - Not expired
     - Trusted root

### Performance Verification

```bash
# Test response time
curl -w "@-" -o /dev/null -s https://cepcomunicacion.com <<'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF

# Expected: time_total < 1s for homepage

# Test API response time
time curl -s https://cepcomunicacion.com/api/health > /dev/null

# Expected: < 500ms

# Load test (optional - use Apache Bench)
ab -n 1000 -c 10 https://cepcomunicacion.com/

# Expected:
# - Time per request: < 500ms (mean)
# - Failed requests: 0
# - Requests per second: > 20
```

---

## Rollback Procedures

See [ROLLBACK_PROCEDURES.md](./ROLLBACK_PROCEDURES.md) for detailed rollback instructions.

**Quick Rollback (< 5 minutes):**

```bash
# SSH to server
ssh root@148.230.118.124

# Stop current PM2 process
pm2 stop cepcomunicacion-prod

# Restore previous deployment
cd /var/www/cepcomunicacion-blue  # Blue environment (previous)
pm2 start ecosystem.config.js

# Update Nginx to point to blue
sudo nano /etc/nginx/sites-available/cepcomunicacion-prod
# Change proxy_pass to blue port

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Verify rollback
curl https://cepcomunicacion.com/api/health
```

---

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for comprehensive troubleshooting guide.

**Common Issues:**

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs cepcomunicacion-prod --err

# Check environment variables
cat /var/www/cepcomunicacion/apps/web-next/.env.production

# Verify database connection
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost

# Restart application
pm2 restart cepcomunicacion-prod
```

### Nginx 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check if port 3001 is listening
sudo ss -tlnp | grep 3001

# Check Nginx error logs
sudo tail -f /var/log/nginx/cepcomunicacion_error.log

# Restart services
pm2 restart cepcomunicacion-prod
sudo systemctl reload nginx
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew --force-renewal

# Check certificate validity
sudo certbot certificates

# Test Nginx configuration
sudo nginx -t
```

---

## Monitoring

### Set Up Monitoring Dashboard (Optional)

See [MONITORING_SETUP.md](./MONITORING_SETUP.md) for full monitoring stack deployment.

**Quick Monitoring Commands:**

```bash
# Check all services status
sudo systemctl status nginx postgresql redis-server pm2-root

# Check PM2 processes
pm2 status
pm2 monit  # Interactive monitoring

# Check resource usage
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check logs
sudo tail -f /var/log/nginx/cepcomunicacion_access.log
pm2 logs cepcomunicacion-prod --lines 100
```

### Set Up Alerts (Recommended)

Use a service like UptimeRobot, Pingdom, or self-hosted monitoring:

1. **Uptime Monitoring**
   - Monitor: https://cepcomunicacion.com/api/health
   - Interval: 5 minutes
   - Alert: Email/SMS on downtime

2. **SSL Expiry Monitoring**
   - Check: SSL certificate expiry
   - Alert: 7 days before expiry

3. **Disk Space Monitoring**
   - Threshold: 80% usage
   - Alert: Email when exceeded

4. **Memory Monitoring**
   - Threshold: 85% usage
   - Alert: Email when exceeded

---

## Maintenance

### Daily Maintenance

```bash
# Check application logs for errors
pm2 logs cepcomunicacion-prod --err --lines 100

# Check Nginx logs for errors
sudo tail -100 /var/log/nginx/cepcomunicacion_error.log

# Check disk space
df -h /

# Check memory usage
free -h

# Check PM2 process status
pm2 status
```

### Weekly Maintenance

```bash
# Review access logs for anomalies
sudo tail -1000 /var/log/nginx/cepcomunicacion_access.log | grep -E " (4[0-9]{2}|5[0-9]{2}) "

# Review Fail2Ban logs
sudo fail2ban-client status sshd

# Check database size
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -c "SELECT pg_size_pretty(pg_database_size('cepcomunicacion'));"

# Check backup status
ls -lh /var/backups/postgresql/ | tail -10

# Update system packages (if available)
sudo apt update
sudo apt list --upgradable
```

### Monthly Maintenance

```bash
# Full system update (during maintenance window)
sudo apt update && sudo apt upgrade -y

# Review and rotate logs
sudo logrotate -f /etc/logrotate.conf

# Database maintenance
psql -U cepcomunicacion_user -d cepcomunicacion -h localhost -c "VACUUM ANALYZE;"

# Check SSL certificate expiry
sudo certbot certificates

# Review security updates
sudo unattended-upgrades --dry-run

# Test backup restoration (in staging environment)
# See ROLLBACK_PROCEDURES.md for restoration steps
```

### Updating Application (Minor Updates)

```bash
# SSH to server
ssh root@148.230.118.124

# Navigate to repository
cd /var/www/cepcomunicacion

# Backup database
sudo -u postgres pg_dump cepcomunicacion > /tmp/backup_$(date +%Y%m%d_%H%M%S).sql

# Pull latest changes
git pull origin production

# Install updated dependencies
pnpm install --frozen-lockfile

# Rebuild application
cd apps/web-next
pnpm build

# Restart application with zero downtime
pm2 reload cepcomunicacion-prod

# Monitor logs for errors
pm2 logs cepcomunicacion-prod --lines 100

# Verify deployment
curl https://cepcomunicacion.com/api/health
```

---

## Summary

**Deployment Complete!** 🎉

You have successfully deployed CEPComunicacion v2 to production on Hostinger VPS srv943151.

**What's deployed:**
- ✅ Next.js 16 + Payload CMS 3 application
- ✅ PostgreSQL 16 database
- ✅ Redis 7.2 cache and queue
- ✅ Nginx reverse proxy with SSL/TLS
- ✅ PM2 process manager
- ✅ UFW firewall
- ✅ Fail2Ban intrusion prevention
- ✅ Automated backups
- ✅ SSL certificates (Let's Encrypt)
- ✅ Security headers
- ✅ Rate limiting
- ✅ GDPR compliance features
- ✅ Health check monitoring

**Access URLs:**
- Public site: https://cepcomunicacion.com
- Admin dashboard: https://cepcomunicacion.com/admin
- Health check: https://cepcomunicacion.com/api/health

**Next Steps:**
1. Change default admin password immediately
2. Set up monitoring alerts
3. Schedule regular backups
4. Test rollback procedure in staging
5. Document custom configurations
6. Train team on admin dashboard
7. Configure external integrations (if needed)

**Support:**
- Technical issues: dev@solaria.agency
- Security issues: security@solaria.agency
- Emergency: [PHONE NUMBER]

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2025-10-31
**Maintained by:** SOLARIA AGENCY
