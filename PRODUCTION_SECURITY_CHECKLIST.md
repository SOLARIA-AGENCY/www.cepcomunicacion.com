# Production Security Deployment Checklist

**Server:** Hostinger VPS srv943151 (148.230.118.124)
**Project:** CEPComunicacion v2
**Date:** 2025-10-31

---

## Pre-Deployment Security Hardening

### 1. Server Hardening (Ubuntu 25.04)

#### 1.1 Enable and Configure UFW Firewall
```bash
# SSH to server
ssh root@148.230.118.124

# Enable UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (CRITICAL - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow PostgreSQL (localhost only - already configured)
# No action needed, PostgreSQL bound to 127.0.0.1

# Enable firewall
sudo ufw enable

# Verify status
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
22/tcp (v6)                ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443/tcp (v6)               ALLOW       Anywhere (v6)
```

#### 1.2 Install and Configure Fail2Ban
```bash
# Install fail2ban
sudo apt update
sudo apt install fail2ban -y

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
sudo nano /etc/fail2ban/jail.local

# Set these values:
# [DEFAULT]
# bantime  = 3600        # Ban for 1 hour
# findtime = 600         # 10 minute window
# maxretry = 5           # Max 5 attempts
#
# [sshd]
# enabled = true
# port    = ssh
# logpath = /var/log/auth.log

# Restart fail2ban
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status sshd
```

#### 1.3 Configure Automatic Security Updates
```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades -y

# Configure
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Enable automatic updates for security patches only
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Verify configuration
cat /etc/apt/apt.conf.d/20auto-upgrades
```

#### 1.4 Harden SSH Configuration
```bash
# Backup original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Apply these settings:
# PermitRootLogin yes                    # Keep for now (using key auth)
# PasswordAuthentication no              # Disable password auth (keys only)
# PubkeyAuthentication yes               # Enable key-based auth
# ChallengeResponseAuthentication no     # Disable challenge-response
# UsePAM yes                             # Keep PAM enabled
# X11Forwarding no                       # Disable X11 (not needed)
# MaxAuthTries 3                         # Max 3 login attempts
# ClientAliveInterval 300                # 5 minute idle timeout
# ClientAliveCountMax 2                  # Disconnect after 2 keepalive failures

# Restart SSH (CAREFUL - test in new terminal first!)
sudo systemctl restart sshd

# Test SSH in new terminal BEFORE closing this one
# ssh root@148.230.118.124
```

### 2. SSL/TLS Certificate Setup

#### 2.1 Install Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Or for Apache:
# sudo apt install certbot python3-certbot-apache -y
```

#### 2.2 Configure DNS (Prerequisite)
```bash
# Ensure DNS A records point to 148.230.118.124
# cepcomunicacion.com         A    148.230.118.124
# www.cepcomunicacion.com     A    148.230.118.124
# admin.cepcomunicacion.com   A    148.230.118.124

# Verify DNS propagation
dig cepcomunicacion.com +short
# Should return: 148.230.118.124
```

#### 2.3 Obtain SSL Certificate
```bash
# Stop Apache/Nginx temporarily
sudo systemctl stop apache2
# or: sudo systemctl stop nginx

# Obtain certificate (standalone mode)
sudo certbot certonly --standalone -d cepcomunicacion.com -d www.cepcomunicacion.com

# Or use nginx plugin:
# sudo certbot --nginx -d cepcomunicacion.com -d www.cepcomunicacion.com

# Follow prompts:
# - Enter email: admin@solaria.agency
# - Agree to Terms of Service: Yes
# - Share email with EFF: No (optional)

# Certificates installed to:
# /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem
# /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem
```

#### 2.4 Configure Auto-Renewal
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Expected: "Congratulations, all simulated renewals succeeded"

# Certbot installs cron job automatically
# Verify renewal cron:
sudo systemctl status certbot.timer

# Manually check renewal config
cat /etc/letsencrypt/renewal/cepcomunicacion.com.conf
```

### 3. Nginx Configuration (Production)

#### 3.1 Install Nginx (if not already installed)
```bash
# Nginx already installed (version 1.26.3)
nginx -v

# Ensure nginx is disabled (we'll enable after config)
sudo systemctl stop nginx
sudo systemctl disable nginx
```

#### 3.2 Create Nginx Config for Next.js
```bash
# Create new site config
sudo nano /etc/nginx/sites-available/cepcomunicacion

# Paste this configuration:
```

```nginx
# /etc/nginx/sites-available/cepcomunicacion

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

    # SSL Certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/cepcomunicacion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cepcomunicacion.com/privkey.pem;

    # SSL Configuration (Modern, TLS 1.3 only)
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers 'ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers (redundant with Next.js, but defense in depth)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logs
    access_log /var/log/nginx/cepcomunicacion_access.log;
    error_log /var/log/nginx/cepcomunicacion_error.log;

    # Rate Limiting (global)
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=gdpr_limit:10m rate=1r/h;

    # Proxy to Next.js (running on port 3000)
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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Rate limit GDPR export endpoint
    location /api/gdpr/export {
        limit_req zone=gdpr_limit burst=2 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rate limit API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Payload Admin (separate subdomain recommended in production)
    location /admin {
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

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cepcomunicacion /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Expected: "syntax is ok" and "test is successful"

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. PostgreSQL Hardening

```bash
# Verify PostgreSQL only listens on localhost
sudo netstat -plnt | grep 5432
# Expected: 127.0.0.1:5432 (NOT 0.0.0.0)

# Check PostgreSQL config
sudo nano /etc/postgresql/*/main/postgresql.conf
# Verify: listen_addresses = 'localhost'

# Check pg_hba.conf (authentication)
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Ensure only localhost connections allowed

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 5. Environment Variables (Production)

```bash
# Create production .env file
sudo nano /var/www/cepcomunicacion/.env.production

# Add these variables (replace with real values):
```

```bash
# Database
DATABASE_URL=postgresql://cep_user:STRONG_PASSWORD_HERE@localhost:5432/cepcomunicacion_prod

# Payload CMS
PAYLOAD_SECRET=GENERATE_WITH_openssl_rand_base64_48
NEXT_PUBLIC_SERVER_URL=https://cepcomunicacion.com

# Redis (for rate limiting - add after Redis setup)
REDIS_URL=redis://localhost:6379

# Email (Brevo/Mailgun)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-brevo-api-key

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXX

# Security
NODE_ENV=production
```

```bash
# Secure .env file
sudo chmod 600 /var/www/cepcomunicacion/.env.production
sudo chown root:root /var/www/cepcomunicacion/.env.production
```

### 6. Application Deployment

```bash
# Clone repository
cd /var/www/
sudo git clone https://github.com/solaria-agency/cepcomunicacion.git

# Install dependencies
cd cepcomunicacion/apps/web-next
npm install --production

# Build Next.js
npm run build

# Install PM2 globally (already installed)
npm install -g pm2

# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'cepcomunicacion',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/cepcomunicacion/apps/web-next',
    instances: 2, // Use 2 CPU cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    env_file: '/var/www/cepcomunicacion/.env.production',
    error_file: '/var/log/pm2/cepcomunicacion-error.log',
    out_file: '/var/log/pm2/cepcomunicacion-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Run the command it outputs

# Check application status
pm2 status
pm2 logs cepcomunicacion --lines 50
```

### 7. Database Backup (Automated)

```bash
# Create backup directory
sudo mkdir -p /var/backups/postgresql
sudo chown postgres:postgres /var/backups/postgresql

# Create backup script
sudo nano /usr/local/bin/backup-postgres.sh
```

```bash
#!/bin/bash
# PostgreSQL Backup Script

# Configuration
BACKUP_DIR="/var/backups/postgresql"
DB_NAME="cepcomunicacion_prod"
DB_USER="postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Create backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Check if backup succeeded
if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"

    # Delete backups older than retention period
    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
else
    echo "Backup FAILED!" >&2
    exit 1
fi
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Test backup
sudo -u postgres /usr/local/bin/backup-postgres.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add this line:
# 0 2 * * * /usr/local/bin/backup-postgres.sh >> /var/log/postgres-backup.log 2>&1

# Verify cron job
sudo crontab -l
```

---

## Post-Deployment Verification

### 1. Test Security Headers

```bash
# Test from local machine
curl -I https://cepcomunicacion.com | grep -E "Strict-Transport|X-Frame|X-Content"

# Expected:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
```

### 2. Test SSL Configuration

```bash
# Test SSL certificate
curl -v https://cepcomunicacion.com 2>&1 | grep "SSL certificate verify ok"

# Check SSL grade
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=cepcomunicacion.com
# Target: A or A+ rating
```

### 3. Test GDPR Export API

```bash
# Test from local machine
curl -X POST https://cepcomunicacion.com/api/gdpr/export \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected: Rate limit or successful export
```

### 4. Monitor Application

```bash
# SSH to server
ssh root@148.230.118.124

# Check PM2 status
pm2 status

# View logs
pm2 logs cepcomunicacion --lines 100

# Monitor CPU/Memory
pm2 monit

# Check Nginx access logs
sudo tail -f /var/log/nginx/cepcomunicacion_access.log

# Check Nginx error logs
sudo tail -f /var/log/nginx/cepcomunicacion_error.log
```

---

## Security Monitoring Commands

```bash
# Check UFW status
sudo ufw status verbose

# Check fail2ban status
sudo fail2ban-client status sshd

# Check for failed SSH attempts
sudo grep "Failed password" /var/log/auth.log | tail -20

# Check banned IPs
sudo fail2ban-client status sshd | grep "Banned IP list"

# Check SSL certificate expiry
sudo certbot certificates

# Check for security updates
sudo apt update
sudo apt list --upgradable | grep -i security

# Check open ports
sudo netstat -tuln | grep LISTEN

# Check running processes
sudo ps aux | grep -E "node|nginx|postgres"
```

---

## Emergency Procedures

### Revoke Compromised SSL Certificate
```bash
sudo certbot revoke --cert-path /etc/letsencrypt/live/cepcomunicacion.com/cert.pem
sudo certbot delete --cert-name cepcomunicacion.com
sudo certbot certonly --standalone -d cepcomunicacion.com -d www.cepcomunicacion.com
```

### Block IP Address Immediately
```bash
sudo ufw deny from <IP_ADDRESS>
sudo fail2ban-client set sshd banip <IP_ADDRESS>
```

### Restart Application
```bash
pm2 restart cepcomunicacion
pm2 reload cepcomunicacion  # Zero-downtime reload
```

### Restore Database from Backup
```bash
# List backups
ls -lh /var/backups/postgresql/

# Restore from backup
gunzip < /var/backups/postgresql/cepcomunicacion_prod_YYYYMMDD_HHMMSS.sql.gz | psql -U postgres -d cepcomunicacion_prod
```

---

## Compliance Audit Schedule

| Audit Type | Frequency | Next Due |
|------------|-----------|----------|
| Security headers check | Weekly | 2025-11-07 |
| SSL certificate check | Monthly | 2025-11-30 |
| Database backup test | Monthly | 2025-11-30 |
| Dependency updates | Weekly | 2025-11-07 |
| Penetration testing | Quarterly | 2026-01-31 |
| GDPR compliance review | Annually | 2026-10-31 |

---

**Checklist Version:** 1.0
**Last Updated:** 2025-10-31
**Maintained By:** SOLARIA AGENCY
