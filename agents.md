# Agent Configuration and Critical Patterns

This document contains critical configuration patterns and known issues that AI agents (Claude Code, GitHub Copilot, etc.) should be aware of when working on this project.

---

## ⚠️ CRITICAL: TailwindCSS v4 Configuration

**ISSUE HISTORY:** This configuration error has occurred **TWICE** causing complete CSS styling failure.

### Problem Description

When using TailwindCSS v4.x, utility classes like `.bg-background`, `.text-foreground`, `.bg-card`, etc. are **NOT generated** if colors are incorrectly placed in `theme.extend.colors` instead of `theme.colors`.

**Symptoms:**
- ✅ HTML renders with Tailwind classes in markup
- ✅ CSS file serves successfully (200 OK)
- ✅ CSS variables defined in `:root`
- ❌ Utility classes NOT present in compiled CSS
- ❌ Dashboard appears completely unstyled (white text on white background)
- ❌ Searching compiled CSS for `.bg-background` returns 0 results

### Root Cause

**TailwindCSS v4.x Breaking Change:** Colors MUST be defined directly in `theme.colors`, NOT in `theme.extend.colors`.

This is different from Tailwind v3.x where colors could be in either location.

### ✅ CORRECT Configuration

**File:** `apps/cms/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './@payload-config/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {  // ✅ CORRECT - Colors at theme level
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      sidebar: {
        DEFAULT: "hsl(var(--sidebar))",
        foreground: "hsl(var(--sidebar-foreground))",
        primary: "hsl(var(--sidebar-primary))",
        "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        accent: "hsl(var(--sidebar-accent))",
        "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        border: "hsl(var(--sidebar-border))",
        ring: "hsl(var(--sidebar-ring))",
      },
    },
    extend: {  // ❌ DO NOT PUT COLORS HERE
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**File:** `apps/cms/postcss.config.cjs`

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ Required for TailwindCSS v4
    autoprefixer: {},
  },
}
```

**File:** `apps/cms/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 97%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar: 0 0% 100%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... additional dark mode variables ... */
  }
}
```

### ❌ INCORRECT Configuration (Causes Failure)

```javascript
// ❌ WRONG - This will NOT generate utility classes in v4
module.exports = {
  theme: {
    extend: {
      colors: {  // ❌ Colors in extend - WILL NOT WORK
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ...
      },
    },
  },
}
```

### Verification Commands

After fixing configuration, verify utility classes are generated:

```bash
# 1. Kill the dev server
pkill -f "next dev"

# 2. Restart dev server
cd apps/cms && pnpm dev

# 3. Wait for compilation (30-60 seconds)

# 4. Verify utility classes exist in compiled CSS
curl -s http://localhost:3000/_next/static/css/app/layout.css | grep -o "\.bg-background" | head -1
# Should output: .bg-background

curl -s http://localhost:3000/_next/static/css/app/layout.css | grep -o "\.text-foreground" | head -1
# Should output: .text-foreground

# 5. Test dashboard in browser
open http://localhost:3000/ciclos
# Should display with proper styling (not white on white)
```

### Immediate Solution (If Issue Occurs)

1. **Open** `apps/cms/tailwind.config.js`
2. **Move** all color definitions from `theme.extend.colors` to `theme.colors`
3. **Kill** dev server: `pkill -f "next dev"`
4. **Restart** dev server: `cd apps/cms && pnpm dev`
5. **Wait** 30-60 seconds for CSS recompilation
6. **Verify** utility classes generated (see commands above)

### Prevention Checklist

Before committing any Tailwind configuration changes:

- [ ] Colors are in `theme.colors` NOT `theme.extend.colors`
- [ ] PostCSS config uses `@tailwindcss/postcss` (not `tailwindcss` directly)
- [ ] `@tailwindcss/postcss` version is `^4.x` in package.json
- [ ] Utility classes are generated in compiled CSS (test with grep)
- [ ] Dashboard renders with proper styling in browser

---

## Additional Agent Patterns

(To be added as patterns are discovered)

---

## Project Context (Updated 2025-11-23)

**Current Status:** Phase F1-F2 Complete - Production CMS Deployed
**Stack:** Next.js 15.2.3 + Payload CMS 3.62.1 + PostgreSQL 16.10 + Redis 7.0.15
**Production:** http://46.62.222.138 (Hetzner VPS srv943151)
**Process Manager:** PM2 6.0.13 (app: cepcomunicacion-cms)

**Active Development:**
- Custom dashboard with Cursos, Ciclos, Convocatorias, Sedes
- Authentication with RBAC (5 roles)
- PostgreSQL schema with 27+ tables
- BullMQ + Redis infrastructure ready

**See CLAUDE.md for complete project documentation.**

---

**Last Updated:** 2025-11-23
**TailwindCSS Issue Occurrences:** 2
**Status:** Documented and verified
