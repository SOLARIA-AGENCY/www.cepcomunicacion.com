#!/bin/bash

# Quick Reinstall Commands for CEP Comunicación
# Use when SSH is unstable - run commands one by one

echo "=== CEP COMUNICACIÓN - QUICK REINSTALL ==="
echo "Run these commands one by one on the server:"
echo ""

echo "# 1. Stop all containers"
echo "cd /var/www/cepcomunicacion"
echo "docker-compose down --remove-orphans"
echo ""

echo "# 2. Remove all containers"
echo "docker container rm -f \$(docker container ls -aq) 2>/dev/null || true"
echo ""

echo "# 3. Remove all images"
echo "docker image rm -f \$(docker image ls -aq) 2>/dev/null || true"
echo ""

echo "# 4. Remove all volumes"
echo "docker volume rm -f \$(docker volume ls -q) 2>/dev/null || true"
echo ""

echo "# 5. Clean Docker system"
echo "docker system prune -af --volumes || true"
echo ""

echo "# 6. Pull latest code"
echo "git fetch origin"
echo "git reset --hard origin/main"
echo "git clean -fd"
echo ""

echo "# 7. Start services step by step"
echo "docker-compose up -d postgres redis minio"
echo "sleep 30"
echo "docker-compose up -d cms"
echo "sleep 30"
echo "docker-compose up -d frontend"
echo "sleep 20"
echo "docker-compose up -d admin"
echo "sleep 10"
echo "docker-compose up -d nginx"
echo ""

echo "# 8. Check status"
echo "docker-compose ps"
echo ""

echo "# 9. Check services"
echo "curl -I http://localhost"
echo "curl -I http://localhost:3000"
echo "curl -I http://localhost:3001"
echo ""

echo "=== END OF QUICK REINSTALL ==="