#!/bin/bash

# CEPComunicacion v2 - Vite Cleanup Script
# Removes old Vite application artifacts and references
# Run this script to clean up deprecated Vite-based frontend

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

heading() {
    echo -e "${BLUE}$1${NC}"
}

echo "================================================"
heading "CEPComunicacion v2 - Vite Cleanup"
echo "================================================"
echo ""
echo "This script will remove all Vite-related artifacts"
echo "from the repository to avoid confusion."
echo ""
echo "Current stack:"
echo "  - Frontend: Next.js 16 (apps/web-next/)"
echo "  - Admin: Next.js 15 (apps/admin/)"
echo "  - CMS: Payload CMS 3.62.1 (apps/cms/)"
echo ""
echo "Deprecated (will be removed):"
echo "  - Old Vite frontend (apps/web/)"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with cleanup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    warn "Cleanup cancelled by user"
    exit 0
fi

echo ""
heading "Step 1: Backing up current state..."
echo "-----------------------------------"

# Create backup directory with timestamp
BACKUP_DIR=".backups/vite-cleanup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup apps/web directory if it exists
if [ -d "apps/web" ]; then
    info "Backing up apps/web to $BACKUP_DIR/apps-web.tar.gz"
    tar -czf "$BACKUP_DIR/apps-web.tar.gz" apps/web/ 2>/dev/null || warn "Backup failed (directory may be empty)"
else
    info "apps/web directory not found (already removed?)"
fi

echo ""
heading "Step 2: Removing old Vite application..."
echo "-----------------------------------"

# Remove apps/web directory
if [ -d "apps/web" ]; then
    info "Removing apps/web directory..."
    rm -rf apps/web
    info "apps/web removed successfully"
else
    warn "apps/web directory not found (already removed)"
fi

echo ""
heading "Step 3: Searching for Vite config files..."
echo "-----------------------------------"

# Find and remove vite.config.* files (but NOT vitest.config.* - that's the testing framework)
VITE_CONFIGS=$(find . -name "vite.config.*" -not -path "*/node_modules/*" -type f 2>/dev/null || true)

if [ -z "$VITE_CONFIGS" ]; then
    info "No standalone vite.config.* files found"
else
    echo "Found Vite config files:"
    echo "$VITE_CONFIGS"
    echo ""

    # Backup and remove each file
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            # Backup individual file
            BACKUP_FILE="$BACKUP_DIR/$(echo $file | sed 's/\//-/g')"
            cp "$file" "$BACKUP_FILE" 2>/dev/null || true
            info "Backed up: $file"

            # Remove file
            rm "$file"
            info "Removed: $file"
        fi
    done <<< "$VITE_CONFIGS"
fi

echo ""
heading "Step 4: Removing .vite cache directories..."
echo "-----------------------------------"

# Find and remove .vite directories
VITE_CACHE=$(find . -name ".vite" -type d -not -path "*/node_modules/*" 2>/dev/null || true)

if [ -z "$VITE_CACHE" ]; then
    info "No .vite cache directories found"
else
    echo "Found .vite cache directories:"
    echo "$VITE_CACHE"
    echo ""

    while IFS= read -r dir; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            info "Removed: $dir"
        fi
    done <<< "$VITE_CACHE"
fi

echo ""
heading "Step 5: Verification..."
echo "-----------------------------------"

# List remaining apps
echo "Remaining applications:"
ls -la apps/ | grep -E "^d" | grep -v "^\.$" | grep -v "^\.\.$" | awk '{print "  - " $NF}'

echo ""

# Check for any remaining VITE_ references (excluding node_modules and backups)
VITE_REFS=$(grep -r "VITE_" --include="*.yml" --include="*.yaml" --include="*.sh" --include="*.md" --exclude-dir="node_modules" --exclude-dir=".backups" --exclude-dir=".git" . 2>/dev/null || true)

if [ -z "$VITE_REFS" ]; then
    info "No VITE_ environment variable references found"
else
    warn "Found remaining VITE_ references (may need manual cleanup):"
    echo "$VITE_REFS"
    echo ""
    echo "These should be changed to NEXT_PUBLIC_* variables"
fi

echo ""
heading "Step 6: Checking for vitest files (should NOT be removed)..."
echo "-----------------------------------"

# Verify Vitest files still exist (these are for testing, not Vite build tool)
VITEST_CONFIGS=$(find . -name "vitest.config.*" -not -path "*/node_modules/*" -type f 2>/dev/null | wc -l)
VITEST_SETUPS=$(find . -name "vitest.setup.*" -not -path "*/node_modules/*" -type f 2>/dev/null | wc -l)

info "Found $VITEST_CONFIGS vitest.config.* files (kept - these are for testing)"
info "Found $VITEST_SETUPS vitest.setup.* files (kept - these are for testing)"

echo ""
echo "================================================"
heading "✅ Vite cleanup complete!"
echo "================================================"
echo ""
echo "Summary:"
echo "  - Removed: apps/web directory"
echo "  - Removed: vite.config.* files (if any)"
echo "  - Removed: .vite cache directories"
echo "  - Kept: vitest.* files (testing framework)"
echo "  - Backup: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "  1. Review remaining VITE_ references above (if any)"
echo "  2. Update environment variables to use NEXT_PUBLIC_*"
echo "  3. Update documentation to reflect Next.js 16 stack"
echo "  4. Test local development: pnpm dev"
echo ""
echo "If you need to restore:"
echo "  tar -xzf $BACKUP_DIR/apps-web.tar.gz"
echo ""
