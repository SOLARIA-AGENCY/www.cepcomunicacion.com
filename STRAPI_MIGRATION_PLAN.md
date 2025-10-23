# Strapi 4.x Migration Plan
## CEPComunicacion v2 - Detailed Implementation Guide

**Date Created:** 2025-10-23
**ADR Reference:** ADR-001
**Timeline:** 20 working days (3 weeks)
**Methodology:** Test-Driven Development (TDD)

---

## 📋 EXECUTIVE SUMMARY

### Migration Overview

**From:** Payload CMS 3.60.0 (incompatible architecture)
**To:** Strapi 4.x (Express-based, stable)
**Scope:** 13 collections, RBAC (5 roles), field permissions, audit trail
**Approach:** Phased migration with TDD (tests written BEFORE implementation)

### Success Criteria

- ✅ All 13 collections migrated with full functionality
- ✅ RBAC working (5 roles: Admin, Gestor, Marketing, Asesor, Lectura)
- ✅ Field-level permissions implemented
- ✅ Audit trail operational
- ✅ File uploads configured (S3)
- ✅ BullMQ integration via webhooks
- ✅ Zero TypeScript errors (strict mode)
- ✅ 100% test coverage for critical paths
- ✅ Frontend (React) unchanged and functional

---

## 🗓️ TIMELINE & PHASES

### Phase 0: Preparation (Day 0) ✅ COMPLETE
**Status:** ✅ DONE (2025-10-23)
**Duration:** 0 days (already complete)

**Completed:**
- [x] ADR-001 documented and approved
- [x] Stack evaluation completed
- [x] CLAUDE.md updated
- [x] Current work committed (a76893f)

---

### Phase 1: Foundation (Days 1-5)
**Goal:** Working Strapi instance with Users collection and RBAC

#### Day 1: Strapi Installation & Configuration

**Tasks:**
1. **Install Strapi 4.x**
   ```bash
   cd apps/cms
   npx create-strapi-app@latest . --quickstart --no-run
   # Select:
   # - TypeScript: Yes
   # - Install dependencies: Yes (pnpm)
   # - Skip database config (we'll configure PostgreSQL)
   ```

2. **Configure PostgreSQL**
   ```typescript
   // config/database.ts
   export default ({ env }) => ({
     connection: {
       client: 'postgres',
       connection: {
         host: env('DATABASE_HOST', 'localhost'),
         port: env.int('DATABASE_PORT', 5432),
         database: env('DATABASE_NAME', 'cepcomunicacion'),
         user: env('DATABASE_USERNAME', 'cepcomunicacion'),
         password: env('DATABASE_PASSWORD'),
         ssl: env.bool('DATABASE_SSL', false),
       },
     },
   });
   ```

3. **Configure TypeScript strict mode**
   ```json
   // tsconfig.json
   {
     "extends": "@strapi/typescript-utils/tsconfigs/server",
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true
     }
   }
   ```

4. **Set up environment variables**
   ```env
   # .env
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=<generate_keys>
   API_TOKEN_SALT=<generate_salt>
   ADMIN_JWT_SECRET=<generate_secret>
   TRANSFER_TOKEN_SALT=<generate_salt>
   JWT_SECRET=<generate_secret>

   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=cepcomunicacion
   DATABASE_USERNAME=cepcomunicacion
   DATABASE_PASSWORD=<password>
   ```

5. **Test Strapi starts successfully**
   ```bash
   pnpm develop
   # Should start on http://localhost:1337/admin
   ```

**Tests:**
- ✅ Strapi starts without errors
- ✅ Admin UI accessible at http://localhost:1337/admin
- ✅ PostgreSQL connection successful
- ✅ TypeScript compilation successful (strict mode)

**Deliverable:** Working Strapi 4.x instance

---

#### Day 2: Users Collection & RBAC Setup

**Tasks:**

1. **Extend default Users collection**
   ```typescript
   // src/extensions/users-permissions/content-types/user/schema.json
   {
     "attributes": {
       "name": {
         "type": "string",
         "required": true,
         "minLength": 2,
         "maxLength": 100
       },
       "phone": {
         "type": "string",
         "regex": "^\\+34 [0-9]{3} [0-9]{3} [0-9]{3}$"
       },
       "avatar_url": {
         "type": "string"
       },
       "bio": {
         "type": "text",
         "maxLength": 500
       },
       "active": {
         "type": "boolean",
         "default": true
       },
       "last_login": {
         "type": "datetime"
       }
     }
   }
   ```

2. **Create 5 custom roles**
   ```typescript
   // src/bootstrap.ts
   export default async () => {
     const roles = ['Admin', 'Gestor', 'Marketing', 'Asesor', 'Lectura'];

     for (const roleName of roles) {
       const role = await strapi.query('plugin::users-permissions.role').findOne({
         where: { name: roleName },
       });

       if (!role) {
         await strapi.query('plugin::users-permissions.role').create({
           data: {
             name: roleName,
             description: `${roleName} role`,
             type: roleName.toLowerCase(),
           },
         });
       }
     }
   };
   ```

3. **Configure role permissions**
   ```typescript
   // src/bootstrap.ts (continued)
   // Admin: Full access
   // Gestor: All collections (read, create, update, delete)
   // Marketing: Campaigns, AdsTemplates, Leads (CRUD), others (read)
   // Asesor: Leads (read, update), others (read)
   // Lectura: All collections (read only)
   ```

**Tests:**
```typescript
// tests/users/users.test.ts
import { setupStrapi, cleanupStrapi } from '../helpers/strapi';

describe('Users Collection', () => {
  beforeAll(async () => {
    await setupStrapi();
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  describe('User Creation', () => {
    test('Admin can create user', async () => {
      const adminToken = await getAdminToken();
      const response = await request(strapi.server.httpServer)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Test123!',
          name: 'Test User',
          role: 'marketing',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('test@example.com');
    });

    test('Marketing cannot create admin user', async () => {
      const marketingToken = await getMarketingToken();
      const response = await request(strapi.server.httpServer)
        .post('/api/users')
        .set('Authorization', `Bearer ${marketingToken}`)
        .send({
          username: 'adminuser',
          email: 'admin@example.com',
          password: 'Admin123!',
          role: 'admin',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('RBAC', () => {
    test('Admin role exists', async () => {
      const role = await strapi.query('plugin::users-permissions.role').findOne({
        where: { name: 'Admin' },
      });
      expect(role).toBeDefined();
    });

    test('All 5 roles exist', async () => {
      const roles = await strapi.query('plugin::users-permissions.role').findMany();
      const roleNames = roles.map(r => r.name);
      expect(roleNames).toContain('Admin');
      expect(roleNames).toContain('Gestor');
      expect(roleNames).toContain('Marketing');
      expect(roleNames).toContain('Asesor');
      expect(roleNames).toContain('Lectura');
    });
  });
});
```

**Deliverable:** Users collection with 5 roles

---

#### Days 3-4: Core Academic Collections

**Collections to migrate:**
1. Cycles
2. Campuses
3. Courses
4. CourseRuns

**TDD Approach:**
1. Write tests FIRST (based on Payload specs)
2. Create Strapi content types
3. Run tests (should fail - RED)
4. Implement functionality
5. Run tests (should pass - GREEN)
6. Refactor if needed

**Example: Cycles Collection**

**Step 1: Write Tests**
```typescript
// tests/cycles/cycles.test.ts
describe('Cycles Collection', () => {
  test('CREATE: Admin can create cycle', async () => {
    const response = await createCycle(adminToken, {
      slug: 'fp-informatica',
      name: 'FP Informática',
      level: 'superior',
      duration_years: 2,
    });
    expect(response.status).toBe(201);
    expect(response.body.data.attributes.slug).toBe('fp-informatica');
  });

  test('VALIDATION: Slug must be unique', async () => {
    await createCycle(adminToken, { slug: 'duplicate', name: 'Test' });
    const response = await createCycle(adminToken, { slug: 'duplicate', name: 'Test 2' });
    expect(response.status).toBe(400);
  });

  test('RBAC: Lectura cannot create cycle', async () => {
    const response = await createCycle(lecturaToken, {
      slug: 'test-cycle',
      name: 'Test Cycle',
    });
    expect(response.status).toBe(403);
  });

  test('RELATIONSHIP: Cycle has many courses', async () => {
    const cycle = await createCycle(adminToken, { slug: 'test', name: 'Test' });
    const course1 = await createCourse(adminToken, { cycle: cycle.id });
    const course2 = await createCourse(adminToken, { cycle: cycle.id });

    const response = await request(strapi.server.httpServer)
      .get(`/api/cycles/${cycle.id}?populate=courses`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.body.data.attributes.courses.data).toHaveLength(2);
  });
});
```

**Step 2: Create Content Type**
```json
// src/api/cycle/content-types/cycle/schema.json
{
  "kind": "collectionType",
  "collectionName": "cycles",
  "info": {
    "singularName": "cycle",
    "pluralName": "cycles",
    "displayName": "Cycle"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true,
      "unique": true
    },
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 255
    },
    "level": {
      "type": "enumeration",
      "enum": ["medio", "superior"],
      "required": true
    },
    "duration_years": {
      "type": "integer",
      "required": true,
      "min": 1,
      "max": 4
    },
    "description": {
      "type": "richtext"
    },
    "courses": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::course.course",
      "mappedBy": "cycle"
    },
    "active": {
      "type": "boolean",
      "default": true
    }
  }
}
```

**Step 3: Configure Permissions**
```typescript
// src/api/cycle/policies/rbac.ts
export default (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;

  if (!user) return false;

  const role = user.role.name;
  const action = policyContext.request.method;

  // Admin, Gestor: Full access
  if (['Admin', 'Gestor'].includes(role)) return true;

  // Marketing, Asesor, Lectura: Read only
  if (action === 'GET') return true;

  return false;
};
```

**Step 4: Run Tests → Implement → Verify**

**Repeat for:**
- Campuses (similar to Cycles)
- Courses (with Cycle relationship, many-to-many Campuses)
- CourseRuns (with Course and Campus relationships)

**Tests per collection:**
- CRUD operations (4 tests minimum)
- Validation rules (3-5 tests)
- RBAC for all 5 roles (5 tests)
- Relationships (2-3 tests)
- **Total: ~15 tests per collection**

**Deliverable:** 4 core collections with 60+ tests

---

#### Day 5: Verification & Documentation

**Tasks:**
1. Run full test suite
2. Verify all relationships work
3. Test admin UI functionality
4. Document API endpoints
5. Create collection documentation

**Tests:**
```typescript
// tests/integration/relationships.test.ts
describe('Collection Relationships', () => {
  test('Course → Cycle relationship', async () => {
    const cycle = await createCycle(adminToken, { ... });
    const course = await createCourse(adminToken, { cycle: cycle.id });
    const fetched = await getCourse(adminToken, course.id, 'cycle');
    expect(fetched.attributes.cycle.data.id).toBe(cycle.id);
  });

  test('Course ↔ Campuses many-to-many', async () => {
    const campus1 = await createCampus(adminToken, { ... });
    const campus2 = await createCampus(adminToken, { ... });
    const course = await createCourse(adminToken, {
      campuses: [campus1.id, campus2.id]
    });
    const fetched = await getCourse(adminToken, course.id, 'campuses');
    expect(fetched.attributes.campuses.data).toHaveLength(2);
  });
});
```

**Deliverable:** Phase 1 complete with 70+ passing tests

---

### Phase 2: Student & Enrollment Management (Days 6-7)

#### Day 6: Students Collection (PII Protection)

**Tasks:**
1. Create Students content type with PII fields
2. Implement field-level permissions (PII protection)
3. GDPR consent tracking
4. Spanish validation (DNI, phone)

**Content Type:**
```json
// src/api/student/content-types/student/schema.json
{
  "attributes": {
    "first_name": { "type": "string", "required": true },
    "last_name": { "type": "string", "required": true },
    "email": { "type": "email", "required": true, "unique": true },
    "phone": {
      "type": "string",
      "regex": "^\\+34 [0-9]{3} [0-9]{3} [0-9]{3}$"
    },
    "dni": {
      "type": "string",
      "regex": "^[0-9]{8}[A-Z]$",
      "unique": true
    },
    "date_of_birth": { "type": "date", "required": true },
    "address": { "type": "string" },
    "city": { "type": "string" },
    "postal_code": { "type": "string" },
    "gdpr_consent": { "type": "boolean", "required": true },
    "privacy_policy_accepted": { "type": "boolean", "required": true },
    "consent_timestamp": { "type": "datetime" },
    "consent_ip_address": { "type": "string" },
    "active": { "type": "boolean", "default": true }
  }
}
```

**Field-Level Permissions:**
```typescript
// src/api/student/middlewares/pii-protection.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    const role = ctx.state.user?.role?.name;

    // Lectura role: Hide ALL PII
    if (role === 'Lectura' && ctx.response.body?.data) {
      const hidePII = (student) => {
        delete student.attributes.email;
        delete student.attributes.phone;
        delete student.attributes.dni;
        delete student.attributes.address;
        return student;
      };

      if (Array.isArray(ctx.response.body.data)) {
        ctx.response.body.data = ctx.response.body.data.map(hidePII);
      } else {
        ctx.response.body.data = hidePII(ctx.response.body.data);
      }
    }

    // Marketing role: Hide DNI and emergency contacts
    if (role === 'Marketing' && ctx.response.body?.data) {
      const hideSensitive = (student) => {
        delete student.attributes.dni;
        delete student.attributes.emergency_contact_name;
        delete student.attributes.emergency_contact_phone;
        return student;
      };

      if (Array.isArray(ctx.response.body.data)) {
        ctx.response.body.data = ctx.response.body.data.map(hideSensitive);
      } else {
        ctx.response.body.data = hideSensitive(ctx.response.body.data);
      }
    }
  };
};
```

**GDPR Hooks:**
```typescript
// src/api/student/content-types/student/lifecycles.ts
export default {
  beforeCreate(event) {
    const { data } = event.params;

    // Enforce GDPR consent
    if (!data.gdpr_consent || !data.privacy_policy_accepted) {
      throw new Error('GDPR consent required');
    }

    // Auto-capture consent metadata
    data.consent_timestamp = new Date().toISOString();
    data.consent_ip_address = event.state?.ip || 'unknown';
  },

  beforeUpdate(event) {
    // Prevent modification of GDPR fields
    if (event.params.data.gdpr_consent !== undefined ||
        event.params.data.privacy_policy_accepted !== undefined ||
        event.params.data.consent_timestamp !== undefined ||
        event.params.data.consent_ip_address !== undefined) {
      throw new Error('GDPR fields are immutable');
    }
  },
};
```

**Tests:**
```typescript
describe('Students Collection - PII Protection', () => {
  test('Lectura cannot see PII fields', async () => {
    const student = await createStudent(adminToken, { ... });
    const response = await getStudent(lecturaToken, student.id);
    expect(response.body.data.attributes.email).toBeUndefined();
    expect(response.body.data.attributes.phone).toBeUndefined();
    expect(response.body.data.attributes.dni).toBeUndefined();
  });

  test('Marketing cannot see DNI', async () => {
    const student = await createStudent(adminToken, { ... });
    const response = await getStudent(marketingToken, student.id);
    expect(response.body.data.attributes.dni).toBeUndefined();
    expect(response.body.data.attributes.email).toBeDefined(); // Can see email
  });

  test('Admin can see all PII', async () => {
    const student = await createStudent(adminToken, { ... });
    const response = await getStudent(adminToken, student.id);
    expect(response.body.data.attributes.email).toBeDefined();
    expect(response.body.data.attributes.dni).toBeDefined();
  });
});

describe('Students Collection - GDPR', () => {
  test('Cannot create without GDPR consent', async () => {
    const response = await createStudent(adminToken, {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      gdpr_consent: false, // Missing consent
    });
    expect(response.status).toBe(400);
  });

  test('Consent metadata auto-captured', async () => {
    const response = await createStudent(adminToken, {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      gdpr_consent: true,
      privacy_policy_accepted: true,
    });
    expect(response.body.data.attributes.consent_timestamp).toBeDefined();
    expect(response.body.data.attributes.consent_ip_address).toBeDefined();
  });

  test('GDPR fields are immutable', async () => {
    const student = await createStudent(adminToken, { ... });
    const response = await updateStudent(adminToken, student.id, {
      gdpr_consent: false, // Attempt to revoke
    });
    expect(response.status).toBe(400);
  });
});
```

**Deliverable:** Students collection with PII protection (20+ tests)

---

#### Day 7: Enrollments Collection

**Tasks:**
1. Create Enrollments content type
2. Implement financial data protection
3. Status workflow validation
4. Capacity management hooks

**Content Type:**
```json
{
  "attributes": {
    "student": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::student.student",
      "required": true
    },
    "course_run": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::course-run.course-run",
      "required": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "confirmed", "waitlisted", "completed", "cancelled", "withdrawn"],
      "default": "pending",
      "required": true
    },
    "enrolled_at": { "type": "datetime" },
    "confirmed_at": { "type": "datetime" },
    "completed_at": { "type": "datetime" },
    "total_amount": { "type": "decimal", "required": true },
    "amount_paid": { "type": "decimal", "default": 0 },
    "payment_status": {
      "type": "enumeration",
      "enum": ["pending", "partial", "paid", "refunded"],
      "default": "pending"
    },
    "financial_aid_requested": { "type": "boolean", "default": false },
    "financial_aid_amount": { "type": "decimal" },
    "financial_aid_status": {
      "type": "enumeration",
      "enum": ["pending", "approved", "rejected"],
      "default": "pending"
    },
    "attendance_percentage": { "type": "integer", "min": 0, "max": 100 },
    "final_grade": { "type": "integer", "min": 0, "max": 100 },
    "certificate_issued": { "type": "boolean", "default": false },
    "certificate_url": { "type": "string" }
  }
}
```

**Financial Data Protection:**
```typescript
// src/api/enrollment/middlewares/financial-protection.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    const role = ctx.state.user?.role?.name;

    // Only Admin and Gestor can modify financial fields
    if (ctx.request.method === 'PUT' || ctx.request.method === 'POST') {
      if (!['Admin', 'Gestor'].includes(role)) {
        const financialFields = [
          'total_amount',
          'amount_paid',
          'payment_status',
          'financial_aid_amount',
          'financial_aid_status',
        ];

        for (const field of financialFields) {
          if (ctx.request.body.data?.[field] !== undefined) {
            ctx.throw(403, 'Financial data modification not allowed');
          }
        }
      }
    }

    await next();
  };
};
```

**Lifecycle Hooks:**
```typescript
// src/api/enrollment/content-types/enrollment/lifecycles.ts
export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Check course run capacity
    const courseRun = await strapi.entityService.findOne(
      'api::course-run.course-run',
      data.course_run,
      { fields: ['max_students', 'current_enrollments'] }
    );

    if (courseRun.current_enrollments >= courseRun.max_students) {
      data.status = 'waitlisted';
    }

    // Set enrolled_at timestamp
    data.enrolled_at = new Date().toISOString();
  },

  async afterCreate(event) {
    const { result } = event;

    // Increment course_run.current_enrollments
    if (result.status === 'confirmed') {
      await strapi.entityService.update(
        'api::course-run.course-run',
        result.course_run.id,
        {
          data: {
            current_enrollments: result.course_run.current_enrollments + 1,
          },
        }
      );
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    const oldData = params.data;

    // If status changed to confirmed, increment counter
    if (oldData.status !== 'confirmed' && result.status === 'confirmed') {
      await strapi.entityService.update(
        'api::course-run.course-run',
        result.course_run.id,
        {
          data: {
            current_enrollments: result.course_run.current_enrollments + 1,
          },
        }
      );
    }

    // If status changed from confirmed, decrement counter
    if (oldData.status === 'confirmed' && result.status !== 'confirmed') {
      await strapi.entityService.update(
        'api::course-run.course-run',
        result.course_run.id,
        {
          data: {
            current_enrollments: result.course_run.current_enrollments - 1,
          },
        }
      );
    }
  },
};
```

**Tests:**
```typescript
describe('Enrollments - Financial Protection', () => {
  test('Admin can modify financial fields', async () => {
    const enrollment = await createEnrollment(adminToken, { ... });
    const response = await updateEnrollment(adminToken, enrollment.id, {
      amount_paid: 500,
      payment_status: 'partial',
    });
    expect(response.status).toBe(200);
  });

  test('Marketing cannot modify financial fields', async () => {
    const enrollment = await createEnrollment(adminToken, { ... });
    const response = await updateEnrollment(marketingToken, enrollment.id, {
      amount_paid: 500,
    });
    expect(response.status).toBe(403);
  });
});

describe('Enrollments - Capacity Management', () => {
  test('Enrollment set to waitlisted when course full', async () => {
    const courseRun = await createCourseRun(adminToken, { max_students: 2 });
    await createEnrollment(adminToken, { course_run: courseRun.id, status: 'confirmed' });
    await createEnrollment(adminToken, { course_run: courseRun.id, status: 'confirmed' });

    const response = await createEnrollment(adminToken, { course_run: courseRun.id });
    expect(response.body.data.attributes.status).toBe('waitlisted');
  });

  test('current_enrollments incremented on confirm', async () => {
    const courseRun = await createCourseRun(adminToken, { current_enrollments: 5 });
    await createEnrollment(adminToken, {
      course_run: courseRun.id,
      status: 'confirmed',
    });

    const updated = await getCourseRun(adminToken, courseRun.id);
    expect(updated.attributes.current_enrollments).toBe(6);
  });
});
```

**Deliverable:** Enrollments with financial protection (25+ tests)

---

### Phase 3: Marketing & Leads (Days 8-10)

#### Days 8-9: Leads & Campaigns Collections

**Leads Collection:**
- GDPR-compliant lead capture
- Public form submission (no auth)
- Spanish phone validation
- Duplicate prevention
- Lead scoring

**Campaigns Collection:**
- UTM parameter tracking
- Budget/ROI metrics
- Status workflow
- Real-time analytics

**Similar TDD approach:**
1. Write tests
2. Create content types
3. Implement hooks
4. Verify tests pass

**Deliverable:** Leads + Campaigns (40+ tests)

---

#### Day 10: AdsTemplates Collection

**Content Type:**
- Multi-language support (es, en, ca)
- Version tracking
- Asset URL management
- Tag-based organization

**Deliverable:** AdsTemplates (15+ tests)

---

### Phase 4: Content Collections (Day 11)

#### BlogPosts, FAQs, Media

**BlogPosts:**
- Rich text content
- SEO fields (meta title, description)
- Slug auto-generation
- Categories/tags

**FAQs:**
- Question/answer pairs
- Categories
- Display order
- Slug generation

**Media:**
- File uploads (S3 integration)
- Image optimization
- Folder organization
- Alt text for accessibility

**Deliverable:** 3 content collections (30+ tests)

---

### Phase 5: Custom Logic (Days 12-13)

#### Day 12: Field-Level Permissions Middleware

**Implementation:**
```typescript
// src/middlewares/field-permissions.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    const role = ctx.state.user?.role?.name;
    const contentType = ctx.params.model;

    // Load field permission rules
    const rules = await strapi.service('api::permission.permission')
      .getFieldRules(contentType, role);

    // Filter response based on rules
    if (ctx.response.body?.data) {
      ctx.response.body.data = filterFields(
        ctx.response.body.data,
        rules
      );
    }
  };
};
```

**Tests:**
```typescript
describe('Field-Level Permissions', () => {
  test('Admin sees all fields', async () => {
    const response = await getStudent(adminToken, studentId);
    expect(response.body.data.attributes.email).toBeDefined();
    expect(response.body.data.attributes.dni).toBeDefined();
  });

  test('Marketing cannot see DNI field', async () => {
    const response = await getStudent(marketingToken, studentId);
    expect(response.body.data.attributes.dni).toBeUndefined();
  });

  // ... more tests for all field permission rules
});
```

---

#### Day 13: Audit Trail Setup

**Option 1: Use Plugin**
```bash
pnpm add strapi-plugin-audit-log
```

**Option 2: Custom Implementation**
```typescript
// src/api/audit-log/content-types/audit-log/schema.json
{
  "attributes": {
    "user": { "type": "relation", "relation": "manyToOne", "target": "plugin::users-permissions.user" },
    "action": { "type": "enumeration", "enum": ["create", "update", "delete"] },
    "content_type": { "type": "string" },
    "entry_id": { "type": "integer" },
    "ip_address": { "type": "string" },
    "user_agent": { "type": "string" },
    "changes": { "type": "json" },
    "timestamp": { "type": "datetime" }
  }
}

// src/middlewares/audit-logger.ts
export default (config, { strapi }) => {
  return async (ctx, next) => {
    const before = await captureState(ctx);
    await next();
    const after = await captureState(ctx);

    if (ctx.request.method !== 'GET') {
      await strapi.entityService.create('api::audit-log.audit-log', {
        data: {
          user: ctx.state.user?.id,
          action: ctx.request.method,
          content_type: ctx.params.model,
          entry_id: ctx.params.id,
          ip_address: ctx.request.ip,
          user_agent: ctx.request.headers['user-agent'],
          changes: diff(before, after),
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
};
```

**Tests:**
```typescript
describe('Audit Trail', () => {
  test('CREATE action logged', async () => {
    const student = await createStudent(adminToken, { ... });
    const logs = await getAuditLogs(adminToken, {
      content_type: 'student',
      entry_id: student.id,
    });
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('create');
  });

  test('UPDATE action logged with changes', async () => {
    const student = await createStudent(adminToken, { name: 'Old Name' });
    await updateStudent(adminToken, student.id, { name: 'New Name' });
    const logs = await getAuditLogs(adminToken, {
      content_type: 'student',
      entry_id: student.id,
      action: 'update',
    });
    expect(logs[0].changes.name.before).toBe('Old Name');
    expect(logs[0].changes.name.after).toBe('New Name');
  });
});
```

**Deliverable:** Audit trail operational (10+ tests)

---

### Phase 6: BullMQ Integration (Day 14)

#### Webhooks Configuration

**Tasks:**
1. Install Strapi webhooks plugin (built-in)
2. Configure webhooks for each collection
3. Trigger BullMQ jobs from webhooks

**Webhook Setup:**
```typescript
// src/api/lead/content-types/lead/lifecycles.ts
export default {
  async afterCreate(event) {
    const { result } = event;

    // Trigger webhook
    await strapi.service('plugin::webhooks.webhook').trigger({
      event: 'lead.created',
      payload: {
        id: result.id,
        email: result.email,
        course: result.course?.id,
        campaign: result.campaign?.id,
      },
    });
  },
};
```

**BullMQ Worker (separate service):**
```typescript
// workers/src/lead-processor.ts
import { Queue, Worker } from 'bullmq';

const leadQueue = new Queue('lead-processing', { connection: redis });

// Webhook receiver endpoint
app.post('/webhooks/lead-created', async (req, res) => {
  const { id, email, course, campaign } = req.body;

  await leadQueue.add('process-lead', {
    leadId: id,
    email,
    courseId: course,
    campaignId: campaign,
  });

  res.status(200).send('OK');
});

// Worker
const worker = new Worker('lead-processing', async (job) => {
  const { leadId, email } = job.data;

  // Process lead
  await sendWelcomeEmail(email);
  await assignToAsesor(leadId);
  await syncToMailchimp(email);
}, { connection: redis });
```

**Tests:**
```typescript
describe('BullMQ Integration', () => {
  test('Lead creation triggers webhook', async () => {
    const webhookSpy = jest.spyOn(strapi.service('plugin::webhooks.webhook'), 'trigger');

    await createLead(publicToken, { ... });

    expect(webhookSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'lead.created',
      })
    );
  });

  test('Webhook triggers BullMQ job', async () => {
    // Mock BullMQ queue
    const queueAddSpy = jest.spyOn(leadQueue, 'add');

    await triggerWebhook('lead.created', { id: 123, email: 'test@example.com' });

    expect(queueAddSpy).toHaveBeenCalledWith(
      'process-lead',
      expect.objectContaining({ leadId: 123 })
    );
  });
});
```

**Deliverable:** BullMQ webhooks (8+ tests)

---

### Phase 7: File Uploads & S3 (Day 15)

#### S3 Storage Plugin

**Installation:**
```bash
pnpm add @strapi/provider-upload-aws-s3
```

**Configuration:**
```typescript
// config/plugins.ts
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION', 'eu-west-1'),
        params: {
          Bucket: env('AWS_BUCKET_NAME'),
        },
      },
    },
  },
});
```

**Tests:**
```typescript
describe('File Uploads', () => {
  test('Upload image to S3', async () => {
    const response = await uploadFile(adminToken, './test-image.jpg');
    expect(response.status).toBe(200);
    expect(response.body[0].url).toContain('s3.amazonaws.com');
  });

  test('Media collection tracks uploads', async () => {
    const file = await uploadFile(adminToken, './test.pdf');
    const media = await getMedia(adminToken, { file_id: file.id });
    expect(media).toHaveLength(1);
    expect(media[0].attributes.file_type).toBe('application/pdf');
  });
});
```

**Deliverable:** S3 file uploads (6+ tests)

---

### Phase 8: Testing & Deployment (Days 16-20)

#### Day 16-17: Full Test Suite

**Tasks:**
1. Run all unit tests
2. Run integration tests
3. Run E2E tests (admin UI)
4. Performance testing (load test)

**Test Execution:**
```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests (Playwright)
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

**Target Metrics:**
- ✅ Unit test coverage: 80%+
- ✅ Integration test coverage: 70%+
- ✅ Critical path coverage: 100%
- ✅ All tests passing (0 failures)

---

#### Day 18: Security Testing

**Tasks:**
1. OWASP Top 10 checklist
2. SQL injection testing
3. XSS testing
4. CSRF protection verification
5. Authentication/authorization testing
6. GDPR compliance audit

**Security Tests:**
```typescript
describe('Security', () => {
  test('SQL injection prevention', async () => {
    const response = await createStudent(adminToken, {
      email: "' OR '1'='1",
    });
    expect(response.status).toBe(400);
  });

  test('XSS prevention in text fields', async () => {
    const response = await createCourse(adminToken, {
      title: '<script>alert("XSS")</script>',
    });
    const fetched = await getCourse(adminToken, response.body.data.id);
    expect(fetched.attributes.title).not.toContain('<script>');
  });

  test('Unauthorized access blocked', async () => {
    const response = await request(strapi.server.httpServer)
      .get('/api/students')
      .set('Authorization', 'Bearer invalid-token');
    expect(response.status).toBe(401);
  });
});
```

---

#### Day 19: Docker Configuration

**Create Strapi Dockerfile:**
```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.15.4

FROM base AS dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
ENV NODE_ENV=production
EXPOSE 1337
CMD ["pnpm", "start"]
```

**Update Docker Compose:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cepcomunicacion
      POSTGRES_USER: cepcomunicacion
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  strapi:
    build:
      context: ./apps/cms
      dockerfile: Dockerfile
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: cepcomunicacion
      DATABASE_USERNAME: cepcomunicacion
      DATABASE_PASSWORD: ${DB_PASSWORD}
      NODE_ENV: production
    ports:
      - "1337:1337"
    depends_on:
      - postgres
      - redis
    volumes:
      - strapi-uploads:/app/public/uploads

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://strapi:1337

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infra/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - strapi

volumes:
  postgres-data:
  redis-data:
  strapi-uploads:
```

---

#### Day 20: Deployment & Documentation

**Tasks:**
1. Deploy to staging environment
2. Run smoke tests
3. Update API documentation
4. Create developer guide
5. Production deployment

**Deployment Checklist:**
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations run
- [ ] S3 bucket configured
- [ ] Nginx reverse proxy configured
- [ ] Health check endpoints working
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Rollback plan documented

**Smoke Tests:**
```bash
# Health check
curl https://api.cepcomunicacion.com/api/_health

# Authentication
curl -X POST https://api.cepcomunicacion.com/api/auth/local \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"admin@cepcomunicacion.com","password":"xxx"}'

# Create resource
curl -X POST https://api.cepcomunicacion.com/api/cycles \
  -H 'Authorization: Bearer xxx' \
  -H 'Content-Type: application/json' \
  -d '{"data":{"slug":"test","name":"Test Cycle"}}'
```

**Deliverable:** Production-ready deployment

---

## 📊 SUCCESS METRICS

### Code Quality
- ✅ 0 TypeScript errors (strict mode)
- ✅ 0 ESLint warnings
- ✅ 200+ tests passing
- ✅ 80%+ code coverage

### Functionality
- ✅ All 13 collections migrated
- ✅ RBAC working (5 roles)
- ✅ Field-level permissions operational
- ✅ Audit trail logging all mutations
- ✅ File uploads to S3
- ✅ BullMQ integration via webhooks

### Performance
- ✅ API response time < 200ms (p95)
- ✅ Admin UI loads < 2s
- ✅ Database queries optimized
- ✅ N+1 queries eliminated

### Security
- ✅ OWASP Top 10 compliant
- ✅ GDPR compliant
- ✅ PII fields protected
- ✅ Authentication/authorization working

---

## 🎯 RISK MITIGATION

### Risk 1: Migration Takes Longer Than Expected
**Mitigation:** Phased approach, critical collections first
**Contingency:** Extend timeline by 1 week if needed

### Risk 2: Data Migration Issues
**Mitigation:** Test migration on staging first, rollback plan
**Contingency:** Manual data entry if automated migration fails

### Risk 3: Team Learning Curve
**Mitigation:** Excellent Strapi docs, pair programming
**Contingency:** External Strapi expert consultant (if needed)

### Risk 4: Plugin Gaps
**Mitigation:** Custom code for missing features
**Contingency:** Community plugins, Strapi marketplace

---

## 📝 DOCUMENTATION DELIVERABLES

1. **API Documentation** (Swagger/OpenAPI)
2. **Developer Guide** (setup, architecture, conventions)
3. **User Guide** (admin UI usage)
4. **Deployment Guide** (Docker, environment config)
5. **Testing Guide** (how to run tests, write new tests)

---

## ✅ COMPLETION CRITERIA

**Phase 1:**
- [ ] Strapi installed and running
- [ ] Users collection with 5 roles
- [ ] 4 core collections migrated
- [ ] 70+ tests passing

**Phase 2:**
- [ ] Students collection (PII protection)
- [ ] Enrollments collection (financial protection)
- [ ] 45+ new tests passing

**Phase 3:**
- [ ] Leads, Campaigns, AdsTemplates migrated
- [ ] 55+ new tests passing

**Phase 4:**
- [ ] BlogPosts, FAQs, Media migrated
- [ ] S3 uploads working
- [ ] 30+ new tests passing

**Phase 5:**
- [ ] Field-level permissions implemented
- [ ] Audit trail operational
- [ ] BullMQ webhooks configured
- [ ] 18+ new tests passing

**Phase 6:**
- [ ] All tests passing (200+)
- [ ] Security audit passed
- [ ] Docker configuration complete
- [ ] Production deployment successful

---

**Document Status:** ✅ READY FOR IMPLEMENTATION
**Next Step:** Install Strapi 4.x (Day 1)
**Timeline:** 20 working days (3 weeks)
**Start Date:** TBD (awaiting client approval)

---

_This migration plan will be updated as progress is made._
