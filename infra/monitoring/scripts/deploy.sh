#!/bin/bash
#
# Deploy Monitoring Stack for CEPComunicacion v2
#
# This script deploys the complete monitoring infrastructure including:
# - Prometheus (metrics collection)
# - Grafana (visualization)
# - Loki (log aggregation)
# - Alertmanager (alert routing)
# - Exporters (node, postgres, redis, nginx, cadvisor, blackbox)
# - Uptime Kuma (uptime monitoring)
#
# Usage:
#   ./deploy.sh [start|stop|restart|logs|status]
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONITORING_DIR="$(dirname "$SCRIPT_DIR")"
DATA_DIR="/var/lib/cepcomunicacion/monitoring"
ENV_FILE="$MONITORING_DIR/.env"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]] && ! groups | grep -q docker; then
        log_warn "You may need to run this script with sudo or add your user to the docker group"
    fi

    log_info "Requirements check passed"
}

create_directories() {
    log_info "Creating data directories..."

    mkdir -p "$DATA_DIR"/{prometheus,grafana,loki,uptime-kuma,alertmanager}

    # Set permissions
    chmod -R 755 "$DATA_DIR"

    # Grafana needs specific UID/GID (472:472)
    chown -R 472:472 "$DATA_DIR/grafana" 2>/dev/null || true

    log_info "Data directories created at $DATA_DIR"
}

check_env_file() {
    log_info "Checking environment configuration..."

    if [[ ! -f "$ENV_FILE" ]]; then
        log_warn "No .env file found. Creating from template..."

        cat > "$ENV_FILE" << 'EOF'
# Monitoring Stack Environment Variables

# Grafana
GRAFANA_PASSWORD=ChangeMe123!

# PostgreSQL (should match main application)
POSTGRES_USER=cepcomunicacion
POSTGRES_PASSWORD=wGWxjMYsUWSBvlqw2Ck9KU2BKUI=
POSTGRES_DB=cepcomunicacion

# Redis (if password protected)
REDIS_PASSWORD=

# SMTP (for alerts)
SMTP_HOST=smtp.gmail.com:587
SMTP_USER=alerts@cepcomunicacion.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=alerts@cepcomunicacion.com

# Google Analytics 4 (optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
GA4_API_SECRET=

# Slack (optional)
SLACK_WEBHOOK_URL=

# PagerDuty (optional)
PAGERDUTY_SERVICE_KEY=
EOF

        log_warn "Please edit $ENV_FILE and configure your credentials"
        log_warn "Then run this script again"
        exit 0
    fi

    # Load environment variables
    set -a
    source "$ENV_FILE"
    set +a

    log_info "Environment configuration loaded"
}

validate_config() {
    log_info "Validating configuration files..."

    # Check Prometheus config
    if docker run --rm -v "$MONITORING_DIR/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml" \
        prom/prometheus:v2.48.0 \
        promtool check config /etc/prometheus/prometheus.yml > /dev/null 2>&1; then
        log_info "Prometheus configuration is valid"
    else
        log_error "Prometheus configuration is invalid"
        exit 1
    fi

    # Check Alertmanager config
    if docker run --rm -v "$MONITORING_DIR/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml" \
        prom/alertmanager:v0.26.0 \
        amtool check-config /etc/alertmanager/alertmanager.yml > /dev/null 2>&1; then
        log_info "Alertmanager configuration is valid"
    else
        log_error "Alertmanager configuration is invalid"
        exit 1
    fi

    log_info "Configuration validation passed"
}

deploy_stack() {
    log_info "Deploying monitoring stack..."

    cd "$MONITORING_DIR"

    # Pull latest images
    log_info "Pulling Docker images..."
    docker-compose -f docker-compose.monitoring.yml pull

    # Start services
    log_info "Starting services..."
    docker-compose -f docker-compose.monitoring.yml up -d

    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 15

    # Check service health
    check_health
}

check_health() {
    log_info "Checking service health..."

    local services=("prometheus" "grafana" "loki" "alertmanager")
    local all_healthy=true

    for service in "${services[@]}"; do
        if docker-compose -f "$MONITORING_DIR/docker-compose.monitoring.yml" ps "$service" | grep -q "Up"; then
            log_info "✓ $service is running"
        else
            log_error "✗ $service is not running"
            all_healthy=false
        fi
    done

    if [[ "$all_healthy" == true ]]; then
        log_info "All services are healthy"
        show_access_urls
    else
        log_error "Some services are not healthy. Check logs with: $0 logs"
        exit 1
    fi
}

show_access_urls() {
    echo ""
    log_info "=== Monitoring Stack Access URLs ==="
    echo ""
    echo "  Grafana:         http://localhost:3003"
    echo "  Prometheus:      http://localhost:9090"
    echo "  Alertmanager:    http://localhost:9093"
    echo "  Uptime Kuma:     http://localhost:3004"
    echo "  Loki:            http://localhost:3100"
    echo ""
    echo "  Grafana credentials:"
    echo "    Username: admin"
    echo "    Password: ${GRAFANA_PASSWORD:-ChangeMe123!}"
    echo ""
    log_info "====================================="
}

stop_stack() {
    log_info "Stopping monitoring stack..."

    cd "$MONITORING_DIR"
    docker-compose -f docker-compose.monitoring.yml down

    log_info "Monitoring stack stopped"
}

restart_stack() {
    log_info "Restarting monitoring stack..."

    stop_stack
    sleep 5
    deploy_stack
}

show_logs() {
    local service="${1:-}"

    cd "$MONITORING_DIR"

    if [[ -n "$service" ]]; then
        log_info "Showing logs for $service..."
        docker-compose -f docker-compose.monitoring.yml logs -f "$service"
    else
        log_info "Showing logs for all services..."
        docker-compose -f docker-compose.monitoring.yml logs -f
    fi
}

show_status() {
    log_info "Monitoring stack status:"
    echo ""

    cd "$MONITORING_DIR"
    docker-compose -f docker-compose.monitoring.yml ps
}

backup_data() {
    log_info "Backing up monitoring data..."

    local backup_dir="/var/backups/cepcomunicacion/monitoring"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/monitoring_backup_$timestamp.tar.gz"

    mkdir -p "$backup_dir"

    # Create backup
    tar -czf "$backup_file" -C "$DATA_DIR" .

    log_info "Backup created: $backup_file"
}

show_usage() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    start           Deploy and start the monitoring stack
    stop            Stop the monitoring stack
    restart         Restart the monitoring stack
    status          Show status of all services
    logs [SERVICE]  Show logs (optional: specific service)
    backup          Backup monitoring data
    validate        Validate configuration files
    help            Show this help message

Examples:
    $0 start
    $0 logs prometheus
    $0 restart
    $0 backup

EOF
}

# Main execution
main() {
    local command="${1:-}"

    case "$command" in
        start)
            check_requirements
            create_directories
            check_env_file
            validate_config
            deploy_stack
            ;;
        stop)
            stop_stack
            ;;
        restart)
            restart_stack
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "${2:-}"
            ;;
        backup)
            backup_data
            ;;
        validate)
            validate_config
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
