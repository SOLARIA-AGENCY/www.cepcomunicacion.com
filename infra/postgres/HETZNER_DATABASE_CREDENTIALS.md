# Database Installation Complete - Hetzner VPS

## Server Information
- **IP:** 46.62.222.138
- **Hostname:** CEPCOMUNICACION-PROD
- **Installation Date:** 2025-11-03
- **Status:** PRODUCTION READY

## PostgreSQL 16.10

### Connection Details
```bash
Database: cepcomunicacion
User: cepcomunicacion
Password: T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=
Host: localhost
Port: 5432
```

### Connection String
```
postgresql://cepcomunicacion:T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=@localhost:5432/cepcomunicacion
```

### Environment Variable (.env)
```bash
DATABASE_URL="postgresql://cepcomunicacion:T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=@localhost:5432/cepcomunicacion"
```

### Configuration Highlights
- Optimized for 3.7GB RAM, SSD storage
- shared_buffers: 1GB
- effective_cache_size: 2.5GB
- Listening on localhost only (secure)
- Extensions: pg_stat_statements, uuid-ossp, pg_trgm

### Performance Test Results
- INSERT 10,000 rows: SUCCESS
- COUNT query: 1.582ms
- Index creation: 5.806ms
- Index scan (10,000 rows): 1.878ms

## Redis 7.0.15

### Connection Details
```bash
Password: ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=
Host: localhost
Port: 6379
```

### Connection String
```
redis://:ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=@localhost:6379
```

### Environment Variables (.env)
```bash
REDIS_URL="redis://:ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=@localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y="
```

### Configuration Highlights
- Memory: 512MB max
- Eviction: allkeys-lru
- Persistence: RDB + AOF enabled
- Listening on localhost only (secure)

### Performance Benchmark Results
- PING: 125,000 req/sec
- SET: 128,205 req/sec
- GET: 119,047 req/sec
- INCR: 136,986 req/sec
- LPUSH: 136,986 req/sec

## Security

- Both services listen ONLY on localhost (127.0.0.1, ::1)
- Strong 32-character base64 passwords
- PostgreSQL uses scram-sha-256 authentication
- Redis password protected
- No external network access

## Docker Compose Example

For applications running in Docker containers on the same host:

```yaml
services:
  app:
    environment:
      DATABASE_URL: "postgresql://cepcomunicacion:T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=@host.docker.internal:5432/cepcomunicacion"
      REDIS_URL: "redis://:ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=@host.docker.internal:6379"
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

Or use host network mode:

```yaml
services:
  app:
    network_mode: "host"
    environment:
      DATABASE_URL: "postgresql://cepcomunicacion:T+IscBZYTfvdGp57EFiOb3wBI/+dOb5MRhXHX1B2hTg=@localhost:5432/cepcomunicacion"
      REDIS_URL: "redis://:ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=@localhost:6379"
```

## Service Management

```bash
# Check status
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "systemctl status postgresql redis-server"

# Restart services
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "systemctl restart postgresql redis-server"

# Check logs
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "tail -f /var/log/postgresql/postgresql-16-main.log"
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "tail -f /var/log/redis/redis-server.log"
```

## Backup Commands

### PostgreSQL
```bash
# Backup
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "sudo -u postgres pg_dump cepcomunicacion > /backup/cepcomunicacion_$(date +%Y%m%d).sql"

# Restore
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "sudo -u postgres psql cepcomunicacion < /backup/cepcomunicacion_YYYYMMDD.sql"
```

### Redis
```bash
# Manual snapshot
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "redis-cli -a 'ZbCBFWGRZtdY+vcIdFGnSKLArSyE3kIgnW+q664xZ2Y=' BGSAVE"

# Copy backup
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "cp /var/lib/redis/dump.rdb /backup/redis_dump_$(date +%Y%m%d).rdb"
```

## Complete Documentation

Full installation summary available on server:
```bash
ssh -i ~/.ssh/solaria-hetzner/id_solaria_hetzner_prod root@46.62.222.138 "cat /root/database-installation-summary.txt"
```

Credentials file on server (root-only access):
```bash
/root/.db_credentials
```

---

**IMPORTANT:** Store these credentials securely in your password manager!

**Support:** SOLARIA AGENCY - https://www.solaria.agency
