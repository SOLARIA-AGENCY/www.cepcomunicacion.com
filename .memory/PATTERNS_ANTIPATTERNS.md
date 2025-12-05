# Development Patterns & Anti-Patterns

**Last Updated**: 2025-11-23
**Context**: CEPComunicacion v2 - Next.js 15 + Payload CMS 3 + PostgreSQL

---

## 🚫 Anti-Patterns (What NOT to Do)

### 1. **Multiple Dev Servers Running Concurrently**

**Symptom**: Port conflicts, stale bundles served randomly
**Example**:
```bash
ps aux | grep "next dev"
# Shows 3 processes instead of 1
```

**Why It's Bad**:
- Each process may serve different bundle version
- Load balancer effect between stale/fresh bundles
- Impossible to know which version is being served

**Fix**:
```bash
# Always kill port before starting
lsof -ti:3002 | xargs kill -9
pnpm dev --port 3002
```

---

### 2. **Keeping Old Prototypes/Mockups in Active Codebase**

**Symptom**: Module resolution ambiguity, wrong file imported
**Example**:
```bash
find . -name "AppSidebar.tsx"
# Returns:
# ./design-dashboard-mockup/src/layouts/AppSidebar.tsx  (OLD)
# ./apps/cms/@payload-config/components/layout/AppSidebar.tsx  (NEW)
```

**Why It's Bad**:
- Bundler may cache import resolution to wrong file
- tsconfig paths can't disambiguate identical filenames
- Causes silent bugs when bundler picks old version

**Fix**:
```bash
# Immediately archive old code
mv design-dashboard-mockup legacy/frontend-html-prototypes/
```

---

### 3. **Incremental Cache Deletion**

**Symptom**: Partial cache clears leave residual corruption
**Example**:
```bash
# WRONG: Only deleting .next
rm -rf .next

# Problem: node_modules/.cache still has stale Webpack cache
```

**Why It's Bad**:
- `.next/` is output cache, `node_modules/.cache` is build cache
- Both must be cleared for full invalidation
- Leaving one causes mixed old/new state

**Fix**:
```bash
# CORRECT: Delete both caches
rm -rf .next node_modules/.cache
```

---

### 4. **Trusting Fast Refresh for Structural Changes**

**Symptom**: Component exports, structure, or paths changed but not reflected
**Example**:
```tsx
// Changed from:
export function AppSidebar() { ... }

// To:
export const AppSidebar = () => { ... }

// Fast Refresh may not detect this
```

**Why It's Bad**:
- Fast Refresh optimized for prop/state changes
- Export changes, component structure changes need full reload
- Creates illusion that code was updated (shows "Compiled") but actually stale

**Fix**:
```bash
# For structural changes, use production build
pnpm build && pnpm start
```

---

### 5. **Relying on Browser Cache Clearing**

**Symptom**: Hard refresh, incognito mode, new browser all show same stale content
**Example**:
```bash
# User tries Cmd+Shift+R, incognito, new browser
# All show old version

# Real problem: Server-side bundle cache
```

**Why It's Bad**:
- Browser cache is NOT the problem in dev mode
- Dev server serves bundles directly, browser caching is minimal
- Wastes time on wrong solution

**Fix**:
```bash
# Focus on server-side cache, not browser
rm -rf .next node_modules/.cache
```

---

## ✅ Best Practices (What TO Do)

### 1. **Safe Dev Server Restart Script**

**Create**: `scripts/dev-restart.sh`
```bash
#!/bin/bash
echo "🔄 Safe dev server restart..."

# 1. Kill existing processes
echo "🔪 Killing existing processes..."
lsof -ti:3002 | xargs kill -9 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null

# 2. Clear caches
echo "🧹 Clearing caches..."
rm -rf .next node_modules/.cache

# 3. Verify single process will start
sleep 2
RUNNING=$(ps aux | grep "next dev" | grep -v grep | wc -l)
if [ $RUNNING -gt 0 ]; then
  echo "⚠️  WARNING: $RUNNING processes still running"
  exit 1
fi

# 4. Start fresh
echo "✅ Starting fresh dev server..."
pnpm dev --port 3002
```

**Usage**:
```bash
chmod +x scripts/dev-restart.sh
./scripts/dev-restart.sh
```

---

### 2. **Production Build for Critical Verifications**

**When to Use**: After making structural component changes

**Process**:
```bash
# 1. Stop dev server
lsof -ti:3002 | xargs kill -9

# 2. Clean build
rm -rf .next
pnpm build

# 3. Start production server
pnpm start --port 3002

# 4. Verify changes
curl http://localhost:3002 | grep "YOUR_CHANGE"
```

**Why It Works**:
- Production builds have NO cache
- Every `pnpm build` is completely fresh
- Guaranteed to reflect current source code

---

### 3. **Pre-Flight Checklist Before UI Changes**

**Checklist**:
```markdown
Before starting UI work:
- [ ] Kill all dev servers: `lsof -ti:3002 | xargs kill -9`
- [ ] Clear caches: `rm -rf .next node_modules/.cache`
- [ ] Verify clean state: `ps aux | grep "next dev" | wc -l` → 0
- [ ] Archive old prototypes: `mv old-stuff legacy/`
- [ ] Clean git status: No untracked `.py`, `.sh`, `.md` files

After making changes:
- [ ] Verify in source: `grep "NEW_TEXT" path/to/file`
- [ ] Wait for compile: Look for "✓ Compiled" in terminal
- [ ] Verify in bundle: `grep "NEW_TEXT" .next/**/*.js`
- [ ] Test in browser: http://localhost:3002
- [ ] If stale: PRODUCTION BUILD (don't debug dev cache)
```

---

### 4. **File Organization Discipline**

**Structure**:
```
repo/
├── apps/
│   ├── cms/          # Active CMS application
│   └── web/          # Active frontend application
├── legacy/           # Archived code
│   ├── scripts/      # One-time scripts
│   ├── docs/         # Temporary documentation
│   ├── backups/      # File backups
│   └── prototypes/   # Old mockups
├── .memory/          # Learning logs, incidents
└── docs/             # Permanent documentation
```

**Rules**:
1. **No duplicate filenames** across `apps/` and `legacy/`
2. **Archive immediately** after prototype becomes obsolete
3. **No temporary files** in root (`.py`, `.sh`, `*.backup`)
4. **Single source of truth** for each component

---

### 5. **Monitoring Health Checks**

**Add to package.json**:
```json
{
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0 --port 3002",
    "dev:safe": "scripts/dev-restart.sh",
    "dev:verify": "ps aux | grep 'next dev' | grep -v grep | wc -l",
    "dev:clean": "rm -rf .next node_modules/.cache && pnpm dev"
  }
}
```

**Usage**:
```bash
# Before starting work
pnpm dev:verify
# Output: 0 (no processes running)

# Start safely
pnpm dev:safe

# Verify running
pnpm dev:verify
# Output: 1 (exactly one process)
```

---

## 📊 Pattern Summary

| Pattern | Category | Impact | Effort | Priority |
|---------|----------|--------|--------|----------|
| Kill port before start | Prevention | High | Low | P0 |
| Delete both caches | Prevention | High | Low | P0 |
| Archive old prototypes | Prevention | Medium | Low | P1 |
| Production build verify | Debugging | High | Medium | P0 |
| Pre-flight checklist | Prevention | High | Low | P1 |
| Safe restart script | Automation | High | Medium | P1 |
| Health check commands | Monitoring | Medium | Low | P2 |

---

## 🎯 Quick Reference

**Problem**: Changes not visible in browser
**Root Cause**: Dev server module cache corruption
**Quick Fix**: `pnpm build && pnpm start`
**Prevention**: Kill port + clear caches before starting

**Command Sequence**:
```bash
# 1. Clean state
lsof -ti:3002 | xargs kill -9
rm -rf .next node_modules/.cache

# 2. Verify clean
ps aux | grep "next dev" | grep -v grep
# Should output: nothing

# 3. Start fresh
pnpm dev --port 3002

# 4. Verify running
ps aux | grep "next dev" | grep -v grep | wc -l
# Should output: 1
```

---

**Next Steps**: Create automated tooling to enforce these patterns.
