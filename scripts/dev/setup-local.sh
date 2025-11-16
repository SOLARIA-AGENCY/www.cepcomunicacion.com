#!/bin/bash

# CEPComunicacion v2 - Local Development Setup
# One-command setup for new developers
# Run this script to initialize your local development environment

set -e  # Exit on error

echo "🚀 CEPComunicacion v2 - Local Development Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
info() {
    echo -e "${GREEN}✓${NC} $1"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

# Check Docker
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker Desktop."
    exit 1
fi
info "Docker: $(docker --version)"

# Check Docker Compose
if ! command -v docker compose &> /dev/null; then
    error "Docker Compose is not installed."
    exit 1
fi
info "Docker Compose: $(docker compose version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 20+."
    exit 1
fi
NODE_VERSION=$(node --version)
info "Node.js: $NODE_VERSION"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    warn "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi
info "pnpm: $(pnpm --version)"

# Check minimum versions
NODE_MAJOR=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
    error "Node.js version must be 20 or higher. Current: $NODE_VERSION"
    exit 1
fi

echo ""
echo "Step 2: Installing dependencies..."
echo "-----------------------------------"

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    info "Installing pnpm dependencies..."
    pnpm install
else
    info "Dependencies already installed. Run 'pnpm install' to update."
fi

echo ""
echo "Step 3: Setting up environment variables..."
echo "-----------------------------------"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    info "Creating .env file from example..."
    cat > .env << 'EOF'
# CEPComunicacion v2 - Development Environment Variables

# Database
POSTGRES_DB=cepcomunicacion
POSTGRES_USER=cepadmin
POSTGRES_PASSWORD=devpassword123

# Redis (no password in dev)
REDIS_PASSWORD=

# Payload CMS
PAYLOAD_SECRET=dev-secret-change-in-production-$(openssl rand -hex 16)

# MinIO S3 Storage
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
S3_BUCKET=cep-uploads
S3_BACKUP_BUCKET=cep-backups

# BullBoard Monitoring
BULLBOARD_USER=admin
BULLBOARD_PASSWORD=admin

# External APIs (optional - leave empty for development)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
META_PIXEL_ID=

MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_LIST_ID=

WHATSAPP_PHONE_ID=
WHATSAPP_ACCESS_TOKEN=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Feature Flags (disabled in dev by default)
ENABLE_META_INTEGRATION=false
ENABLE_MAILCHIMP_INTEGRATION=false
ENABLE_WHATSAPP_INTEGRATION=false
ENABLE_LLM_INTEGRATION=false
ENABLE_DEV_LOGIN=true

# Analytics (disabled in dev)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
EOF
    info ".env file created successfully"
else
    warn ".env file already exists. Skipping creation."
fi

# Create app-specific .env files if needed
for app in apps/web-next apps/admin apps/cms; do
    if [ -f "$app/.env.example" ] && [ ! -f "$app/.env.local" ]; then
        info "Creating $app/.env.local from example..."
        cp "$app/.env.example" "$app/.env.local"
    fi
done

echo ""
echo "Step 4: Starting Docker services..."
echo "-----------------------------------"

# Stop any existing containers
if [ "$(docker ps -q -f name=cep-)" ]; then
    warn "Stopping existing containers..."
    docker compose -f docker-compose.dev.yml down
fi

# Start essential services (postgres, redis, minio)
info "Starting database and storage services..."
docker compose -f docker-compose.dev.yml up -d postgres redis minio mailhog

# Wait for services to be healthy
info "Waiting for services to be ready..."
sleep 10

# Check PostgreSQL health
until docker exec cep-postgres-dev pg_isready -U cepadmin -d cepcomunicacion &> /dev/null; do
    echo -n "."
    sleep 2
done
info "PostgreSQL is ready"

# Check Redis health
until docker exec cep-redis-dev redis-cli ping &> /dev/null; do
    echo -n "."
    sleep 2
done
info "Redis is ready"

echo ""
echo "Step 5: Running database migrations..."
echo "-----------------------------------"

# Run migrations if migration script exists
if [ -f "infra/postgres/apply_migrations.sh" ]; then
    info "Applying database migrations..."
    ./infra/postgres/apply_migrations.sh || warn "Migration failed. Run manually: pnpm db:migrate"
else
    warn "Migration script not found. Create schema manually."
fi

echo ""
echo "Step 6: Seeding database (optional)..."
echo "-----------------------------------"

# Seed database if seed file exists
if [ -f "infra/postgres/seeds/001_initial_data.sql" ]; then
    read -p "Do you want to seed the database with sample data? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Seeding database..."
        docker exec -i cep-postgres-dev psql -U cepadmin -d cepcomunicacion < infra/postgres/seeds/001_initial_data.sql || warn "Seeding failed"
    else
        info "Skipping database seeding"
    fi
else
    warn "Seed file not found. Database is empty."
fi

echo ""
echo "Step 7: Starting development servers..."
echo "-----------------------------------"

info "You can now start the full development stack with:"
echo ""
echo "  pnpm dev:docker          # Start all services"
echo "  pnpm dev:docker:minimal  # Start only frontend + CMS + DB"
echo "  pnpm dev:docker:logs     # Follow logs"
echo ""
echo "Or start services individually:"
echo ""
echo "  docker compose -f docker-compose.dev.yml up -d"
echo ""

echo "================================================"
echo "✅ Local development environment is ready!"
echo "================================================"
echo ""
echo "Access your services at:"
echo ""
echo "  Frontend (Next.js 16):  http://localhost:3000"
echo "  Admin (Next.js 15):     http://localhost:3001"
echo "  CMS (Payload 3.62.1):   http://localhost:3002"
echo "  MailHog:                http://localhost:8025"
echo "  BullBoard:              http://localhost:3010 (admin/admin)"
echo "  MinIO:                  http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "Database connections:"
echo ""
echo "  PostgreSQL:  localhost:5432"
echo "  Username:    cepadmin"
echo "  Password:    devpassword123"
echo "  Database:    cepcomunicacion"
echo ""
echo "  Redis:       localhost:6379 (no password)"
echo ""
echo "Useful commands:"
echo ""
echo "  ./scripts/dev/reset-database.sh    # Reset database to clean state"
echo "  ./scripts/dev/logs-follow.sh cms   # Follow logs for specific service"
echo "  docker compose -f docker-compose.dev.yml ps    # Check service status"
echo ""
echo "Happy coding! 🎉"
echo ""
