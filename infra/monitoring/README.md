# Monitoring Infrastructure for CEPComunicacion v2

Complete production-grade monitoring, observability, and alerting system for the CEPComunicacion educational platform.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [Installation](#installation)
- [Configuration](#configuration)
- [Dashboards](#dashboards)
- [Alerts](#alerts)
- [Metrics Reference](#metrics-reference)
- [Logs](#logs)
- [Troubleshooting](#troubleshooting)
- [Performance Tuning](#performance-tuning)
- [Security](#security)
- [Backup and Recovery](#backup-and-recovery)

## Overview

This monitoring stack provides comprehensive observability across the entire CEPComunicacion platform:

- **Metrics Collection**: Prometheus scrapes metrics from 10+ sources every 15 seconds
- **Visualization**: Grafana dashboards for real-time insights
- **Log Aggregation**: Loki collects and indexes logs from all services
- **Alerting**: Alertmanager routes alerts to appropriate teams via email, Slack, PagerDuty
- **Uptime Monitoring**: Blackbox Exporter and Uptime Kuma for external monitoring
- **Performance Tracking**: Core Web Vitals and application performance metrics

### Key Features

✅ **Complete observability** - metrics, logs, traces, and uptime in one place
✅ **Production-ready** - battle-tested components with 30-day retention
✅ **Business metrics** - track leads, conversions, campaigns directly
✅ **Multi-channel alerting** - email, Slack, PagerDuty integration
✅ **GDPR compliant** - no external data sharing, self-hosted
✅ **Low resource usage** - optimized for 4GB VPS
✅ **Easy deployment** - one-command Docker Compose setup

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Monitoring Stack                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Grafana  │  │Prometheus│  │   Loki   │  │Alertmgr  │        │
│  │  :3003   │  │  :9090   │  │  :3100   │  │  :9093   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │             │              │             │               │
│       └─────────────┴──────────────┴─────────────┘               │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────────┐        │
│  │                  Data Sources                        │        │
│  ├──────────────────────────────────────────────────────┤        │
│  │ Node Exporter    │ PostgreSQL Exporter │ Redis Exp  │        │
│  │ cAdvisor         │ Nginx Exporter      │ Promtail   │        │
│  │ Blackbox Exp     │ Next.js /api/metrics│ Uptime Kuma│        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Application Stack                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Web App  │  Payload CMS  │  PostgreSQL  │  Redis       │
│  BullMQ Workers   │  Nginx Proxy  │  Docker      │              │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### Core Services

#### 1. Prometheus (v2.48.0)

**Purpose**: Time-series database for metrics collection and storage

**Metrics Collected**:
- System metrics (CPU, memory, disk, network)
- Application metrics (requests, errors, latency)
- Database metrics (connections, queries, cache)
- Business metrics (leads, conversions, campaigns)

**Configuration**: `/infra/monitoring/prometheus/prometheus.yml`

**Retention**: 30 days

**Port**: 9090

**Resource Usage**: ~500MB RAM, 2GB disk

#### 2. Grafana (v10.2.2)

**Purpose**: Visualization and dashboards

**Features**:
- 5 pre-configured dashboards
- Custom alerting rules
- Role-based access control
- Email notifications
- Plugin support (clock, piechart)

**Configuration**: `/infra/monitoring/grafana/`

**Port**: 3003

**Credentials**:
- Username: `admin`
- Password: Set in `.env` (default: `ChangeMe123!`)

**Resource Usage**: ~300MB RAM

#### 3. Loki (v2.9.3)

**Purpose**: Log aggregation and querying

**Features**:
- Multi-tenant log storage
- Label-based indexing
- LogQL query language
- 30-day retention
- Compression enabled

**Configuration**: `/infra/monitoring/loki/loki-config.yml`

**Port**: 3100

**Resource Usage**: ~200MB RAM, 5GB disk

#### 4. Alertmanager (v0.26.0)

**Purpose**: Alert routing, grouping, and notification

**Features**:
- Alert deduplication
- Silencing and inhibition rules
- Multi-channel notifications (email, Slack, PagerDuty)
- Grouping by severity and team
- Alert history

**Configuration**: `/infra/monitoring/alertmanager/alertmanager.yml`

**Port**: 9093

**Resource Usage**: ~100MB RAM

### Exporters

#### Node Exporter (v1.7.0)

**Metrics**: CPU, memory, disk, network, filesystem

**Port**: 9100

#### PostgreSQL Exporter (v0.15.0)

**Metrics**:
- Connection pool usage
- Query performance
- Cache hit ratio
- Table and index sizes
- Replication lag
- Business metrics (leads count, courses count)

**Custom Queries**: `/infra/monitoring/postgres-exporter/queries.yaml`

**Port**: 9187

#### Redis Exporter (v1.55.0)

**Metrics**:
- Memory usage
- Cache hit/miss ratio
- Connected clients
- Evicted keys
- BullMQ queue stats

**Port**: 9121

#### Nginx Exporter (v1.0.0)

**Metrics**:
- Active connections
- Request rate
- Response codes
- Upstream latency

**Port**: 9113

#### cAdvisor (v0.47.2)

**Metrics**:
- Container CPU/memory usage
- Network I/O per container
- Filesystem usage
- Restart counts

**Port**: 8080

#### Blackbox Exporter (v0.24.0)

**Probes**:
- HTTP/HTTPS endpoint availability
- SSL certificate expiry
- TCP port checks
- ICMP ping
- DNS resolution

**Port**: 9115

### Log Collection

#### Promtail (v2.9.3)

**Logs Collected**:
- Docker container logs (all CEPComunicacion services)
- Nginx access and error logs
- PostgreSQL logs
- System logs (syslog)
- Application logs (Next.js, Payload, BullMQ)

**Pipeline**:
1. Scrape logs from files and Docker
2. Parse using regex or JSON
3. Extract labels (service, level, component)
4. Forward to Loki

### Uptime Monitoring

#### Uptime Kuma (v1.23.11)

**Purpose**: User-friendly uptime monitoring dashboard

**Monitors**:
- Website homepage (every 1 minute)
- API health endpoint (every 1 minute)
- Admin panel (every 5 minutes)
- Database connectivity (every 1 minute)

**Port**: 3004

**Features**:
- Status pages
- Multiple notification channels
- Incident timeline
- Response time charts

## Installation

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space
- Root or sudo access

### Quick Start

```bash
# 1. Navigate to monitoring directory
cd /path/to/cepcomunicacion/infra/monitoring

# 2. Copy environment template
cp .env.example .env

# 3. Edit environment variables
nano .env

# 4. Deploy the stack
./scripts/deploy.sh start
```

### Manual Deployment

```bash
# Create data directories
mkdir -p /var/lib/cepcomunicacion/monitoring/{prometheus,grafana,loki,uptime-kuma,alertmanager}

# Set permissions
chown -R 472:472 /var/lib/cepcomunicacion/monitoring/grafana

# Validate configuration
docker run --rm -v ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:v2.48.0 promtool check config /etc/prometheus/prometheus.yml

# Start services
docker-compose -f docker-compose.monitoring.yml up -d

# Check status
docker-compose -f docker-compose.monitoring.yml ps

# View logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

## Configuration

### Environment Variables

Required variables in `/infra/monitoring/.env`:

```bash
# Grafana
GRAFANA_PASSWORD=YourSecurePassword123!

# PostgreSQL (must match main application)
POSTGRES_USER=cepcomunicacion
POSTGRES_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI=
POSTGRES_DB=cepcomunicacion

# SMTP (for email alerts)
SMTP_HOST=smtp.gmail.com:587
SMTP_USER=alerts@cepcomunicacion.com
SMTP_PASSWORD=your-smtp-app-password
SMTP_FROM=alerts@cepcomunicacion.com

# Optional: Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Optional: PagerDuty
PAGERDUTY_SERVICE_KEY=your-pagerduty-key

# Optional: Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret
```

### Prometheus Configuration

**Scrape Interval**: 15 seconds (adjustable in `prometheus.yml`)

**Retention**: 30 days (adjustable with `--storage.tsdb.retention.time=30d`)

**Storage Limit**: 10GB (adjustable with `--storage.tsdb.retention.size=10GB`)

**Add New Scrape Target**:

```yaml
# prometheus/prometheus.yml
scrape_configs:
  - job_name: 'my-new-service'
    static_configs:
      - targets: ['my-service:9090']
        labels:
          service: 'my-service'
          component: 'backend'
```

### Alert Rules

Alert rules are defined in `/infra/monitoring/prometheus/alerts/`:

- `application.yml` - Application-level alerts (errors, latency, availability)
- `infrastructure.yml` - Infrastructure alerts (CPU, memory, disk, containers)

**Add New Alert**:

```yaml
# prometheus/alerts/custom.yml
groups:
  - name: custom_alerts
    interval: 30s
    rules:
      - alert: MyCustomAlert
        expr: my_metric > 100
        for: 5m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "My custom alert fired"
          description: "Metric value is {{ $value }}"
          runbook: "https://docs.cepcomunicacion.com/runbooks/my-alert"
```

Then reload Prometheus:

```bash
docker-compose -f docker-compose.monitoring.yml exec prometheus \
  kill -HUP 1
```

### Alertmanager Routing

Alerts are routed based on labels:

| Label | Receiver | Notification |
|-------|----------|--------------|
| `severity: critical` | critical-alerts | Email + Slack + PagerDuty |
| `team: platform` | platform-team | Email |
| `team: backend` | backend-team | Email |
| `team: marketing` | marketing-team | Email |
| `category: database` | database-team | Email |
| `category: security` | security-team | Email (urgent) |

**Add New Receiver**:

```yaml
# alertmanager/alertmanager.yml
receivers:
  - name: 'my-team'
    email_configs:
      - to: 'myteam@cepcomunicacion.com'
        headers:
          Subject: '[CEP] {{ .GroupLabels.alertname }}'
```

## Dashboards

### Pre-configured Dashboards

#### 1. System Overview

**Metrics**:
- CPU usage (current, average, max)
- Memory usage (RAM, swap)
- Disk usage and I/O
- Network traffic (in/out)
- System load (1m, 5m, 15m)

**Alerts**:
- High CPU usage (>80%)
- High memory usage (>80%)
- Disk space low (<20%)

**Use Cases**:
- Capacity planning
- Performance troubleshooting
- Resource optimization

#### 2. Application Performance

**Metrics**:
- Request rate (per minute)
- Error rate (4xx, 5xx)
- Request duration (p50, p95, p99)
- Active connections
- Cache hit ratio

**Alerts**:
- High error rate (>5%)
- Slow responses (p95 >2s)
- Service down

**Use Cases**:
- SLA monitoring
- Performance optimization
- Incident response

#### 3. Database Performance

**Metrics**:
- Connection pool usage
- Query duration (slow queries)
- Cache hit ratio
- Table sizes
- Index usage
- Replication lag

**Alerts**:
- Connection pool exhausted (>90%)
- Slow queries detected
- Low cache hit ratio (<50%)

**Use Cases**:
- Query optimization
- Index tuning
- Capacity planning

#### 4. User Experience (Core Web Vitals)

**Metrics**:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)
- INP (Interaction to Next Paint)

**Thresholds**:
- Good: Green
- Needs Improvement: Yellow
- Poor: Red

**Use Cases**:
- SEO optimization
- User experience improvements
- Performance budgeting

#### 5. Business Metrics

**Metrics**:
- Total leads
- Leads per hour/day
- Lead conversion rate
- Active campaigns
- Campaign spending
- Top-performing courses

**Alerts**:
- No leads in last hour
- Lead submission errors
- Campaign spending anomaly

**Use Cases**:
- Business intelligence
- Marketing ROI
- Conversion optimization

### Creating Custom Dashboards

1. **Access Grafana**: http://localhost:3003
2. **Login**: admin / (your password)
3. **Create Dashboard**: Click "+" → "Dashboard"
4. **Add Panel**: Click "Add visualization"
5. **Select Data Source**: Prometheus or Loki
6. **Write Query**: Use PromQL or LogQL
7. **Configure Visualization**: Choose chart type, colors, thresholds
8. **Save Dashboard**: Click "Save" icon

**Example PromQL Queries**:

```promql
# Request rate by endpoint
rate(http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate percentage
(rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])) * 100

# Memory usage percentage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# Database connections
pg_stat_database_numbackends{datname="cepcomunicacion"}

# Leads in last 24 hours
increase(leads_total[24h])
```

## Alerts

### Alert Severity Levels

| Level | Color | Response Time | Notification |
|-------|-------|---------------|--------------|
| **Critical** | Red | Immediate (< 5 min) | Email + Slack + PagerDuty |
| **Warning** | Yellow | 30 minutes | Email |
| **Info** | Blue | Best effort | Email (daily digest) |

### Common Alerts

#### HighHTTPErrorRate

**Trigger**: 5xx error rate > 5% for 5 minutes

**Severity**: Critical

**Team**: Backend

**Runbook**: Check application logs, database connectivity, and recent deployments

**Resolution Steps**:
1. Check `/api/health` endpoint
2. Review Grafana Application Performance dashboard
3. Query Loki for error logs: `{service="backend"} |= "error"`
4. Check database connection pool
5. Restart affected service if necessary

#### DatabaseConnectionsHigh

**Trigger**: Active connections > 80 for 5 minutes

**Severity**: Warning

**Team**: Backend

**Runbook**: Investigate connection leaks or increase pool size

**Resolution Steps**:
1. Query active connections: `SELECT * FROM pg_stat_activity`
2. Identify long-running queries
3. Check for connection leaks in application code
4. Terminate idle connections if needed
5. Consider increasing `max_connections`

#### DiskSpaceLow

**Trigger**: Available disk space < 20%

**Severity**: Warning

**Team**: Platform

**Runbook**: Clean up old logs, optimize database, add storage

**Resolution Steps**:
1. Check disk usage: `df -h`
2. Find largest directories: `du -h --max-depth=1 /`
3. Clean up Docker: `docker system prune -af`
4. Rotate old logs
5. Vacuum PostgreSQL database
6. Resize volume if needed

#### NoLeadsReceived

**Trigger**: Zero leads in last hour

**Severity**: Warning

**Team**: Marketing

**Runbook**: Check forms, integrations, and tracking

**Resolution Steps**:
1. Test lead form submission manually
2. Check Meta Pixel integration
3. Verify webhook endpoints
4. Review firewall/rate limiting rules
5. Check for JavaScript errors in browser console

### Silencing Alerts

**Via Alertmanager UI**:
1. Navigate to http://localhost:9093
2. Click "Silences" → "New Silence"
3. Set matchers (e.g., `alertname=HighCPUUsage`)
4. Set duration (e.g., 2 hours)
5. Add comment explaining why
6. Click "Create"

**Via API**:

```bash
curl -X POST http://localhost:9093/api/v2/silences \
  -H 'Content-Type: application/json' \
  -d '{
    "matchers": [
      {
        "name": "alertname",
        "value": "HighCPUUsage",
        "isRegex": false
      }
    ],
    "startsAt": "2025-10-31T10:00:00Z",
    "endsAt": "2025-10-31T12:00:00Z",
    "createdBy": "admin",
    "comment": "Scheduled maintenance"
  }'
```

## Metrics Reference

### HTTP Metrics

```
http_requests_total{method="GET",status="200",route="/api/courses"}
http_request_duration_seconds{method="POST",route="/api/leads"}
```

### System Metrics

```
node_cpu_seconds_total{mode="idle"}
node_memory_MemAvailable_bytes
node_filesystem_avail_bytes{mountpoint="/"}
```

### Database Metrics

```
pg_stat_database_numbackends{datname="cepcomunicacion"}
pg_stat_database_blks_hit
pg_stat_database_blks_read
```

### Business Metrics

```
leads_total
leads_last_hour
leads_last_24h
courses_published
campaign_spend_euros
```

### Custom Application Metrics

To add custom metrics to your Next.js app:

```typescript
// Import tracking functions
import { trackCounter, trackHistogram } from '@/app/api/metrics/route';

// Increment counter
trackCounter('custom_event_total', { event: 'button_click', page: 'homepage' });

// Record histogram value
trackHistogram('custom_duration_seconds', durationInSeconds, { operation: 'pdf_generation' });
```

## Logs

### Accessing Logs

**Via Grafana Explore**:
1. Navigate to http://localhost:3003
2. Click "Explore" (compass icon)
3. Select "Loki" data source
4. Use LogQL queries

**Example LogQL Queries**:

```logql
# All logs from Next.js app
{service="frontend"}

# Error logs from any service
{} |= "error" |= "level=error"

# Logs from specific container
{container="cepcomunicacion_cms"}

# Logs with specific status code
{service="backend"} | json | status="500"

# Logs matching regex
{service="database"} |~ "connection.*failed"

# Count of error logs per minute
sum(rate({} |= "error"[1m])) by (service)
```

### Log Levels

Standard log levels across all services:

- `TRACE` - Very detailed debugging
- `DEBUG` - Debugging information
- `INFO` - General information
- `WARN` - Warning messages
- `ERROR` - Error messages
- `FATAL` - Critical errors causing shutdown

### Log Retention

- **Default**: 30 days
- **Storage**: 5GB allocated
- **Compression**: Enabled (gzip)
- **Cleanup**: Automatic based on retention period

### Exporting Logs

**Export last hour of logs**:

```bash
docker-compose -f docker-compose.monitoring.yml exec loki \
  logcli query '{service="backend"}' --since=1h > backend-logs.txt
```

**Export specific time range**:

```bash
logcli query '{service="backend"}' \
  --from="2025-10-31T10:00:00Z" \
  --to="2025-10-31T11:00:00Z" \
  --limit=5000 > logs.txt
```

## Troubleshooting

### Prometheus Not Scraping Targets

**Symptom**: Targets show as "DOWN" in Prometheus UI

**Diagnosis**:
1. Check target endpoint: `curl http://target:port/metrics`
2. Verify network connectivity between Prometheus and target
3. Check firewall rules
4. Verify target is running: `docker ps`

**Resolution**:
```bash
# Test connectivity
docker exec cepcomunicacion_prometheus curl http://node-exporter:9100/metrics

# Check Prometheus logs
docker-compose -f docker-compose.monitoring.yml logs prometheus

# Reload Prometheus configuration
docker-compose -f docker-compose.monitoring.yml exec prometheus \
  kill -HUP 1
```

### Grafana Can't Connect to Prometheus

**Symptom**: Dashboards show "No data" or datasource errors

**Diagnosis**:
1. Check datasource configuration in Grafana
2. Verify Prometheus is running
3. Check network connectivity

**Resolution**:
```bash
# Check Prometheus URL from Grafana container
docker exec cepcomunicacion_grafana curl http://prometheus:9090/api/v1/status/config

# Verify datasource configuration
# Navigate to Grafana → Configuration → Data Sources → Prometheus
# Click "Test" button

# Restart Grafana
docker-compose -f docker-compose.monitoring.yml restart grafana
```

### High Memory Usage

**Symptom**: Monitoring stack consuming excessive RAM

**Diagnosis**:
```bash
# Check memory usage per container
docker stats --no-stream

# Check Prometheus memory
docker exec cepcomunicacion_prometheus \
  curl http://localhost:9090/api/v1/status/runtimeinfo
```

**Resolution**:
1. Reduce Prometheus retention: `--storage.tsdb.retention.time=15d`
2. Decrease scrape frequency: `scrape_interval: 30s`
3. Limit Loki log ingestion rate
4. Enable compression in Loki
5. Add memory limits in docker-compose.yml:

```yaml
services:
  prometheus:
    mem_limit: 1g
    mem_reservation: 512m
```

### Alerts Not Being Sent

**Symptom**: Alerts firing but no notifications received

**Diagnosis**:
1. Check Alertmanager UI: http://localhost:9093
2. Verify alert is visible in "Alerts" tab
3. Check for silences
4. Review Alertmanager logs

**Resolution**:
```bash
# Check Alertmanager logs
docker-compose -f docker-compose.monitoring.yml logs alertmanager

# Test email configuration
docker exec cepcomunicacion_alertmanager \
  amtool config routes test --config.file=/etc/alertmanager/alertmanager.yml

# Check SMTP credentials in .env
cat /infra/monitoring/.env | grep SMTP

# Test email manually
docker exec cepcomunicacion_alertmanager \
  amtool alert add test_alert alertname=TestAlert
```

## Performance Tuning

### Optimizing Prometheus

**Reduce cardinality**:
- Limit number of unique label combinations
- Use relabeling to drop unnecessary labels
- Avoid high-cardinality labels (e.g., request IDs)

**Example relabeling**:

```yaml
metric_relabel_configs:
  - source_labels: [__name__]
    regex: 'unnecessary_metric_.*'
    action: drop
```

**Tune retention**:

```yaml
command:
  - '--storage.tsdb.retention.time=15d'
  - '--storage.tsdb.retention.size=5GB'
```

**Optimize queries**:
- Use recording rules for frequently queried metrics
- Add `/prometheus/rules/recording.yml`:

```yaml
groups:
  - name: recording_rules
    interval: 15s
    rules:
      - record: job:http_request_rate:5m
        expr: rate(http_requests_total[5m])

      - record: job:http_error_rate:5m
        expr: rate(http_requests_total{status=~"5.."}[5m])
```

### Optimizing Loki

**Reduce log volume**:
- Filter out verbose debug logs in production
- Use log sampling for high-volume services
- Implement log level filtering in Promtail

**Example Promtail filtering**:

```yaml
pipeline_stages:
  - match:
      selector: '{service="frontend"}'
      stages:
        - drop:
            expression: 'level=debug'
```

**Configure compression**:

```yaml
# loki-config.yml
chunk_encoding: snappy
```

## Security

### Authentication

**Grafana**:
- Change default admin password immediately
- Enable HTTPS (use reverse proxy with SSL)
- Configure OAuth/LDAP for SSO
- Implement role-based access control

**Prometheus/Alertmanager**:
- Use reverse proxy with HTTP Basic Auth
- Restrict access to internal network only
- Enable HTTPS

**Example Nginx reverse proxy**:

```nginx
server {
    listen 443 ssl;
    server_name monitor.cepcomunicacion.com;

    ssl_certificate /etc/letsencrypt/live/monitor.cepcomunicacion.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monitor.cepcomunicacion.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Basic auth
        auth_basic "Monitoring Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

### Network Security

**Firewall rules**:

```bash
# Allow only specific IPs to access monitoring
ufw allow from 10.0.0.0/8 to any port 3003 comment "Grafana internal"
ufw allow from 10.0.0.0/8 to any port 9090 comment "Prometheus internal"

# Block external access
ufw deny 3003
ufw deny 9090
ufw deny 9093
ufw deny 3100
```

**Docker network isolation**:

All monitoring services are on isolated `monitoring` network. Only expose necessary ports.

### Secrets Management

**Do NOT commit**:
- `.env` file
- Grafana admin password
- SMTP credentials
- API keys

**Use environment variables**:

```bash
# Set via environment
export GRAFANA_PASSWORD=$(openssl rand -base64 32)
export SMTP_PASSWORD=$(cat /run/secrets/smtp_password)
```

## Backup and Recovery

### Backup Strategy

**What to backup**:
1. Prometheus data (metrics)
2. Grafana dashboards and datasources
3. Alertmanager configuration and silences
4. Loki logs (optional)

**Automated backup script**:

```bash
#!/bin/bash
# /infra/monitoring/scripts/backup.sh

BACKUP_DIR="/var/backups/cepcomunicacion/monitoring"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup Prometheus data
docker run --rm \
  -v cepcomunicacion_prometheus_data:/prometheus \
  -v "$BACKUP_DIR:/backup" \
  alpine \
  tar czf "/backup/prometheus_${TIMESTAMP}.tar.gz" /prometheus

# Backup Grafana data
docker run --rm \
  -v cepcomunicacion_grafana_data:/grafana \
  -v "$BACKUP_DIR:/backup" \
  alpine \
  tar czf "/backup/grafana_${TIMESTAMP}.tar.gz" /grafana

# Retention: keep last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
```

**Schedule backups**:

```bash
# Add to crontab
crontab -e

# Backup daily at 2 AM
0 2 * * * /infra/monitoring/scripts/backup.sh
```

### Restore from Backup

```bash
# Stop monitoring stack
docker-compose -f docker-compose.monitoring.yml down

# Restore Prometheus data
docker run --rm \
  -v cepcomunicacion_prometheus_data:/prometheus \
  -v /var/backups/cepcomunicacion/monitoring:/backup \
  alpine \
  sh -c "rm -rf /prometheus/* && tar xzf /backup/prometheus_20251031_020000.tar.gz -C /"

# Restore Grafana data
docker run --rm \
  -v cepcomunicacion_grafana_data:/grafana \
  -v /var/backups/cepcomunicacion/monitoring:/backup \
  alpine \
  sh -c "rm -rf /grafana/* && tar xzf /backup/grafana_20251031_020000.tar.gz -C /"

# Restart stack
docker-compose -f docker-compose.monitoring.yml up -d
```

---

## Additional Resources

- **Prometheus Documentation**: https://prometheus.io/docs/
- **Grafana Documentation**: https://grafana.com/docs/
- **Loki Documentation**: https://grafana.com/docs/loki/
- **PromQL Guide**: https://prometheus.io/docs/prometheus/latest/querying/basics/
- **LogQL Guide**: https://grafana.com/docs/loki/latest/logql/

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review logs: `docker-compose logs [service]`
3. Contact platform team: platform@cepcomunicacion.com
4. Create issue in repository

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
**Maintained by**: Platform Team - SOLARIA AGENCY
