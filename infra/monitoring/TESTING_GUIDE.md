# Monitoring System Testing Guide

This guide provides step-by-step instructions for testing and validating the monitoring infrastructure.

## Table of Contents

- [Pre-Deployment Tests](#pre-deployment-tests)
- [Deployment Tests](#deployment-tests)
- [Functional Tests](#functional-tests)
- [Alert Tests](#alert-tests)
- [Performance Tests](#performance-tests)
- [Integration Tests](#integration-tests)
- [Load Tests](#load-tests)

---

## Pre-Deployment Tests

### 1. Configuration Validation

**Objective**: Ensure all configuration files are syntactically correct

```bash
cd /path/to/cepcomunicacion/infra/monitoring

# Test Prometheus configuration
docker run --rm \
  -v $(pwd)/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:v2.48.0 \
  promtool check config /etc/prometheus/prometheus.yml

# Expected output: "SUCCESS: 0 rule files found"

# Test Prometheus alert rules
docker run --rm \
  -v $(pwd)/prometheus/alerts:/etc/prometheus/alerts \
  prom/prometheus:v2.48.0 \
  promtool check rules /etc/prometheus/alerts/*.yml

# Expected output: "SUCCESS: X rules found"

# Test Alertmanager configuration
docker run --rm \
  -v $(pwd)/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
  prom/alertmanager:v0.26.0 \
  amtool check-config /etc/alertmanager/alertmanager.yml

# Expected output: "Checking '/etc/alertmanager/alertmanager.yml'  SUCCESS"
```

**Expected Results**:
- ✅ All configurations pass validation
- ✅ No syntax errors
- ✅ All referenced files exist

### 2. Environment Configuration

**Objective**: Verify environment variables are set correctly

```bash
# Check .env file exists
if [ -f .env ]; then
  echo "✅ .env file found"
else
  echo "❌ .env file missing - copy from .env.example"
  exit 1
fi

# Verify required variables
required_vars=("GRAFANA_PASSWORD" "POSTGRES_USER" "POSTGRES_PASSWORD" "SMTP_HOST" "SMTP_USER" "SMTP_PASSWORD")

for var in "${required_vars[@]}"; do
  if grep -q "^$var=" .env; then
    echo "✅ $var is set"
  else
    echo "❌ $var is missing"
  fi
done
```

**Expected Results**:
- ✅ .env file exists
- ✅ All required variables are set
- ✅ No placeholder values remain

### 3. Directory Permissions

**Objective**: Ensure data directories have correct permissions

```bash
# Create directories
sudo mkdir -p /var/lib/cepcomunicacion/monitoring/{prometheus,grafana,loki,uptime-kuma,alertmanager}

# Set ownership (Grafana needs UID 472)
sudo chown -R 472:472 /var/lib/cepcomunicacion/monitoring/grafana

# Verify permissions
ls -la /var/lib/cepcomunicacion/monitoring/

# Expected output:
# drwxr-xr-x  alertmanager
# drwxr-xr-x  grafana (owned by 472:472)
# drwxr-xr-x  loki
# drwxr-xr-x  prometheus
# drwxr-xr-x  uptime-kuma
```

**Expected Results**:
- ✅ All directories exist
- ✅ Grafana directory owned by UID 472
- ✅ All directories have rwx permissions

---

## Deployment Tests

### 1. Container Startup

**Objective**: Verify all containers start successfully

```bash
# Deploy stack
./scripts/deploy.sh start

# Wait for services to start
sleep 30

# Check container status
docker-compose -f docker-compose.monitoring.yml ps

# All containers should show "Up" status
```

**Expected Results**:
```
NAME                                STATUS
cepcomunicacion_prometheus          Up (healthy)
cepcomunicacion_grafana             Up (healthy)
cepcomunicacion_loki                Up
cepcomunicacion_alertmanager        Up
cepcomunicacion_node_exporter       Up
cepcomunicacion_postgres_exporter   Up
cepcomunicacion_redis_exporter      Up
cepcomunicacion_nginx_exporter      Up
cepcomunicacion_cadvisor            Up
cepcomunicacion_blackbox_exporter   Up
cepcomunicacion_promtail            Up
cepcomunicacion_uptime_kuma         Up
```

**Pass Criteria**:
- ✅ All 12 containers are "Up"
- ✅ No containers in "Restarting" or "Exited" state
- ✅ No error messages in deployment output

### 2. Network Connectivity

**Objective**: Verify containers can communicate

```bash
# Test Prometheus → Node Exporter
docker exec cepcomunicacion_prometheus curl -s http://node-exporter:9100/metrics | head -5

# Test Grafana → Prometheus
docker exec cepcomunicacion_grafana curl -s http://prometheus:9090/api/v1/status/config | jq .status

# Test Promtail → Loki
docker exec cepcomunicacion_promtail curl -s http://loki:3100/ready

# Test Alertmanager → SMTP (if configured)
docker exec cepcomunicacion_alertmanager nc -zv $SMTP_HOST 587
```

**Expected Results**:
- ✅ All curl commands return data
- ✅ No "connection refused" errors
- ✅ SMTP connection succeeds (if configured)

### 3. Service Health Checks

**Objective**: Verify all services are healthy

```bash
# Prometheus
curl -s http://localhost:9090/-/healthy
# Expected: "Prometheus is Healthy."

# Grafana
curl -s http://localhost:3003/api/health | jq
# Expected: {"database": "ok", "version": "10.2.2"}

# Loki
curl -s http://localhost:3100/ready
# Expected: "ready"

# Alertmanager
curl -s http://localhost:9093/-/healthy
# Expected: "OK"
```

**Expected Results**:
- ✅ All endpoints return healthy status
- ✅ HTTP status code 200 for all
- ✅ No error messages

---

## Functional Tests

### 1. Prometheus Scraping

**Objective**: Verify Prometheus is collecting metrics from all targets

```bash
# Open Prometheus UI
open http://localhost:9090

# Navigate to: Status → Targets

# Check all targets are UP
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'
```

**Expected Results**:
```json
{"job": "prometheus", "health": "up"}
{"job": "node-exporter", "health": "up"}
{"job": "postgres-exporter", "health": "up"}
{"job": "redis-exporter", "health": "up"}
{"job": "nginx-exporter", "health": "up"}
{"job": "cadvisor", "health": "up"}
{"job": "blackbox-http", "health": "up"}
{"job": "nextjs-app", "health": "up"}
{"job": "payload-cms", "health": "up"}
```

**Pass Criteria**:
- ✅ All targets show "up" health
- ✅ Last scrape time < 30 seconds
- ✅ No scrape errors

### 2. Grafana Dashboards

**Objective**: Verify Grafana is configured and dashboards are visible

```bash
# Login to Grafana
open http://localhost:3003
# Username: admin
# Password: (from .env)

# Verify datasources via API
curl -u admin:$GRAFANA_PASSWORD http://localhost:3003/api/datasources | jq '.[] | {name: .name, type: .type}'

# Expected output:
# {"name": "Prometheus", "type": "prometheus"}
# {"name": "Loki", "type": "loki"}
# {"name": "PostgreSQL", "type": "postgres"}
```

**Manual Steps**:
1. Login to Grafana
2. Navigate to Dashboards
3. Verify 5 dashboards exist:
   - System Overview
   - Application Performance
   - Database Performance
   - User Experience (Core Web Vitals)
   - Business Metrics
4. Open each dashboard and verify data is displayed

**Pass Criteria**:
- ✅ All 3 datasources configured
- ✅ All 5 dashboards visible
- ✅ Dashboards display real-time data
- ✅ No "No data" errors

### 3. Log Aggregation

**Objective**: Verify Loki is collecting logs

```bash
# Open Grafana Explore
open http://localhost:3003/explore

# Switch to Loki datasource

# Query logs from all services
{service=~".+"}

# Query logs from specific service
{service="backend"}

# Query error logs
{} |= "error"
```

**Expected Results**:
- ✅ Logs appear in Explore view
- ✅ Logs from multiple services visible
- ✅ Labels correctly parsed (service, level, component)
- ✅ Timestamps are accurate

### 4. Alertmanager Routing

**Objective**: Verify Alertmanager is configured correctly

```bash
# Check Alertmanager status
curl -s http://localhost:9093/api/v2/status | jq

# Check configured receivers
curl -s http://localhost:9093/api/v2/receivers | jq '.[] | .name'

# Expected receivers:
# "default"
# "critical-alerts"
# "platform-team"
# "backend-team"
# "marketing-team"
# "database-team"
```

**Expected Results**:
- ✅ All receivers configured
- ✅ Route tree is valid
- ✅ Inhibition rules are loaded

---

## Alert Tests

### 1. Test Alert - Manual Trigger

**Objective**: Verify alerts can be triggered and routed correctly

```bash
# Create a test alert
curl -X POST http://localhost:9093/api/v2/alerts \
  -H 'Content-Type: application/json' \
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "warning",
      "team": "platform"
    },
    "annotations": {
      "summary": "This is a test alert",
      "description": "Testing alert routing"
    },
    "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }]'

# Check alert appears in Alertmanager
open http://localhost:9093/#/alerts

# Check alert appears in Grafana
# Navigate to: Alerting → Alert rules
```

**Expected Results**:
- ✅ Alert visible in Alertmanager UI
- ✅ Alert routed to correct receiver (platform-team)
- ✅ Email notification sent (if SMTP configured)
- ✅ Alert appears in Grafana

### 2. Test Alert - High CPU Usage

**Objective**: Trigger a real alert by simulating high CPU

```bash
# Install stress tool
sudo apt install stress -y

# Create high CPU load
stress --cpu 8 --timeout 300s &

# Wait 2 minutes for alert to fire
sleep 120

# Check if alert fired
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | select(.labels.alertname=="HighCPUUsage")'

# Check Alertmanager
curl -s http://localhost:9093/api/v2/alerts | jq '.[] | select(.labels.alertname=="HighCPUUsage")'

# Kill stress test
killall stress
```

**Expected Results**:
- ✅ HighCPUUsage alert fires after ~2 minutes
- ✅ Alert appears in Prometheus Alerts page
- ✅ Alert routed to Alertmanager
- ✅ Email notification sent
- ✅ Alert resolves after stress test stops

### 3. Test Alert - Service Down

**Objective**: Trigger service down alert

```bash
# Stop a service
docker-compose -f docker-compose.yml stop web

# Wait for alert to fire (2 minutes)
sleep 120

# Check alert
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | select(.labels.alertname=="ServiceDown")'

# Restart service
docker-compose -f docker-compose.yml start web

# Wait for alert to resolve
sleep 120
```

**Expected Results**:
- ✅ ServiceDown alert fires after 2 minutes
- ✅ Severity is "critical"
- ✅ Email sent to critical-alerts receiver
- ✅ Alert resolves after service restart

### 4. Test Alert Silencing

**Objective**: Verify alert silencing works

```bash
# Create a silence
curl -X POST http://localhost:9093/api/v2/silences \
  -H 'Content-Type: application/json' \
  -d '{
    "matchers": [
      {
        "name": "alertname",
        "value": "TestAlert",
        "isRegex": false
      }
    ],
    "startsAt": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
    "endsAt": "'$(date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%SZ)'",
    "createdBy": "test",
    "comment": "Testing silence functionality"
  }'

# Trigger test alert (should be silenced)
curl -X POST http://localhost:9093/api/v2/alerts \
  -H 'Content-Type: application/json' \
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "warning"
    },
    "annotations": {
      "summary": "This alert should be silenced"
    }
  }]'

# Verify alert is silenced (no notification sent)
```

**Expected Results**:
- ✅ Silence created successfully
- ✅ Alert appears in Alertmanager but marked as "silenced"
- ✅ No notification sent
- ✅ Silence visible in Silences tab

---

## Performance Tests

### 1. Query Performance

**Objective**: Verify query response times are acceptable

```bash
# Test Prometheus query performance
time curl -s "http://localhost:9090/api/v1/query?query=up" > /dev/null

# Expected: < 100ms

# Test complex query
time curl -s "http://localhost:9090/api/v1/query?query=rate(http_requests_total[5m])" > /dev/null

# Expected: < 500ms

# Test Grafana dashboard load time
time curl -s -u admin:$GRAFANA_PASSWORD "http://localhost:3003/api/dashboards/uid/system-overview" > /dev/null

# Expected: < 1s
```

**Expected Results**:
- ✅ Simple queries: < 100ms
- ✅ Complex queries: < 500ms
- ✅ Dashboard loads: < 1s

### 2. Scrape Performance

**Objective**: Verify scrape jobs complete within interval

```bash
# Check scrape duration
curl -s http://localhost:9090/api/v1/query?query=scrape_duration_seconds | jq '.data.result[] | {job: .metric.job, duration: .value[1]}'

# All durations should be < 1 second
```

**Expected Results**:
- ✅ All scrapes complete in < 1s
- ✅ No scrape timeouts
- ✅ Scrape success rate > 99%

### 3. Resource Usage

**Objective**: Monitor resource consumption of monitoring stack

```bash
# Check container resource usage
docker stats --no-stream | grep cepcomunicacion

# Expected limits:
# prometheus: < 1GB RAM
# grafana: < 512MB RAM
# loki: < 512MB RAM
# alertmanager: < 256MB RAM
```

**Expected Results**:
- ✅ Total RAM usage < 3GB
- ✅ CPU usage < 20% at idle
- ✅ Disk I/O < 10MB/s

---

## Integration Tests

### 1. Application Metrics

**Objective**: Verify Next.js app is exposing metrics

```bash
# Test metrics endpoint
curl http://localhost:3001/api/metrics

# Expected output (Prometheus format):
# # HELP http_requests_total Total HTTP requests
# # TYPE http_requests_total counter
# http_requests_total{method="GET",status="200"} 42

# Verify Prometheus is scraping
curl -s "http://localhost:9090/api/v1/query?query=http_requests_total" | jq .data.result
```

**Expected Results**:
- ✅ /api/metrics returns Prometheus format
- ✅ Metrics include labels (method, status, route)
- ✅ Prometheus successfully scrapes metrics
- ✅ Metrics appear in Grafana

### 2. Health Check Endpoint

**Objective**: Verify health check provides accurate status

```bash
# Test health endpoint
curl http://localhost:3001/api/health | jq

# Expected output:
# {
#   "status": "healthy",
#   "timestamp": "2025-10-31T...",
#   "services": {
#     "database": {"status": "up", "latency": 5},
#     "redis": {"status": "up", "latency": 2},
#     ...
#   }
# }

# Test when service is down
docker-compose stop postgres
curl http://localhost:3001/api/health
# Expected: status=503, database.status="down"

# Restart service
docker-compose start postgres
```

**Expected Results**:
- ✅ Health endpoint returns JSON
- ✅ All services show "up" when healthy
- ✅ Returns 503 when critical service down
- ✅ Latency measurements accurate

### 3. Web Vitals Collection

**Objective**: Verify Core Web Vitals are being tracked

```bash
# Send test Web Vitals metric
curl -X POST http://localhost:3001/api/vitals \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "test-123",
    "name": "FCP",
    "value": 1200,
    "rating": "good",
    "delta": 1200,
    "navigationType": "navigate",
    "url": "http://localhost:3001/",
    "timestamp": '$(date +%s)000'
  }'

# Check if metric was stored
curl -s http://localhost:3001/api/vitals?range=1h | jq
```

**Expected Results**:
- ✅ POST returns 200 OK
- ✅ Metric appears in database (if configured)
- ✅ Metric forwarded to analytics (if configured)
- ✅ GET endpoint returns aggregated stats

### 4. Log Collection

**Objective**: Verify logs from all services are collected

```bash
# Generate test logs
docker-compose logs web | tail -10
docker-compose logs cms | tail -10

# Query logs in Loki
curl -s 'http://localhost:3100/loki/api/v1/query?query={service="frontend"}' | jq '.data.result[0].values[0:5]'

# Expected: Recent logs from Next.js app
```

**Expected Results**:
- ✅ Logs from all services visible in Loki
- ✅ Labels correctly extracted
- ✅ Timestamps accurate
- ✅ Log levels parsed correctly

---

## Load Tests

### 1. High Request Rate

**Objective**: Verify monitoring handles high traffic

```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Send 10,000 requests (100 concurrent)
ab -n 10000 -c 100 http://localhost:3001/

# Check metrics during load
watch -n 1 'curl -s "http://localhost:9090/api/v1/query?query=rate(http_requests_total[1m])"'

# Verify no dropped metrics
curl -s "http://localhost:9090/api/v1/query?query=prometheus_tsdb_head_series" | jq
```

**Expected Results**:
- ✅ All requests tracked
- ✅ No metric loss
- ✅ Prometheus keeps up with scraping
- ✅ Dashboards remain responsive

### 2. High Log Volume

**Objective**: Verify Loki handles high log ingestion

```bash
# Generate high log volume
for i in {1..1000}; do
  docker-compose logs web >> /dev/null
  docker-compose logs cms >> /dev/null
done

# Check Loki ingestion rate
curl -s http://localhost:3100/metrics | grep loki_ingester_streams_created_total

# Check for backpressure
curl -s http://localhost:3100/metrics | grep loki_ingester_flush_queue_length
```

**Expected Results**:
- ✅ Loki handles 1000+ lines/second
- ✅ No ingestion errors
- ✅ Queries remain responsive
- ✅ Memory usage stable

### 3. Long-Running Stability

**Objective**: Verify monitoring stack is stable over time

```bash
# Run for 24 hours and monitor
watch -n 300 'docker stats --no-stream | grep cepcomunicacion'

# Check for memory leaks
# Memory usage should remain stable, not grow continuously

# Check for container restarts
docker-compose ps | grep -i restart
```

**Expected Results**:
- ✅ No unexpected restarts
- ✅ Memory usage stable (no leaks)
- ✅ CPU usage consistent
- ✅ Disk usage growth linear (as expected)

---

## Test Results Summary

### Checklist

#### Pre-Deployment
- [ ] All configurations validated
- [ ] Environment variables set
- [ ] Directory permissions correct

#### Deployment
- [ ] All 12 containers started
- [ ] Network connectivity verified
- [ ] All services healthy

#### Functional
- [ ] Prometheus scraping all targets
- [ ] Grafana dashboards visible
- [ ] Loki collecting logs
- [ ] Alertmanager configured

#### Alerts
- [ ] Test alert fires and routes correctly
- [ ] Real alerts trigger on conditions
- [ ] Email notifications sent
- [ ] Silencing works

#### Performance
- [ ] Query times < 500ms
- [ ] Scrape times < 1s
- [ ] Resource usage within limits

#### Integration
- [ ] Application metrics collected
- [ ] Health checks work
- [ ] Web Vitals tracked
- [ ] Logs aggregated

#### Load
- [ ] Handles 1000 req/s
- [ ] Handles 1000 logs/s
- [ ] Stable over 24 hours

---

## Troubleshooting Test Failures

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.monitoring.yml logs [container-name]

# Check for port conflicts
netstat -tulpn | grep -E "9090|3003|3100|9093"

# Check volume permissions
ls -la /var/lib/cepcomunicacion/monitoring/
```

### Target Down in Prometheus

```bash
# Check target endpoint manually
curl http://[target]:port/metrics

# Check network connectivity
docker exec cepcomunicacion_prometheus ping [target]

# Check firewall rules
sudo ufw status
```

### No Data in Grafana

```bash
# Test datasource
curl -u admin:$GRAFANA_PASSWORD \
  http://localhost:3003/api/datasources/1/health

# Check Prometheus has data
curl "http://localhost:9090/api/v1/query?query=up"

# Verify time range in dashboard
```

### Alerts Not Firing

```bash
# Check alert rules loaded
curl http://localhost:9090/api/v1/rules

# Check alert is pending/firing
curl http://localhost:9090/api/v1/alerts

# Check Alertmanager connection
curl http://localhost:9093/-/healthy
```

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
