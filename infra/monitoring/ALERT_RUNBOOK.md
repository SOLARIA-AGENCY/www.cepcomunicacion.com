# Alert Runbook - CEPComunicacion v2

This runbook provides step-by-step procedures for responding to alerts from the monitoring system.

## Table of Contents

- [General Response Procedure](#general-response-procedure)
- [Application Alerts](#application-alerts)
- [Database Alerts](#database-alerts)
- [Infrastructure Alerts](#infrastructure-alerts)
- [Business Alerts](#business-alerts)
- [Escalation Procedures](#escalation-procedures)

## General Response Procedure

### When You Receive an Alert

1. **Acknowledge** - Confirm receipt within 5 minutes (critical) or 30 minutes (warning)
2. **Assess** - Review alert details, severity, and affected services
3. **Investigate** - Follow specific runbook procedures below
4. **Mitigate** - Take immediate action to restore service
5. **Document** - Record actions taken and root cause
6. **Follow-up** - Schedule permanent fix if temporary mitigation applied

### Alert Severity Response Times

| Severity | Response Time | Resolution Target | Escalation After |
|----------|---------------|-------------------|------------------|
| Critical | 5 minutes | 1 hour | 30 minutes |
| Warning | 30 minutes | 4 hours | 2 hours |
| Info | Best effort | 24 hours | N/A |

---

## Application Alerts

### ServiceDown

**Alert**: Service is not responding to health checks

**Severity**: Critical

**Team**: Platform

#### Symptoms
- Service container stopped or crashed
- Health check endpoint returning errors
- No metrics being collected

#### Investigation Steps

1. **Check service status**:
```bash
docker ps -a | grep cepcomunicacion
```

2. **Check container logs**:
```bash
docker logs cepcomunicacion_web --tail 100
docker logs cepcomunicacion_cms --tail 100
```

3. **Check health endpoint manually**:
```bash
curl -v http://localhost:3001/api/health
curl -v http://localhost:3000/api/health
```

4. **Check resource usage**:
```bash
docker stats --no-stream
```

#### Resolution Steps

**If container is stopped**:
```bash
docker-compose -f docker-compose.yml up -d [service-name]
```

**If container is running but unhealthy**:
```bash
# Check for errors in logs
docker logs cepcomunicacion_[service] --tail 500 | grep -i error

# Restart service
docker-compose -f docker-compose.yml restart [service-name]

# If still failing, check dependencies
docker-compose -f docker-compose.yml ps
```

**If OOM killed (Out of Memory)**:
```bash
# Check dmesg for OOM events
dmesg | grep -i oom

# Increase memory limit in docker-compose.yml
# Then restart service
docker-compose -f docker-compose.yml up -d [service-name]
```

#### Prevention
- Enable automatic restart policy in Docker Compose
- Implement circuit breakers in application code
- Add resource limits and health checks
- Monitor memory usage trends

---

### HighHTTPErrorRate

**Alert**: 5xx error rate exceeds 5% of total requests

**Severity**: Critical

**Team**: Backend

#### Symptoms
- Increased 500/502/503 errors
- User complaints about errors
- Slow or failing requests

#### Investigation Steps

1. **Check error distribution**:
```bash
# Query Prometheus for error breakdown
# Navigate to: http://localhost:9090/graph
rate(http_requests_total{status=~"5.."}[5m]) by (status, route)
```

2. **Check application logs**:
```bash
# Query Loki for error logs
{service="backend"} |= "error" |= "status=5"
```

3. **Check database connectivity**:
```bash
curl http://localhost:3001/api/health
# Check "database" status in response
```

4. **Check recent deployments**:
```bash
git log -n 10 --oneline
docker images | grep cepcomunicacion
```

#### Resolution Steps

**If database connection issues**:
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready

# Check active connections
docker-compose exec postgres psql -U cepcomunicacion -c "SELECT count(*) FROM pg_stat_activity;"

# Restart connection pool
docker-compose restart cms web
```

**If application errors**:
```bash
# Review error logs for stack traces
docker logs cepcomunicacion_cms 2>&1 | grep -A 10 "Error:"

# Check for configuration issues
docker-compose exec cms env | grep -E "DATABASE|REDIS|SMTP"

# Rollback if recent deployment caused issue
git checkout [previous-commit]
docker-compose up -d --build
```

**If external API failures**:
```bash
# Test external services
curl -v https://graph.facebook.com/v18.0/me
curl -v https://api.mailchimp.com/3.0/ping

# Implement fallback/retry logic
# Enable circuit breaker pattern
```

#### Prevention
- Implement retry logic with exponential backoff
- Add circuit breakers for external APIs
- Improve error handling and logging
- Add integration tests for critical paths

---

### SlowAPIResponses

**Alert**: 95th percentile response time exceeds 2 seconds

**Severity**: Warning

**Team**: Backend

#### Symptoms
- Slow page loads
- Timeout errors
- Poor user experience
- Database query slowness

#### Investigation Steps

1. **Identify slow endpoints**:
```bash
# Query Prometheus
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) by (route)
```

2. **Check database query performance**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT query, calls, total_exec_time, mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;"
```

3. **Check slow query log**:
```bash
docker-compose exec postgres tail -f /var/lib/postgresql/data/log/postgresql-*.log | grep "duration:"
```

4. **Check Redis cache hit rate**:
```bash
# Query Prometheus
rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))
```

#### Resolution Steps

**If slow database queries**:
```bash
# Analyze specific query
docker-compose exec postgres psql -U cepcomunicacion -c "
  EXPLAIN ANALYZE
  SELECT * FROM leads WHERE status = 'new';"

# Add missing indexes
docker-compose exec postgres psql -U cepcomunicacion -c "
  CREATE INDEX CONCURRENTLY idx_leads_status ON leads(status);"

# Vacuum and analyze tables
docker-compose exec postgres psql -U cepcomunicacion -c "VACUUM ANALYZE;"
```

**If low cache hit rate**:
```bash
# Increase Redis memory
# Edit docker-compose.yml:
# redis:
#   command: redis-server --maxmemory 512mb

# Restart Redis
docker-compose restart redis

# Implement cache warming strategy
# Review cache TTL settings
```

**If high resource usage**:
```bash
# Scale horizontally - add more workers
docker-compose up -d --scale worker=3

# Optimize resource-intensive operations
# Implement pagination for large result sets
# Use database connection pooling
```

#### Prevention
- Add database query performance monitoring
- Implement APM (Application Performance Monitoring)
- Set up query execution time budgets
- Regular database maintenance (vacuum, analyze)
- Optimize N+1 query problems

---

## Database Alerts

### DatabaseConnectionsHigh

**Alert**: Active database connections exceed 80% of max connections

**Severity**: Warning

**Team**: Backend

#### Symptoms
- "Too many connections" errors
- Connection pool exhaustion
- Application slowdown
- New connections rejected

#### Investigation Steps

1. **Check active connections**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT count(*), state
  FROM pg_stat_activity
  WHERE datname = 'cepcomunicacion'
  GROUP BY state;"
```

2. **Identify connection sources**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT application_name, count(*), state
  FROM pg_stat_activity
  WHERE datname = 'cepcomunicacion'
  GROUP BY application_name, state
  ORDER BY count(*) DESC;"
```

3. **Check for idle connections**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT pid, usename, application_name, state, query_start
  FROM pg_stat_activity
  WHERE datname = 'cepcomunicacion'
    AND state = 'idle'
  ORDER BY query_start;"
```

4. **Check connection pool settings**:
```bash
# Check application configuration
docker-compose exec cms env | grep DATABASE_POOL
```

#### Resolution Steps

**Immediate mitigation**:
```bash
# Terminate idle connections (older than 1 hour)
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE datname = 'cepcomunicacion'
    AND state = 'idle'
    AND state_change < NOW() - INTERVAL '1 hour';"

# Restart application to reset connection pool
docker-compose restart cms web worker
```

**Long-term fix**:
```bash
# Increase max_connections (requires PostgreSQL restart)
docker-compose exec postgres psql -U cepcomunicacion -c "
  ALTER SYSTEM SET max_connections = 150;"
docker-compose restart postgres

# Configure connection pooling in application
# Set reasonable pool size (typically 10-20 per instance)
# Implement connection timeout
# Close connections properly in application code
```

#### Prevention
- Set connection pool max size to reasonable value
- Implement connection leak detection
- Monitor connection usage trends
- Use connection pooler (PgBouncer) if needed
- Set statement_timeout to prevent long-running queries

---

### SlowDatabaseQueries

**Alert**: High rate of disk reads indicates slow queries or missing indexes

**Severity**: Warning

**Team**: Backend

#### Investigation Steps

1. **Identify slow queries**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT query, calls, total_exec_time, mean_exec_time, rows
  FROM pg_stat_statements
  WHERE mean_exec_time > 1000  -- queries slower than 1 second
  ORDER BY mean_exec_time DESC
  LIMIT 20;"
```

2. **Check missing indexes**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan
  FROM pg_stat_user_tables
  WHERE seq_scan > idx_scan
    AND seq_tup_read > 10000
  ORDER BY seq_tup_read DESC;"
```

3. **Analyze query execution plan**:
```bash
docker-compose exec postgres psql -U cepcomunicacion -c "
  EXPLAIN (ANALYZE, BUFFERS)
  [paste slow query here];"
```

#### Resolution Steps

```bash
# Create missing indexes
docker-compose exec postgres psql -U cepcomunicacion -c "
  CREATE INDEX CONCURRENTLY idx_leads_created_at ON leads(created_at);
  CREATE INDEX CONCURRENTLY idx_leads_campus_id ON leads(campus_id);
  CREATE INDEX CONCURRENTLY idx_course_runs_status ON course_runs(status);"

# Update table statistics
docker-compose exec postgres psql -U cepcomunicacion -c "ANALYZE;"

# Enable auto-vacuum if disabled
docker-compose exec postgres psql -U cepcomunicacion -c "
  ALTER TABLE leads SET (autovacuum_enabled = true);"
```

#### Prevention
- Regular query performance reviews
- Automated slow query log monitoring
- Index usage analysis
- Query optimization in code reviews
- Database performance testing in CI/CD

---

## Infrastructure Alerts

### HighCPUUsage

**Alert**: CPU usage exceeds 80% for 10 minutes

**Severity**: Warning

**Team**: Platform

#### Investigation Steps

1. **Identify CPU-intensive processes**:
```bash
top -bn1 | head -20
docker stats --no-stream
```

2. **Check for runaway processes**:
```bash
ps aux | sort -k3 -r | head -10
```

3. **Review application metrics**:
```bash
# Query Prometheus for container CPU usage
rate(container_cpu_usage_seconds_total[5m]) * 100
```

#### Resolution Steps

**If specific container consuming CPU**:
```bash
# Restart container
docker-compose restart [container-name]

# Scale down CPU-intensive operations
# Implement rate limiting
# Optimize CPU-intensive code paths
```

**If system-wide issue**:
```bash
# Check for system updates
apt list --upgradable

# Check for cron jobs
crontab -l
systemctl list-timers

# Review system logs
journalctl -n 100 -p err
```

#### Prevention
- Right-size container resource limits
- Implement CPU throttling for background jobs
- Profile CPU usage in development
- Schedule CPU-intensive tasks during off-peak hours

---

### HighMemoryUsage

**Alert**: Memory usage exceeds 80% of total RAM

**Severity**: Warning

**Team**: Platform

#### Investigation Steps

1. **Check memory usage by container**:
```bash
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"
```

2. **Check for memory leaks**:
```bash
# Monitor memory usage over time
watch -n 5 'docker stats --no-stream'
```

3. **Check system memory**:
```bash
free -h
vmstat 5 10
```

#### Resolution Steps

**Immediate mitigation**:
```bash
# Restart memory-hungry container
docker-compose restart [container-name]

# Clear caches
echo 3 > /proc/sys/vm/drop_caches  # Requires root

# Stop non-essential services temporarily
docker-compose stop uptime-kuma
```

**Long-term fix**:
```bash
# Add memory limits to containers
# Edit docker-compose.yml:
# services:
#   cms:
#     mem_limit: 1g
#     mem_reservation: 512m

# Investigate memory leaks in application
# Use memory profiler
# Fix memory leaks in code

# Consider upgrading VPS plan
```

#### Prevention
- Set memory limits on all containers
- Implement memory leak detection
- Monitor memory trends
- Regular container restarts (weekly)
- Optimize application memory usage

---

### DiskSpaceLow

**Alert**: Available disk space below 20%

**Severity**: Warning

**Team**: Platform

#### Investigation Steps

1. **Check disk usage**:
```bash
df -h
du -sh /* | sort -h
```

2. **Find largest directories**:
```bash
du -h --max-depth=1 /var/lib/docker | sort -h
du -h --max-depth=1 /var/log | sort -h
```

3. **Check Docker disk usage**:
```bash
docker system df
```

#### Resolution Steps

**Clean up Docker resources**:
```bash
# Remove unused images, containers, networks
docker system prune -af --volumes

# Remove old logs
docker-compose logs --tail=0 > /dev/null

# Limit log file sizes
# Edit /etc/docker/daemon.json:
# {
#   "log-driver": "json-file",
#   "log-opts": {
#     "max-size": "10m",
#     "max-file": "3"
#   }
# }
```

**Clean up application data**:
```bash
# Vacuum PostgreSQL database
docker-compose exec postgres psql -U cepcomunicacion -c "VACUUM FULL;"

# Clean old logs
find /var/log -name "*.log" -mtime +30 -delete
find /var/log -name "*.gz" -mtime +30 -delete

# Rotate logs
logrotate -f /etc/logrotate.conf
```

**Clean up monitoring data**:
```bash
# Reduce Prometheus retention
# Edit prometheus.yml:
# --storage.tsdb.retention.time=15d

# Clean old Loki chunks
# Edit loki-config.yml:
# retention_period: 15d
```

#### Prevention
- Implement automated cleanup scripts
- Set up log rotation
- Monitor disk usage trends
- Plan for storage expansion
- Implement data archival strategy

---

## Business Alerts

### NoLeadsReceived

**Alert**: Zero leads captured in the last hour

**Severity**: Warning

**Team**: Marketing

#### Symptoms
- No lead form submissions
- Meta Ads integration broken
- Website forms not working
- Webhook failures

#### Investigation Steps

1. **Check form functionality**:
- Manually test lead form on website
- Check browser console for JavaScript errors
- Verify CAPTCHA is working
- Test form submission in different browsers

2. **Check webhook endpoints**:
```bash
# Check if webhook endpoint is accessible
curl -v https://www.cepcomunicacion.com/api/leads/webhook

# Check recent webhook deliveries in Meta Ads Manager
# Navigate to: Meta Ads Manager → Settings → Webhooks
```

3. **Check integration logs**:
```bash
# Query logs for lead submissions
docker logs cepcomunicacion_cms 2>&1 | grep "lead.*submit"

# Check for errors
{service="backend"} |= "lead" |= "error"
```

4. **Check Meta Pixel**:
```bash
# Verify pixel is firing
# Use Meta Pixel Helper browser extension
# Check DebugView in Meta Events Manager
```

#### Resolution Steps

**If form is broken**:
```bash
# Check frontend logs
docker logs cepcomunicacion_web 2>&1 | grep -i error

# Verify API endpoint is responding
curl -X POST https://www.cepcomunicacion.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Restart frontend if needed
docker-compose restart web
```

**If webhook is down**:
```bash
# Verify webhook endpoint
curl -v https://www.cepcomunicacion.com/api/leads/webhook

# Check firewall rules
ufw status | grep 443

# Check Nginx configuration
docker-compose exec nginx nginx -t

# Enable fallback polling
# Set ENABLE_META_POLLING=true in .env
```

**If database issues**:
```bash
# Check if leads table is accessible
docker-compose exec postgres psql -U cepcomunicacion -c "SELECT count(*) FROM leads;"

# Check for table locks
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT * FROM pg_locks WHERE NOT granted;"
```

#### Prevention
- Implement form submission monitoring
- Set up synthetic tests for lead forms
- Enable webhook delivery monitoring
- Implement fallback polling mechanism
- Add form submission analytics

---

### LeadSubmissionErrors

**Alert**: Lead form submissions are failing

**Severity**: Critical

**Team**: Backend

#### Investigation Steps

1. **Check error rate**:
```bash
# Query Prometheus
rate(lead_submission_errors_total[5m])
```

2. **Check error logs**:
```bash
{service="backend"} |= "lead" |= "error" |= "submit"
```

3. **Test form submission**:
```bash
curl -X POST https://www.cepcomunicacion.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "phone": "+34600000000",
    "course_id": "1",
    "campus_id": "1",
    "gdpr_consent": true
  }'
```

#### Resolution Steps

**If validation errors**:
- Review validation rules
- Check required fields
- Verify GDPR consent checkbox is working

**If database errors**:
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready

# Check for table schema changes
docker-compose exec postgres psql -U cepcomunicacion -c "\d leads"

# Verify foreign key constraints
docker-compose exec postgres psql -U cepcomunicacion -c "
  SELECT conname, conrelid::regclass, confrelid::regclass
  FROM pg_constraint
  WHERE contype = 'f' AND conrelid = 'leads'::regclass;"
```

**If external API failures**:
```bash
# Check Meta Graph API
curl https://graph.facebook.com/v18.0/me?access_token=$FACEBOOK_ACCESS_TOKEN

# Check Mailchimp API
curl -u "anystring:$MAILCHIMP_API_KEY" \
  https://$MAILCHIMP_DC.api.mailchimp.com/3.0/ping

# Implement retry logic
# Queue failed submissions for later retry
```

#### Prevention
- Add comprehensive error handling
- Implement retry mechanism with exponential backoff
- Queue lead submissions to BullMQ
- Add validation tests
- Monitor external API status

---

## Escalation Procedures

### Level 1: On-Call Engineer

**Responsibilities**:
- Acknowledge alerts within SLA
- Follow runbook procedures
- Implement temporary fixes
- Document actions taken

**Escalate to Level 2 if**:
- Cannot resolve within 30 minutes (critical) or 2 hours (warning)
- Issue requires code changes
- Issue affects multiple services
- Data loss risk identified

### Level 2: Senior Engineer / Team Lead

**Responsibilities**:
- Review Level 1 actions
- Make architectural decisions
- Coordinate with other teams
- Approve emergency deployments

**Escalate to Level 3 if**:
- Issue affects business-critical functions
- Requires emergency infrastructure changes
- Potential security breach
- Regulatory compliance risk

### Level 3: CTO / Management

**Responsibilities**:
- Business impact assessment
- External communication
- Resource allocation
- Escalation to vendors/partners

### Contact Information

**Platform Team**:
- Email: platform@cepcomunicacion.com
- Slack: #platform-oncall
- Phone: +34 XXX XXX XXX

**Backend Team**:
- Email: backend@cepcomunicacion.com
- Slack: #backend-oncall
- Phone: +34 XXX XXX XXX

**Marketing Team**:
- Email: marketing@cepcomunicacion.com
- Slack: #marketing
- Phone: +34 XXX XXX XXX

**CTO**:
- Email: cto@cepcomunicacion.com
- Phone: +34 XXX XXX XXX (24/7)

---

## Post-Incident Review

After resolving any critical incident:

1. **Document timeline** - What happened, when, and who was involved
2. **Root cause analysis** - Why did it happen?
3. **Impact assessment** - What was affected?
4. **Actions taken** - What was done to resolve?
5. **Preventive measures** - How to prevent recurrence?
6. **Follow-up tasks** - Create tickets for permanent fixes

**Template**: `/docs/incident-report-template.md`

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
**Maintained by**: Platform Team - SOLARIA AGENCY
