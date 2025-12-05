#!/bin/bash
# Safe Dev Server Restart Script
# Created: 2025-11-23
# Purpose: Prevent zombie processes and cache corruption

set -e

echo "🔄 CEP CMS - Safe Dev Server Restart"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Navigate to CMS directory
cd "$(dirname "$0")/../apps/cms" || exit 1

# 1. Kill existing processes
echo "🔪 Step 1: Killing existing dev servers..."
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
pkill -9 -f "next dev" 2>/dev/null || true
pkill -9 -f "pnpm dev" 2>/dev/null || true
sleep 2

# 2. Verify all processes killed
RUNNING=$(ps aux | grep -E "next dev|pnpm dev" | grep -v grep | wc -l | tr -d ' ')
if [ "$RUNNING" -gt 0 ]; then
  echo "⚠️  WARNING: $RUNNING processes still running!"
  echo "    Manual intervention required:"
  echo "    ps aux | grep -E 'next dev|pnpm dev'"
  exit 1
fi
echo "✅ All processes killed"

# 3. Clear caches
echo ""
echo "🧹 Step 2: Clearing build caches..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅ Caches cleared"

# 4. Verify clean state
echo ""
echo "🔍 Step 3: Verifying clean state..."
if [ -d ".next" ]; then
  echo "⚠️  WARNING: .next directory still exists!"
  exit 1
fi
echo "✅ Clean state verified"

# 5. Start fresh dev server
echo ""
echo "🚀 Step 4: Starting fresh dev server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Server will be available at:"
echo "   Local:   http://localhost:3002"
echo "   Network: http://0.0.0.0:3002"
echo ""

# Start server in background and capture PID
pnpm dev --port 3002 &
DEV_PID=$!

# Wait for server to start
sleep 3

# Verify server is running
if ps -p $DEV_PID > /dev/null; then
  echo "✅ Dev server started successfully (PID: $DEV_PID)"
  echo ""
  echo "ℹ️  To stop the server:"
  echo "   kill $DEV_PID"
  echo "   or"
  echo "   lsof -ti:3002 | xargs kill -9"
else
  echo "❌ Failed to start dev server!"
  exit 1
fi
