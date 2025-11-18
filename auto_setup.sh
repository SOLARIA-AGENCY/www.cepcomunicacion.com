#!/bin/bash

# AUTOMATIC SERVER SETUP - CEP COMunicación v2
# Execute this when you have the new server IP

set -e  # Exit on any error

echo "🚀 Starting automatic server setup for CEP Comunicación v2"
echo "=================================================="

# Check if IP argument provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Please provide server IP"
    echo "Usage: ./auto_setup.sh SERVER_IP"
    exit 1
fi

SERVER_IP=$1
SSH_KEY="~/.ssh/cepcomunicacion"

echo "📍 Server IP: $SERVER_IP"
echo "🔑 SSH Key: $SSH_KEY"
echo ""

# Function to execute remote commands
execute_remote() {
    ssh -i $SSH_KEY -o StrictHostKeyChecking=no root@$SERVER_IP "$1"
}

echo "🔍 Testing SSH connection..."
if execute_remote "echo 'SSH connection successful'"; then
    echo "✅ SSH connection successful"
else
    echo "❌ SSH connection failed"
    exit 1
fi

echo ""
echo "📦 Updating system packages..."
execute_remote "apt update && apt upgrade -y"

echo ""
echo "🐳 Installing Docker..."
execute_remote "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"

echo ""
echo "🔧 Installing Docker Compose..."
execute_remote "curl -L 'https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)' -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose"

echo ""
echo "🔥 Configuring firewall..."
execute_remote "ufw default deny incoming && ufw default allow outgoing && ufw allow ssh && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable"

echo ""
echo "📁 Creating project directory..."
execute_remote "cd /opt && git clone https://github.com/solaria-agency/cepcomunicacion.git"

echo ""
echo "⚙️ Setting up environment file..."
execute_remote "cd /opt/cepcomunicacion && cp .env.example .env"

echo ""
echo "🔑 Generating secure passwords..."
execute_remote "
cd /opt/cepcomunicacion
# Generate random passwords
POSTGRES_PASSWORD=\$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-25)
REDIS_PASSWORD=\$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-25)
MINIO_PASSWORD=\$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-25)
PAYLOAD_SECRET=\$(openssl rand -base64 32 | tr -d '=+/' | cut -c1-32)

# Update .env file
sed -i \"s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=\$POSTGRES_PASSWORD/\" .env
sed -i \"s/REDIS_PASSWORD=.*/REDIS_PASSWORD=\$REDIS_PASSWORD/\" .env
sed -i \"s/MINIO_ROOT_PASSWORD=.*/MINIO_ROOT_PASSWORD=\$MINIO_PASSWORD/\" .env
sed -i \"s/PAYLOAD_SECRET=.*/PAYLOAD_SECRET=\$PAYLOAD_SECRET/\" .env

echo 'Environment configured with secure passwords'
"

echo ""
echo "📂 Creating necessary directories..."
execute_remote "cd /opt/cepcomunicacion && mkdir -p logs nginx/conf.d nginx/ssl postgres/init"

echo ""
echo "🚀 Starting Docker services..."
execute_remote "cd /opt/cepcomunicacion && docker-compose up -d postgres redis minio"

echo ""
echo "⏳ Waiting for database to be ready..."
execute_remote "sleep 30"

echo ""
echo "🚀 Starting CMS..."
execute_remote "cd /opt/cepcomunicacion && docker-compose up -d cms"

echo ""
echo "⏳ Waiting for CMS to be ready..."
execute_remote "sleep 30"

echo ""
echo "🚀 Starting frontend and admin..."
execute_remote "cd /opt/cepcomunicacion && docker-compose up -d frontend admin"

echo ""
echo "⏳ Waiting for applications to be ready..."
execute_remote "sleep 20"

echo ""
echo "🚀 Starting nginx reverse proxy..."
execute_remote "cd /opt/cepcomunicacion && docker-compose up -d nginx"

echo ""
echo "📊 Checking container status..."
execute_remote "cd /opt/cepcomunicacion && docker-compose ps"

echo ""
echo "🏥 Verifying services..."
execute_remote "curl -I http://localhost || echo 'Frontend not responding'"
execute_remote "curl -I http://localhost:3000 || echo 'CMS not responding'"
execute_remote "curl -I http://localhost:3001 || echo 'Admin not responding'"

echo ""
echo "🎠 Checking HeroCarousel..."
HERO_CHECK=$(execute_remote "curl -s http://localhost | grep -i 'carousel\\|hero' || echo 'HeroCarousel not found'")
if [[ $HERO_CHECK == *"carousel"* ]] || [[ $HERO_CHECK == *"hero"* ]]; then
    echo "✅ HeroCarousel found in frontend"
else
    echo "❌ HeroCarousel not found - checking debug info..."
    execute_remote "curl -s http://localhost | head -20"
fi

echo ""
echo "🌐 Testing public access..."
echo "Testing from your local machine, run:"
echo "curl -I http://$SERVER_IP/"
echo "curl -s http://$SERVER_IP/ | grep -i carousel"

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo "Frontend: http://$SERVER_IP/"
echo "CMS API: http://$SERVER_IP:3000/admin"
echo "Admin Panel: http://$SERVER_IP:3001"
echo ""
echo "Next steps:"
echo "1. Test the URLs above in your browser"
echo "2. Configure SSL certificates if needed"
echo "3. Set up monitoring and backups"
echo "4. Update DNS records to point to this server"