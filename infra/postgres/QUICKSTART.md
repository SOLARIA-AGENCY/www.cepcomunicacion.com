# PostgreSQL Quick Start Guide - CEPComunicacion v2

## 5-Minute Setup

### Step 1: Create Database
```bash
createdb cepcomunicacion
```

### Step 2: Apply All Migrations
```bash
cd /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/infra/postgres

# One-liner to apply all migrations
for file in migrations/*.sql; do
  echo "Applying $file..."
  psql -U postgres -d cepcomunicacion -f "$file"
done
```

### Step 3: Load Seed Data
```bash
psql -U postgres -d cepcomunicacion -f seeds/001_initial_data.sql
```

### Step 4: Verify
```bash
psql -U postgres -d cepcomunicacion -c "\dt"
# Expected: 13 tables

psql -U postgres -d cepcomunicacion -c "SELECT COUNT(*) FROM courses WHERE status = 'published';"
# Expected: 5
```

---

## Environment Variables

Add to your `.env` file:

```bash
# PostgreSQL Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cepcomunicacion
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password

# Production
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

---

## Common Queries Cheat Sheet

### 1. Recent Leads
```sql
SELECT name, email, status, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 20;
```

### 2. Published Courses by Campus
```sql
SELECT c.title, cam.name as campus, c.modality, c.price
FROM courses c
JOIN campuses cam ON c.campus_id = cam.id
WHERE c.status = 'published'
ORDER BY cam.name, c.title;
```

### 3. Campaign Performance
```sql
SELECT
    cam.name,
    COUNT(l.id) as leads,
    COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as conversions
FROM campaigns cam
LEFT JOIN leads l ON l.campaign_id = cam.id
GROUP BY cam.id, cam.name
ORDER BY conversions DESC;
```

### 4. Upcoming Course Runs
```sql
SELECT
    c.title,
    cr.start_date,
    cam.name as campus
FROM course_runs cr
JOIN courses c ON cr.course_id = c.id
JOIN campuses cam ON cr.campus_id = cam.id
WHERE cr.start_date >= CURRENT_DATE
    AND cr.status = 'scheduled'
ORDER BY cr.start_date;
```

---

## Connection Strings

### psql (CLI)
```bash
psql postgresql://postgres:password@localhost:5432/cepcomunicacion
```

### Node.js (pg)
```javascript
const { Client } = require('pg');

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

await client.connect();
```

### Prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// DATABASE_URL=postgresql://postgres:password@localhost:5432/cepcomunicacion
```

---

## Useful psql Commands

```bash
\dt                    # List all tables
\d table_name          # Describe table schema
\di                    # List all indexes
\du                    # List users
\l                     # List databases
\c database_name       # Connect to database
\x                     # Toggle expanded display
\q                     # Quit
```

---

## Backup & Restore

### Backup
```bash
# Full database backup
pg_dump -U postgres cepcomunicacion > backup_$(date +%Y%m%d).sql

# Schema only
pg_dump -U postgres --schema-only cepcomunicacion > schema_backup.sql

# Data only
pg_dump -U postgres --data-only cepcomunicacion > data_backup.sql
```

### Restore
```bash
# Restore full database
psql -U postgres -d cepcomunicacion < backup_20251021.sql

# Restore to new database
createdb cepcomunicacion_restored
psql -U postgres -d cepcomunicacion_restored < backup_20251021.sql
```

---

## Troubleshooting

### Can't connect to PostgreSQL
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Or on macOS
brew services list | grep postgresql

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql # macOS
```

### Permission denied
```bash
# Grant all privileges
psql -U postgres -d cepcomunicacion -c "
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
"
```

### Reset admin password
```bash
# Generate bcrypt hash (Node.js)
node -e "console.log(require('bcryptjs').hashSync('new_password', 10))"

# Update password
psql -U postgres -d cepcomunicacion -c "
  UPDATE users
  SET password_hash = '\$2b\$10\$...'
  WHERE email = 'admin@cepcomunicacion.com';
"
```

---

## Performance Tuning

### Analyze table statistics
```bash
psql -U postgres -d cepcomunicacion -c "ANALYZE VERBOSE;"
```

### Find slow queries
```sql
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Check table sizes
```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Development Workflow

### 1. Create Test Database
```bash
createdb cepcomunicacion_test
```

### 2. Run Migrations on Test DB
```bash
for file in migrations/*.sql; do
  psql -U postgres -d cepcomunicacion_test -f "$file"
done
```

### 3. Run Tests
```bash
npm test infra/postgres/tests/migrations.test.ts
```

### 4. Reset Test Database
```bash
dropdb cepcomunicacion_test
createdb cepcomunicacion_test
# Re-apply migrations
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Enable SSL/TLS in production
- [ ] Configure connection pooling (PgBouncer)
- [ ] Set up automatic backups
- [ ] Monitor audit_logs for suspicious activity
- [ ] Implement row-level security (RLS) if multi-tenant
- [ ] Regularly update PostgreSQL version
- [ ] Use environment variables for credentials (never hardcode)

---

## Next Steps

1. Read full documentation: [SCHEMA.md](./SCHEMA.md)
2. Review migrations: `migrations/*.sql`
3. Run tests: `npm test`
4. Set up monitoring (pg_stat_statements, slow query log)
5. Configure backups (cron job for daily pg_dump)

---

**Need Help?**
- Documentation: [README.md](./README.md)
- Schema Reference: [SCHEMA.md](./SCHEMA.md)
- Support: dev@cepcomunicacion.com
