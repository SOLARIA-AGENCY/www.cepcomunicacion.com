#!/bin/bash

# CEPComunicacion v2 - Docker Health Test
# Verifies all containers are healthy before deployment

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🏥 Docker Health Check"
echo "======================"
echo ""

COMPOSE_FILE=${1:-docker-compose.yml}
TIMEOUT=120  # 2 minutes max wait time
INTERVAL=5   # Check every 5 seconds

echo "Using compose file: $COMPOSE_FILE"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Check if docker compose is available
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}✗ docker compose not found${NC}"
    exit 1
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}✗ Compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

# Get list of all services
echo "Checking services..."
SERVICES=$(docker compose -f "$COMPOSE_FILE" ps --services)
TOTAL_SERVICES=$(echo "$SERVICES" | wc -l)
echo "Total services: $TOTAL_SERVICES"
echo ""

# Track failures
FAILED_SERVICES=()
PASSED_SERVICES=()

# Function to check container health
check_container_health() {
    local container_name=$1
    local health_status

    # Try to get health status
    health_status=$(docker inspect --format='{{.State.Health.Status}}' "$container_name" 2>/dev/null || echo "none")

    # If no health check defined, check if container is running
    if [ "$health_status" = "none" ] || [ "$health_status" = "<no value>" ]; then
        local state=$(docker inspect --format='{{.State.Status}}' "$container_name" 2>/dev/null || echo "unknown")
        if [ "$state" = "running" ]; then
            echo "running"
        else
            echo "$state"
        fi
    else
        echo "$health_status"
    fi
}

# Check each service
for service in $SERVICES; do
    # Get container name for service
    container_name=$(docker compose -f "$COMPOSE_FILE" ps -q "$service" 2>/dev/null | head -n1)

    if [ -z "$container_name" ]; then
        echo -e "${YELLOW}⚠ Service '$service' not running${NC}"
        FAILED_SERVICES+=("$service (not running)")
        continue
    fi

    # Get actual container name
    container_name=$(docker inspect --format='{{.Name}}' "$container_name" | sed 's/\///')

    echo -n "Checking $service ($container_name)... "

    # Wait for container to be healthy
    elapsed=0
    while [ $elapsed -lt $TIMEOUT ]; do
        status=$(check_container_health "$container_name")

        case "$status" in
            healthy|running)
                echo -e "${GREEN}✓ $status${NC}"
                PASSED_SERVICES+=("$service")
                break
                ;;
            starting)
                echo -n "."
                sleep $INTERVAL
                elapsed=$((elapsed + INTERVAL))
                ;;
            unhealthy)
                echo -e "${RED}✗ unhealthy${NC}"
                FAILED_SERVICES+=("$service (unhealthy)")
                break
                ;;
            exited|dead|unknown)
                echo -e "${RED}✗ $status${NC}"
                FAILED_SERVICES+=("$service ($status)")
                break
                ;;
            *)
                echo -n "."
                sleep $INTERVAL
                elapsed=$((elapsed + INTERVAL))
                ;;
        esac
    done

    # Check if timeout occurred
    if [ $elapsed -ge $TIMEOUT ]; then
        echo -e "${RED}✗ timeout${NC}"
        FAILED_SERVICES+=("$service (timeout)")
    fi
done

echo ""
echo "======================"
echo "Health Check Summary"
echo "======================"
echo ""
echo -e "${GREEN}✓ Healthy: ${#PASSED_SERVICES[@]}/$TOTAL_SERVICES${NC}"

if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    echo -e "${RED}✗ Failed: ${#FAILED_SERVICES[@]}/$TOTAL_SERVICES${NC}"
    echo ""
    echo "Failed services:"
    for failed in "${FAILED_SERVICES[@]}"; do
        echo -e "  ${RED}✗${NC} $failed"
    done
    echo ""

    # Show logs for failed services
    echo "Showing logs for failed services:"
    echo ""
    for failed in "${FAILED_SERVICES[@]}"; do
        service_name=$(echo "$failed" | cut -d' ' -f1)
        echo "--- Logs for $service_name ---"
        docker compose -f "$COMPOSE_FILE" logs --tail=20 "$service_name" 2>/dev/null || echo "No logs available"
        echo ""
    done

    exit 1
fi

echo ""
echo -e "${GREEN}✅ All services are healthy!${NC}"
exit 0
