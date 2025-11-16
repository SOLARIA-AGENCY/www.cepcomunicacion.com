#!/bin/bash

# CEPComunicacion v2 - Database Reset Script
# Completely resets the development database to a clean state
# WARNING: This will DELETE ALL DATA in the development database

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "⚠️  Database Reset Script"
echo "========================"
echo ""
echo -e "${RED}WARNING: This will DELETE ALL DATA in your development database!${NC}"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " -r
echo

if [[ ! $REPLY == "yes" ]]; then
    echo "Aborted."
    exit 0
fi

echo -e "${YELLOW}Starting database reset...${NC}"
echo ""

# Step 1: Stop and remove database container
echo "Step 1: Stopping PostgreSQL container..."
docker compose -f docker-compose.dev.yml stop postgres || true
docker compose -f docker-compose.dev.yml rm -f postgres || true

# Step 2: Remove database volume
echo "Step 2: Removing database volume..."
docker volume rm cepcomunicacion-v2_postgres-data-dev 2>/dev/null || true

# Step 3: Start fresh PostgreSQL container
echo "Step 3: Starting fresh PostgreSQL container..."
docker compose -f docker-compose.dev.yml up -d postgres

# Step 4: Wait for PostgreSQL to be ready
echo "Step 4: Waiting for PostgreSQL to be ready..."
sleep 5

MAX_RETRIES=30
RETRY_COUNT=0

until docker exec cep-postgres-dev pg_isready -U cepadmin -d cepcomunicacion &> /dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo -e "${RED}Error: PostgreSQL did not become ready in time${NC}"
        exit 1
    fi
    echo -n "."
    sleep 2
done

echo ""
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Step 5: Run migrations
echo "Step 5: Running database migrations..."
if [ -f "infra/postgres/apply_migrations.sh" ]; then
    ./infra/postgres/apply_migrations.sh || echo -e "${YELLOW}⚠ Migration failed. Run manually: pnpm db:migrate${NC}"
else
    echo -e "${YELLOW}⚠ Migration script not found at infra/postgres/apply_migrations.sh${NC}"
    echo "Creating database schema manually..."

    # Check if init SQL exists
    if [ -f "infra/postgres/init/001_init.sql" ]; then
        docker exec -i cep-postgres-dev psql -U cepadmin -d cepcomunicacion < infra/postgres/init/001_init.sql
        echo -e "${GREEN}✓ Schema created from init script${NC}"
    else
        echo -e "${YELLOW}⚠ No init script found. Database is empty.${NC}"
    fi
fi

# Step 6: Seed database (optional)
echo "Step 6: Seeding database..."
read -p "Do you want to seed the database with sample data? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "infra/postgres/seeds/001_initial_data.sql" ]; then
        echo "Loading seed data..."
        docker exec -i cep-postgres-dev psql -U cepadmin -d cepcomunicacion < infra/postgres/seeds/001_initial_data.sql
        echo -e "${GREEN}✓ Database seeded successfully${NC}"
    else
        echo -e "${YELLOW}⚠ Seed file not found at infra/postgres/seeds/001_initial_data.sql${NC}"
    fi
else
    echo "Skipping database seeding"
fi

# Step 7: Restart CMS to reload schema
echo "Step 7: Restarting CMS to reload schema..."
docker compose -f docker-compose.dev.yml restart cms 2>/dev/null || echo "CMS not running"

# Step 8: Verify connection
echo "Step 8: Verifying database connection..."
TABLES=$(docker exec cep-postgres-dev psql -U cepadmin -d cepcomunicacion -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo -e "${GREEN}✓ Database has $TABLES tables${NC}"

echo ""
echo "========================"
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo "========================"
echo ""
echo "You can now connect to the fresh database:"
echo "  Host:     localhost"
echo "  Port:     5432"
echo "  User:     cepadmin"
echo "  Password: devpassword123"
echo "  Database: cepcomunicacion"
echo ""
echo "Or use Docker exec:"
echo "  docker exec -it cep-postgres-dev psql -U cepadmin -d cepcomunicacion"
echo ""
