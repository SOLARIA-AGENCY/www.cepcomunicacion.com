# CEPComunicacion v2 - Production Deployment Guide

**Version:** 1.0.0
**Last Updated:** 2025-10-31
**Target Environment:** Hostinger VPS (srv943151)
**Estimated Deployment Time:** 3-4 hours

---

## Executive Summary

This guide provides complete instructions for deploying CEPComunicacion v2 from development to production on the Hostinger VPS (srv943151 - 148.230.118.124). Follow each phase sequentially for a successful zero-downtime deployment.

**Technology Stack:**
- Frontend: Next.js 16.0.1 + React 19.2.0
- Backend: Payload CMS 3.61.1 (embedded)
- Database: PostgreSQL 16
- Cache/Queue: Redis 7.2 + BullMQ
- Web Server: Nginx with Let's Encrypt SSL
- Process Manager: PM2
- Monitoring: Prometheus + Grafana
- Containerization: Docker + Docker Compose

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Server Environment](#server-environment)
3. [Phase 1: Initial Server Setup](#phase-1-initial-server-setup)
4. [Phase 2: Install Dependencies](#phase-2-install-dependencies)
5. [Phase 3: Application Deployment](#phase-3-application-deployment)
6. [Phase 4: Database Setup](#phase-4-database-setup)
7. [Phase 5: SSL/TLS Configuration](#phase-5-ssltls-configuration)
8. [Phase 6: Monitoring Stack](#phase-6-monitoring-stack)
9. [Phase 7: Backup Configuration](#phase-7-backup-configuration)
10. [Phase 8: Testing & Validation](#phase-8-testing--validation)
11. [Phase 9: Go-Live](#phase-9-go-live)
12. [Rollback Procedures](#rollback-procedures)
13. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Documentation Review
- [ ] Read this deployment guide completely
- [ ] Review SECURITY_IMPLEMENTATION.md
- [ ] Review DISASTER_RECOVERY.md
- [ ] Review COMPREHENSIVE_AUDIT_REPORT.md

### Access Verification
- [ ] SSH access to srv943151 (148.230.118.124)
- [ ] Root or sudo privileges
- [ ] GitHub repository access
- [ ] Domain DNS management access
- [ ] Email/Slack for alerts configured

### Service Accounts
- [ ] Mailchimp API key obtained
- [ ] Meta Ads API token ready
- [ ] WhatsApp Cloud API credentials
- [ ] Brevo/Mailgun SMTP credentials
- [ ] AWS S3 credentials (optional, for backups)

### Local Testing
- [ ] Application runs locally without errors
- [ ] All 242 tests passing (32 unit + 210 e2e)
- [ ] Database migrations tested
- [ ] Production build successful (`pnpm build`)

---

## Server Environment

### Current Server Specifications
- **Hostname:** srv943151.hostinger.com
- **IP Address:** 148.230.118.124
- **Provider:** Hostinger VPS
- **Operating System:** Ubuntu 25.04 (Plucky Puffin)
- **Kernel:** Linux 6.14.0-27-generic
- **CPU:** 1 vCore (AMD EPYC 9354P)
- **RAM:** 3.8 GB
- **Storage:** 48 GB SSD (44 GB available)

### Existing Services (To Be Managed)
- **Apache2:** Port 80 (will be disabled)
- **MariaDB 11.4.7:** Port 3306 (will coexist with PostgreSQL)
- **Node.js:** v22.20.0 (correct version ✓)
- **PM2:** Installed (will be used)
- **Git:** 2.48.1 (correct version ✓)

### Target Service Ports
- **Nginx:** 80 (HTTP redirect), 443 (HTTPS)
- **Next.js:** 3001 (internal)
- **PostgreSQL:** 5432 (localhost only)
- **Redis:** 6379 (localhost only)
- **Prometheus:** 9090 (internal)
- **Grafana:** 3003 (internal, proxied via Nginx)
- **Uptime Kuma:** 3004 (internal)

---

## Phase 1: Initial Server Setup

**Duration:** 30 minutes

### 1.1 SSH Connection

```bash
# Connect to server
ssh root@148.230.118.124

# Update system
apt-get update && apt-get upgrade -y

# Install essential packages
apt-get install -y curl wget git vim ufw
```

### 1.2 Create Deployment User

```bash
# Create user with sudo privileges
adduser cepdeploy
usermod -aG sudo cepdeploy

# Set up SSH keys for cepdeploy
mkdir -p /home/cepdeploy/.ssh
cp /root/.ssh/authorized_keys /home/cepdeploy/.ssh/
chown -R cepdeploy:cepdeploy /home/cepdeploy/.ssh
chmod 700 /home/cepdeploy/.ssh
chmod 600 /home/cepdeploy/.ssh/authorized_keys

# Test login as cepdeploy
su - cepdeploy
```

### 1.3 Configure Firewall

```bash
# Enable UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Verify rules
sudo ufw status numbered
```

**Expected Output:**
```
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere
[ 2] 80/tcp                     ALLOW IN    Anywhere
[ 3] 443/tcp                    ALLOW IN    Anywhere
```

### 1.4 Disable Apache2 (Conflicting Port 80)

```bash
# Stop Apache2
sudo systemctl stop apache2

# Disable Apache2 from auto-start
sudo systemctl disable apache2

# Verify Apache2 is not running
sudo systemctl status apache2
```

### 1.5 Create Directory Structure

```bash
# Application directory
sudo mkdir -p /var/www/cepcomunicacion
sudo chown -R cepdeploy:cepdeploy /var/www/cepcomunicacion

# Log directory
sudo mkdir -p /var/log/cepcomunicacion
sudo chown -R cepdeploy:cepdeploy /var/log/cepcomunicacion

# Backup directory
sudo mkdir -p /var/backups/cepcomunicacion/{database,media,config}
sudo chown -R cepdeploy:cepdeploy /var/backups/cepcomunicacion

# Monitoring data directory
sudo mkdir -p /var/lib/cepcomunicacion/monitoring/{prometheus,grafana,loki}
sudo chown -R cepdeploy:cepdeploy /var/lib/cepcomunicacion
```

---

## Phase 2: Install Dependencies

**Duration:** 45 minutes

### 2.1 Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add cepdeploy to docker group
sudo usermod -aG docker cepdeploy

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Log out and back in for group changes to take effect
exit
# SSH back in as cepdeploy
```

### 2.2 Install PostgreSQL 16

```bash
# Add PostgreSQL APT repository
sudo apt-get install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

# Install PostgreSQL 16
sudo apt-get update
sudo apt-get install -y postgresql-16 postgresql-client-16

# Verify installation
psql --version
# Expected: psql (PostgreSQL) 16.x

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify status
sudo systemctl status postgresql
```

### 2.3 Install Redis 7.2

```bash
# Install Redis
sudo apt-get install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Make these changes:
# - bind 127.0.0.1 ::1  (localhost only)
# - requirepass YOUR_STRONG_PASSWORD  (uncomment and set password)
# - maxmemory 512mb  (limit memory usage)
# - maxmemory-policy allkeys-lru  (eviction policy)

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test connection
redis-cli
# > AUTH YOUR_STRONG_PASSWORD
# > PING
# Expected: PONG
# > exit
```

### 2.4 Install Nginx

```bash
# Install Nginx
sudo apt-get install -y nginx

# Stop Nginx (will configure later)
sudo systemctl stop nginx

# Verify installation
nginx -v
# Expected: nginx version: nginx/1.24.x or higher
```

### 2.5 Install pnpm (Node.js Package Manager)

```bash
# Node.js v22.20.0 is already installed
node --version
# Expected: v22.20.0

# Install pnpm globally
npm install -g pnpm@8.15.1

# Verify installation
pnpm --version
# Expected: 8.15.1
```

### 2.6 Install PM2 (Process Manager)

```bash
# PM2 is already installed globally
pm2 --version

# If not installed:
# npm install -g pm2@6.0.13

# Configure PM2 startup script
pm2 startup systemd -u cepdeploy --hp /home/cepdeploy

# Save PM2 configuration
pm2 save
```

---

## Phase 3: Application Deployment

**Duration:** 45 minutes

### 3.1 Clone Repository

```bash
# Navigate to application directory
cd /var/www/cepcomunicacion

# Clone repository
git clone https://github.com/SOLARIA-AGENCY/www.cepcomunicacion.com.git .

# Checkout production branch
git checkout migration/payload-nextjs-clean

# Verify repository
ls -la
# Should see: apps/, infra/, package.json, etc.
```

### 3.2 Install Dependencies

```bash
# Install all dependencies
pnpm install

# Expected output: "dependencies installed" with no errors
# This will take 5-10 minutes

# Verify installation
ls node_modules
# Should see hundreds of packages
```

### 3.3 Configure Environment Variables

```bash
# Create production environment file
cp apps/web-next/.env.example apps/web-next/.env.production

# Edit environment file
nano apps/web-next/.env.production
```

**Production Environment Variables:**

```bash
# ============================================
# CEPCOMUNICACION V2 - PRODUCTION ENVIRONMENT
# ============================================

# Application
NODE_ENV=production
PORT=3001
BASE_URL=https://www.cepcomunicacion.com

# Database (PostgreSQL 16)
DATABASE_URL=postgresql://cepcomunicacion:CHANGE_THIS_PASSWORD@localhost:5432/cepcomunicacion
POSTGRES_USER=cepcomunicacion
POSTGRES_PASSWORD=CHANGE_THIS_PASSWORD
POSTGRES_DB=cepcomunicacion

# Redis (Cache & Queue)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=CHANGE_THIS_PASSWORD

# Payload CMS
PAYLOAD_SECRET=GENERATE_WITH_openssl_rand_-hex_32
PAYLOAD_PUBLIC_SERVER_URL=https://www.cepcomunicacion.com
PAYLOAD_PUBLIC_ADMIN_URL=https://www.cepcomunicacion.com/admin

# Email (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@cepcomunicacion.com
SMTP_PASSWORD=YOUR_BREVO_API_KEY
SMTP_FROM=noreply@cepcomunicacion.com
SMTP_FROM_NAME=CEP Formación

# Mailchimp Integration
MAILCHIMP_API_KEY=YOUR_MAILCHIMP_API_KEY
MAILCHIMP_SERVER_PREFIX=us21  # Check your Mailchimp dashboard
MAILCHIMP_LIST_ID=YOUR_LIST_ID

# Meta Ads API
META_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN
META_APP_ID=YOUR_APP_ID
META_APP_SECRET=YOUR_APP_SECRET

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
WHATSAPP_ACCESS_TOKEN=YOUR_WHATSAPP_TOKEN
WHATSAPP_BUSINESS_ACCOUNT_ID=YOUR_BUSINESS_ACCOUNT_ID

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Monitoring & Observability
GRAFANA_PASSWORD=STRONG_PASSWORD_HERE
HEALTHCHECKS_IO_URL=https://hc-ping.com/YOUR_UUID

# Backup Configuration
S3_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY  # Optional
S3_SECRET_ACCESS_KEY=YOUR_AWS_SECRET  # Optional
S3_BUCKET=cepcomunicacion-backups
S3_REGION=eu-west-1
S3_ENDPOINT=https://s3.eu-west-1.amazonaws.com  # Or MinIO endpoint

# Security
ALLOWED_ORIGINS=https://www.cepcomunicacion.com,https://cepcomunicacion.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict

# Logging
LOG_LEVEL=info  # production: info, development: debug
```

**Generate Strong Passwords:**

```bash
# Generate PAYLOAD_SECRET
openssl rand -hex 32

# Generate database password
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 32

# Generate Grafana password
openssl rand -base64 16
```

### 3.4 Build Application

```bash
# Build Next.js application
cd apps/web-next
pnpm build

# Expected output:
# - "Compiled successfully"
# - ".next/static/..." files created
# - Build time: 2-5 minutes

# Verify build
ls -lh .next/
# Should see: static/, server/, cache/ directories
```

---

## Phase 4: Database Setup

**Duration:** 30 minutes

### 4.1 Create PostgreSQL Database & User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database user
CREATE USER cepcomunicacion WITH PASSWORD 'YOUR_STRONG_PASSWORD';

# Create database
CREATE DATABASE cepcomunicacion OWNER cepcomunicacion;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cepcomunicacion TO cepcomunicacion;

# Exit psql
\q
```

### 4.2 Test Database Connection

```bash
# Test connection
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT version();"

# Expected: PostgreSQL version output
```

### 4.3 Run Database Migrations

```bash
# Navigate to project root
cd /var/www/cepcomunicacion

# Run all migrations
for file in infra/postgres/migrations/*.sql; do
  echo "Running migration: $file"
  PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -f "$file"
done

# Verify tables created
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "\dt"

# Expected: List of 14+ tables (users, courses, students, leads, etc.)
```

### 4.4 Seed Initial Data

```bash
# Run seed script
cd /var/www/cepcomunicacion
PAYLOAD_SECRET="YOUR_SECRET" DATABASE_URL="postgresql://cepcomunicacion:YOUR_PASSWORD@localhost:5432/cepcomunicacion" node apps/cms/scripts/seed.js

# Expected output:
# - "Seeding database..."
# - "Created admin user"
# - "Created 5 cycles"
# - "Created 3 campuses"
# - "Seeding complete"

# Verify seed data
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM cycles; SELECT COUNT(*) FROM campuses;"
```

---

## Phase 5: SSL/TLS Configuration

**Duration:** 30 minutes

### 5.1 Install Certbot

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
# Expected: certbot 2.x.x or higher
```

### 5.2 Configure Nginx (Initial HTTP-only)

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cepcomunicacion
```

**Initial Nginx Configuration (HTTP only, for Certbot):**

```nginx
server {
    listen 80;
    server_name www.cepcomunicacion.com cepcomunicacion.com;

    root /var/www/cepcomunicacion/apps/web-next/.next;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cepcomunicacion /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5.3 Obtain SSL Certificate

```bash
# Create certbot directory
sudo mkdir -p /var/www/certbot

# Obtain certificate (interactive)
sudo certbot --nginx -d www.cepcomunicacion.com -d cepcomunicacion.com

# Follow prompts:
# - Enter email: admin@cepcomunicacion.com
# - Agree to terms: Yes
# - Share email: No (optional)
# - Redirect HTTP to HTTPS: Yes (option 2)

# Expected output:
# - "Congratulations! You have successfully enabled HTTPS..."
# - Certificate locations displayed
```

### 5.4 Update Nginx Configuration (HTTPS)

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/cepcomunicacion
```

**Production Nginx Configuration (HTTPS):**

```nginx
# HTTP (redirect to HTTPS)
server {
    listen 80;
    server_name www.cepcomunicacion.com cepcomunicacion.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS (main site)
server {
    listen 443 ssl http2;
    server_name www.cepcomunicacion.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/www.cepcomunicacion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.cepcomunicacion.com/privkey.pem;

    # SSL Configuration (Strong Security)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers (additional to Next.js headers)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Client body size (for file uploads)
    client_max_body_size 10M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets (cache headers)
    location /_next/static/ {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Grafana (monitoring dashboard)
    location /monitoring/ {
        proxy_pass http://localhost:3003/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Authentication required
        auth_basic "Monitoring Dashboard";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}

# Redirect apex domain to www
server {
    listen 443 ssl http2;
    server_name cepcomunicacion.com;

    ssl_certificate /etc/letsencrypt/live/www.cepcomunicacion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.cepcomunicacion.com/privkey.pem;

    return 301 https://www.cepcomunicacion.com$request_uri;
}
```

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5.5 Configure Auto-Renewal

```bash
# Create renewal cron job
sudo crontab -e

# Add line (runs daily at 3 AM):
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"

# Test renewal (dry run)
sudo certbot renew --dry-run

# Expected: "Congratulations, all simulated renewals succeeded"
```

### 5.6 Create HTTP Authentication for Monitoring

```bash
# Install apache2-utils
sudo apt-get install -y apache2-utils

# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Enter password when prompted
# This protects /monitoring/ endpoint
```

---

## Phase 6: Monitoring Stack

**Duration:** 20 minutes

### 6.1 Deploy Monitoring Containers

```bash
# Navigate to monitoring directory
cd /var/www/cepcomunicacion/infra/monitoring

# Copy environment template
cp .env.example .env

# Edit environment
nano .env

# Set these values:
# - GRAFANA_PASSWORD=your_strong_password
# - SMTP credentials (for alerts)

# Deploy monitoring stack
./scripts/deploy.sh start

# Verify containers
docker-compose -f docker-compose.monitoring.yml ps

# Expected: All 12 containers running (Up status)
```

### 6.2 Configure Grafana

```bash
# Wait 30 seconds for Grafana to start
sleep 30

# Access Grafana
# URL: https://www.cepcomunicacion.com/monitoring/
# Login: admin / YOUR_GRAFANA_PASSWORD

# Import dashboards (already provisioned automatically)
# - System Overview
# - Application Performance
# - Database Performance
# - User Experience
# - Business Metrics
```

### 6.3 Verify Prometheus Targets

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'

# Expected: All targets showing "health": "up"
```

---

## Phase 7: Backup Configuration

**Duration:** 15 minutes

### 7.1 Install Backup Scripts

```bash
# Copy backup scripts
sudo cp -r /var/www/cepcomunicacion/infra/backup/scripts /opt/cepcomunicacion-backup/

# Make scripts executable
sudo chmod +x /opt/cepcomunicacion-backup/*.sh

# Edit database credentials in scripts
sudo nano /opt/cepcomunicacion-backup/backup-database.sh
# Update DB_PASSWORD with your PostgreSQL password

sudo nano /opt/cepcomunicacion-backup/backup-media.sh
# Update SOURCE_DIR if needed

sudo nano /opt/cepcomunicacion-backup/backup-config.sh
# Update APP_DIR if needed
```

### 7.2 Install Backup Cron Jobs

```bash
# Install crontab
crontab /var/www/cepcomunicacion/infra/backup/crontab

# Verify cron jobs
crontab -l

# Expected: 5 cron jobs (daily backups, weekly backup, health check)
```

### 7.3 Test Backup Scripts

```bash
# Test database backup
sudo /opt/cepcomunicacion-backup/backup-database.sh

# Verify backup created
ls -lh /var/backups/cepcomunicacion/database/

# Expected: cepcomunicacion_YYYY-MM-DD_HH-MM-SS.dump file

# Test media backup
sudo /opt/cepcomunicacion-backup/backup-media.sh

# Test config backup
sudo /opt/cepcomunicacion-backup/backup-config.sh
```

---

## Phase 8: Testing & Validation

**Duration:** 30 minutes

### 8.1 Start Application

```bash
# Navigate to application directory
cd /var/www/cepcomunicacion/apps/web-next

# Start application with PM2
pm2 start npm --name "cepcomunicacion" -- run start

# Check status
pm2 status

# Expected: "cepcomunicacion" showing "online" status

# Save PM2 configuration
pm2 save
```

### 8.2 Health Check Tests

```bash
# Test application health endpoint
curl -f https://www.cepcomunicacion.com/api/health

# Expected: {"status":"healthy","timestamp":"...","services":{"database":"up","application":"up"}}

# Test homepage
curl -I https://www.cepcomunicacion.com

# Expected: HTTP/2 200

# Test admin panel
curl -I https://www.cepcomunicacion.com/admin

# Expected: HTTP/2 200 (or 302 redirect to login)

# Test SSL certificate
echo | openssl s_client -connect www.cepcomunicacion.com:443 -servername www.cepcomunicacion.com 2>/dev/null | openssl x509 -noout -dates

# Expected: Valid dates showing notBefore and notAfter
```

### 8.3 Performance Tests

```bash
# Install Apache Bench (if not installed)
sudo apt-get install -y apache2-utils

# Run load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://www.cepcomunicacion.com/

# Expected:
# - Requests per second: > 50
# - Time per request (mean): < 200ms
# - Failed requests: 0
```

### 8.4 Security Tests

```bash
# Test HTTPS redirect
curl -I http://www.cepcomunicacion.com

# Expected: HTTP/1.1 301 Moved Permanently
#           Location: https://www.cepcomunicacion.com/

# Test security headers
curl -I https://www.cepcomunicacion.com | grep -i "strict-transport\|x-frame\|x-content-type"

# Expected:
# - strict-transport-security: max-age=31536000
# - x-frame-options: DENY
# - x-content-type-options: nosniff

# Test SSL certificate grade (online tool)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=www.cepcomunicacion.com
# Target: A or A+ rating
```

### 8.5 Functional Tests

**Manual Testing Checklist:**

- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] Course catalog displays courses
- [ ] Course detail pages load
- [ ] Contact form submission works
- [ ] Admin login works (https://www.cepcomunicacion.com/admin)
- [ ] Admin dashboard displays
- [ ] Can create/edit/delete a course
- [ ] Can create/edit/delete a student
- [ ] Media upload works
- [ ] Search functionality works
- [ ] Responsive design works (mobile, tablet)
- [ ] No console errors in browser

### 8.6 Monitor Logs

```bash
# Application logs (PM2)
pm2 logs cepcomunicacion --lines 50

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# Check for errors (should be minimal or zero)
```

---

## Phase 9: Go-Live

**Duration:** 15 minutes

### 9.1 Final Verification

```bash
# Run comprehensive health check
curl https://www.cepcomunicacion.com/api/health | jq

# Check all services
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server
pm2 status

# All should show "active (running)" or "online"
```

### 9.2 Update DNS (If Needed)

If deploying to a new server, update DNS:

```
# DNS Configuration
Type: A
Name: @
Value: 148.230.118.124
TTL: 3600

Type: A
Name: www
Value: 148.230.118.124
TTL: 3600

Type: AAAA (optional, if IPv6)
Name: @
Value: 2a02:4780:28:b773::1
TTL: 3600
```

**DNS Propagation:**
- Wait 5-60 minutes for DNS propagation
- Check: `dig www.cepcomunicacion.com`
- Expected: 148.230.118.124

### 9.3 Enable Monitoring Alerts

```bash
# Test email alerts
cd /var/www/cepcomunicacion/infra/monitoring
./scripts/test-alerts.sh

# Expected: Alert email received

# Test Slack webhook (if configured)
curl -X POST YOUR_SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"CEPComunicacion deployed successfully!"}'
```

### 9.4 Deployment Complete

**Deployment Checklist (Final):**

- [ ] Application running on PM2
- [ ] Nginx serving HTTPS traffic
- [ ] PostgreSQL database operational
- [ ] Redis cache operational
- [ ] All health checks passing
- [ ] Monitoring stack operational
- [ ] Backups scheduled
- [ ] SSL certificate valid
- [ ] DNS pointing to server
- [ ] No errors in logs
- [ ] Performance metrics acceptable

**Success Criteria:**
- ✅ Homepage loads in < 2 seconds
- ✅ All Core Web Vitals passing
- ✅ No 5xx errors
- ✅ SSL certificate valid
- ✅ Security headers present
- ✅ Monitoring dashboards accessible

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

If critical issues occur immediately after deployment:

```bash
# 1. Stop current application
pm2 stop cepcomunicacion

# 2. Restore previous version from Git
cd /var/www/cepcomunicacion
git checkout HEAD~1  # or specific commit hash

# 3. Rebuild application
cd apps/web-next
pnpm build

# 4. Restart application
pm2 restart cepcomunicacion

# 5. Verify
curl -f https://www.cepcomunicacion.com/api/health
```

### Database Rollback

```bash
# 1. Stop application
pm2 stop cepcomunicacion

# 2. Restore database from backup
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion < /var/backups/cepcomunicacion/database/cepcomunicacion_YYYY-MM-DD.dump

# 3. Restart application
pm2 restart cepcomunicacion

# 4. Verify data integrity
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT COUNT(*) FROM users;"
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Port 80 Already in Use

**Symptom:** Nginx fails to start with "Address already in use"

**Solution:**
```bash
# Check what's using port 80
sudo lsof -i :80

# If Apache2 is running:
sudo systemctl stop apache2
sudo systemctl disable apache2

# Restart Nginx
sudo systemctl restart nginx
```

#### Issue 2: Database Connection Failed

**Symptom:** Application shows "Database connection error"

**Solution:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# If not running:
sudo systemctl start postgresql

# Test connection manually
PGPASSWORD='YOUR_PASSWORD' psql -h localhost -U cepcomunicacion -d cepcomunicacion -c "SELECT 1;"

# Check DATABASE_URL in .env.production
nano /var/www/cepcomunicacion/apps/web-next/.env.production
```

#### Issue 3: PM2 Application Not Starting

**Symptom:** PM2 shows "errored" status

**Solution:**
```bash
# Check logs
pm2 logs cepcomunicacion --err

# Common causes:
# - Missing environment variables
# - Port 3001 already in use
# - Build files missing

# Rebuild application
cd /var/www/cepcomunicacion/apps/web-next
pnpm build

# Restart
pm2 restart cepcomunicacion
```

#### Issue 4: SSL Certificate Issues

**Symptom:** Browser shows "Your connection is not private"

**Solution:**
```bash
# Check certificate validity
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

#### Issue 5: High Memory Usage

**Symptom:** Server becomes slow, OOM errors

**Solution:**
```bash
# Check memory usage
free -h

# Check top memory consumers
ps aux --sort=-%mem | head -n 10

# Restart services if needed
pm2 restart cepcomunicacion
docker-compose -f /var/www/cepcomunicacion/infra/monitoring/docker-compose.monitoring.yml restart
```

---

## Post-Deployment Tasks

### Week 1: Monitoring & Optimization

- [ ] Monitor Grafana dashboards daily
- [ ] Review error logs daily
- [ ] Optimize slow queries identified by monitoring
- [ ] Fine-tune alert thresholds
- [ ] Document any issues and resolutions

### Week 2: Performance Tuning

- [ ] Analyze Core Web Vitals data
- [ ] Optimize database indexes based on query patterns
- [ ] Configure Redis cache TTLs
- [ ] Review and optimize API response times
- [ ] Load test with realistic traffic

### Month 1: Security Audit

- [ ] Review audit logs for suspicious activity
- [ ] Update all dependencies
- [ ] Run security scan (e.g., OWASP ZAP)
- [ ] Review and update firewall rules
- [ ] Test disaster recovery procedures

---

## Support & Escalation

### Documentation
- **Deployment Guide:** This document
- **Security Implementation:** `/SECURITY_IMPLEMENTATION.md`
- **Disaster Recovery:** `/infra/backup/DISASTER_RECOVERY.md`
- **Monitoring Guide:** `/infra/monitoring/README.md`

### Contacts
- **Development Team:** SOLARIA AGENCY
- **Client:** CEP Formación
- **Server Provider:** Hostinger Support

### Emergency Procedures
1. **Application Down:** Run rollback procedure (< 5 minutes)
2. **Database Corruption:** Restore from backup (1-2 hours)
3. **Server Compromised:** Follow security incident response plan
4. **Data Loss:** Contact Hostinger support + restore from S3 backup

---

## Appendix

### A. Service Ports Reference

| Service | Port | Access | Purpose |
|---------|------|--------|---------|
| Nginx | 80 | Public | HTTP (redirect to HTTPS) |
| Nginx | 443 | Public | HTTPS (main application) |
| Next.js | 3001 | Internal | Application server |
| PostgreSQL | 5432 | Localhost | Database |
| Redis | 6379 | Localhost | Cache & queue |
| Prometheus | 9090 | Internal | Metrics collection |
| Grafana | 3003 | Internal | Monitoring dashboard |
| Alertmanager | 9093 | Internal | Alert routing |
| Uptime Kuma | 3004 | Internal | Uptime monitoring |

### B. File Locations

| Component | Location |
|-----------|----------|
| Application | `/var/www/cepcomunicacion` |
| Nginx Config | `/etc/nginx/sites-available/cepcomunicacion` |
| SSL Certificates | `/etc/letsencrypt/live/www.cepcomunicacion.com/` |
| Logs | `/var/log/cepcomunicacion/` |
| Backups | `/var/backups/cepcomunicacion/` |
| Monitoring Data | `/var/lib/cepcomunicacion/monitoring/` |
| PM2 Logs | `/home/cepdeploy/.pm2/logs/` |

### C. Useful Commands

```bash
# View application logs
pm2 logs cepcomunicacion

# Restart application
pm2 restart cepcomunicacion

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql

# Restart Redis
sudo systemctl restart redis-server

# View monitoring stack
docker-compose -f /var/www/cepcomunicacion/infra/monitoring/docker-compose.monitoring.yml ps

# Run backup manually
sudo /opt/cepcomunicacion-backup/backup-database.sh

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
htop
```

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2025-10-31
**Next Review:** 2026-01-31

**Generated by:** Claude AI Assistant (Anthropic)
**For:** SOLARIA AGENCY → CEP FORMACIÓN
**Project:** CEPComunicacion v2
