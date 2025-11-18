#!/bin/bash

# Complete Server Recovery Commands for CEP Comunicación
# Execute these commands in order when server access is restored

echo "=== CEP COMUNICACIÓN - COMPLETE SERVER RECOVERY ==="
echo "Starting recovery process..."
echo ""

# 1. Navigate to project directory
echo "📁 Navigating to project directory..."
cd /var/www/cepcomunicacion || {
    echo "❌ Project directory not found, checking alternatives..."
    cd /opt/cepcomunicacion || {
        echo "❌ Project directory not found in /opt either"
        echo "❌ Please check where the repository was cloned"
        exit 1
    }
}
echo "✅ Project directory found: $(pwd)"
echo ""

# 2. Check system status
echo "🔍 Checking system status..."
systemctl status --no-pager
echo ""
free -h
echo ""
df -h
echo ""

# 3. Check firewall status
echo "🔥 Checking firewall status..."
ufw status verbose
echo ""
iptables -L | head -20
echo ""

# 4. Check Docker status
echo "🐳 Checking Docker status..."
docker --version
docker-compose --version
docker ps -a
echo ""

# 5. Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs nginx/conf.d nginx/ssl postgres/init
echo "✅ Directories created"
echo ""

# 6. Start core services (database, cache, storage)
echo "🚀 Starting core services..."
docker-compose up -d postgres redis minio
echo "✅ Core services started"
echo ""

# 7. Wait for database to be ready (30 seconds)
echo "⏳ Waiting for database to be ready..."
sleep 30
echo ""

# 8. Check database health
echo "🏥 Checking database health..."
docker-compose exec postgres pg_isready -U cepadmin -d cepcomunicacion || echo "⚠️ Database not ready yet"
echo ""

# 9. Start CMS backend
echo "🚀 Starting CMS backend..."
docker-compose up -d cms
echo "✅ CMS started"
echo ""

# 10. Wait for CMS to be ready (30 seconds)
echo "⏳ Waiting for CMS to be ready..."
sleep 30
echo ""

# 11. Start frontend and admin
echo "🚀 Starting frontend and admin..."
docker-compose up -d frontend admin
echo "✅ Frontend and admin started"
echo ""

# 12. Wait for applications to be ready (20 seconds)
echo "⏳ Waiting for applications to be ready..."
sleep 20
echo ""

# 13. Start nginx reverse proxy
echo "🚀 Starting nginx reverse proxy..."
docker-compose up -d nginx
echo "✅ Nginx started"
echo ""

# 14. Check all container status
echo "📊 Checking all container status..."
docker-compose ps
echo ""

# 15. Check service health
echo "🏥 Checking service health..."
curl -I http://localhost || echo "❌ Frontend not responding"
curl -I http://localhost:3000 || echo "❌ CMS not responding"
curl -I http://localhost:3001 || echo "❌ Admin not responding"
echo ""

# 16. Check for HeroCarousel in frontend
echo "🎠 Checking for HeroCarousel in frontend..."
HERO_CHECK=$(curl -s http://localhost | grep -i 'carousel\|hero' || echo "❌ HeroCarousel not found")
if [[ $HERO_CHECK == *"carousel"* ]] || [[ $HERO_CHECK == *"hero"* ]]; then
    echo "✅ HeroCarousel found in frontend"
else
    echo "❌ HeroCarousel not found in frontend"
    echo "Debug info:"
    curl -s http://localhost | head -20
fi
echo ""

# 17. Show logs if there are issues
echo "📋 Checking for any issues..."
FAILED_CONTAINERS=$(docker-compose ps | grep -c "Exit\|Down" || echo "0")
if [ "$FAILED_CONTAINERS" -gt 0 ]; then
    echo "⚠️ Found $FAILED_CONTAINERS failed containers, showing logs:"
    docker-compose logs --tail=20
else
    echo "✅ All containers running successfully"
fi
echo ""

# 18. Final verification
echo "🎯 Final verification:"
echo "Frontend should be accessible at: http://46.62.222.138/"
echo "CMS API should be accessible at: http://46.62.222.138:3000"
echo "Admin panel should be accessible at: http://46.62.222.138:3001"
echo ""

# 19. Public access test
echo "🌐 Testing public access..."
curl -I http://46.62.222.138/ || echo "❌ Public frontend not accessible"
curl -I http://46.62.222.138:3000 || echo "❌ Public CMS not accessible"
curl -I http://46.62.222.138:3001 || echo "❌ Public admin not accessible"
echo ""

echo "=== RECOVERY COMPLETE ==="
echo ""
echo "🎉 CEP Comunicación server recovery completed!"
echo ""
echo "Next steps:"
echo "1. Verify HeroCarousel is visible at http://46.62.222.138/"
echo "2. Test CMS functionality at http://46.62.222.138:3000/admin"
echo "3. Test admin panel at http://46.62.222.138:3001"
echo "4. Configure SSL certificates if needed"
echo "5. Set up monitoring and backups"
echo ""