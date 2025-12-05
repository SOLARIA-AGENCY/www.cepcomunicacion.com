# Deployment Plan - CEP Comunicación v2

**Version:** 1.0.0
**Date:** 2025-12-05
**Target Server:** 46.62.222.138 (Hetzner VPS)

---

## Pre-Deployment Checklist

- [x] Performance optimizations implemented
- [x] Cache layer created (src/lib/cache.ts)
- [x] Database indexes defined (infra/database/performance-indexes.sql)
- [x] Nginx config optimized
- [x] next.config.js optimized
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Git commit and push
- [ ] Server deployment

---

## 1. Server Infrastructure

### Current State
| Service | Status | Version |
|---------|--------|---------|
| Ubuntu | ✅ Running | 24.04.3 LTS |
| PostgreSQL | ✅ Running | 16.10 |
| Redis | ✅ Running | 7.0.15 |
| Node.js | ✅ Running | v22.20.0 |
| PM2 | ✅ Running | 6.0.13 |
| Nginx | ✅ Running | 1.26.3 |

### Target Architecture
```
                    ┌─────────────────────────────────────┐
                    │           INTERNET                   │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────▼───────────────────┐
                    │         NGINX (Port 80/443)         │
                    │  - SSL Termination                  │
                    │  - Gzip/Brotli Compression          │
                    │  - Static File Caching              │
                    │  - Rate Limiting                    │
                    └─────────────────┬───────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
    ┌─────────▼─────────┐   ┌────────▼────────┐   ┌─────────▼─────────┐
    │  Static Assets    │   │  API/CMS (3001) │   │  Admin Panel      │
    │  /_next/static/*  │   │  Next.js + PM2  │   │  /admin           │
    └───────────────────┘   └────────┬────────┘   └───────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
          ┌─────────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐
          │    Redis      │  │ PostgreSQL  │  │   MinIO   │
          │   (Cache)     │  │    (DB)     │  │  (Media)  │
          │   Port 6379   │  │  Port 5432  │  │ Port 9000 │
          └───────────────┘  └─────────────┘  └───────────┘
```

---

## 2. Deployment Steps

### Step 1: Prepare Local Environment
```bash
# Run tests
cd apps/cms
pnpm test

# Build production
pnpm build
```

### Step 2: Connect to Server
```bash
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138
```

### Step 3: Update Nginx Configuration
```bash
# Backup current config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Deploy new config
# (See nginx.conf in infra/nginx/)
nginx -t && systemctl reload nginx
```

### Step 4: Configure Redis for Caching
```bash
# Verify Redis is running
redis-cli ping

# Set max memory and eviction policy
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Persist config
redis-cli CONFIG REWRITE
```

### Step 5: Create Database Indexes
```bash
# Connect to PostgreSQL
psql -U postgres -d cepcomunicacion

# Run index script
\i /opt/apps/cms/infra/database/performance-indexes.sql
```

### Step 6: Deploy Application
```bash
# Pull latest changes
cd /opt/apps/cms
git pull origin main

# Install dependencies
pnpm install --frozen-lockfile

# Build
pnpm build

# Restart PM2
pm2 restart cepcomunicacion-cms
pm2 save
```

### Step 7: Verify Deployment
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs cepcomunicacion-cms --lines 50

# Test endpoints
curl -I http://localhost:3001/
curl -I http://localhost:3001/api/health
```

---

## 3. Nginx Configuration

### Production Config (/etc/nginx/sites-available/cepcomunicacion)

```nginx
# Upstream for Next.js app
upstream nextjs_upstream {
    server 127.0.0.1:3001;
    keepalive 64;
}

server {
    listen 80;
    server_name cepcomunicacion.com www.cepcomunicacion.com;

    # Redirect to HTTPS (uncomment when SSL is configured)
    # return 301 https://$server_name$request_uri;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/json application/xml+rss
               image/svg+xml;

    # Static assets - aggressive caching
    location /_next/static/ {
        alias /opt/apps/cms/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Media uploads
    location /media/ {
        alias /opt/apps/cms/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API routes - proxied to Next.js
    location /api/ {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # API caching
        proxy_cache_valid 200 10s;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Admin panel
    location /admin {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # All other routes - Next.js SSR
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
```

---

## 4. Environment Variables

### Required on Server (/opt/apps/cms/.env)

```env
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/cepcomunicacion
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cepcomunicacion
DATABASE_USER=postgres
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD

# Payload CMS
PAYLOAD_SECRET=YOUR_64_CHAR_SECRET_KEY
PAYLOAD_PUBLIC_SERVER_URL=http://46.62.222.138

# Redis Cache
REDIS_URL=redis://localhost:6379

# MinIO (S3)
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET=cepcomunicacion
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=YOUR_MINIO_SECRET

# Node
NODE_ENV=production
PORT=3001
```

---

## 5. Rollback Plan

### If deployment fails:

```bash
# 1. Restore previous PM2 state
pm2 resurrect

# 2. Restore git to previous commit
cd /opt/apps/cms
git checkout HEAD~1

# 3. Rebuild and restart
pnpm install
pnpm build
pm2 restart cepcomunicacion-cms

# 4. Restore Nginx config
cp /etc/nginx/sites-available/default.bak /etc/nginx/sites-available/default
nginx -t && systemctl reload nginx
```

---

## 6. Monitoring Post-Deployment

### Commands to verify health:

```bash
# PM2 process health
pm2 monit

# System resources
htop

# PostgreSQL connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Redis stats
redis-cli INFO stats | grep -E "hits|misses"

# Nginx access logs
tail -f /var/log/nginx/access.log

# Application logs
pm2 logs cepcomunicacion-cms --lines 100
```

---

## 7. Success Criteria

| Metric | Target | Verification |
|--------|--------|--------------|
| HTTP 200 on / | ✓ | `curl -I http://46.62.222.138/` |
| HTTP 200 on /api/health | ✓ | `curl http://46.62.222.138/api/health` |
| PM2 status "online" | ✓ | `pm2 status` |
| Redis responding | ✓ | `redis-cli ping` |
| PostgreSQL connected | ✓ | `psql -c "SELECT 1"` |
| No errors in logs | ✓ | `pm2 logs --lines 50 --nostream` |

---

**Estimated Deployment Time:** 15-20 minutes
**Rollback Time:** 5 minutes
