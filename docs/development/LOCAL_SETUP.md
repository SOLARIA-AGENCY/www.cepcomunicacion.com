# Local Development Setup Guide

This guide will help you set up the CEPComunicacion v2 project on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Docker Desktop** (20.10+)
   - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

2. **Node.js** (20.0.0 or higher)
   - [Download from nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

3. **pnpm** (9.0.0 or higher)
   - Install: `npm install -g pnpm`
   - Verify installation: `pnpm --version`

4. **Git** (2.30+)
   - [Download from git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Optional Tools

- **PostgreSQL Client** - For database inspection (DBeaver, pgAdmin, or `psql`)
- **Redis CLI** - For Redis debugging (`redis-cli`)
- **VS Code** - Recommended IDE with extensions:
  - ESLint
  - Prettier
  - Docker
  - PostgreSQL
  - Tailwind CSS IntelliSense

## Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
# Clone the repository
git clone https://github.com/your-org/cepcomunicacion.git
cd cepcomunicacion

# Run setup script
pnpm dev:setup
```

This script will:
- Check all prerequisites
- Install dependencies
- Create `.env` file with development defaults
- Start Docker services (PostgreSQL, Redis, MinIO)
- Run database migrations
- Optionally seed sample data

### Option 2: Manual Setup

If you prefer manual control:

```bash
# 1. Clone repository
git clone https://github.com/your-org/cepcomunicacion.git
cd cepcomunicacion

# 2. Install dependencies
pnpm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your settings (or use defaults)

# 4. Start infrastructure services
docker compose -f docker-compose.dev.yml up -d postgres redis minio mailhog

# 5. Wait for services (30 seconds)
sleep 30

# 6. Run database migrations
pnpm db:migrate

# 7. (Optional) Seed database
pnpm db:seed

# 8. Start development servers
pnpm dev:docker
```

## Development Environment

### Environment Variables

The `.env` file contains all configuration. Development defaults:

```bash
# Database
POSTGRES_DB=cepcomunicacion
POSTGRES_USER=cepadmin
POSTGRES_PASSWORD=devpassword123

# Redis (no password in dev)
REDIS_PASSWORD=

# Payload CMS
PAYLOAD_SECRET=dev-secret-change-in-production-<random>

# MinIO S3
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# Feature Flags (disabled in dev)
ENABLE_META_INTEGRATION=false
ENABLE_MAILCHIMP_INTEGRATION=false
ENABLE_WHATSAPP_INTEGRATION=false
ENABLE_LLM_INTEGRATION=false
ENABLE_DEV_LOGIN=true
```

### Service Ports

| Service | Port | URL | Credentials |
|---------|------|-----|-------------|
| Frontend (Next.js 16) | 3000 | http://localhost:3000 | - |
| Admin Dashboard (Next.js 15) | 3001 | http://localhost:3001 | admin/admin |
| CMS API (Payload 3.62.1) | 3002 | http://localhost:3002 | - |
| MailHog Web UI | 8025 | http://localhost:8025 | - |
| BullBoard (Queue) | 3010 | http://localhost:3010 | admin/admin |
| MinIO Console | 9001 | http://localhost:9001 | minioadmin/minioadmin |
| PostgreSQL | 5432 | localhost:5432 | cepadmin/devpassword123 |
| Redis | 6379 | localhost:6379 | (no password) |

### Starting Services

#### Start Full Stack

```bash
# Start all services and follow logs
pnpm dev:docker

# Or start without logs
pnpm dev:docker:up
```

#### Start Minimal Stack (Frontend + CMS + DB)

```bash
# Only essential services for frontend development
pnpm dev:docker:minimal
```

#### Start Individual Services

```bash
# Start only database and storage
docker compose -f docker-compose.dev.yml up -d postgres redis minio

# Start only frontend
docker compose -f docker-compose.dev.yml up -d frontend

# Start CMS
docker compose -f docker-compose.dev.yml up -d cms

# Start workers (optional)
docker compose -f docker-compose.dev.yml --profile workers up -d
```

### Viewing Logs

```bash
# Follow all logs
pnpm dev:docker:logs

# Follow specific service
./scripts/dev/logs-follow.sh cms

# View last 100 lines
docker compose -f docker-compose.dev.yml logs --tail=100 frontend

# Follow logs for multiple services
docker compose -f docker-compose.dev.yml logs -f frontend cms postgres
```

### Stopping Services

```bash
# Stop all services (keeps data)
pnpm dev:docker:down

# Stop and remove volumes (DELETES ALL DATA)
pnpm dev:docker:clean
```

## Database Management

### Connecting to PostgreSQL

#### Using Docker Exec

```bash
# Connect to PostgreSQL CLI
docker exec -it cep-postgres-dev psql -U cepadmin -d cepcomunicacion

# Run SQL file
docker exec -i cep-postgres-dev psql -U cepadmin -d cepcomunicacion < schema.sql

# Dump database
docker exec cep-postgres-dev pg_dump -U cepadmin cepcomunicacion > backup.sql
```

#### Using Local PostgreSQL Client

```bash
# Connection string
postgresql://cepadmin:devpassword123@localhost:5432/cepcomunicacion

# Using psql
psql -h localhost -p 5432 -U cepadmin -d cepcomunicacion

# Using DBeaver or pgAdmin
Host:     localhost
Port:     5432
Database: cepcomunicacion
User:     cepadmin
Password: devpassword123
```

### Running Migrations

```bash
# Apply all pending migrations
pnpm db:migrate

# Rollback last migration (if supported)
pnpm db:migrate:rollback
```

### Seeding Data

```bash
# Load sample data
pnpm db:seed

# Load custom SQL file
docker exec -i cep-postgres-dev psql -U cepadmin -d cepcomunicacion < my-data.sql
```

### Resetting Database

```bash
# Complete reset (DELETES ALL DATA)
pnpm db:reset:dev

# Or manually
docker compose -f docker-compose.dev.yml down -v postgres
docker volume rm cepcomunicacion-v2_postgres-data-dev
docker compose -f docker-compose.dev.yml up -d postgres
pnpm db:migrate
pnpm db:seed
```

## Hot Reload & Debugging

### Frontend (Next.js 16)

Hot reload with Turbopack is enabled by default. Edit files in `apps/web-next/` and see changes instantly.

```bash
# Start frontend in dev mode with Turbopack
docker compose -f docker-compose.dev.yml up frontend

# Or run outside Docker for faster Fast Refresh
cd apps/web-next
pnpm dev --turbopack
```

### Admin Dashboard (Next.js 15)

Next.js Fast Refresh is enabled. Edit files in `apps/admin/` for instant updates.

```bash
# Run inside Docker
docker compose -f docker-compose.dev.yml up admin

# Or run locally
cd apps/admin
pnpm dev
```

### CMS (Payload)

Payload CMS runs with Next.js. Hot reload enabled for API and admin changes.

```bash
# Run inside Docker
docker compose -f docker-compose.dev.yml up cms

# Or run locally
cd apps/cms
pnpm dev
```

### Node.js Debugging

Debug ports are exposed for all Node.js services:

| Service | Debug Port | VS Code Attach Config |
|---------|------------|----------------------|
| Frontend | 9229 | `attach-frontend` |
| Admin | 9230 | `attach-admin` |
| CMS | 9231 | `attach-cms` |
| Worker Auto | 9232 | `attach-worker-auto` |
| Worker LLM | 9233 | `attach-worker-llm` |

Example VS Code `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to CMS",
      "port": 9231,
      "restart": true,
      "sourceMaps": true,
      "localRoot": "${workspaceFolder}/apps/cms",
      "remoteRoot": "/app/apps/cms"
    }
  ]
}
```

## Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage

# Specific workspace
pnpm test:cms
pnpm test:web
pnpm test:workers
```

### Integration Tests

```bash
# Start test environment
docker compose -f docker-compose.test.yml up --abort-on-container-exit

# Clean up
docker compose -f docker-compose.test.yml down -v
```

### E2E Tests (Playwright)

```bash
# Install Playwright
pnpm --filter tests install

# Run E2E tests
pnpm test:e2e

# Interactive mode
pnpm test:e2e:ui
```

## Common Issues

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.dev.yml
ports:
  - "3010:3000"  # Changed from 3000:3000
```

### Docker Containers Not Starting

```bash
# Check logs
docker compose -f docker-compose.dev.yml logs

# Check Docker Desktop is running
docker ps

# Restart Docker Desktop
# (varies by OS)

# Remove old containers
docker compose -f docker-compose.dev.yml down -v
docker system prune -af
```

### Database Connection Errors

```bash
# Wait for PostgreSQL to be ready
docker exec cep-postgres-dev pg_isready -U cepadmin -d cepcomunicacion

# Check PostgreSQL logs
docker logs cep-postgres-dev

# Restart PostgreSQL
docker compose -f docker-compose.dev.yml restart postgres
```

### Hot Reload Not Working

```bash
# Enable polling for Docker volumes (add to .env)
WATCHPACK_POLLING=true           # Next.js (both frontend and admin)

# Or run outside Docker for faster development
cd apps/web-next
pnpm dev --turbopack
```

### Permission Errors (Linux)

```bash
# Fix volume permissions
sudo chown -R $USER:$USER .

# Run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker
```

## Next Steps

- Read [WORKFLOW.md](./WORKFLOW.md) for development workflow
- Check [ARCHITECTURE.md](../infrastructure/ARCHITECTURE.md) for system design
- Review [CICD.md](../infrastructure/CICD.md) for deployment process
- Join team Slack/Discord for help

## Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Team Chat**: Slack/Discord
- **Email**: dev@cepcomunicacion.com
