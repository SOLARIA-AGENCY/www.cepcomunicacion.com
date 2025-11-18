#!/bin/bash

# Final Commands to Complete CEP Comunicación Reinstallation
# Execute these commands one by one when SSH is available

echo "=== CEP COMUNICACIÓN - FINAL INSTALLATION COMMANDS ==="
echo "Execute these commands in order when SSH is stable:"
echo ""

echo "# 1. Navigate to project directory"
echo "cd /var/www/cepcomunicacion"
echo "pwd"
echo ""

echo "# 2. Create necessary directories"
echo "mkdir -p logs nginx/conf.d nginx/ssl postgres/init"
echo ""

echo "# 3. Start core services (database, cache, storage)"
echo "docker-compose up -d postgres redis minio"
echo ""

echo "# 4. Wait for database to be ready (30 seconds)"
echo "sleep 30"
echo ""

echo "# 5. Check database health"
echo "docker-compose exec postgres pg_isready -U cepadmin -d cepcomunicacion || echo 'Database not ready yet'"
echo ""

echo "# 6. Start CMS backend"
echo "docker-compose up -d cms"
echo ""

echo "# 7. Wait for CMS to be ready (30 seconds)"
echo "sleep 30"
echo ""

echo "# 8. Start frontend and admin"
echo "docker-compose up -d frontend admin"
echo ""

echo "# 9. Wait for applications to be ready (20 seconds)"
echo "sleep 20"
echo ""

echo "# 10. Start nginx reverse proxy"
echo "docker-compose up -d nginx"
echo ""

echo "# 11. Check all container status"
echo "docker-compose ps"
echo ""

echo "# 12. Check service health"
echo "curl -I http://localhost || echo 'Frontend not responding'"
echo "curl -I http://localhost:3000 || echo 'CMS not responding'"
echo "curl -I http://localhost:3001 || echo 'Admin not responding'"
echo ""

echo "# 13. Check for HeroCarousel in frontend"
echo "curl -s http://localhost | grep -i 'carousel\|hero' || echo 'HeroCarousel not found'"
echo ""

echo "# 14. Show logs if there are issues"
echo "docker-compose logs --tail=20 frontend"
echo ""

echo "=== END OF FINAL COMMANDS ==="
echo ""
echo "Expected result:"
echo "- Frontend: http://46.62.222.138/ with HeroCarousel visible"
echo "- CMS: http://46.62.222.138:3000/api working"
echo "- Admin: http://46.62.222.138:3001 working"
echo ""