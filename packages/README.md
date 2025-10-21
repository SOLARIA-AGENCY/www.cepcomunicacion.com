# Shared Packages

This directory contains shared code used across multiple applications in the monorepo.

## Structure

```
packages/
├── database/    # Drizzle ORM schemas and database client
├── types/       # Shared TypeScript types and interfaces
├── ui/          # Shared UI components (React)
└── utils/       # Shared utility functions
```

## Packages

### Database (`/packages/database/`)
**Status:** Not yet created
**Purpose:** Database layer for all applications

**Contents:**
- Drizzle ORM schema definitions
- Database client configuration
- Migration scripts
- Seed data utilities
- Query helpers

**Used by:** api, admin (indirectly)

### Types (`/packages/types/`)
**Status:** Not yet created
**Purpose:** Shared TypeScript type definitions

**Contents:**
- Entity interfaces
- API request/response types
- Zod schemas for validation
- Enum definitions
- Utility types

**Used by:** api, web, admin

### UI (`/packages/ui/`)
**Status:** Not yet created
**Purpose:** Shared React components

**Contents:**
- Base UI components (shadcn/ui)
- Custom business components
- Form components
- Layout components
- Theme configuration

**Used by:** web, admin

### Utils (`/packages/utils/`)
**Status:** Not yet created
**Purpose:** Shared utility functions

**Contents:**
- Date/time utilities
- String formatting
- Validation helpers
- Currency formatting
- Error handling
- Constants

**Used by:** api, web, admin

## Development Guidelines

### Creating a New Package

1. Create directory in `/packages/`
2. Initialize with `package.json`
3. Add TypeScript configuration
4. Export from `index.ts`
5. Add to Turborepo pipeline

### Package Structure

```
package-name/
├── src/
│   ├── index.ts       # Main exports
│   └── ...            # Source files
├── package.json       # Package configuration
├── tsconfig.json      # TypeScript config
└── README.md          # Package documentation
```

### Naming Convention

- Use kebab-case for directory names
- Use PascalCase for component names
- Use camelCase for utilities
- Prefix with `@cepcomunicacion/` in package.json

### Dependencies

- Keep external dependencies minimal
- Prefer peer dependencies for React/TypeScript
- Document why each dependency is needed
- Regularly audit and update

## Best Practices

1. **Single Responsibility:** Each package should have a clear, focused purpose
2. **No Application Logic:** Packages contain reusable code only
3. **Type Safety:** All packages must be fully typed
4. **Documentation:** Every export should be documented
5. **Testing:** Packages should have unit tests
6. **Versioning:** Use semantic versioning
7. **Breaking Changes:** Document in CHANGELOG.md

## Usage Example

```typescript
// In an application
import { db } from '@cepcomunicacion/database';
import { User } from '@cepcomunicacion/types';
import { Button } from '@cepcomunicacion/ui';
import { formatDate } from '@cepcomunicacion/utils';
```

---

**Phase:** Phase 1 (Foundation)
**Next Steps:** Create database package first, then types
