#!/bin/bash

# CEPComunicacion v2 - Logs Follow Script
# Follow logs for specific service or all services

SERVICE=${1:-all}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📋 Following logs for: ${YELLOW}$SERVICE${NC}"
echo "Press Ctrl+C to stop"
echo ""

# Check if service exists
if [ "$SERVICE" != "all" ]; then
    if ! docker compose -f docker-compose.dev.yml ps --services | grep -q "^${SERVICE}$"; then
        echo "Error: Service '$SERVICE' not found"
        echo ""
        echo "Available services:"
        docker compose -f docker-compose.dev.yml ps --services
        exit 1
    fi
fi

# Follow logs
if [ "$SERVICE" == "all" ]; then
    docker compose -f docker-compose.dev.yml logs -f
else
    docker compose -f docker-compose.dev.yml logs -f "$SERVICE"
fi
