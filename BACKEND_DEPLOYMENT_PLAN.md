# PLAN DE IMPLEMENTACIÓN BACKEND - CEP FORMACIÓN
**Fecha:** 2025-11-19
**Prioridad:** P0 - CRÍTICO
**Objetivo:** Dashboard administrativo funcional en < 4 horas

---

## ESTADO ACTUAL

### ✅ Completado (Backend Desarrollado):
```
Component              Status    Details
──────────────────────────────────────────────────────────
Payload CMS 3.62.1     ✓ Ready   16 collections configured
Admin Dashboard        ✓ Ready   Next.js app built
PostgreSQL Schema      ✓ Ready   27 tables with relationships
Docker Compose         ✓ Ready   All services defined
Dockerfiles            ✓ Ready   cms, admin, worker, frontend
Collections            ✓ Ready   Courses, Leads, Campaigns, etc.
RBAC System            ✓ Ready   5 roles with permissions
```

### ❌ Pendiente (NO Desplegado):
```
Service              Status      Impact
─────────────────────────────────────────────
PostgreSQL 16        Not Running  HIGH - No database
Redis 7              Not Running  HIGH - No cache/queue
Payload CMS          Not Running  CRITICAL - No backend
Admin Dashboard      Not Running  CRITICAL - No UI
Workers (BullMQ)     Not Running  MEDIUM - No automation
Mailhog              Not Running  LOW - Testing only
MinIO (S3)           Not Running  MEDIUM - No file storage
```

**Current Production:** Solo nginx estático (frontend HTML)

---

## PLAN EJECUTIVO: FAST TRACK (4 horas)

### Phase 1: Infrastructure Base (30 min)
```bash
Priority: P0 CRITICAL
Goal: Database + Cache running
```

**Tasks:**
1. Deploy PostgreSQL 16 container
2. Deploy Redis 7 container
3. Run database migrations
4. Verify connectivity

**Commands:**
```bash
# On Hetzner server (46.62.222.138)
cd /opt/cepcomunicacion
docker compose up -d postgres redis
docker compose logs -f postgres redis
```

**Validation:**
- PostgreSQL accepting connections on :5432
- Redis accepting connections on :6379
- Database `cepcomunicacion` created
- 27 tables migrated

---

### Phase 2: Payload CMS Backend (45 min)
```bash
Priority: P0 CRITICAL
Goal: CMS API responding
```

**Tasks:**
1. Build CMS Docker image
2. Deploy CMS container
3. Run Payload migrations
4. Create admin user
5. Test API endpoints

**Commands:**
```bash
# Build and deploy
docker compose build cms
docker compose up -d cms

# Create admin user
docker compose exec cms pnpm payload create-admin

# Test API
curl http://46.62.222.138:3000/api/health
```

**Validation:**
- CMS running on port 3000
- Admin user created
- API responding: `/api/courses`, `/api/leads`
- Payload admin accessible: `http://46.62.222.138:3000/admin`

---

### Phase 3: Admin Dashboard (45 min)
```bash
Priority: P0 CRITICAL
Goal: Dashboard UI accessible
```

**Tasks:**
1. Build Admin Docker image
2. Deploy Admin container
3. Configure API connection
4. Test authentication
5. Verify UI rendering

**Commands:**
```bash
# Build and deploy
docker compose build admin
docker compose up -d admin

# Test dashboard
curl http://46.62.222.138:3001/
```

**Validation:**
- Dashboard running on port 3001
- Login page renders correctly
- Can authenticate with admin user
- Dashboard loads data from CMS
- TailwindCSS styles working

---

### Phase 4: Nginx Reverse Proxy (30 min)
```bash
Priority: P0 CRITICAL
Goal: Unified access through port 80
```

**Tasks:**
1. Configure Nginx reverse proxy
2. Route `/admin` → Admin Dashboard :3001
3. Route `/api` → Payload CMS :3000
4. Route `/` → Static Frontend
5. Restart Nginx

**Nginx Config:**
```nginx
# Frontend (static HTML)
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}

# Admin Dashboard
location /dashboard {
    proxy_pass http://admin:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
}

# Payload CMS API + Admin
location /api {
    proxy_pass http://cms:3000/api;
}

location /admin {
    proxy_pass http://cms:3000/admin;
}
```

**Validation:**
- http://46.62.222.138/ → Frontend ✓
- http://46.62.222.138/admin → Payload Admin ✓
- http://46.62.222.138/dashboard → Admin Dashboard ✓
- http://46.62.222.138/api/courses → API ✓

---

### Phase 5: File Storage (MinIO) (20 min)
```bash
Priority: P1 HIGH
Goal: Image uploads working
```

**Tasks:**
1. Deploy MinIO container
2. Create bucket `cep-uploads`
3. Configure Payload to use MinIO
4. Test file upload

**Commands:**
```bash
docker compose up -d minio minio-init
docker compose logs minio-init

# Test upload
curl -X POST http://46.62.222.138/api/media \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-image.jpg"
```

**Validation:**
- MinIO running on :9000
- Bucket created
- Files uploaded successfully
- Images accessible via URL

---

### Phase 6: Mailhog (Testing) (10 min)
```bash
Priority: P2 MEDIUM
Goal: Email testing ready
```

**Tasks:**
1. Deploy Mailhog container
2. Configure SMTP settings
3. Test email sending

**Commands:**
```bash
docker compose up -d mailhog

# Access UI
open http://46.62.222.138:8025
```

**Validation:**
- Mailhog UI accessible
- Test emails captured
- SMTP relay working

---

### Phase 7: BullMQ Workers (Optional) (30 min)
```bash
Priority: P3 LOW
Goal: Background automation
```

**Tasks:**
1. Deploy worker containers
2. Configure job queues
3. Test lead processing

**Commands:**
```bash
docker compose up -d worker-automation worker-llm worker-stats

# Monitor queues
docker compose logs -f worker-automation
```

**Validation:**
- Workers processing jobs
- Redis queues working
- Lead automation triggered

---

## DEPLOYMENT SEQUENCE (EXECUTE IN ORDER)

```bash
# 1. Preparación
cd /opt/cepcomunicacion
git pull origin main

# 2. Infrastructure
docker compose up -d postgres redis
sleep 10
docker compose exec postgres psql -U postgres -c "CREATE DATABASE cepcomunicacion;"

# 3. CMS Backend
docker compose build cms
docker compose up -d cms
sleep 15
docker compose exec cms pnpm payload create-admin

# 4. Admin Dashboard
docker compose build admin
docker compose up -d admin

# 5. File Storage
docker compose up -d minio minio-init

# 6. Reverse Proxy
docker compose up -d nginx

# 7. Verification
docker compose ps
curl http://46.62.222.138/api/health
curl http://46.62.222.138/dashboard
```

---

## CONFIGURATION FILES REQUIRED

### 1. Environment Variables (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/cepcomunicacion

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://46.62.222.138

# Storage
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=cep-uploads

# Redis
REDIS_URL=redis://redis:6379

# Email
SMTP_HOST=mailhog
SMTP_PORT=1025
```

### 2. Admin User Credentials
```bash
Email: admin@cepformacion.com
Password: [Generate secure password]
Role: Admin
```

---

## SUCCESS METRICS

### Phase 1-4 (CRITICAL - 2.5 hours):
```
✓ PostgreSQL running and accepting connections
✓ Redis running and responding to ping
✓ Payload CMS API responding on /api
✓ Admin dashboard loading on /dashboard
✓ Admin user can login
✓ Collections accessible via API
✓ Frontend, backend, dashboard all working
```

### Phase 5-7 (NICE-TO-HAVE - 1 hour):
```
✓ File uploads working
✓ Images displaying correctly
✓ Mailhog capturing test emails
✓ Workers processing background jobs
```

---

## ROLLBACK PLAN

If deployment fails:
```bash
# Stop all new containers
docker compose down

# Restore frontend-only
docker run -d --name cep-frontend \
  -p 80:80 \
  -v /opt/frontend-new:/usr/share/nginx/html:ro \
  nginx:alpine

# Frontend continues working while debugging
```

---

## MONITORING POST-DEPLOYMENT

**Health Checks:**
```bash
# Every 5 minutes
curl http://46.62.222.138/api/health
curl http://46.62.222.138/dashboard

# Container status
docker compose ps
docker stats --no-stream

# Logs
docker compose logs --tail=50 cms
docker compose logs --tail=50 admin
```

**Alerts:**
- Container stopped → Restart
- API not responding → Check logs
- Database connection failed → Verify PostgreSQL
- Dashboard white screen → TailwindCSS config issue

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Week 1:**
   - ✓ Seed database with sample data
   - ✓ Configure production email (replace Mailhog)
   - ✓ Set up SSL/HTTPS (Let's Encrypt)
   - ✓ Implement automated backups

2. **Week 2:**
   - ✓ Deploy BullMQ workers
   - ✓ Configure Meta Ads webhook
   - ✓ Set up Mailchimp integration
   - ✓ Enable analytics tracking

3. **Week 3:**
   - ✓ User training
   - ✓ Content migration
   - ✓ Performance optimization
   - ✓ Security audit

---

## RESOURCE REQUIREMENTS

**Server Specs (Current):**
- CPU: 1 vCore AMD EPYC
- RAM: 3.8 GB
- Storage: 44 GB available

**Expected Usage:**
```
Service          RAM     CPU    Storage
────────────────────────────────────────
PostgreSQL       512MB   10%    5GB
Redis            256MB   5%     1GB
Payload CMS      512MB   20%    2GB
Admin Dashboard  512MB   15%    1GB
Nginx            128MB   5%     100MB
MinIO            256MB   10%    10GB (uploads)
Workers          256MB   10%    500MB
────────────────────────────────────────
TOTAL           ~2.4GB   75%    ~20GB
```

**Status:** ✅ Server has sufficient resources

---

## CONTACT & SUPPORT

**CTO:** Carlos J. Pérez
**Agency:** SOLARIA AGENCY
**Server:** Hetzner VPS (46.62.222.138)
**SSH Access:** root@46.62.222.138 (key: id_solaria_hetzner_prod)

**Emergency Commands:**
```bash
# Restart all services
ssh root@46.62.222.138 "cd /opt/cepcomunicacion && docker compose restart"

# View logs
ssh root@46.62.222.138 "cd /opt/cepcomunicacion && docker compose logs -f cms"

# Stop all
ssh root@46.62.222.138 "cd /opt/cepcomunicacion && docker compose down"
```

---

## CONCLUSION

**Timeline:** 4 hours total
**Critical Path:** Phase 1-4 (2.5 hours)
**Risk:** Low - Backend fully developed, just needs deployment
**Blockers:** None identified

**Recommendation:** Execute Phases 1-4 immediately to get dashboard operational. Phases 5-7 can be done in parallel or deferred to Week 2.

**Next Action:** Run deployment sequence and validate each phase before proceeding to next.
