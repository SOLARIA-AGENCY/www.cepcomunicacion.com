# SOLARIA Demo Server Deployment Guide

**Server:** Hostinger VPS srv943151
**IP:** 148.230.118.124 (IPv4) / 2a02:4780:28:b773::1 (IPv6)
**OS:** Ubuntu 25.04 (Plucky Puffin)
**Purpose:** CEPComunicacion v2 Demo/Staging Deployment

---

## Current Server Status (Pre-Deployment)

### Installed Services (Active)
- ✅ Apache2 (port 80) - **NEEDS: Disable before Nginx**
- ✅ MariaDB 11.4.7 (port 3306, localhost only)
- ✅ PHP 8.4.5
- ✅ Node.js v22.20.0
- ✅ PM2 6.0.13
- ✅ Git 2.48.1

### Missing/Inactive Services
- ❌ Nginx (installed but inactive) - **NEEDS: Configure and activate**
- ❌ UFW (installed but inactive) - **CRITICAL: Enable firewall**
- ❌ PostgreSQL - **NEEDS: Install for Payload CMS**
- ❌ Redis - **NEEDS: Install for rate limiting**
- ❌ SSL Certificate - **CRITICAL: Install Let's Encrypt**

### Security Concerns (URGENT)
- 🔴 **UFW firewall disabled** - Server exposed to all ports
- 🔴 **HTTP only (port 80)** - No HTTPS/SSL configured
- 🔴 **Apache running** - Conflicts with Nginx deployment
- 🟡 **No fail2ban** - SSH brute force attacks not mitigated
- 🟡 **No automatic backups** - Data loss risk

---

## Deployment Plan (Step-by-Step)

### Phase 1: Security Hardening (URGENT - Do First)

#### Step 1.1: Enable UFW Firewall
```bash
# SSH to server
ssh root@148.230.118.124

# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp   # SSH (CRITICAL - don't lock yourself out!)
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS

# Enable firewall
sudo ufw enable

# Verify
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

#### Step 1.2: Install and Configure Fail2Ban
```bash
# Install
sudo apt update
sudo apt install fail2ban -y

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
sudo nano /etc/fail2ban/jail.local

# Set:
# [DEFAULT]
# bantime  = 3600
# findtime = 600
# maxretry = 5
#
# [sshd]
# enabled = true

# Start fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Verify
sudo fail2ban-client status sshd
```

#### Step 1.3: Disable Apache2 (Conflicts with Nginx)
```bash
# Stop Apache
sudo systemctl stop apache2

# Disable from starting on boot
sudo systemctl disable apache2

# Verify Apache is stopped
sudo systemctl status apache2
# Expected: "inactive (dead)"

# Verify port 80 is free
sudo netstat -tuln | grep :80
# Expected: No output (port free)
```

### Phase 2: Install Required Services

#### Step 2.1: Install PostgreSQL 16
```bash
# Add PostgreSQL repository
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-client-16

# Verify installation
psql --version
# Expected: psql (PostgreSQL) 16.x

# Check status
sudo systemctl status postgresql
# Expected: active (running)

# Verify PostgreSQL only listens on localhost
sudo netstat -plnt | grep 5432
# Expected: 127.0.0.1:5432 (NOT 0.0.0.0)
```

#### Step 2.2: Create PostgreSQL Database and User
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE cepcomunicacion_demo;

# Create user with password
CREATE USER cep_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cepcomunicacion_demo TO cep_user;

# Grant schema permissions (PostgreSQL 15+)
\c cepcomunicacion_demo
GRANT ALL ON SCHEMA public TO cep_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cep_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cep_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cep_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cep_user;

# Exit psql
\q

# Test connection
psql -U cep_user -d cepcomunicacion_demo -h localhost
# Enter password when prompted
# Expected: Successfully connected
\q
```

**Save this connection string:**
```
postgresql://cep_user:CHANGE_THIS_PASSWORD@localhost:5432/cepcomunicacion_demo
```

#### Step 2.3: Install Redis
```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis to listen on localhost only
sudo nano /etc/redis/redis.conf

# Ensure this line exists:
# bind 127.0.0.1 ::1

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Expected: PONG

# Verify Redis only listens on localhost
sudo netstat -plnt | grep 6379
# Expected: 127.0.0.1:6379
```

### Phase 3: SSL Certificate Setup

#### Step 3.1: Configure DNS (Prerequisite)
**Before running certbot, ensure DNS is configured:**

| Record Type | Name | Value | TTL |
|-------------|------|-------|-----|
| A | cepcomunicacion.com | 148.230.118.124 | 3600 |
| A | www.cepcomunicacion.com | 148.230.118.124 | 3600 |
| AAAA | cepcomunicacion.com | 2a02:4780:28:b773::1 | 3600 |
| AAAA | www.cepcomunicacion.com | 2a02:4780:28:b773::1 | 3600 |

**Verify DNS propagation:**
```bash
dig cepcomunicacion.com +short
# Expected: 148.230.118.124

dig www.cepcomunicacion.com +short
# Expected: 148.230.118.124
```

#### Step 3.2: Install Certbot
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

#### Step 3.3: Obtain SSL Certificate
```bash
# Stop any services on port 80
sudo systemctl stop apache2
sudo systemctl stop nginx

# Obtain certificate (standalone mode)
sudo certbot certonly --standalone \
  -d cepcomunicacion.com \
  -d www.cepcomunicacion.com \
  --email admin@solaria.agency \
  --agree-tos \
  --no-eff-email

# Certificates will be saved to:
# /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem
# /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem

# Verify certificates exist
sudo ls -la /etc/letsencrypt/live/cepcomunicacion.com/
```

#### Step 3.4: Configure Auto-Renewal
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Expected: "Congratulations, all simulated renewals succeeded"

# Certbot auto-installs renewal timer
sudo systemctl status certbot.timer
# Expected: active (running)
```

### Phase 4: Configure Nginx

#### Step 4.1: Create Nginx Site Configuration
```bash
# Create configuration file
sudo nano /etc/nginx/sites-available/cepcomunicacion
```

**Paste this configuration:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name cepcomunicacion.com www.cepcomunicacion.com;

    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cepcomunicacion.com www.cepcomunicacion.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem;

    # SSL Configuration (TLS 1.3 preferred)
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers (defense in depth with Next.js)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Logs
    access_log /var/log/nginx/cepcomunicacion_access.log;
    error_log /var/log/nginx/cepcomunicacion_error.log;

    # Rate Limiting Zones
    limit_req_zone $binary_remote_addr zone=gdpr_limit:10m rate=1r/h;
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # Proxy to Next.js (port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limit GDPR export endpoint (1 request per hour)
    location /api/gdpr/export {
        limit_req zone=gdpr_limit burst=2 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limit other API endpoints (10 requests per second)
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 4.2: Enable Site and Start Nginx
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cepcomunicacion /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
# Expected: "syntax is ok" and "test is successful"

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx
# Expected: active (running)

# Verify ports
sudo netstat -tuln | grep -E ":80|:443"
# Expected: 0.0.0.0:80 and 0.0.0.0:443
```

### Phase 5: Deploy Application

#### Step 5.1: Create Deployment Directory
```bash
# Create directory
sudo mkdir -p /var/www/cepcomunicacion
cd /var/www/cepcomunicacion

# Set ownership
sudo chown -R root:root /var/www/cepcomunicacion
```

#### Step 5.2: Clone Repository
```bash
# Clone from GitHub
git clone https://github.com/YOUR_ORG/cepcomunicacion.git /var/www/cepcomunicacion

# Or upload via SCP from local machine:
# scp -r /path/to/local/cepcomunicacion root@148.230.118.124:/var/www/
```

#### Step 5.3: Create Environment File
```bash
# Create production .env
nano /var/www/cepcomunicacion/apps/web-next/.env.production

# Add these variables:
```

```bash
# Database
DATABASE_URL=postgresql://cep_user:CHANGE_THIS_PASSWORD@localhost:5432/cepcomunicacion_demo

# Payload CMS
PAYLOAD_SECRET=GENERATE_WITH_openssl_rand_base64_48
NEXT_PUBLIC_SERVER_URL=https://cepcomunicacion.com

# Redis
REDIS_URL=redis://localhost:6379

# Node Environment
NODE_ENV=production
```

**Generate PAYLOAD_SECRET:**
```bash
openssl rand -base64 48
# Copy output to .env.production
```

**Secure .env file:**
```bash
chmod 600 /var/www/cepcomunicacion/apps/web-next/.env.production
```

#### Step 5.4: Install Dependencies and Build
```bash
cd /var/www/cepcomunicacion/apps/web-next

# Install dependencies
npm install --production

# Build Next.js
npm run build

# Verify build succeeded
ls -la .next/
# Should see build artifacts
```

#### Step 5.5: Configure PM2
```bash
# Create PM2 ecosystem file
nano /var/www/cepcomunicacion/apps/web-next/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'cepcomunicacion-demo',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/cepcomunicacion/apps/web-next',
    instances: 1, // 1 instance on demo server (low RAM)
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '800M', // Restart if exceeds 800MB
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_file: '/var/www/cepcomunicacion/apps/web-next/.env.production',
    error_file: '/var/log/pm2/cepcomunicacion-error.log',
    out_file: '/var/log/pm2/cepcomunicacion-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
```

#### Step 5.6: Start Application
```bash
# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R root:root /var/log/pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command it outputs (sudo env PATH=...)

# Verify application is running
pm2 status
# Expected: cepcomunicacion-demo | online

# Check logs
pm2 logs cepcomunicacion-demo --lines 50
```

### Phase 6: Database Migration
```bash
# Run Payload migrations (if any)
cd /var/www/cepcomunicacion/apps/web-next

# Generate Payload types
npm run payload generate:types

# Seed database with demo data (optional)
npm run seed

# Verify database connection
psql -U cep_user -d cepcomunicacion_demo -h localhost -c "\dt"
# Should show Payload tables: users, students, leads, etc.
```

### Phase 7: Automated Backups

#### Step 7.1: Create Backup Script
```bash
# Create backup directory
sudo mkdir -p /var/backups/postgresql
sudo chown postgres:postgres /var/backups/postgresql

# Create backup script
sudo nano /usr/local/bin/backup-postgres.sh
```

```bash
#!/bin/bash
# PostgreSQL Backup Script for CEPComunicacion Demo

BACKUP_DIR="/var/backups/postgresql"
DB_NAME="cepcomunicacion_demo"
DB_USER="postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
else
    echo "Backup FAILED!" >&2
    exit 1
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Test backup
sudo -u postgres /usr/local/bin/backup-postgres.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-postgres.sh >> /var/log/postgres-backup.log 2>&1
```

---

## Post-Deployment Verification

### 1. Test HTTPS and Security Headers
```bash
# From local machine
curl -I https://cepcomunicacion.com | grep -E "HTTP|Strict-Transport|X-Frame"

# Expected:
# HTTP/2 200
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
```

### 2. Test GDPR Export API
```bash
curl -X POST https://cepcomunicacion.com/api/gdpr/export \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected: 200 OK or 429 Rate Limit
```

### 3. Test Payload Admin
```bash
# Open browser: https://cepcomunicacion.com/admin
# Expected: Payload login page
```

### 4. Test SSL Certificate
```bash
# Check SSL grade
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=cepcomunicacion.com
# Target: A or A+ rating
```

### 5. Test Security Headers
```bash
# Visit: https://securityheaders.com/?q=https://cepcomunicacion.com
# Target: Grade A or A+
```

---

## Monitoring Commands

```bash
# SSH to server
ssh root@148.230.118.124

# Check application status
pm2 status
pm2 logs cepcomunicacion-demo --lines 50

# Check Nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/cepcomunicacion_access.log

# Check PostgreSQL status
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis status
redis-cli ping
redis-cli info stats

# Check firewall status
sudo ufw status verbose

# Check fail2ban status
sudo fail2ban-client status sshd

# Check SSL certificate
sudo certbot certificates
```

---

## Resource Usage (Expected)

**Server Resources Available:**
- CPU: 1 vCore AMD EPYC
- RAM: 3.8 GB
- Storage: 48 GB SSD (44 GB available)

**Application Resource Usage (Estimated):**
- Next.js (PM2): 500-800 MB RAM
- PostgreSQL: 200-400 MB RAM
- Redis: 50-100 MB RAM
- Nginx: 20-50 MB RAM
- **Total:** 800-1400 MB RAM (~35% of available)

**Storage Usage (Estimated):**
- Application: 500 MB
- Database: 100-500 MB (grows with data)
- Backups: 1-5 GB (30 days retention)
- Logs: 100-500 MB
- **Total:** 2-6 GB (~10% of available)

---

## Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs cepcomunicacion-demo --err

# Check environment variables
cat /var/www/cepcomunicacion/apps/web-next/.env.production

# Check database connection
psql -U cep_user -d cepcomunicacion_demo -h localhost

# Restart application
pm2 restart cepcomunicacion-demo
```

### Nginx 502 Bad Gateway
```bash
# Check if Next.js is running
pm2 status

# Check if port 3000 is listening
sudo netstat -tuln | grep 3000

# Check Nginx error logs
sudo tail -f /var/log/nginx/cepcomunicacion_error.log

# Restart Nginx
sudo systemctl restart nginx
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

## Emergency Contacts

**Server Issues:** admin@solaria.agency
**Application Issues:** dev@solaria.agency
**Security Issues:** security@solaria.agency

**Server Details:**
- IP: 148.230.118.124
- Provider: Hostinger (VPS srv943151)
- OS: Ubuntu 25.04

---

**Deployment Completed:** [Date]
**Deployed By:** [Name]
**Next Review:** [Date + 1 month]

---

**End of Deployment Guide**
