# Development Methodology - CEPComunicacion v2

## Core Philosophy: Test-Driven Development (TDD)

**MANDATORY FOR ALL DEVELOPMENT**

Every feature, bug fix, and refactoring MUST follow the RED-GREEN-REFACTOR cycle:

1. **RED ❌** - Write a failing test first
2. **GREEN ✅** - Write minimum code to make it pass
3. **REFACTOR 🔄** - Improve code while keeping tests green

## Test-First Development Principles

### Rule 1: No Production Code Without a Test
Never write production code without first writing a failing test that requires that code.

### Rule 2: Write the Simplest Test
Write only enough of a test to demonstrate a failure (compilation failure counts).

### Rule 3: Write the Simplest Code
Write only enough production code to pass the currently failing test.

### Rule 4: Refactor Constantly
Once tests pass, refactor to improve design while keeping all tests green.

## Test Pyramid Strategy

Maintain this distribution of tests:

- **60% Unit Tests** - Fast, isolated, test single functions/components
- **30% Integration Tests** - Test interactions between modules
- **10% E2E Tests** - Test complete user flows

### Coverage Thresholds (MANDATORY)

```json
{
  "lines": 80,
  "functions": 80,
  "branches": 75,
  "statements": 80
}
```

## Agent-Based Development Workflow

### Specialized Agents

Use these agents for their specific domains:

1. **postgresql-schema-architect** - Database schema, migrations, indexes, query optimization
2. **payload-cms-architect** - Collections, hooks, access control, REST/GraphQL APIs
3. **react-frontend-dev** - React components, pages, routing, UI/UX, performance
4. **bullmq-worker-automation** - Background jobs, queues, external service integrations
5. **security-gdpr-compliance** - Security audits, GDPR compliance, authentication, rate limiting
6. **infra-devops-architect** - Docker, Nginx, backups, deployments, monitoring

### Agent Assignment Rules

- **Always identify** the most adequate agent for each task
- **One agent per domain** - Don't mix concerns
- **Sequential execution** - Complete one agent's work before moving to the next
- **Test before handoff** - Each agent must pass all tests before next agent starts

## TDD Workflow Example

### Example: Creating a New Collection

#### Step 1: RED ❌ - Write Failing Test

```typescript
// apps/cms/src/collections/Courses/Courses.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { request } from 'supertest';
import { app } from '../../server';

describe('POST /api/courses', () => {
  it('should create a course with required fields', async () => {
    const courseData = {
      slug: 'marketing-digital',
      title: 'Marketing Digital Avanzado',
      duration: 60,
      modality: 'presencial',
    };

    const response = await request(app)
      .post('/api/courses')
      .send(courseData)
      .expect(201);

    expect(response.body.doc).toHaveProperty('id');
    expect(response.body.doc.slug).toBe('marketing-digital');
  });

  it('should reject course without required fields', async () => {
    await request(app)
      .post('/api/courses')
      .send({ slug: 'test' })
      .expect(400);
  });
});
```

**Run test:** `pnpm test:cms` → **FAILS** ❌ (collection doesn't exist)

#### Step 2: GREEN ✅ - Minimum Code to Pass

```typescript
// apps/cms/src/collections/Courses/Courses.ts
import { CollectionConfig } from 'payload/types';

export const Courses: CollectionConfig = {
  slug: 'courses',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
    },
    {
      name: 'modality',
      type: 'select',
      options: ['presencial', 'online', 'hibrido'],
      required: true,
    },
  ],
};
```

**Run test:** `pnpm test:cms` → **PASSES** ✅

#### Step 3: REFACTOR 🔄 - Improve While Tests Stay Green

```typescript
// Add validation and better structure
import { CollectionConfig } from 'payload/types';
import { z } from 'zod';

const courseSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(10).max(200),
  duration: z.number().min(1).max(500),
  modality: z.enum(['presencial', 'online', 'hibrido']),
});

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'modality', 'duration', 'createdAt'],
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (val: string) => {
        try {
          courseSchema.shape.slug.parse(val);
          return true;
        } catch (e) {
          return e.errors[0].message;
        }
      },
    },
    // ... rest of fields with validation
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
        return data;
      },
    ],
  },
};
```

**Run test:** `pnpm test:cms` → **STILL PASSES** ✅

**Run all tests:** `pnpm test` → **ALL PASS** ✅

**Commit:** `git commit -m "feat(cms): add Courses collection with validation"`

## Commit Conventions

Use conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **refactor** - Code change that neither fixes a bug nor adds a feature
- **test** - Adding or updating tests
- **docs** - Documentation only
- **chore** - Maintenance (deps, config, etc.)
- **perf** - Performance improvement

### Scopes

- **cms** - Payload CMS backend
- **web** - React frontend
- **worker** - BullMQ workers
- **infra** - Infrastructure/Docker
- **db** - Database schema
- **shared** - Shared packages

### Examples

```bash
feat(cms): add Courses collection with slug validation
fix(web): correct course filter by cycle taxonomy
test(worker): add integration tests for lead.created job
refactor(shared): extract validation schemas to @cepcomunicacion/types
docs(infra): update VPS migration guide with new backup strategy
```

## Code Review Checklist

Before marking a task as complete, verify:

- [ ] **Tests written first** and were initially failing
- [ ] **All tests pass** (`pnpm test` shows 100% pass rate)
- [ ] **Coverage thresholds met** (80%+ for all metrics)
- [ ] **No TypeScript errors** (`pnpm typecheck` passes)
- [ ] **Linting passes** (`pnpm lint` passes)
- [ ] **Code follows SOLID principles**
- [ ] **Validation added** (frontend + backend + database)
- [ ] **Error handling implemented** (try/catch, error boundaries)
- [ ] **Security reviewed** (no SQL injection, XSS, CSRF vulnerabilities)
- [ ] **GDPR compliant** (if handling personal data)
- [ ] **Accessible** (ARIA labels, keyboard navigation if frontend)
- [ ] **Documented** (JSDoc for complex functions)
- [ ] **Atomic commit** with conventional commit message

## Testing Stack Configuration

### Unit Tests (Vitest)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
```

### Integration Tests (Supertest)

```typescript
// apps/cms/src/collections/Courses/Courses.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { request } from 'supertest';
import { app, payload } from '../../server';

describe('Courses Collection Integration', () => {
  beforeAll(async () => {
    await payload.db.connect();
  });

  afterAll(async () => {
    await payload.db.collections.courses.deleteMany({});
    await payload.db.disconnect();
  });

  it('should create, read, update, delete course', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/courses')
      .send({ slug: 'test', title: 'Test Course', duration: 60, modality: 'online' })
      .expect(201);
    
    const courseId = createRes.body.doc.id;

    // Read
    await request(app)
      .get(`/api/courses/${courseId}`)
      .expect(200);

    // Update
    await request(app)
      .patch(`/api/courses/${courseId}`)
      .send({ title: 'Updated Title' })
      .expect(200);

    // Delete
    await request(app)
      .delete(`/api/courses/${courseId}`)
      .expect(200);
  });
});
```

### E2E Tests (Playwright)

```typescript
// apps/web/e2e/courses.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Course Listing Page', () => {
  test('should filter courses by cycle', async ({ page }) => {
    await page.goto('/cursos');
    
    // Wait for courses to load
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount(10);
    
    // Filter by "Grado Superior"
    await page.click('[data-testid="filter-cycle-grado-superior"]');
    
    // Verify filtered results
    await expect(page.locator('[data-testid="course-card"]')).toHaveCount(5);
    await expect(page.locator('text=Grado Superior')).toBeVisible();
  });

  test('should navigate to course detail', async ({ page }) => {
    await page.goto('/cursos');
    await page.click('[data-testid="course-card"]:first-child');
    
    // Verify detail page
    await expect(page).toHaveURL(/\/cursos\/[a-z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## TaskMaster Integration

Use TodoWrite tool to track tasks, NOT manual TODO lists:

```typescript
// Before starting a feature
TodoWrite({
  todos: [
    { content: "Write failing tests for Courses collection", status: "in_progress", activeForm: "Writing tests" },
    { content: "Implement Courses collection", status: "pending", activeForm: "Implementing collection" },
    { content: "Add validation schemas", status: "pending", activeForm: "Adding validation" },
    { content: "Write integration tests", status: "pending", activeForm: "Writing integration tests" },
    { content: "Test coverage verification", status: "pending", activeForm: "Verifying coverage" },
  ]
});

// After completing each task
TodoWrite({
  todos: [
    { content: "Write failing tests for Courses collection", status: "completed", activeForm: "Writing tests" },
    { content: "Implement Courses collection", status: "in_progress", activeForm: "Implementing collection" },
    // ...
  ]
});
```

## Local Development Setup

### Live Reload Configuration

All services support hot reload:

```bash
# Start all services with hot reload
docker compose up -d

# Watch logs
docker compose logs -f cms web worker-automation

# Frontend (Vite) - Hot Module Replacement
# http://localhost:3000

# Backend (Payload) - Nodemon auto-restart
# http://localhost:3001

# BullBoard - Queue monitoring
# http://localhost:3002
```

### Development Workflow

1. **Start Docker services**: `docker compose up -d`
2. **Install dependencies**: `pnpm install`
3. **Run tests in watch mode**: `pnpm test:watch`
4. **Start development servers**: `pnpm dev` (runs all apps in parallel)
5. **Make changes** → **Tests auto-run** → **Browser auto-reloads**

### Pre-Commit Checks

Every commit triggers automatic checks:

```bash
#!/bin/sh
# .husky/pre-commit

pnpm typecheck || exit 1
pnpm lint || exit 1
pnpm test || exit 1
```

## Atomic Commits Rule

**Each commit must:**

1. **Pass all tests** (100% pass rate)
2. **Pass TypeScript check** (zero errors)
3. **Pass linting** (zero errors)
4. **Have a single responsibility** (one feature/fix per commit)
5. **Be deployable** (don't break main branch)

**Never commit:**

- Failing tests
- TypeScript errors
- Linting errors
- Half-implemented features
- Commented-out code
- console.log statements
- Secrets or credentials

## Example Full TDD Cycle

### Feature: Lead Form with Email Validation

#### 1. RED ❌ - Write Failing Tests

```typescript
// apps/web/src/components/LeadForm/LeadForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LeadForm } from './LeadForm';

describe('LeadForm', () => {
  it('should show error for invalid email', async () => {
    render(<LeadForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/email no válido/i)).toBeInTheDocument();
    });
  });

  it('should submit valid form data', async () => {
    const onSubmit = vi.fn();
    render(<LeadForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Juan Pérez' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '612345678' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '612345678',
      });
    });
  });
});
```

**Run:** `pnpm test:web` → **FAILS** ❌ (component doesn't exist)

#### 2. GREEN ✅ - Minimum Implementation

```typescript
// apps/web/src/components/LeadForm/LeadForm.tsx
import { useState } from 'react';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email('Email no válido'),
  phone: z.string().regex(/^[6-7]\d{8}$/, 'Teléfono no válido'),
});

export function LeadForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBlur = (field: string, value: string) => {
    try {
      leadSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: '' }));
    } catch (e) {
      setErrors(prev => ({ ...prev, [field]: e.errors[0].message }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };
    
    try {
      leadSchema.parse(data);
      onSubmit?.(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nombre</label>
      <input id="name" name="name" />
      
      <label htmlFor="email">Email</label>
      <input id="email" name="email" onBlur={(e) => handleBlur('email', e.target.value)} />
      {errors.email && <span>{errors.email}</span>}
      
      <label htmlFor="phone">Teléfono</label>
      <input id="phone" name="phone" onBlur={(e) => handleBlur('phone', e.target.value)} />
      {errors.phone && <span>{errors.phone}</span>}
      
      <button type="submit">Enviar</button>
    </form>
  );
}
```

**Run:** `pnpm test:web` → **PASSES** ✅

#### 3. REFACTOR 🔄 - Improve Design

```typescript
// Extract validation to shared package
// packages/validation/src/schemas/lead.schema.ts
export const leadSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email no válido'),
  phone: z.string().regex(/^[6-7]\d{8}$/, 'Teléfono debe ser válido (9 dígitos, empieza con 6 o 7)'),
  gdprConsent: z.boolean().refine(val => val === true, 'Debe aceptar la política de privacidad'),
});

// Improve component with better UX
// apps/web/src/components/LeadForm/LeadForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema } from '@cepcomunicacion/validation';

export function LeadForm({ onSubmit }: LeadFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(leadSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>
      
      {/* ... similar for email, phone ... */}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
      </button>
    </form>
  );
}
```

**Run:** `pnpm test` → **ALL TESTS PASS** ✅

**Commit:**
```bash
git add .
git commit -m "feat(web): add LeadForm with validation and accessibility

- Add Zod schema for lead validation
- Implement form with react-hook-form
- Add ARIA labels for accessibility
- Extract validation to shared package
- Add comprehensive unit tests

Test coverage: 95% (exceeds 80% threshold)"
```

---

## Summary

**MANDATORY RULES:**

1. ✅ **Test-First Always** - No code without failing test first
2. ✅ **RED-GREEN-REFACTOR** - Follow the cycle religiously
3. ✅ **80% Coverage Minimum** - No exceptions
4. ✅ **Agent-Based Development** - Use specialized agents
5. ✅ **Atomic Commits** - Each commit passes all checks
6. ✅ **Live Development** - Hot reload always enabled
7. ✅ **TaskMaster Integration** - Use TodoWrite, not manual TODOs

**Before marking any task complete:**

- [ ] All tests pass (100%)
- [ ] Coverage meets thresholds (80%+)
- [ ] TypeScript check passes (zero errors)
- [ ] Linting passes (zero errors)
- [ ] Code reviewed against checklist
- [ ] Commit follows conventions
- [ ] Changes tested in browser/API

**Development is not complete until ALL of the above are verified.**
