# Infrastructure Architecture Documentation

Complete technical architecture documentation for CEPComunicacion v2 infrastructure and deployment.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Network Topology](#network-topology)
- [Service Components](#service-components)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Backup Strategy](#backup-strategy)
- [Scaling Considerations](#scaling-considerations)

---

## System Overview

CEPComunicacion v2 is a containerized microservices application deployed on a Hetzner VPS running Ubuntu 24.04.3 LTS.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Internet                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Hetzner VPS (srv943151)                         │
│                  46.62.222.138                                   │
│                  Ubuntu 24.04.3 LTS                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Nginx (Port 80/443)                    │  │
│  │              Reverse Proxy + SSL Termination              │  │
│  └────┬──────────────┬──────────────┬──────────────────────┘  │
│       │              │              │                           │
│       ▼              ▼              ▼                           │
│  ┌────────┐    ┌────────┐    ┌────────┐                       │
│  │Frontend│    │  CMS   │    │ Admin  │                       │
│  │Next.js │    │Payload │    │Next.js │                       │
│  │16:3000 │    │3.62:3002│   │15:3001 │                       │
│  └────────┘    └───┬────┘    └───┬────┘                       │
│                    │              │                             │
│       ┌────────────┴──────────────┴────────────────┐           │
│       │           Internal Network                   │           │
│       │         (172.21.0.0/16)                     │           │
│       │                                              │           │
│       ▼                                              ▼           │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐       │
│  │ PostgreSQL │  │   Redis    │  │  BullMQ Workers    │       │
│  │    :5432   │  │   :6379    │  │  - Automation      │       │
│  └────────────┘  └────────────┘  │  - LLM             │       │
│                                   │  - Stats           │       │
│                                   └────────────────────┘       │
│                                                                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐       │
│  │   MinIO    │  │  MailHog   │  │    BullBoard       │       │
│  │ S3 Storage │  │ SMTP Test  │  │  Queue Monitor     │       │
│  │ :9000/9001 │  │ :1025/8025 │  │      :3010         │       │
│  └────────────┘  └────────────┘  └────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend Layer:**
- Next.js 16.0.1 (App Router + Turbopack)
- React 19.0.0
- React Server Components
- TailwindCSS 4.0
- TypeScript 5.9.3

**Backend Layer:**
- Payload CMS 3.62.1 (Next.js 15)
- Node.js 22.20.0
- Express.js integration

**Data Layer:**
- PostgreSQL 16 (primary database)
- Redis 7 (cache + job queue)
- MinIO (S3-compatible object storage)

**Infrastructure:**
- Docker 24.0+
- Docker Compose 2.20+
- Nginx 1.26.3
- Ubuntu 24.04.3 LTS

**CI/CD:**
- GitHub Actions
- GitHub Container Registry

---

## Architecture Diagram

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       External Network (172.20.0.0/16)          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                       Nginx Container                     │  │
│  │  - Port 80 (HTTP)                                         │  │
│  │  - Port 443 (HTTPS - Let's Encrypt)                       │  │
│  │  - Static file serving                                    │  │
│  │  - Reverse proxy to backend services                      │  │
│  │  - Security headers (HSTS, CSP, X-Frame-Options)          │  │
│  │  - Rate limiting                                           │  │
│  │  - Gzip compression                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│  ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐      │
│  │   Frontend      │ │    CMS      │ │     Admin       │      │
│  │   Container     │ │  Container  │ │   Container     │      │
│  │                 │ │             │ │                 │      │
│  │  Next.js 16     │ │  Payload    │ │   Next.js 15    │      │
│  │  + Turbopack    │ │  3.62.1     │ │   Dashboard     │      │
│  │  Port: 3000     │ │  Port: 3002 │ │   Port: 3001    │      │
│  └─────────────────┘ └──────┬──────┘ └─────────────────┘      │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                       Internal Network (172.21.0.0/16)           │
│                              │                                   │
│              ┌───────────────┴────────────────┐                  │
│              ▼                                ▼                  │
│  ┌──────────────────────┐        ┌──────────────────────┐       │
│  │  PostgreSQL 16       │        │     Redis 7          │       │
│  │  Container           │        │     Container        │       │
│  │                      │        │                      │       │
│  │  - Primary Database  │        │  - Job Queue         │       │
│  │  - Volume: postgres  │        │  - Cache             │       │
│  │  - Port: 5432        │        │  - Pub/Sub           │       │
│  │  - Optimized config  │        │  - Volume: redis     │       │
│  │  - Auto backups      │        │  - Port: 6379        │       │
│  └──────────────────────┘        └──────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    BullMQ Workers                         │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │  │
│  │  │  Automation  │ │     LLM      │ │    Stats     │     │  │
│  │  │   Worker     │ │   Worker     │ │   Worker     │     │  │
│  │  │              │ │              │ │              │     │  │
│  │  │  - Leads     │ │  - Content   │ │  - Reports   │     │  │
│  │  │  - Campaigns │ │  - Gen AI    │ │  - Analytics │     │  │
│  │  │  - Emails    │ │  - Meta Ads  │ │  - Backups   │     │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    MinIO     │ │   MailHog    │ │     BullBoard        │   │
│  │  Container   │ │  Container   │ │     Container        │   │
│  │              │ │              │ │                      │   │
│  │  S3 Storage  │ │  SMTP Server │ │  Queue Monitoring    │   │
│  │  Port: 9000  │ │  Port: 1025  │ │  Port: 3010          │   │
│  │  Console:9001│ │  Web: 8025   │ │  Auth: admin/admin   │   │
│  └──────────────┘ └──────────────┘ └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Network Topology

### Network Segmentation

**External Network (172.20.0.0/16)**
- Public-facing services
- Nginx (reverse proxy)
- Frontend (static content)
- Admin (dashboard access)
- CMS (API endpoints)
- MinIO (public file access)
- MailHog (dev email testing)
- BullBoard (queue monitoring)

**Internal Network (172.21.0.0/16)**
- Isolated backend services
- PostgreSQL (database)
- Redis (cache/queue)
- Workers (background jobs)
- No external access
- Service-to-service communication only

### Port Mapping

**External (Host → Container):**

| Service | Host Port | Container Port | Protocol |
|---------|-----------|----------------|----------|
| Nginx | 80 | 80 | HTTP |
| Nginx | 443 | 443 | HTTPS |
| PostgreSQL | 5432 | 5432 | PostgreSQL |
| Redis | 6379 | 6379 | Redis |
| MinIO API | 9000 | 9000 | HTTP |
| MinIO Console | 9001 | 9001 | HTTP |
| MailHog SMTP | 1025 | 1025 | SMTP |
| MailHog Web | 8025 | 8025 | HTTP |

**Internal (Container → Container):**

| From | To | Port | Purpose |
|------|-----|------|---------|
| Nginx | Frontend | 3000 | Proxy requests |
| Nginx | CMS | 3002 | API proxy |
| Nginx | Admin | 3001 | Dashboard proxy |
| CMS | PostgreSQL | 5432 | Database queries |
| CMS | Redis | 6379 | Cache/queue |
| CMS | MinIO | 9000 | File uploads |
| Workers | PostgreSQL | 5432 | Job data |
| Workers | Redis | 6379 | Job queue |
| Workers | MinIO | 9000 | File processing |

---

## Service Components

### 1. Nginx (Reverse Proxy)

**Purpose:** Edge proxy, SSL termination, static file serving

**Configuration:**
- Worker processes: 4
- Connections per worker: 1024
- Gzip compression enabled
- Client max body size: 100MB
- Keepalive timeout: 65s

**Routes:**
```nginx
/                  → Frontend (React app)
/api               → CMS (Payload API)
/admin             → Admin Dashboard
/static            → Nginx static files
```

**Security Headers:**
```nginx
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### 2. Frontend (Next.js 16)

**Purpose:** Public-facing website

**Technologies:**
- Next.js 16.0.1 (App Router)
- React 19.0.0
- React Server Components
- TailwindCSS 4.0
- Turbopack (dev build tool)

**Build Output:**
- Server-rendered pages (Node.js runtime)
- Static assets optimized by Next.js
- Served via standalone mode on port 3000
- Proxied through Nginx

**Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=http://cms:3002/api
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=XXXXXXXXXX
PORT=3000
HOSTNAME=0.0.0.0
```

### 3. CMS (Payload)

**Purpose:** Backend API, content management, admin panel

**Technologies:**
- Payload CMS 3.62.1
- Next.js 16 (required by Payload)
- Express.js (API server)
- TypeScript

**Collections:**
- Courses
- CourseRuns (Convocations)
- Sites (Campuses)
- Cycles
- Leads
- Campaigns
- Users

**API Endpoints:**
```
GET  /api/courses
POST /api/leads
GET  /api/courses/:id
POST /api/campaigns
```

**Resource Limits:**
- CPU: 0.5 cores
- Memory: 768MB

### 4. Admin Dashboard (Next.js)

**Purpose:** Custom admin interface for marketing team

**Features:**
- Lead management
- Campaign tracking
- Analytics dashboards
- User management
- Course CRUD

**Authentication:**
- Development: admin/admin (bypass)
- Production: JWT-based auth
- Role-based access control (5 roles)

### 5. PostgreSQL 16

**Purpose:** Primary relational database

**Configuration:**
```ini
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
random_page_cost = 1.1
```

**Backup Strategy:**
- Daily automated backups (3 AM)
- Retention: 30 days
- Stored in MinIO
- Pre-deployment backups

**Tables:** 27 tables (see DATABASE_SCHEMA.md)

### 6. Redis 7

**Purpose:** Cache, job queue, pub/sub

**Configuration:**
```ini
maxmemory = 512MB
maxmemory-policy = allkeys-lru
appendonly = yes
appendfsync = everysec
```

**Use Cases:**
- BullMQ job queue
- Session caching
- API response caching
- Rate limiting

### 7. BullMQ Workers

**Purpose:** Background job processing

**Workers:**

**Automation Worker:**
- Lead processing
- Campaign automation
- Email sending
- Meta Ads sync
- Mailchimp integration

**LLM Worker:**
- AI content generation
- Meta ad copy creation
- Course description writing
- Requires OpenAI/Anthropic API keys

**Stats Worker:**
- Analytics aggregation
- Report generation
- Database backups
- Data exports

### 8. MinIO (S3 Storage)

**Purpose:** Object storage for uploads

**Buckets:**
- `cep-uploads` - User uploads (public)
- `cep-backups` - Database backups (private)

**Configuration:**
- API Port: 9000
- Console Port: 9001
- Credentials: minioadmin/minioadmin (dev)

### 9. MailHog (Dev Only)

**Purpose:** SMTP testing

**Features:**
- Catch-all SMTP server
- Web UI for viewing emails
- No emails actually sent
- Replace with real SMTP in production

### 10. BullBoard

**Purpose:** Job queue monitoring

**Features:**
- View active jobs
- Retry failed jobs
- Job statistics
- Queue metrics

---

## Data Flow

### User Request Flow

```
1. User → Browser → http://46.62.222.138/

2. Request → Nginx:80

3. Nginx → Frontend Container:3000
   - Static files served
   - React app loads

4. Frontend → JavaScript fetch()
   → http://46.62.222.138/api/courses

5. Nginx → CMS Container:3002
   - API request proxied

6. CMS → PostgreSQL:5432
   - Database query

7. PostgreSQL → CMS
   - Results returned

8. CMS → Redis:6379
   - Cache response

9. CMS → Frontend
   - JSON response

10. Frontend → User
    - Rendered UI
```

### Lead Submission Flow

```
1. User submits form → Frontend

2. Frontend → POST /api/leads
   - CAPTCHA validation
   - RGPD consent

3. CMS → Validates data
   - Schema validation
   - Duplicate check

4. CMS → PostgreSQL
   - Insert lead record
   - Log IP + timestamp

5. CMS → Redis
   - Queue background job

6. Automation Worker → Redis
   - Pick up job

7. Worker → External APIs
   - Meta Ads lead sync
   - Mailchimp subscription
   - WhatsApp notification

8. Worker → PostgreSQL
   - Update lead status

9. CMS → Frontend
   - Success response

10. Frontend → User
    - Thank you message
```

---

## Security Architecture

### Network Security

**Firewall (UFW):**
```bash
22/tcp    ALLOW   # SSH (key-based only)
80/tcp    ALLOW   # HTTP
443/tcp   ALLOW   # HTTPS
```

**Docker Network Isolation:**
- External network: Internet-facing
- Internal network: No external access
- PostgreSQL only on internal network
- Redis only on internal network

### Application Security

**Authentication:**
- JWT tokens (short-lived)
- HTTP-only cookies
- Refresh token rotation

**Authorization:**
- Role-based access control (RBAC)
- Field-level permissions
- API rate limiting

**Data Protection:**
- RGPD compliance
- Data encryption at rest (planned)
- SSL/TLS for data in transit
- Secrets in environment variables

**Input Validation:**
- Schema validation (Zod)
- SQL injection prevention (Parameterized queries)
- XSS prevention (Content Security Policy)
- CSRF tokens

### Secrets Management

**Development:**
```bash
.env.local (gitignored)
```

**Production:**
```bash
.env (server only, not in Git)
GitHub Secrets (for CI/CD)
```

**Never in Git:**
- Database passwords
- API keys
- JWT secrets
- SMTP credentials

---

## Backup Strategy

### Automated Backups

**Database Backups:**
- Schedule: Daily at 3 AM UTC
- Format: Compressed SQL dump (.sql.gz)
- Storage: MinIO `cep-backups` bucket
- Retention: 30 days
- Pre-deployment: Manual backup

**File Backups:**
- Media uploads (MinIO)
- Configuration files (.env)
- Nginx configs

**Backup Script:**
```bash
#!/bin/bash
# /opt/cepcomunicacion/backup/backup.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="backup-$DATE.sql.gz"

# Dump database
docker compose exec -T postgres \
  pg_dump -U cepadmin cepcomunicacion | gzip > "/backups/$BACKUP_FILE"

# Upload to MinIO
mc cp "/backups/$BACKUP_FILE" minio/cep-backups/

# Delete old backups (>30 days)
find /backups -name "backup-*.sql.gz" -mtime +30 -delete
```

### Restore Procedure

```bash
# List available backups
mc ls minio/cep-backups/

# Download backup
mc cp minio/cep-backups/backup-20251110-030000.sql.gz /tmp/

# Restore database
gunzip -c /tmp/backup-20251110-030000.sql.gz | \
  docker compose exec -T postgres psql -U cepadmin -d cepcomunicacion
```

---

## Scaling Considerations

### Current Limitations

**Server Resources:**
- CPU: 1 vCore
- RAM: 3.8 GB
- Disk: 48 GB SSD

**Bottlenecks:**
- Single server (no redundancy)
- Limited CPU for concurrent users
- PostgreSQL on same server

### Horizontal Scaling (Future)

**When to Scale:**
- >1000 concurrent users
- >100 req/sec sustained
- CPU >80% for >5 minutes
- Memory >3GB sustained

**Scaling Strategy:**

**Phase 1: Separate Database**
```
App Server (Hetzner)
  ├─ Nginx
  ├─ Frontend
  ├─ CMS
  └─ Workers

Database Server (Managed)
  └─ PostgreSQL (DigitalOcean/AWS RDS)
```

**Phase 2: Load Balancing**
```
Load Balancer (Hetzner LB)
  ├─ App Server 1
  ├─ App Server 2
  └─ App Server 3

Database Cluster
  ├─ Primary (write)
  └─ Replicas (read)
```

**Phase 3: Kubernetes**
```
Kubernetes Cluster
  ├─ Ingress (Nginx)
  ├─ Frontend Pods (3 replicas)
  ├─ CMS Pods (3 replicas)
  ├─ Worker Pods (auto-scale)
  └─ External Services
       ├─ PostgreSQL (managed)
       ├─ Redis (managed)
       └─ S3 (AWS/DigitalOcean)
```

### Vertical Scaling (Immediate)

**Upgrade Server:**
- CPX21: 3 vCores, 8GB RAM, 80GB SSD
- CPX31: 4 vCores, 16GB RAM, 160GB SSD

**Optimize Containers:**
- Increase PostgreSQL shared_buffers
- Add Redis max memory
- Enable Nginx caching
- Optimize Docker images

---

**Last Updated:** 2025-11-10
**Maintained by:** SOLARIA AGENCY DevOps Team
