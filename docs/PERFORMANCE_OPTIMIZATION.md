# Performance Optimization Strategy - CEP Comunicación

**Version:** 1.0.0
**Updated:** 2025-12-05
**Status:** Implementation Ready

---

## Executive Summary

Este documento define la estrategia de optimización de rendimiento para el sistema CEP Comunicación v2.

### Current Baseline

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| API Response (p50) | ~200ms | <100ms | 🔄 Pending |
| API Response (p95) | ~800ms | <300ms | 🔄 Pending |
| TTFB (Dashboard) | ~1.2s | <500ms | 🔄 Pending |
| Database Queries/req | ~15 | <5 | 🔄 Pending |
| Bundle Size (main) | ~300KB | <150KB | 🔄 Pending |

---

## 1. Caching Strategy

### 1.1 Multi-Layer Cache Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Service Worker Cache (Static Assets)               │  │
│  │  HTTP Cache (Cache-Control headers)                 │  │
│  │  React Query Cache (API responses)                  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CDN (Cloudflare/Vercel)                │
│  - Static assets (1 year TTL, immutable)                   │
│  - API responses (10s cache, 60s stale-while-revalidate)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION (Next.js)                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ISR Cache (Next.js built-in)                       │  │
│  │  - Static pages: 24h revalidation                   │  │
│  │  - Dynamic pages: 60s revalidation                  │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Redis Cache (Query results)                        │  │
│  │  - Cycles/Campuses: 1h TTL                         │  │
│  │  - Courses: 5min TTL                               │  │
│  │  - Leads: 10s TTL                                   │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL)                  │
│  - Connection pooling (max: 20, min: 2)                    │
│  - Statement timeout: 30s                                  │
│  - Prepared statements (automatic via Drizzle)             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Cache Configuration (src/lib/cache.ts)

```typescript
// TTL Configuration by Entity Type
const CACHE_CONFIG = {
  // Static data - long cache
  cycles: { ttl: 3600, swr: 7200 },      // 1h cache, 2h stale
  campuses: { ttl: 3600, swr: 7200 },    // 1h cache, 2h stale
  areas: { ttl: 3600, swr: 7200 },       // 1h cache, 2h stale

  // Semi-static data - medium cache
  courses: { ttl: 300, swr: 600 },       // 5min cache, 10min stale
  courseRuns: { ttl: 60, swr: 120 },     // 1min cache, 2min stale

  // Dynamic data - short cache
  leads: { ttl: 10, swr: 30 },           // 10s cache, 30s stale
  enrollments: { ttl: 30, swr: 60 },     // 30s cache, 1min stale

  // User-specific - no cache
  users: { ttl: 0, swr: 0 },
  auditLogs: { ttl: 0, swr: 0 },
}
```

### 1.3 Cache Invalidation Strategy

```typescript
// Automatic invalidation on mutations
// See: src/lib/cache.ts -> invalidateRelated()

// Entity relationships for cascade invalidation:
const relations = {
  courses: ['courseRuns', 'cycles'],
  courseRuns: ['courses', 'enrollments'],
  cycles: ['courses'],
  campuses: ['courseRuns'],
}
```

---

## 2. Database Optimization

### 2.1 Recommended Indexes

Run these SQL commands on PostgreSQL to optimize common queries:

```sql
-- ============================================================================
-- PERFORMANCE INDEXES for CEP Comunicación
-- Run on production database after schema is stable
-- ============================================================================

-- Courses: Filter by type, status, featured
CREATE INDEX CONCURRENTLY idx_courses_type_status
ON courses (type, status)
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_courses_featured
ON courses (featured, created_at DESC)
WHERE featured = true;

-- CourseRuns: Filter by course, status, dates
CREATE INDEX CONCURRENTLY idx_course_runs_course_status
ON course_runs (course_id, status, start_date);

CREATE INDEX CONCURRENTLY idx_course_runs_dates
ON course_runs (start_date, end_date)
WHERE status IN ('open', 'waitlist');

-- Enrollments: Student lookups, capacity checks
CREATE INDEX CONCURRENTLY idx_enrollments_course_run
ON enrollments (course_run_id, status);

CREATE INDEX CONCURRENTLY idx_enrollments_student
ON enrollments (student_id, created_at DESC);

-- Leads: Campaign attribution, date filtering
CREATE INDEX CONCURRENTLY idx_leads_campaign
ON leads (campaign_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_leads_source_date
ON leads (source, created_at DESC);

CREATE INDEX CONCURRENTLY idx_leads_email_search
ON leads (email);

-- Campaigns: Date range queries, status
CREATE INDEX CONCURRENTLY idx_campaigns_dates
ON campaigns (start_date, end_date)
WHERE status = 'active';

-- AuditLogs: User activity, entity lookups
CREATE INDEX CONCURRENTLY idx_audit_logs_user_date
ON audit_logs (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_audit_logs_entity
ON audit_logs (entity_type, entity_id, created_at DESC);

-- Full-text search on course titles (optional)
CREATE INDEX CONCURRENTLY idx_courses_title_fts
ON courses USING GIN (to_tsvector('spanish', title));
```

### 2.2 Connection Pool Settings

```typescript
// payload.config.ts
pool: {
  max: 20,                    // Max connections (adjust based on RAM)
  min: 2,                     // Keep 2 warm connections
  idleTimeoutMillis: 30000,   // Close idle after 30s
  connectionTimeoutMillis: 5000, // Fail fast
  statement_timeout: 30000,   // 30s max query time
}
```

### 2.3 Query Optimization Guidelines

```typescript
// ❌ BAD: N+1 queries
const courses = await payload.find({ collection: 'courses' });
for (const course of courses.docs) {
  const runs = await payload.find({
    collection: 'courseRuns',
    where: { course: { equals: course.id } }
  });
}

// ✅ GOOD: Single query with depth
const courses = await payload.find({
  collection: 'courses',
  depth: 2, // Include related courseRuns
});

// ✅ BETTER: Select only needed fields
const courses = await payload.find({
  collection: 'courses',
  depth: 1,
  select: {
    title: true,
    slug: true,
    type: true,
    courseRuns: {
      startDate: true,
      status: true,
    }
  }
});
```

---

## 3. Frontend Optimization

### 3.1 Next.js Configuration (next.config.js)

```javascript
// Already implemented:
- Image optimization (AVIF/WebP, responsive sizes)
- Bundle splitting (vendors, common chunks)
- Compression (gzip enabled)
- ETags for cache validation
- Console removal in production
- Lucide icons tree-shaking
```

### 3.2 Bundle Analysis

Run periodically to identify large dependencies:

```bash
cd apps/cms
npm run build:analyze
```

Target metrics:
- Main bundle: <100KB (gzipped)
- Vendor bundle: <500KB (gzipped)
- Individual pages: <50KB each

### 3.3 Component Optimization

```typescript
// Use React.memo for expensive components
const CourseCard = React.memo(({ course }: Props) => {
  // ...
});

// Lazy load heavy components
const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-only for chart libraries
});

// Use useMemo for expensive computations
const filteredCourses = useMemo(
  () => courses.filter(c => c.type === filter),
  [courses, filter]
);
```

---

## 4. API Optimization

### 4.1 Response Caching Headers

```typescript
// Already implemented in route handlers:
response.headers.set('Cache-Control', 's-maxage=10, stale-while-revalidate=59');
```

### 4.2 Payload API Best Practices

```typescript
// Limit results
const results = await payload.find({
  collection: 'courses',
  limit: 20,          // Don't fetch everything
  page: 1,
  pagination: true,
});

// Filter at database level
const results = await payload.find({
  collection: 'courses',
  where: {
    status: { equals: 'active' },
    type: { in: ['telematico', 'presencial'] },
  },
});

// Use select to reduce payload size
const results = await payload.find({
  collection: 'courses',
  select: {
    id: true,
    title: true,
    slug: true,
    // Exclude large fields like 'content', 'description'
  },
});
```

---

## 5. Infrastructure Optimization

### 5.1 Nginx Configuration

```nginx
# /etc/nginx/nginx.conf

# Enable gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript
           application/javascript application/json
           application/xml+rss image/svg+xml;

# Enable brotli (if available)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/xml text/javascript
             application/javascript application/json;

# Static file caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Proxy buffering for API
location /api/ {
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 16k;
}
```

### 5.2 Redis Configuration

```conf
# /etc/redis/redis.conf

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence (disable for pure cache)
save ""
appendonly no

# Performance
tcp-keepalive 300
timeout 0
```

### 5.3 PostgreSQL Tuning

```conf
# /etc/postgresql/16/main/postgresql.conf

# Memory
shared_buffers = 256MB           # 25% of RAM
effective_cache_size = 768MB     # 75% of RAM
work_mem = 16MB
maintenance_work_mem = 64MB

# Connections
max_connections = 50

# Query optimization
random_page_cost = 1.1           # SSD storage
effective_io_concurrency = 200

# Logging slow queries
log_min_duration_statement = 1000  # Log queries > 1s
```

---

## 6. Monitoring & Alerts

### 6.1 Key Metrics to Monitor

| Metric | Warning | Critical | Tool |
|--------|---------|----------|------|
| API p95 latency | >500ms | >1s | Prometheus |
| Database connections | >15 | >18 | pg_stat_activity |
| Redis memory | >80% | >90% | redis-cli INFO |
| Error rate (5xx) | >1% | >5% | Nginx logs |
| Cache hit ratio | <80% | <60% | Custom metrics |

### 6.2 Health Check Endpoint

```typescript
// /api/health
export async function GET() {
  const [db, redis] = await Promise.all([
    checkDatabase(),
    cacheHealthCheck(),
  ]);

  return Response.json({
    status: db.status === 'ok' && redis.status === 'ok' ? 'healthy' : 'degraded',
    database: db,
    cache: redis,
    timestamp: new Date().toISOString(),
  });
}
```

---

## 7. Implementation Roadmap

### Phase 1: Quick Wins (Week 1)
- [x] Update next.config.js with optimizations
- [x] Add PostgreSQL connection pool settings
- [x] Create Redis cache layer (src/lib/cache.ts)
- [ ] Add ioredis dependency
- [ ] Test cache layer locally

### Phase 2: Database (Week 2)
- [ ] Run index creation SQL on production
- [ ] Enable query logging for slow queries
- [ ] Analyze and optimize top 10 slowest queries

### Phase 3: Infrastructure (Week 3)
- [ ] Configure Redis on production
- [ ] Update Nginx with compression settings
- [ ] Add health check endpoint
- [ ] Set up monitoring alerts

### Phase 4: Frontend (Week 4)
- [ ] Implement React Query for API caching
- [ ] Add lazy loading for heavy components
- [ ] Run bundle analysis and optimize imports

---

## References

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Payload CMS Optimization](https://payloadcms.com/docs/production/performance)
- [PostgreSQL Tuning](https://pgtune.leopard.in.ua/)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)

---

**Last Updated:** 2025-12-05
**Author:** Claude Code (SOLARIA AGENCY)
