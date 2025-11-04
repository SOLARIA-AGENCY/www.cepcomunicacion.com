# Server Information - CEPComunicación Production

## Hetzner VPS Production Server

### Connection Details
- **IP Address:** 46.62.222.138
- **Hostname:** srv943151
- **Provider:** Hetzner VPS
- **SSH Access:** `ssh root@46.62.222.138`
- **SSH Key:** charlie@solaria.agency (Ed25519)
- **Fingerprint:** SHA256:AMdmaVhw/6byPohYVugI0TJjsQw531eEYjqS9a+hsPw

### System Specifications
- **OS:** Ubuntu 24.04.3 LTS
- **CPU:** AMD EPYC 9354P 32-Core (1 vCore allocated)
- **RAM:** 3.8 GB
- **Storage:** 48 GB SSD
- **Swap:** 4 GB (configured for production)

### Network Configuration
- **IPv4:** 46.62.222.138
- **IPv6:** (pending configuration)
- **Firewall:** UFW active (SSH, HTTP, HTTPS)
- **Open Ports:** 22 (SSH), 80 (HTTP), 443 (HTTPS)

### Web Services

#### Public URLs
- **Frontend:** http://46.62.222.138/
- **CMS Admin:** http://46.62.222.138/admin
- **API:** http://46.62.222.138/api
- **Health Check:** http://46.62.222.138/health

#### Internal Services
- **Next.js/Payload:** localhost:3000 (PM2 managed)
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Software Stack

#### Web Server
- **Nginx:** 1.26.3
  - Serves React static files from `/var/www/cepcomunicacion/apps/web/`
  - Reverse proxies to Next.js for `/admin`, `/api`, `/_next`
  - Security headers configured
  - Rate limiting enabled

#### Runtime
- **Node.js:** v22.20.0
- **NPM:** 10.9.3
- **PM2:** 6.0.13 (process manager)

#### Databases
- **PostgreSQL:** 16.10
  - Database: cepcomunicacion
  - User: cepcomunicacion
  - Password: T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=
  - 27 tables created via Payload migrations

- **Redis:** 7.0.15
  - Used for BullMQ job queue
  - No password configured (localhost only)

### Application Stack

#### CMS (Payload + Next.js)
- **Next.js:** 15.2.3 (exact version)
- **Payload CMS:** 3.62.1
- **React:** 19.2.0
- **Process:** PM2 app "cepcomunicacion-cms"
- **Working Directory:** `/var/www/cepcomunicacion/apps/cms`
- **Build Output:** `.next/` (Next.js standalone)

#### Frontend (React + Vite)
- **React:** 19.1.1
- **Vite:** 7.1.7
- **Build Output:** `dist/` (static files)
- **Deployed To:** `/var/www/cepcomunicacion/apps/web/`

### Directory Structure

```
/var/www/cepcomunicacion/
├── apps/
│   ├── cms/                    # Payload CMS + Next.js
│   │   ├── .next/              # Next.js build
│   │   ├── app/                # Next.js App Router
│   │   ├── src/                # Payload collections
│   │   ├── migrations/         # DB migrations
│   │   ├── .env                # Environment variables
│   │   ├── package.json
│   │   └── ecosystem.config.cjs # PM2 config
│   └── web/                    # React frontend (static)
│       ├── index.html
│       └── assets/
├── logs/                       # PM2 logs
│   ├── cms-out-0.log
│   └── cms-error-0.log
└── infra/                      # Infrastructure scripts
```

### Environment Variables

**Location:** `/var/www/cepcomunicacion/apps/cms/.env`

```bash
# Database
DATABASE_USER=cepcomunicacion
DATABASE_PASSWORD=T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cepcomunicacion
DATABASE_URL=postgresql://cepcomunicacion:T%2BIscBZYTfvdGp57EFiOb3wBI%2F%2BdOb5MRhXHX1B2hTg%3D@localhost:5432/cepcomunicacion

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Payload CMS
PAYLOAD_SECRET=cepcomunicacion-payload-secret-change-in-production-2025
NEXT_PUBLIC_PAYLOAD_URL=http://46.62.222.138

# Node Environment
NODE_ENV=production
PORT=3000
```

### System Optimizations

#### Kernel Parameters (sysctl)
- File descriptors: 65,536
- BBR congestion control enabled
- SSD optimization (TRIM, mq-deadline scheduler)
- TCP/IP stack tuning (40+ parameters)

#### Systemd Resource Limits
- LimitNOFILE=65536
- LimitNPROC=4096

#### Timezone
- **Timezone:** Europe/Madrid

### Monitoring & Logs

#### PM2 Process
```bash
pm2 status                    # Check process status
pm2 logs cepcomunicacion-cms  # View logs
pm2 restart cepcomunicacion-cms
pm2 monit                     # Real-time monitoring
```

#### Nginx Logs
```bash
tail -f /var/log/nginx/cepcomunicacion_access.log
tail -f /var/log/nginx/cepcomunicacion_error.log
```

#### Database Logs
```bash
tail -f /var/log/postgresql/postgresql-16-main.log
```

### Deployment Status

**Last Deployment:** 2025-11-04
**Status:** ✅ Production Ready

#### Working Components
- ✅ Next.js server running (PM2)
- ✅ PostgreSQL database (27 tables)
- ✅ Redis cache/queue
- ✅ Nginx reverse proxy
- ✅ Frontend accessible
- ✅ API responding
- ✅ Health check endpoint

#### Pending Tasks
- ⚠️ Admin UI client-side error (browser console investigation needed)
- ⚠️ Database empty (no sample data)
- ⚠️ SSL/TLS certificate (Let's Encrypt configuration)
- ⚠️ DNS configuration (www.cepcomunicacion.com)

### Maintenance Commands

#### System Updates
```bash
ssh root@46.62.222.138
apt update && apt upgrade -y
```

#### Service Management
```bash
# Nginx
systemctl status nginx
systemctl reload nginx
systemctl restart nginx

# PostgreSQL
systemctl status postgresql
systemctl restart postgresql

# Redis
systemctl status redis-server
systemctl restart redis-server

# PM2
pm2 status
pm2 restart cepcomunicacion-cms
pm2 logs cepcomunicacion-cms
```

#### Database Access
```bash
# Connect to PostgreSQL
PGPASSWORD='T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=' \
  psql -h localhost -U cepcomunicacion -d cepcomunicacion

# Check tables
\dt

# Query courses
SELECT COUNT(*) FROM courses;
```

### Security Notes

- **Firewall:** UFW active, only ports 22, 80, 443 open
- **SSH:** Key-based authentication only (password auth disabled)
- **Database:** PostgreSQL only accessible from localhost
- **Redis:** No password (localhost only, not exposed)
- **Nginx:** Security headers configured (X-Frame-Options, X-XSS-Protection, etc.)
- **File Uploads:** Max 50MB configured in Nginx

### Performance Metrics

- **Response Time:** <400ms
- **Memory Usage:** 67.6MB (PM2 app)
- **CPU Usage:** 0% idle
- **Build Time:** ~2 minutes
- **Cold Start:** <400ms

---

**Last Updated:** 2025-11-04
**Document Version:** 1.0.0
