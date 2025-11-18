#!/bin/bash

# Update Script for CEP Formación Frontend
# This script updates the nginx container with new frontend files

echo "🚀 Starting CEP Formación Frontend Update..."

# Backup current files
echo "📦 Creating backup..."
docker exec cep-nginx sh -c "cp -r /usr/share/nginx/html /usr/share/nginx/html_backup_$(date +%Y%m%d_%H%M%S)"

# Stop nginx container
echo "⏸️ Stopping nginx container..."
docker stop cep-nginx

# Remove old container
echo "🗑️ Removing old container..."
docker rm cep-nginx

# Create new nginx container with updated files
echo "🏗️ Creating new nginx container..."
docker run -d \
  --name cep-nginx \
  --network cep-network \
  -p 80:80 \
  -v /tmp/cep-frontend:/usr/share/nginx/html:ro \
  nginx:alpine

# Copy new files to volume
echo "📁 Copying new frontend files..."
mkdir -p /tmp/cep-frontend
cp /Users/carlosjperez/Documents/GitHub/www.cepcomunicacion.com/*.html /tmp/cep-frontend/

# Restart container
echo "🔄 Restarting nginx container..."
docker restart cep-nginx

echo "✅ Frontend update completed!"
echo "🌐 Site available at: http://46.62.222.138"

# Wait for container to be ready
sleep 5

# Test the deployment
echo "🧪 Testing deployment..."
if curl -s http://46.62.222.138/ | grep -q "DESIGN HUB"; then
    echo "✅ Deployment successful - New frontend is live!"
else
    echo "❌ Deployment failed - Please check logs"
    docker logs cep-nginx
fi