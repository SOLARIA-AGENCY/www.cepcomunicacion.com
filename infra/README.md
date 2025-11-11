# Infrastructure - CEPComunicacion v2

**100% Self-Contained Docker Deployment**

This directory contains all infrastructure configuration for deploying CEPComunicacion v2 on any VPS provider without external dependencies.

---

## Quick Start

### Production Deployment

```bash
# 1. Clone repository
git clone https://github.com/solaria-agency/cepcomunicacion.git
cd cepcomunicacion

# 2. Configure environment
cp .env.example .env
nano .env  # Fill in required values

# 3. Deploy
cd infra/docker
docker compose up -d

# 4. Setup SSL
sudo certbot --nginx -d cepcomunicacion.com
```

**Full guide:** [VPS Setup Guide](../docs/guides/VPS_SETUP_GUIDE.md)

---

## Directory Structure

```
infra/
├── docker/                          # Docker configuration
│   ├── docker-compose.yml          # Main orchestration file
│   ├── Dockerfile.frontend         # React SPA build
│   ├── Dockerfile.cms              # Payload CMS build
│   ├── Dockerfile.worker           # BullMQ workers build
│   ├── Dockerfile.bullboard        # Queue monitoring UI
│   ├── Dockerfile.backup           # Backup service
│   └── bullboard/
│       └── server.js               # BullBoard configuration
│
├── nginx/                           # Nginx reverse proxy
│   ├── nginx.conf                  # Main Nginx config
│   ├── conf.d/
│   │   └── default.conf            # Virtual host config
│   └── ssl/                        # SSL certificates (Let's Encrypt)
│
├── backup/                          # Backup & restore
│   ├── scripts/
│   │   ├── backup.sh               # PostgreSQL backup script
│   │   ├── restore.sh              # Database restore script
│   │   └── entrypoint.sh           # Backup service entry point
│   └── crontab                     # Backup schedule
│
├── scripts/                         # Deployment & migration
│   ├── deploy.sh                   # Zero-downtime deployment
│   └── migrate-vps.sh              # VPS-to-VPS migration
│
└── README.md                        # This file
```

---

## Key Features

### 1. Self-Contained Services

**No external cloud services required:**

| External Service | Replacement | Location |
|-----------------|-------------|----------|
| AWS S3 | MinIO | `minio` container |
| Mailchimp/SendGrid | MailHog/Postfix | `mailhog` container |
| AWS SQS | BullMQ + Redis | `redis` container |
| CloudWatch | Docker logs | Built-in |
| AWS Backup | PostgreSQL dumps → MinIO | `backup` container |

### 2. Complete Portability

**Move between VPS providers in hours:**

```bash
# On old VPS
./scripts/migrate-vps.sh export -o /tmp/backup

# Transfer to new VPS
scp -r /tmp/backup root@NEW_VPS_IP:/tmp/

# On new VPS
./scripts/migrate-vps.sh import -i /tmp/backup
```

### 3. Zero-Downtime Deployments

```bash
# Deploy new version
./scripts/deploy.sh

# Rollback if needed
./scripts/deploy.sh --rollback
```

---

## Services Overview

### Core Services (12 Containers)

| Service | Purpose | RAM | Ports |
|---------|---------|-----|-------|
| **nginx** | Reverse proxy, SSL termination | 128MB | 80, 443 |
| **frontend** | React SPA | 256MB | - |
| **cms** | Payload CMS backend | 768MB | - |
| **postgres** | Primary database | 768MB | - |
| **redis** | Queue + cache | 512MB | - |
| **minio** | S3-compatible storage | 256MB | 9000, 9001 |
| **worker-automation** | Lead processing | 256MB | - |
| **worker-llm** | LLM content generation | 512MB | - |
| **worker-stats** | Analytics, backups | 128MB | - |
| **mailhog** | SMTP server (dev) | 64MB | 1025, 8025 |
| **bullboard** | Queue monitoring | 64MB | - |
| **backup** | Automated backups | 64MB | - |
| **Total** | | **3.8GB** | |

### Network Architecture

```
Internet
  ↓
Nginx (SSL termination, rate limiting)
  ↓
Frontend (React SPA) ← API calls → CMS (Payload)
                                      ↓
                          PostgreSQL + Redis + MinIO
                                      ↓
                          Workers (automation, LLM, stats)
```

---

## Quick Commands

### Service Management

```bash
# View status
docker compose ps

# View logs
docker compose logs -f <service>

# Restart service
docker compose restart <service>

# Stop all
docker compose down

# Start all
docker compose up -d
```

### Backups

```bash
# Manual backup
docker compose exec backup /scripts/backup.sh

# List backups
docker compose exec backup ls -lh /backups

# Restore from backup
docker compose exec backup /scripts/restore.sh -l
docker compose exec backup /scripts/restore.sh -f /backups/backup.sql.gz
```

### Monitoring

```bash
# Queue monitoring
https://cepcomunicacion.com/queues

# MinIO console
http://localhost:9001

# Email testing (dev)
http://localhost:8025

# Resource usage
docker stats

# Disk usage
docker system df
```

---

## Configuration

### Environment Variables

**Critical variables (must be set):**

```env
# Database
POSTGRES_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Redis
REDIS_PASSWORD=<GENERATE_STRONG_PASSWORD>

# MinIO
MINIO_ROOT_PASSWORD=<GENERATE_STRONG_PASSWORD>

# Payload CMS
PAYLOAD_SECRET=<GENERATE_SECRET_32_CHARS_MIN>

# Domain
NEXT_PUBLIC_API_URL=https://cepcomunicacion.com/api
CORS_ORIGINS=https://cepcomunicacion.com

# SSL
LETSENCRYPT_EMAIL=admin@cepcomunicacion.com
```

**Generate secrets:**

```bash
openssl rand -base64 32  # For passwords
openssl rand -base64 48  # For PAYLOAD_SECRET
```

**Full reference:** [.env.example](../.env.example)

### Optional External APIs

**All external integrations are optional:**

- Meta Ads API → Set `ENABLE_META_INTEGRATION=true`
- Mailchimp → Set `ENABLE_MAILCHIMP_INTEGRATION=true`
- WhatsApp → Set `ENABLE_WHATSAPP_INTEGRATION=true`
- OpenAI/Claude → Set `ENABLE_LLM_INTEGRATION=true`

**System works WITHOUT these APIs** (graceful degradation).

---

## Deployment Workflows

### Fresh Deployment

1. **Prepare VPS** (Ubuntu 22.04+, 4GB RAM, 2 vCPU, 50GB SSD)
2. **Install Docker** ([Guide](../docs/guides/VPS_SETUP_GUIDE.md#13-install-docker--docker-compose))
3. **Clone repository**
4. **Configure .env**
5. **Deploy:** `docker compose up -d`
6. **Setup SSL:** `certbot --nginx`

**Time:** 30-60 minutes

### Update Deployment

```bash
cd infra/docker
git pull
docker compose pull
docker compose up -d --build
```

**Time:** 5-10 minutes (zero downtime)

### VPS Migration

```bash
# Old VPS: Export
./scripts/migrate-vps.sh export

# Transfer to new VPS
scp -r backup root@NEW_VPS:/tmp/

# New VPS: Import
./scripts/migrate-vps.sh import -i /tmp/backup

# Update DNS
```

**Time:** 2-4 hours (includes DNS propagation)

---

## Resource Requirements

### Minimum VPS Specs

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 4GB | 8GB |
| vCPU | 2 cores | 4 cores |
| Storage | 50GB SSD | 100GB SSD |
| Bandwidth | 1TB/month | 2TB/month |

### Recommended VPS Providers

| Provider | Price/Month | Specs | Region |
|----------|-------------|-------|--------|
| **Hostinger** | $12 | 4GB/2vCPU/50GB | EU/US |
| **Hetzner** | €4.51 | 4GB/2vCPU/40GB | EU |
| **DigitalOcean** | $24 | 4GB/2vCPU/80GB | Global |
| **Vultr** | $18 | 4GB/2vCPU/80GB | Global |

---

## Security

### Firewall

```bash
# Allow only necessary ports
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### SSL/TLS

```bash
# Let's Encrypt (free, auto-renew)
certbot --nginx -d cepcomunicacion.com -d www.cepcomunicacion.com
```

### Access Control

- **SSH:** Key-based authentication only
- **BullBoard:** Basic authentication (username/password)
- **MinIO Console:** Root credentials
- **Database:** Internal network only (no public access)
- **Redis:** Password-protected, internal network only

---

## Monitoring & Logs

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f cms

# Last 100 lines
docker compose logs --tail=100 cms

# With timestamps
docker compose logs -f --timestamps
```

### Health Checks

```bash
# Check service health
docker compose ps

# Test endpoints
curl http://localhost/api/health
curl http://localhost/

# Check database
docker compose exec postgres pg_isready
```

### Resource Monitoring

```bash
# Real-time stats
docker stats

# Disk usage
docker system df

# Cleanup
docker system prune -a
```

---

## Troubleshooting

### Common Issues

**Services not starting:**

```bash
# Check logs
docker compose logs <service>

# Check resources
docker stats

# Restart
docker compose restart <service>
```

**Out of disk space:**

```bash
# Check usage
df -h
docker system df

# Clean up
docker system prune -a --volumes
```

**Database connection issues:**

```bash
# Check PostgreSQL
docker compose exec postgres pg_isready

# View logs
docker compose logs postgres

# Restart
docker compose restart postgres
```

**Full troubleshooting guide:** [VPS Setup Guide - Troubleshooting](../docs/guides/VPS_SETUP_GUIDE.md#3-troubleshooting)

---

## Documentation

- **[Infrastructure Specification](../docs/specs/09-infrastructure/INFRASTRUCTURE.md)** - Complete infrastructure design
- **[VPS Setup Guide](../docs/guides/VPS_SETUP_GUIDE.md)** - Step-by-step deployment guide
- **[.env.example](../.env.example)** - Environment variables reference
- **[Architecture](../docs/specs/01-architecture/ARCHITECTURE.md)** - System architecture

---

## Support

- **Documentation:** [docs/](../docs/)
- **Issues:** https://github.com/solaria-agency/cepcomunicacion/issues
- **Email:** soporte@solaria.agency
- **Website:** https://www.solaria.agency

---

**Version:** 2.0.0 (Self-Contained)
**Last Updated:** 2025-10-21
**Maintained by:** SOLARIA AGENCY - Infrastructure Team
