#!/bin/bash

# Quick verification script to check Vite cleanup status
# Run this after executing cleanup-vite.sh to verify all changes

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "================================================"
echo "Vite Cleanup Verification"
echo "================================================"
echo ""

# Check 1: apps/web directory
echo -n "1. Checking apps/web directory... "
if [ -d "apps/web" ]; then
    echo -e "${RED}FAIL${NC} - Directory still exists"
    echo "   Run: ./scripts/cleanup-vite.sh"
else
    echo -e "${GREEN}PASS${NC} - Directory removed"
fi

# Check 2: VITE_ in docker-compose files
echo -n "2. Checking docker-compose files for VITE_... "
VITE_DOCKER=$(grep -r "VITE_" docker-compose*.yml 2>/dev/null | wc -l)
if [ "$VITE_DOCKER" -eq 0 ]; then
    echo -e "${GREEN}PASS${NC} - No VITE_ variables found"
else
    echo -e "${RED}FAIL${NC} - Found $VITE_DOCKER occurrences"
    grep -n "VITE_" docker-compose*.yml 2>/dev/null | head -5
fi

# Check 3: VITE_ in .env files
echo -n "3. Checking .env files for VITE_... "
VITE_ENV=$(find . -name ".env*" -not -path "*/node_modules/*" -exec grep -l "VITE_" {} \; 2>/dev/null | wc -l)
if [ "$VITE_ENV" -eq 0 ]; then
    echo -e "${GREEN}PASS${NC} - No VITE_ variables found"
else
    echo -e "${YELLOW}WARN${NC} - Found in $VITE_ENV files (check manually)"
    find . -name ".env*" -not -path "*/node_modules/*" -exec grep -l "VITE_" {} \; 2>/dev/null
fi

# Check 4: Correct app references
echo -n "4. Checking docker-compose references apps/web-next... "
WEB_NEXT_REF=$(grep -c "apps/web-next" docker-compose.dev.yml 2>/dev/null || echo 0)
if [ "$WEB_NEXT_REF" -gt 0 ]; then
    echo -e "${GREEN}PASS${NC} - Found $WEB_NEXT_REF references"
else
    echo -e "${RED}FAIL${NC} - No apps/web-next references found"
fi

# Check 5: Vitest files preserved
echo -n "5. Checking Vitest config files preserved... "
VITEST_CONFIGS=$(find apps -name "vitest.config.*" -not -path "*/node_modules/*" 2>/dev/null | wc -l)
if [ "$VITEST_CONFIGS" -gt 0 ]; then
    echo -e "${GREEN}PASS${NC} - Found $VITEST_CONFIGS files"
else
    echo -e "${YELLOW}WARN${NC} - No vitest.config files found (may be expected)"
fi

# Check 6: Next.js package.json
echo -n "6. Checking apps/web-next/package.json exists... "
if [ -f "apps/web-next/package.json" ]; then
    NEXT_VERSION=$(grep -o '"next": "[^"]*"' apps/web-next/package.json | cut -d'"' -f4)
    echo -e "${GREEN}PASS${NC} - Next.js $NEXT_VERSION"
else
    echo -e "${RED}FAIL${NC} - File not found"
fi

echo ""
echo "================================================"
echo "Verification Complete"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Review VITE_CLEANUP_SUMMARY.md for full details"
echo "2. Test local development: pnpm dev:docker"
echo "3. Update specification documents (future task)"
echo ""
