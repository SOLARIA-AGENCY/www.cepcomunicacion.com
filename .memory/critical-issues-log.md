# Critical Issues Log

This file tracks critical technical issues that have occurred during project development, especially those that have occurred multiple times. The purpose is to prevent recurrence and serve as institutional memory for AI agents and human developers.

---

## 🔴 ISSUE-001: TailwindCSS v4 Configuration Error (CRITICAL)

**Status:** Resolved and Documented
**Occurrences:** 2
**Last Occurrence:** 2025-11-14
**Severity:** HIGH - Complete CSS styling failure

### Problem Description

Dashboard appears completely unstyled (white text on white background, no visual design system applied) despite:
- ✅ HTML rendering correctly with Tailwind classes in markup
- ✅ CSS file serving successfully (HTTP 200, ~1,500+ lines)
- ✅ CSS custom properties defined in `:root`
- ❌ **Utility classes NOT generated in compiled CSS**

### Root Cause

**TailwindCSS v4.x Breaking Change:** Color definitions MUST be placed directly in `theme.colors`, NOT in `theme.extend.colors`.

This differs from TailwindCSS v3.x where colors could be defined in either location. The v4 PostCSS plugin (`@tailwindcss/postcss`) only generates utility classes for colors defined at the top-level `theme.colors` object.

### Technical Details

**Incorrect Configuration (Causes Failure):**
```javascript
// apps/cms/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {  // ❌ WRONG LOCATION FOR V4
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ...
      },
    },
  },
}
```

**Correct Configuration:**
```javascript
// apps/cms/tailwind.config.js
module.exports = {
  theme: {
    colors: {  // ✅ CORRECT LOCATION FOR V4
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // ... all color definitions
    },
    extend: {
      // Only non-color extensions here (borderRadius, animations, etc.)
    },
  },
}
```

### Impact

**User Experience:**
- Dashboard completely unusable (no visual feedback, white on white)
- Forms invisible or unreadable
- Navigation hidden or unclickable
- No indication to users that it's a CSS issue (HTML renders fine)

**Development Time Lost:**
- **First Occurrence:** ~2 hours (investigation + fix + verification)
- **Second Occurrence:** ~1.5 hours (investigation + fix + documentation)
- **Total:** 3.5 hours wasted on same issue

### Occurrence History

#### Occurrence 1
**Date:** Unknown (prior to 2025-11-14)
**Context:** Initial TailwindCSS v4 migration
**Resolution:** Fixed but not documented sufficiently

#### Occurrence 2
**Date:** 2025-11-14
**Context:** After git stash recovery of dashboard work
**Resolution:** Fixed and comprehensively documented in multiple locations

### Resolution Steps

1. **Immediate Fix:**
   ```bash
   # 1. Edit tailwind.config.js - move colors to theme.colors
   # 2. Kill dev server
   pkill -f "next dev"
   # 3. Restart dev server
   cd apps/cms && pnpm dev
   # 4. Wait 30-60 seconds for CSS recompilation
   ```

2. **Verification:**
   ```bash
   # Check utility classes generated
   curl -s http://localhost:3000/_next/static/css/app/layout.css | grep -o "\.bg-background" | head -1
   # Should output: .bg-background

   # Visual verification
   open http://localhost:3000/ciclos
   # Should display with full styling (not white on white)
   ```

### Prevention Measures Implemented

✅ **Documentation Created:**
- `CLAUDE.md` - Updated with comprehensive TailwindCSS v4 section
- `agents.md` - New file created with critical configuration patterns
- `README.md` (root) - Added critical configuration warning
- `apps/cms/README.md` - Added TailwindCSS v4 setup notes
- `.memory/critical-issues-log.md` - This file

✅ **Verification Checklist Created:**
Before committing Tailwind configuration changes:
- [ ] Colors in `theme.colors` NOT `theme.extend.colors`
- [ ] PostCSS uses `@tailwindcss/postcss` plugin
- [ ] Utility classes verified in compiled CSS (grep test)
- [ ] Dashboard visual verification in browser

✅ **Git Hooks (Recommended but not yet implemented):**
- Pre-commit hook to validate tailwind.config.js structure
- Check for colors in wrong location
- Auto-run verification commands

### Related Files

**Configuration:**
- `apps/cms/tailwind.config.js` - Main Tailwind configuration
- `apps/cms/postcss.config.cjs` - PostCSS plugin configuration
- `apps/cms/app/globals.css` - CSS variables and Tailwind directives

**Documentation:**
- `CLAUDE.md` - Lines 615-747 (TailwindCSS v4 Configuration section)
- `agents.md` - Complete critical patterns document
- `README.md` - Lines 13-25 (Critical Configuration Notes)
- `apps/cms/README.md` - Lines 5-22 (Critical Configuration section)

### Lessons Learned

1. **Breaking Changes Matter:** Major version upgrades (v3→v4) require careful migration and documentation
2. **Document on First Occurrence:** First time we fixed this, we didn't document thoroughly enough
3. **Multiple Documentation Points:** Critical issues need documentation in:
   - Project-level docs (CLAUDE.md, agents.md)
   - README files (root and module-specific)
   - Memory logs (this file)
4. **Verification Scripts:** Need automated verification to prevent recurrence
5. **Git Stash Risk:** Stashed work may contain outdated configurations that reintroduce bugs

### Future Improvements

- [ ] Implement pre-commit git hook for tailwind.config.js validation
- [ ] Add automated E2E test that checks for CSS styling presence
- [ ] Create a "common mistakes" checklist in CONTRIBUTING.md
- [ ] Consider adding a linter rule for TailwindCSS config structure

---

## 🔴 ISSUE-002: Payload Admin CSS Served as `<script>` Tags (CRITICAL)

**Status:** Resolved (2025-12-07)  
**Occurrences:** 1 (P0)  
**Severity:** HIGH – Payload admin rendered unstyled due to blocked CSS

### Problem Description

When loading `apps/cms` Payload admin (`/admin`), the browser console showed `Refused to execute script from ".../_next/static/css/*.css" because its MIME type ('text/css') is not executable`.  
The Payload UI rendered without styles (white background, invisible forms) even though CSS files were emitted and reachable.

### Root Cause

`apps/cms/next.config.js` overrode `config.optimization.splitChunks` on the client build.  
This custom Webpack config forced CSS assets into the `rootMainFiles` JS bundle list. Next.js blindly emitted every entry in that array as `<script src="...">`, so `.css` files shipped twice: once as `<link>` and once as `<script>`. Browsers rejected executing CSS as JS, which stalled Payload's CSS hydration and produced a race condition where styles frequently failed to attach.

### Resolution

1. Removed the manual `config.optimization.splitChunks` override so Next.js can manage chunking/CSS manifests.  
   File: `apps/cms/next.config.js` (commit: remove custom splitChunks).
2. Rebuilt the CMS (`pnpm build` in `apps/cms`) to regenerate manifests.
3. Verified that `.next/build-manifest.json` now lists only JS files under `rootMainFiles`, while CSS assets live under the `css` arrays for each route.

### Verification Commands

```bash
cd apps/cms
pnpm build
cat .next/build-manifest.json | jq '.rootMainFiles'
# ✅ should list only *.js entries (no *.css)
```

Optional runtime check (requires server port access):

```bash
PORT=3002 pnpm start --port 3002 &
curl -s http://localhost:3002/admin | grep '<script[^>]*css'
# ✅ should output nothing
```

### Prevention

- Avoid overriding `config.optimization.splitChunks` unless mirroring Next.js defaults plus required tweaks.
- If custom Webpack optimizations are needed, snapshot the emitted manifests and ensure `.css` files stay inside the `css` arrays, not JS lists.
- Add a CI lint/check that fails if any entry in `.next/build-manifest.json.rootMainFiles` matches `*.css`.

### Related Files

- `apps/cms/next.config.js`
- `apps/cms/.next/build-manifest.json` (verification artifact)
- `apps/cms/.next/app-build-manifest.json`

### Follow-up Tasks

- [ ] Add automated test/CI script to ensure no `.css` entries appear inside `rootMainFiles`.
- [ ] Document this constraint inside `CLAUDE.md` / `agents.md` for future agents touching Webpack config.

---

## Issue Template (For Future Critical Issues)

```markdown
## 🔴 ISSUE-XXX: [Issue Title]

**Status:** [Active | Resolved | Monitoring]
**Occurrences:** [Number]
**Last Occurrence:** [Date]
**Severity:** [HIGH | MEDIUM | LOW]

### Problem Description
[Clear description of what went wrong from user/developer perspective]

### Root Cause
[Technical explanation of why it happened]

### Impact
[User experience impact and development time lost]

### Resolution Steps
[Step-by-step fix process]

### Prevention Measures
[What was done to prevent recurrence]

### Related Files
[List of affected configuration/code files]

### Lessons Learned
[Key takeaways for future development]
```

---

**Last Updated:** 2025-11-14
**Maintained By:** Development Team + AI Agents
