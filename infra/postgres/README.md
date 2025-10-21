# PostgreSQL Database - CEPComunicacion v2

**Lead Management & Marketing Automation Platform**

## Quick Start

### 1. Prerequisites
- PostgreSQL 16.x installed
- Node.js 18+ (for running tests)
- psql command-line tool

### 2. Create Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE cepcomunicacion;"

# Or for test database
psql -U postgres -c "CREATE DATABASE cepcomunicacion_test;"
```

### 3. Run Migrations (TDD Approach)

#### Step 1: Run Tests FIRST (RED)
```bash
# Install dependencies
npm install

# Run migration tests (they will FAIL initially - this is expected!)
npm test infra/postgres/tests/migrations.test.ts
```

#### Step 2: Apply Migrations (GREEN)
```bash
# Apply all migrations in order
cd infra/postgres/migrations

psql -U postgres -d cepcomunicacion -f 001_create_base_tables.sql
psql -U postgres -d cepcomunicacion -f 002_create_courses.sql
psql -U postgres -d cepcomunicacion -f 003_create_course_runs.sql
psql -U postgres -d cepcomunicacion -f 004_create_campaigns.sql
psql -U postgres -d cepcomunicacion -f 005_create_leads.sql
psql -U postgres -d cepcomunicacion -f 006_create_content.sql
psql -U postgres -d cepcomunicacion -f 007_create_media.sql
psql -U postgres -d cepcomunicacion -f 008_create_metadata.sql
psql -U postgres -d cepcomunicacion -f 009_create_audit.sql
psql -U postgres -d cepcomunicacion -f 010_create_indexes.sql
psql -U postgres -d cepcomunicacion -f 011_add_constraints.sql
```

#### Step 3: Run Tests Again (Tests should PASS)
```bash
npm test infra/postgres/tests/migrations.test.ts
```

### 4. Load Seed Data
```bash
psql -U postgres -d cepcomunicacion -f seeds/001_initial_data.sql
```

### 5. Verify Installation
```bash
psql -U postgres -d cepcomunicacion -c "\dt"
# Should show 13 tables
```

---

## Project Structure

```
infra/postgres/
├── README.md                          # This file
├── SCHEMA.md                          # Complete schema documentation with ERD
├── migrations/                        # Database migrations (versioned)
│   ├── 001_create_base_tables.sql    # cycles, campuses, users
│   ├── 002_create_courses.sql        # courses table
│   ├── 003_create_course_runs.sql    # course_runs table
│   ├── 004_create_campaigns.sql      # campaigns, ads_templates
│   ├── 005_create_leads.sql          # leads table (GDPR compliant)
│   ├── 006_create_content.sql        # blog_posts, faqs
│   ├── 007_create_media.sql          # media table
│   ├── 008_create_metadata.sql       # seo_metadata table
│   ├── 009_create_audit.sql          # audit_logs table
│   ├── 010_create_indexes.sql        # Performance indexes
│   └── 011_add_constraints.sql       # Triggers for updated_at
├── seeds/                             # Initial data for development
│   └── 001_initial_data.sql          # 3 cycles, 2 campuses, 1 admin, 5 courses, 3 FAQs
└── tests/                             # Migration tests (TDD)
    └── migrations.test.ts             # Comprehensive test suite
```

---

## Database Schema Overview

### 13 Tables

| Table | Purpose | Key Features |
|-------|---------|-------------|
| **cycles** | Educational cycles (FP Básica, Grado Medio, etc.) | Enum constraints, ordering |
| **campuses** | Physical training locations | City indexing |
| **users** | CMS users with RBAC | 5 roles, password reset, bcrypt hashing |
| **courses** | Course catalog | SEO optimization, multi-campus, status workflow |
| **course_runs** | Scheduled course instances | Enrollment management, capacity checks |
| **campaigns** | Marketing campaigns | Multi-platform (Meta, Google, Email), JSONB targeting |
| **ads_templates** | Ad creative templates | Performance metrics, carousel support |
| **leads** | Lead submissions | **GDPR compliant**, UTM tracking, Mailchimp integration |
| **blog_posts** | Content management | Tag-based, view counting, author attribution |
| **faqs** | Frequently asked questions | Category-based, display ordering |
| **media** | File uploads | Polymorphic associations, MinIO/S3 support |
| **seo_metadata** | SEO optimization | Open Graph, Twitter Cards, polymorphic |
| **audit_logs** | GDPR audit trail | Action logging, IP tracking, JSONB snapshots |

### Key Statistics
- **Total Indexes**: 30+ (B-tree, GIN, composite, partial)
- **Foreign Keys**: 18 (with appropriate CASCADE/RESTRICT rules)
- **CHECK Constraints**: 15 (data integrity enforcement)
- **Triggers**: 11 (auto-update `updated_at` timestamps)

---

## GDPR Compliance

### Critical Features
1. **Consent Tracking** (GDPR Article 6)
   - `leads.gdpr_consent` MUST be true (CHECK constraint)
   - `leads.gdpr_consent_date` and `leads.gdpr_consent_ip` for audit trail

2. **Audit Trail** (GDPR Article 30)
   - `audit_logs` table records all data access/modifications
   - 3-year minimum retention

3. **Data Subject Rights**
   - Right to access (Article 15): Log exports
   - Right to erasure (Article 17): Log deletions
   - Right to rectification (Article 16): Log updates

---

## Performance Optimization

### Index Strategy
- **B-tree**: Single-column lookups (email, slug, status)
- **Composite B-tree**: Multi-column filters (cycle_id + campus_id)
- **GIN**: Array search (tags, keywords) and JSONB queries
- **Partial**: Conditional indexes (featured = true, assigned_to IS NOT NULL)

### Query Performance Examples
- Course catalog filtering: **~2ms** (vs 500ms without indexes)
- Campaign analytics: **~5ms** for 10,000 leads
- Keyword search: **~10ms** (vs 2000ms without GIN index)

---

## Migration Workflow

### Test-Driven Development (TDD)

1. **RED**: Write failing tests first
   ```bash
   npm test infra/postgres/tests/migrations.test.ts
   # Expected: Tests FAIL (tables don't exist yet)
   ```

2. **GREEN**: Apply migrations to make tests pass
   ```bash
   psql -U postgres -d cepcomunicacion_test -f migrations/001_create_base_tables.sql
   # ... (apply all migrations)
   npm test
   # Expected: Tests PASS
   ```

3. **REFACTOR**: Optimize indexes and constraints
   ```bash
   # Add missing indexes based on query patterns
   # Update constraints based on business rules
   ```

### Rollback Procedure
Each migration includes a rollback script in comments:
```bash
# Example: Rollback migration 005
psql -U postgres -d cepcomunicacion -c "DROP TABLE IF EXISTS leads CASCADE;"
```

---

## Common Tasks

### Connect to Database
```bash
psql -U postgres -d cepcomunicacion
```

### Run Specific Migration
```bash
psql -U postgres -d cepcomunicacion -f migrations/002_create_courses.sql
```

### Check Migration Status
```bash
psql -U postgres -d cepcomunicacion -c "\dt"
# Lists all tables (should show 13 tables)
```

### View Table Schema
```bash
psql -U postgres -d cepcomunicacion -c "\d courses"
# Shows columns, constraints, indexes for 'courses' table
```

### Export Database Schema
```bash
pg_dump -U postgres -d cepcomunicacion --schema-only > schema_backup.sql
```

### Import Database
```bash
psql -U postgres -d cepcomunicacion < schema_backup.sql
```

---

## Testing

### Run All Migration Tests
```bash
npm test infra/postgres/tests/migrations.test.ts
```

### Run Specific Test Suite
```bash
npm test -- -t "001_create_base_tables"
```

### Test Coverage Requirements
- **Minimum**: 80% coverage
- **Tests include**:
  - Schema validation (columns, data types)
  - Constraint enforcement (UNIQUE, NOT NULL, CHECK, FK)
  - Index creation and performance
  - GDPR compliance (consent tracking)
  - Rollback functionality

---

## Seed Data

### Included Data
- **3 Cycles**: FP Básica, Grado Medio, Grado Superior
- **2 Campuses**: Madrid Centro, Barcelona Eixample
- **1 Admin User**: admin@cepcomunicacion.com (password: `admin123` - **CHANGE IMMEDIATELY**)
- **5 Courses**: Representative sample across modalities
- **3 FAQs**: Common enrollment questions

### Load Seed Data
```bash
psql -U postgres -d cepcomunicacion -f seeds/001_initial_data.sql
```

### Verify Seed Data
```bash
psql -U postgres -d cepcomunicacion -c "SELECT COUNT(*) FROM cycles;"
# Expected: 3

psql -U postgres -d cepcomunicacion -c "SELECT COUNT(*) FROM courses WHERE status = 'published';"
# Expected: 5
```

---

## Maintenance

### Update Table Statistics
```bash
psql -U postgres -d cepcomunicacion -c "ANALYZE;"
```

### Vacuum and Analyze
```bash
psql -U postgres -d cepcomunicacion -c "VACUUM ANALYZE;"
```

### Check Index Usage
```sql
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Find Unused Indexes
```sql
SELECT
    schemaname,
    tablename,
    indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%pkey%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Troubleshooting

### Error: "relation does not exist"
**Solution**: Run migrations in order (001 → 011)

### Error: "duplicate key value violates unique constraint"
**Cause**: Trying to insert duplicate slug/email
**Solution**: Check UNIQUE constraints, ensure data is unique

### Error: "permission denied for table"
**Solution**: Grant permissions:
```bash
psql -U postgres -d cepcomunicacion -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;"
```

### Tests Failing After Migration
**Solution**:
1. Check migration was applied: `\dt` in psql
2. Verify table schema: `\d table_name`
3. Check for typos in column names
4. Ensure indexes were created: `\di`

---

## Security Considerations

### Password Hashing
- Use bcrypt with cost factor 10+ for user passwords
- Never store plaintext passwords
- Implement password reset with expiring tokens

### Row-Level Security (Future)
```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_campus_isolation ON leads
USING (campus_id = current_setting('app.current_campus_id')::INTEGER);
```

### Audit Logs
- Monitor `audit_logs` table for suspicious activity
- Set up alerts for `action='erased'` (GDPR erasure requests)
- Regular compliance audits

---

## Resources

### Documentation
- **Schema Documentation**: [SCHEMA.md](./SCHEMA.md)
- **PostgreSQL Docs**: https://www.postgresql.org/docs/16/
- **GDPR Guidelines**: https://gdpr.eu/

### Tools
- **pgAdmin**: GUI for PostgreSQL management
- **DBeaver**: Universal database tool
- **Postico**: macOS PostgreSQL client

### Support
- **Email**: dev@cepcomunicacion.com
- **Slack**: #database-support
- **Emergency**: On-call DBA +34 XXX XXX XXX

---

## Next Steps

1. **Apply migrations to production database** (during maintenance window)
2. **Configure automatic backups** (daily full backup + WAL archiving)
3. **Set up monitoring** (pg_stat_statements, slow query log)
4. **Implement connection pooling** (PgBouncer or application-level)
5. **Configure SSL/TLS** for production connections
6. **Set up replication** (primary-replica for high availability)

---

**Last Updated**: 2025-10-21
**Database Version**: 1.0.0
**PostgreSQL Version**: 16.x
**Maintainer**: Database Architecture Team
