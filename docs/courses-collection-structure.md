# Courses Collection - Structure Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        COURSES COLLECTION                        │
├─────────────────────────────────────────────────────────────────┤
│  Fields:                                                         │
│  - id: UUID (PK, auto-generated)                                │
│  - slug: TEXT (UNIQUE, indexed) ← auto-generated from name      │
│  - name: VARCHAR(500) (required)                                │
│  - short_description: TEXT (optional)                           │
│  - long_description: RICHTEXT (optional)                        │
│  - modality: ENUM ['presencial', 'online', 'hibrido'] (required)│
│  - duration_hours: INTEGER (optional, min: 1)                   │
│  - base_price: DECIMAL(10,2) (optional, min: 0)                 │
│  - financial_aid_available: BOOLEAN (default: true)             │
│  - active: BOOLEAN (default: true) ← soft delete flag           │
│  - featured: BOOLEAN (default: false) ← homepage promotion      │
│  - meta_title: VARCHAR(300) (optional) ← SEO                    │
│  - meta_description: VARCHAR(500) (optional) ← SEO              │
│  - created_at: TIMESTAMP (auto)                                 │
│  - updated_at: TIMESTAMP (auto)                                 │
└─────────────────────────────────────────────────────────────────┘
                        │                │                │
                        │                │                │
            ┌───────────┘                │                └───────────┐
            │                            │                            │
            │ Many-to-One               │ Many-to-Many              │ Many-to-One
            │ (required)                │ (optional)                │ (optional)
            ▼                            ▼                            ▼
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│       CYCLES           │  │       CAMPUSES         │  │        USERS           │
├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤
│ - id: UUID (PK)        │  │ - id: UUID (PK)        │  │ - id: UUID (PK)        │
│ - name: VARCHAR(100)   │  │ - name: VARCHAR(100)   │  │ - email: VARCHAR(100)  │
│ - slug: TEXT (UNIQUE)  │  │ - slug: TEXT (UNIQUE)  │  │ - name: VARCHAR(100)   │
│ - level: ENUM          │  │ - city: VARCHAR(50)    │  │ - role: ENUM           │
│ - order_display: INT   │  │ - address: TEXT        │  │ - is_active: BOOLEAN   │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
         ▲                           ▲                           ▲
         │                           │                           │
         └───────────────────────────┴───────────────────────────┘
                    Relationships: cycle, campuses[], created_by
```

## Collection Architecture

```
apps/cms/src/collections/Courses/
│
├── Courses.ts                    ← Main collection configuration
│   ├── Collection metadata (slug, labels, admin config)
│   ├── Field definitions (14 fields)
│   ├── Access control (read, create, update, delete)
│   ├── Hooks (beforeValidate, beforeChange)
│   └── Timestamps & default sort
│
├── Courses.validation.ts         ← Zod schemas & validation
│   ├── CourseSchema (Zod)
│   ├── CourseInput (TypeScript type)
│   ├── CourseUpdateSchema (partial)
│   ├── validateCourseData()
│   ├── generateCourseSlug()
│   └── formatValidationErrors()
│
├── Courses.test.ts               ← Comprehensive test suite
│   ├── CRUD Operations (15 tests)
│   ├── Validation Tests (15 tests)
│   ├── Access Control Tests (12 tests)
│   └── Relationship Tests (8 tests)
│
├── access/                       ← Access control functions
│   ├── canManageCourses.ts      (Admin, Gestor, Marketing)
│   ├── canReadCourses.ts        (Public: active only; Staff: all)
│   ├── canUpdateCourse.ts       (Admin/Gestor: all; Marketing: own)
│   └── index.ts
│
├── hooks/                        ← Business logic hooks
│   ├── generateSlug.ts          (Auto-generate URL-friendly slug)
│   ├── validateCourseRelationships.ts (Validate cycle & campuses exist)
│   └── index.ts
│
└── index.ts                      ← Module exports
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COURSE CREATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. User submits course data
   │
   ├─→ [Authentication Check] ───→ User role?
   │                               │
   │                               ├─→ Admin/Gestor/Marketing? ──→ ✅ Continue
   │                               └─→ Other roles? ──────────────→ ❌ 403 Forbidden
   │
2. beforeValidate Hooks
   │
   ├─→ [Track Creator] ──────────→ Set created_by = user.id
   │
   ├─→ [generateSlug] ────────────→ If no slug provided:
   │                                  - Convert name to lowercase
   │                                  - Remove Spanish accents (á→a, ñ→n)
   │                                  - Replace spaces with hyphens
   │                                  - Remove special characters
   │
   └─→ [validateCourseRelationships] → Check cycle exists in DB
                                      → Check all campus IDs exist in DB
                                      → Throw error if any missing
3. Field Validation (Layer 1)
   │
   ├─→ [Required Fields] ─────────→ name, cycle, modality present?
   ├─→ [String Lengths] ──────────→ name ≤ 500, meta_title ≤ 300, etc.
   ├─→ [Numeric Constraints] ─────→ duration_hours > 0, base_price ≥ 0
   ├─→ [Enum Validation] ─────────→ modality in ['presencial', 'online', 'hibrido']
   └─→ [Format Validation] ───────→ slug matches /^[a-z0-9-]+$/
                                   → price has ≤ 2 decimal places
4. beforeChange Hooks
   │
   └─→ [Zod Validation] (Layer 2) → Parse data with CourseSchema
                                   → Log errors if validation fails
                                   → Continue (Payload handles errors)
5. Database Constraints (Layer 3)
   │
   ├─→ [UNIQUE slug] ─────────────→ Check slug not already in DB
   ├─→ [FOREIGN KEY cycle_id] ────→ Check cycle exists (ON DELETE RESTRICT)
   ├─→ [CHECK modality] ──────────→ Ensure modality in enum
   ├─→ [CHECK duration_hours] ────→ Ensure > 0
   └─→ [CHECK base_price] ────────→ Ensure ≥ 0

6. Course Created ✅
   │
   └─→ Return course document with ID, timestamps, relationships
```

## Access Control Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ACCESS CONTROL DECISION TREE                            │
└─────────────────────────────────────────────────────────────────────────────┘

READ ACCESS (canReadCourses)
│
├─→ User authenticated?
│   ├─→ YES: Role in [admin, gestor, marketing, asesor]?
│   │   ├─→ YES: ✅ Return ALL courses (including inactive)
│   │   └─→ NO:  ✅ Return ACTIVE courses only (active=true)
│   └─→ NO:  ✅ Return ACTIVE courses only (active=true)

CREATE ACCESS (canManageCourses)
│
├─→ User authenticated?
│   ├─→ YES: Role in [admin, gestor, marketing]?
│   │   ├─→ YES: ✅ Allow creation
│   │   └─→ NO:  ❌ Deny (403 Forbidden)
│   └─→ NO:  ❌ Deny (401 Unauthorized)

UPDATE ACCESS (canUpdateCourse)
│
├─→ User authenticated?
│   ├─→ YES: Role = admin or gestor?
│   │   ├─→ YES: ✅ Allow update (any course)
│   │   └─→ NO:  Role = marketing?
│   │       ├─→ YES: Is created_by = user.id?
│   │       │   ├─→ YES: ✅ Allow update (own course)
│   │       │   └─→ NO:  ❌ Deny (403 Forbidden)
│   │       └─→ NO:  ❌ Deny (403 Forbidden)
│   └─→ NO:  ❌ Deny (401 Unauthorized)

DELETE ACCESS (inline function)
│
├─→ User authenticated?
│   ├─→ YES: Role in [admin, gestor]?
│   │   ├─→ YES: ✅ Allow deletion
│   │   └─→ NO:  ❌ Deny (403 Forbidden)
│   └─→ NO:  ❌ Deny (401 Unauthorized)
```

## Validation Layers Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                      3-LAYER VALIDATION SYSTEM                         │
└───────────────────────────────────────────────────────────────────────┘

Layer 1: Payload Field Validators (Real-time UI + API)
┌─────────────────────────────────────────────────────────────────────┐
│  • Required field checks (name, cycle, modality)                    │
│  • String length validation (name ≤ 500, meta_title ≤ 300)         │
│  • Numeric constraints (duration_hours > 0, base_price ≥ 0)        │
│  • Format validation (slug regex, price decimals)                   │
│  • Enum validation (modality in allowed values)                     │
│  • Custom validators (e.g., positive integer check)                 │
│  ↓ Errors: User-friendly messages in admin UI                       │
└─────────────────────────────────────────────────────────────────────┘

Layer 2: Zod Runtime Schemas (Type-safe validation)
┌─────────────────────────────────────────────────────────────────────┐
│  • CourseSchema.parse(data) in beforeChange hook                    │
│  • Type inference for TypeScript (CourseInput type)                 │
│  • Complex validation rules (multipleOf, regex patterns)            │
│  • Partial schemas for PATCH updates                                │
│  • Error formatting utilities                                       │
│  ↓ Errors: Logged for debugging, caught by Payload                  │
└─────────────────────────────────────────────────────────────────────┘

Layer 3: PostgreSQL Constraints (Database integrity)
┌─────────────────────────────────────────────────────────────────────┐
│  • UNIQUE constraint on slug (prevents duplicates)                  │
│  • CHECK constraint on modality enum                                │
│  • CHECK constraint on duration_hours > 0                           │
│  • CHECK constraint on base_price ≥ 0                               │
│  • FOREIGN KEY constraint on cycle_id (ON DELETE RESTRICT)          │
│  • NOT NULL constraints on required fields                          │
│  ↓ Errors: PostgreSQL errors, converted to 400 by Payload           │
└─────────────────────────────────────────────────────────────────────┘

                        ✅ Data Persisted to Database
```

## Relationship Cardinality

```
┌──────────────────────────────────────────────────────────────────────┐
│                    RELATIONSHIP CARDINALITY                           │
└──────────────────────────────────────────────────────────────────────┘

COURSES ←→ CYCLES (Many-to-One, Required)
─────────────────────────────────────────────────────────
│ Relationship Type: Many-to-One                        │
│ Cardinality:       N courses : 1 cycle                │
│ Required:          YES (every course must have cycle) │
│ Field:             cycle (relationship)               │
│ Foreign Key:       cycle_id → cycles.id               │
│ On Delete:         RESTRICT (cannot delete cycle if   │
│                    courses exist)                     │
│ Use Cases:         - Group courses by educational     │
│                      level (FP Básica, Grado Medio,   │
│                      Grado Superior)                  │
│                    - Query all courses in a cycle     │
│                    - Enforce categorization           │
─────────────────────────────────────────────────────────

COURSES ←→ CAMPUSES (Many-to-Many, Optional)
─────────────────────────────────────────────────────────
│ Relationship Type: Many-to-Many (via array)           │
│ Cardinality:       N courses : M campuses             │
│ Required:          NO (online courses have 0 campuses)│
│ Field:             campuses (relationship, hasMany)   │
│ Implementation:    Array of campus IDs (campus_ids[]) │
│ On Delete:         (No constraint, orphaned IDs       │
│                    handled by validation hook)        │
│ Use Cases:         - Find courses at specific campus  │
│                    - Multi-location offerings         │
│                    - Online-only courses (empty array)│
─────────────────────────────────────────────────────────

COURSES ←→ USERS (Many-to-One, Optional)
─────────────────────────────────────────────────────────
│ Relationship Type: Many-to-One                        │
│ Cardinality:       N courses : 1 user                 │
│ Required:          NO (but auto-populated if possible)│
│ Field:             created_by (relationship)          │
│ Foreign Key:       created_by → users.id              │
│ On Delete:         (No constraint, keeps creator ID)  │
│ Use Cases:         - Track who created each course    │
│                    - Marketing users edit own courses │
│                    - Audit trail                      │
─────────────────────────────────────────────────────────
```

## Test Coverage Map

```
┌───────────────────────────────────────────────────────────────────────┐
│                      TEST COVERAGE MAP (50+ Tests)                     │
└───────────────────────────────────────────────────────────────────────┘

CRUD Operations (15 tests) ──────────────────────────────────────────┐
│                                                                     │
├─→ [CREATE] Create course with required fields                      │
├─→ [CREATE] Create course with cycle relationship                   │
├─→ [CREATE] Create course with multiple campuses                    │
├─→ [CREATE] Create course with empty campus array (online)          │
├─→ [CREATE] Create course with flags (featured, financial_aid)      │
├─→ [CREATE] Auto-generate slug from Spanish name                    │
├─→ [READ]   Read single course by ID                                │
├─→ [READ]   Read course list with pagination                        │
├─→ [READ]   Query courses by cycle_id                               │
├─→ [READ]   Query courses by campus (array contains)                │
├─→ [READ]   Query featured courses only                             │
├─→ [READ]   Query courses by modality                               │
├─→ [READ]   Filter active courses only                              │
├─→ [UPDATE] Update course fields (name, description, price)         │
├─→ [UPDATE] Update course relationships (cycle, campuses)           │
└─→ [DELETE] Delete course (soft delete if inactive)                 │

Validation Tests (15 tests) ─────────────────────────────────────────┐
│                                                                     │
├─→ Reject course without required fields                            │
├─→ Reject invalid modality (not in enum)                            │
├─→ Reject negative duration_hours                                   │
├─→ Reject negative base_price                                       │
├─→ Reject duplicate slug                                            │
├─→ Validate cycle_id exists (foreign key)                           │
├─→ Validate campus_ids exist (array validation)                     │
├─→ Validate price format (2 decimal places)                         │
├─→ Validate slug format (lowercase, hyphens only)                   │
├─→ Enforce max length for name (500 chars)                          │
├─→ Enforce max length for meta fields (300/500 chars)               │
├─→ Accept optional fields                                           │
├─→ Accept empty campus_ids array                                    │
├─→ Validate duration_hours is positive integer                      │
└─→ Prevent creating course with non-existent cycle                  │

Access Control Tests (12 tests) ────────────────────────────────────┐
│                                                                     │
├─→ [READ]   Public can read active courses                          │
├─→ [READ]   Public cannot read inactive courses                     │
├─→ [CREATE] Admin can create courses                                │
├─→ [CREATE] Gestor can create courses                               │
├─→ [CREATE] Marketing can create courses                            │
├─→ [CREATE] Asesor cannot create courses (403)                      │
├─→ [CREATE] Lectura cannot create courses (403)                     │
├─→ [UPDATE] Admin can update any course                             │
├─→ [UPDATE] Gestor can update any course                            │
├─→ [UPDATE] Marketing can update own courses only                   │
├─→ [DELETE] Admin can delete courses                                │
├─→ [DELETE] Gestor can delete courses                               │
└─→ Track course creator (created_by field)                          │

Relationship Tests (8 tests) ───────────────────────────────────────┐
│                                                                     │
├─→ Create course with valid cycle_id                                │
├─→ Create course with multiple campus_ids                           │
├─→ Create course with empty campus_ids (online)                     │
├─→ Cascade: prevent deleting cycle with courses (RESTRICT)          │
├─→ Update course to different cycle                                 │
├─→ Add campus to existing course                                    │
├─→ Remove campus from course                                        │
└─→ Query all courses for a specific cycle                           │
```

---

**Last Updated:** 2025-10-22
**Project:** CEPComunicacion v2 - Payload CMS Backend
**Collection:** Courses (Phase 1 - Core Collections)
