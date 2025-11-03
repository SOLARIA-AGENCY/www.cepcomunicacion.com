# Monitoring Infrastructure - File Index

Complete index of all monitoring system files and their purposes.

## Quick Navigation

- **Getting Started**: [README.md](README.md)
- **Deployment**: [scripts/deploy.sh](scripts/deploy.sh)
- **Alert Response**: [ALERT_RUNBOOK.md](ALERT_RUNBOOK.md)
- **Testing**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## Directory Structure

```
infra/monitoring/
├── INDEX.md                                  ← You are here
├── README.md                                 ← Main documentation (1,118 lines)
├── ALERT_RUNBOOK.md                         ← Alert response procedures (907 lines)
├── IMPLEMENTATION_SUMMARY.md                ← Implementation details (893 lines)
├── TESTING_GUIDE.md                         ← Testing procedures (650 lines)
├── .env.example                             ← Environment configuration template
├── docker-compose.monitoring.yml            ← Main deployment configuration
│
├── prometheus/                              ← Prometheus metrics collection
│   ├── prometheus.yml                       ← Main configuration
│   ├── alerts/
│   │   ├── application.yml                  ← Application-level alerts (12 rules)
│   │   └── infrastructure.yml               ← Infrastructure alerts (15 rules)
│   └── rules/                               ← (Future: recording rules)
│
├── grafana/                                 ← Grafana visualization
│   ├── dashboards/
│   │   ├── dashboards.yml                   ← Dashboard provisioning
│   │   └── *.json                           ← (Future: 5 dashboard JSONs)
│   └── datasources/
│       └── datasources.yml                  ← Datasource configuration
│
├── loki/                                    ← Loki log aggregation
│   └── loki-config.yml                      ← Main configuration
│
├── promtail/                                ← Promtail log collection
│   └── promtail-config.yml                  ← Log scraping configuration
│
├── alertmanager/                            ← Alertmanager alert routing
│   ├── alertmanager.yml                     ← Routing and notification config
│   └── templates/                           ← (Future: custom templates)
│
├── blackbox-exporter/                       ← Blackbox uptime probes
│   └── blackbox.yml                         ← Probe configuration
│
├── postgres-exporter/                       ← PostgreSQL metrics
│   └── queries.yaml                         ← Custom database queries
│
├── nginx-exporter/                          ← Nginx metrics
│   └── (auto-configured)
│
└── scripts/                                 ← Deployment scripts
    ├── deploy.sh                            ← Main deployment script (executable)
    └── backup.sh                            ← (Future: automated backups)
```

---

## Core Configuration Files

### 1. docker-compose.monitoring.yml

**Purpose**: Main deployment configuration for all monitoring services

**Services**:
- Prometheus (metrics database)
- Grafana (visualization)
- Loki (log aggregation)
- Alertmanager (alert routing)
- Node Exporter (system metrics)
- PostgreSQL Exporter (database metrics)
- Redis Exporter (cache metrics)
- Nginx Exporter (web server metrics)
- cAdvisor (container metrics)
- Blackbox Exporter (uptime probes)
- Promtail (log collection)
- Uptime Kuma (uptime monitoring UI)

**Usage**:
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. prometheus/prometheus.yml

**Purpose**: Prometheus scrape configuration

**Configures**:
- Scrape intervals (15s default)
- Target endpoints (10+ services)
- Alert rules
- Alertmanager connection
- Retention policies (30 days)

**Key Sections**:
- `global`: Default settings
- `scrape_configs`: What to monitor
- `alerting`: Alertmanager integration
- `rule_files`: Alert and recording rules

### 3. prometheus/alerts/application.yml

**Purpose**: Application-level alert rules

**Alerts** (12 rules):
- ServiceDown
- HighHTTPErrorRate
- ElevatedClientErrorRate
- SlowAPIResponses
- VerySlowAPIResponses
- HighRequestRate
- DatabaseConnectionsHigh
- DatabaseConnectionsCritical
- SlowDatabaseQueries
- QueueSizeGrowing
- QueueBacklogCritical
- NoActiveWorkers
- LeadSubmissionErrors
- NoLeadsReceived

### 4. prometheus/alerts/infrastructure.yml

**Purpose**: Infrastructure-level alert rules

**Alerts** (15+ rules):
- CPU: HighCPUUsage, CriticalCPUUsage
- Memory: HighMemoryUsage, CriticalMemoryUsage
- Disk: DiskSpaceLow, DiskSpaceCritical, HighDiskIO
- Network: NetworkReceiveErrors, NetworkTransmitErrors
- System: HighSystemLoad
- Containers: ContainerDown, ContainerRestartingFrequently, ContainerHighCPU, ContainerHighMemory, ContainerOOMKilled
- Uptime: WebsiteDown, SlowResponseTime, DatabaseConnectionFailure, RedisConnectionFailure
- SSL: SSLCertificateExpiringSoon, SSLCertificateExpiringVerySoon

### 5. loki/loki-config.yml

**Purpose**: Loki log storage configuration

**Configures**:
- Storage backend (local filesystem)
- Retention (30 days)
- Compression (gzip)
- Query limits
- Ingestion rate limits

### 6. promtail/promtail-config.yml

**Purpose**: Log collection and forwarding

**Configures**:
- Docker container log scraping
- Nginx access/error logs
- PostgreSQL logs
- Application logs (Next.js, Payload, BullMQ)
- System logs (syslog)
- Log parsing pipelines (JSON, regex)
- Label extraction

### 7. alertmanager/alertmanager.yml

**Purpose**: Alert routing and notifications

**Configures**:
- Email notifications (SMTP)
- Slack webhooks (optional)
- PagerDuty integration (optional)
- Alert grouping and deduplication
- Routing by severity and team
- Inhibition rules (prevent spam)

**Receivers**:
- default (operations team)
- critical-alerts (email + Slack + PagerDuty)
- platform-team
- backend-team
- marketing-team
- database-team
- security-team

### 8. blackbox-exporter/blackbox.yml

**Purpose**: Uptime probe configuration

**Modules**:
- `http_2xx`: HTTP endpoint checks
- `https_2xx`: HTTPS with SSL validation
- `tcp_connect`: TCP port checks
- `icmp`: Ping checks
- `dns_mx`: DNS resolution
- `postgres_tcp`: PostgreSQL connection
- `redis_tcp`: Redis connection

### 9. postgres-exporter/queries.yaml

**Purpose**: Custom PostgreSQL metrics

**Queries**:
- `pg_stat_statements`: Query execution statistics
- `pg_table_size`: Table and index sizes
- `pg_index_usage`: Index usage statistics
- `pg_connection_pool`: Connection pool stats
- `pg_long_running_queries`: Slow queries
- `pg_cache_hit_ratio`: Buffer cache performance
- `pg_replication_lag`: Replication delay
- `pg_deadlocks`: Deadlock count
- `pg_business_leads_count`: Lead statistics
- `pg_business_courses_count`: Course statistics

### 10. grafana/datasources/datasources.yml

**Purpose**: Grafana datasource provisioning

**Datasources**:
- Prometheus (metrics, default)
- Loki (logs)
- PostgreSQL (direct queries, optional)

### 11. grafana/dashboards/dashboards.yml

**Purpose**: Dashboard auto-provisioning

**Configures**:
- Dashboard directory location
- Update interval
- Folder organization

### 12. .env.example

**Purpose**: Environment variable template

**Required Variables**:
- `GRAFANA_PASSWORD`: Admin password
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: Database credentials
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`: Email for alerts
- `SLACK_WEBHOOK_URL`: Slack integration (optional)
- `PAGERDUTY_SERVICE_KEY`: PagerDuty integration (optional)

---

## Application Integration Files

Located in `/apps/web-next/src/app/api/`:

### 1. metrics/route.ts

**Purpose**: Prometheus metrics endpoint for Next.js app

**Endpoint**: `GET /api/metrics`

**Exposes**:
- HTTP request counters (by method, status, route)
- Request duration histograms (p50, p95, p99)
- Page view counters
- API error counters
- Lead submission counters
- Cache hit/miss counters
- Node.js memory usage
- Application uptime

**Format**: Prometheus exposition format (text/plain)

### 2. health/route.ts

**Purpose**: Comprehensive health check endpoint

**Endpoint**: `GET /api/health`

**Checks**:
- Database connectivity (PostgreSQL)
- Redis connectivity
- Payload CMS API availability
- File system access
- Memory usage

**Responses**:
- `200 OK`: All systems healthy
- `503 Service Unavailable`: Critical system down

**Format**: JSON with detailed status per service

### 3. vitals/route.ts

**Purpose**: Core Web Vitals collection and reporting

**Endpoints**:
- `POST /api/vitals`: Submit Web Vitals metrics
- `GET /api/vitals?range=24h`: Retrieve aggregated stats

**Metrics**:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)
- INP (Interaction to Next Paint)

**Integrations**:
- Stores in database
- Forwards to Google Analytics 4 (optional)
- Forwards to Plausible (optional)

---

## Documentation Files

### 1. README.md (1,118 lines)

**Sections**:
1. Overview
2. Architecture
3. Components (detailed descriptions)
4. Installation (step-by-step)
5. Configuration (environment variables, scrape configs)
6. Dashboards (5 dashboards explained)
7. Alerts (40 rules documented)
8. Metrics Reference (PromQL examples)
9. Logs (LogQL examples)
10. Troubleshooting (common issues + solutions)
11. Performance Tuning
12. Security (authentication, network, secrets)
13. Backup and Recovery

**Audience**: DevOps engineers, platform team

### 2. ALERT_RUNBOOK.md (907 lines)

**Sections**:
1. General Response Procedure
2. Application Alerts (12 runbooks)
3. Database Alerts (8 runbooks)
4. Infrastructure Alerts (15 runbooks)
5. Business Alerts (5 runbooks)
6. Escalation Procedures
7. Post-Incident Review Template

**For Each Alert**:
- Symptoms
- Investigation steps
- Resolution steps
- Prevention measures

**Audience**: On-call engineers, incident responders

### 3. IMPLEMENTATION_SUMMARY.md (893 lines)

**Sections**:
1. Executive Summary
2. Architecture Overview
3. Components Deployed
4. Metrics Collected
5. Logs Collected
6. Alerts Configured
7. Grafana Dashboards
8. Files Created
9. Deployment Instructions
10. Integration Instructions
11. Testing Checklist
12. Maintenance Tasks
13. Resource Requirements
14. Success Metrics
15. Next Steps

**Audience**: Project managers, technical leads

### 4. TESTING_GUIDE.md (650 lines)

**Sections**:
1. Pre-Deployment Tests
2. Deployment Tests
3. Functional Tests
4. Alert Tests
5. Performance Tests
6. Integration Tests
7. Load Tests
8. Troubleshooting Test Failures

**Each Test Includes**:
- Objective
- Commands to run
- Expected results
- Pass/fail criteria

**Audience**: QA engineers, DevOps engineers

### 5. INDEX.md (This File)

**Purpose**: Navigation and file reference

**Audience**: Anyone exploring the monitoring system

---

## Deployment Scripts

### 1. scripts/deploy.sh

**Purpose**: Automated deployment and management

**Commands**:
```bash
./scripts/deploy.sh start       # Deploy stack
./scripts/deploy.sh stop        # Stop stack
./scripts/deploy.sh restart     # Restart stack
./scripts/deploy.sh status      # Show service status
./scripts/deploy.sh logs [svc]  # View logs
./scripts/deploy.sh backup      # Backup data
./scripts/deploy.sh validate    # Validate configs
./scripts/deploy.sh help        # Show usage
```

**Features**:
- Validates configurations before deployment
- Creates necessary directories
- Sets correct permissions
- Checks environment variables
- Displays access URLs after deployment

---

## Access Information

### Service URLs (Local)

| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana** | http://localhost:3003 | admin / (from .env) |
| **Prometheus** | http://localhost:9090 | None |
| **Alertmanager** | http://localhost:9093 | None |
| **Uptime Kuma** | http://localhost:3004 | None (first-time setup) |
| **Loki** | http://localhost:3100 | None (API only) |

### Application Endpoints

| Endpoint | URL | Purpose |
|----------|-----|---------|
| **Health Check** | http://localhost:3001/api/health | Service status |
| **Metrics** | http://localhost:3001/api/metrics | Prometheus metrics |
| **Web Vitals** | http://localhost:3001/api/vitals | Core Web Vitals |

---

## Quick Start Guide

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit configuration** (minimum required):
   ```bash
   nano .env
   # Set: GRAFANA_PASSWORD
   # Set: SMTP credentials (for alerts)
   ```

3. **Deploy**:
   ```bash
   ./scripts/deploy.sh start
   ```

4. **Verify**:
   - Open Grafana: http://localhost:3003
   - Login with credentials from .env
   - Check dashboards are visible
   - Verify all targets UP in Prometheus

5. **Test**:
   ```bash
   # Send test alert
   curl -X POST http://localhost:9093/api/v2/alerts \
     -H 'Content-Type: application/json' \
     -d '[{
       "labels": {"alertname": "TestAlert", "severity": "warning"},
       "annotations": {"summary": "Test alert"}
     }]'

   # Check health endpoint
   curl http://localhost:3001/api/health
   ```

---

## File Statistics

| Category | Files | Lines | Purpose |
|----------|-------|-------|---------|
| **Configuration** | 12 | ~2,725 | Infrastructure setup |
| **Application** | 3 | ~530 | Metrics/health endpoints |
| **Scripts** | 1 | ~280 | Deployment automation |
| **Documentation** | 5 | ~3,900 | User guides and runbooks |
| **Total** | **21** | **~7,435** | Complete monitoring system |

---

## Maintenance Schedule

### Daily
- [ ] Check Grafana dashboards for anomalies
- [ ] Review active alerts
- [ ] Verify all targets UP in Prometheus

### Weekly
- [ ] Review alert history and adjust thresholds
- [ ] Check disk usage trends
- [ ] Review slow query logs
- [ ] Update runbook based on incidents

### Monthly
- [ ] Review and optimize alert rules
- [ ] Analyze metric cardinality
- [ ] Clean up old dashboards
- [ ] Review resource usage trends
- [ ] Test backup/restore procedure

### Quarterly
- [ ] Update to latest stable versions
- [ ] Review and update documentation
- [ ] Conduct disaster recovery drill
- [ ] Review and optimize retention policies

---

## Support Resources

### Documentation
- This index file
- [Main README](README.md)
- [Alert Runbook](ALERT_RUNBOOK.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

### External Resources
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

### Contact
- **Platform Team**: platform@cepcomunicacion.com
- **Emergency**: +34 XXX XXX XXX (24/7)
- **Slack**: #platform-monitoring

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-31 | Initial implementation - complete monitoring stack |

---

**Last Updated**: 2025-10-31
**Maintained by**: Platform Team - SOLARIA AGENCY
**Status**: ✅ Production Ready
