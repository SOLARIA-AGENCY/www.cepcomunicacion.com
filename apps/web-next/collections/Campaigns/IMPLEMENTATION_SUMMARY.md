# Campaigns Collection - Implementation Summary

## Technical Overview

**Collection**: Campaigns
**Payload CMS Version**: 3.61.1
**Implementation Date**: 2025-10-30
**Developer**: Claude Code (SOLARIA AGENCY)
**Methodology**: Test-Driven Development (TDD)

## Architecture Summary

### Collection Specifications

- **Slug**: `campaigns`
- **Total Fields**: 20
- **Validation Hooks**: 5
- **Analytics Hooks**: 1
- **Access Control Functions**: 4
- **Validators**: 1 (UTM format)
- **Test Coverage**: 120+ tests
- **Performance Target**: <100ms for 10,000 leads

### File Structure

```
apps/web-next/collections/Campaigns/
├── index.ts                              # Main collection config (20 fields)
├── access/
│   ├── index.ts                          # Access control exports
│   ├── canCreateCampaigns.ts             # Create access (marketing+)
│   ├── canReadCampaigns.ts               # Read access (all authenticated)
│   ├── canUpdateCampaigns.ts             # Update access (ownership-based)
│   └── canDeleteCampaigns.ts             # Delete access (gestor+)
├── hooks/
│   ├── index.ts                          # Hook exports
│   ├── validateDates.ts                  # Date logic validation
│   ├── validateUTMParameters.ts          # UTM requirements validation
│   ├── validateTargets.ts                # Target metrics validation
│   ├── validateStatusWorkflow.ts         # Status transition enforcement
│   ├── trackCampaignCreator.ts           # created_by auto-population & immutability
│   └── calculateCampaignMetrics.ts       # Performance-optimized analytics
├── validators/
│   └── utmFormatValidator.ts             # UTM format validation (^[a-z0-9-]+$)
├── __tests__/
│   └── Campaigns.test.ts                 # 120+ comprehensive tests
├── README.md                             # User documentation
└── IMPLEMENTATION_SUMMARY.md             # This file (technical details)
```

## Field Implementation Details

### Field Categories

1. **Basic Information (5 fields)**
   - name, campaign_type, status, start_date, end_date
   - Primary identifiers and lifecycle management

2. **Budget & Targets (3 fields)**
   - budget, target_leads, target_enrollments
   - Financial and performance goal tracking

3. **UTM Tracking (5 fields)**
   - utm_source, utm_medium, utm_campaign, utm_term, utm_content
   - Marketing attribution and tracking

4. **Relationships (2 fields)**
   - course, created_by
   - Entity associations

5. **Calculated Metrics (4 fields)**
   - total_leads, total_conversions, conversion_rate, cost_per_lead
   - System-managed analytics (SP-001 immutable)

6. **System Fields (1 field)**
   - active (soft delete flag)

### Field-Level Validations

| Field | Validation | Error Message |
|-------|------------|---------------|
| name | required, unique, 3-100 chars | Built-in |
| campaign_type | required, enum | Built-in |
| status | required, enum | Built-in |
| start_date | required, date | Built-in |
| end_date | optional, >= start_date | "End date must be on or after start date" |
| budget | optional, min 0, 2 decimals | Built-in |
| target_leads | optional, min 0, integer | "Target leads must be an integer" |
| target_enrollments | optional, min 0, integer, <= target_leads | "Target enrollments must be an integer" / "Target enrollments cannot exceed target leads" |
| utm_* | optional, format ^[a-z0-9-]+$ | "UTM parameters must be lowercase alphanumeric with hyphens only" |
| utm_campaign | required if any UTM provided | "utm_campaign is required when any UTM parameter is provided" |
| created_by | auto-populated, immutable | "created_by field is immutable" |
| total_* | read-only, system-managed | Rejected via access control |

## Hook Implementation

### beforeChange Hooks (Validation - 4 hooks)

#### 1. validateDates
**Purpose**: Validate date logic
**Triggers**: create, update
**Validations**:
- end_date >= start_date (same day allowed)
- If status=draft, start_date cannot be in past

**Implementation**:
```typescript
// Reset time to compare dates only
const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

if (endDateOnly < startDateOnly) {
  throw new Error('End date must be on or after start date');
}
```

#### 2. validateUTMParameters
**Purpose**: Enforce UTM requirements
**Triggers**: create, update
**Validations**:
- If ANY UTM parameter provided, utm_campaign is REQUIRED
- Format validation handled by field validators

**Implementation**:
```typescript
const hasAnyUTM = utmSource || utmMedium || utmTerm || utmContent;
if (hasAnyUTM && !utmCampaign) {
  throw new Error('utm_campaign is required when any UTM parameter is provided');
}
```

#### 3. validateTargets
**Purpose**: Validate target metrics logic
**Triggers**: create, update
**Validations**:
- If both provided, target_enrollments <= target_leads

**Implementation**:
```typescript
if (targetEnrollments !== null && targetLeads !== null) {
  if (targetEnrollments > targetLeads) {
    throw new Error('Target enrollments cannot exceed target leads');
  }
}
```

#### 4. validateStatusWorkflow
**Purpose**: Enforce status workflow rules
**Triggers**: update only
**Validations**:
- Once status='archived', it's TERMINAL (cannot change)

**Implementation**:
```typescript
if (originalStatus === 'archived' && newStatus !== 'archived') {
  throw new Error('Cannot change status from archived (terminal state)');
}
```

### beforeCreate / beforeUpdate Hooks (1 hook)

#### 5. trackCampaignCreator
**Purpose**: Auto-populate and enforce immutability of created_by (SP-001 Layer 3)
**Triggers**: create, update
**Logic**:
- CREATE: Auto-populate with req.user.id
- UPDATE: Reject any attempts to change created_by

**Implementation**:
```typescript
if (operation === 'create') {
  return req.user.id; // Auto-populate
}

if (operation === 'update') {
  if (originalCreatedBy !== newCreatedBy) {
    throw new Error('created_by field is immutable');
  }
  return originalCreatedBy; // Always return original
}
```

### afterChange Hooks (Analytics - 1 hook)

#### 6. calculateCampaignMetrics
**Purpose**: Calculate campaign analytics (performance-critical)
**Triggers**: create, update
**Performance**: <100ms for 10,000 leads
**Calculations**:
1. total_leads: COUNT(leads WHERE campaign = this)
2. total_conversions: COUNT(DISTINCT students with enrollments WHERE lead.campaign = this)
3. conversion_rate: (conversions / leads) * 100
4. cost_per_lead: budget / leads

**Performance Strategy**:
```typescript
// 1. Single query for total leads (no document loading)
const leadsResult = await payload.find({
  collection: 'leads',
  where: { campaign: { equals: campaignId } },
  limit: 0, // Count only
  pagination: false,
});

// 2. Query leads with conversions
const leadsWithConversions = await payload.find({
  collection: 'leads',
  where: {
    and: [
      { campaign: { equals: campaignId } },
      { converted_to_student: { exists: true } },
    ],
  },
});

// 3. Single query with IN operator for enrollments (no N+1)
const studentsWithEnrollments = await payload.find({
  collection: 'enrollments',
  where: {
    student: { in: studentIds }, // IN operator
  },
});

// 4. Calculate unique conversions
const uniqueStudents = new Set(
  studentsWithEnrollments.docs.map(e => e.student)
);
```

**Division by Zero Handling**:
```typescript
let conversionRate = undefined;
if (totalLeads > 0) {
  conversionRate = (totalConversions / totalLeads) * 100;
}

let costPerLead = undefined;
if (totalLeads > 0 && budget !== null) {
  costPerLead = budget / totalLeads;
}
```

## Access Control Implementation

### 6-Tier RBAC Matrix

| Operation | Public | Lectura | Asesor | Marketing | Gestor | Admin |
|-----------|--------|---------|--------|-----------|--------|-------|
| Create | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Read | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update | ❌ | ❌ | ❌ | ✅* | ✅ | ✅ |
| Delete | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

*Marketing: Own campaigns only (created_by = user.id)

### Ownership-Based Permissions

**Marketing Role - Update Access**:
```typescript
// Marketing users can only update campaigns they created
if (user.role === 'marketing') {
  return {
    created_by: {
      equals: user.id,
    },
  };
}
```

This returns a query constraint that filters campaigns by ownership.

### Field-Level Access Control

**Immutable Fields (5 fields)** - SP-001 Layer 2:
```typescript
{
  name: 'created_by',
  access: {
    read: ({ req: { user } }) => !!user,
    update: () => false, // Immutable
  },
}
```

Applied to:
- created_by
- total_leads
- total_conversions
- conversion_rate
- cost_per_lead

## Security Patterns Implementation

### SP-001: Defense in Depth (5 Immutable Fields)

Three-layer protection for created_by and calculated metrics:

**Layer 1: UI Protection**
```typescript
admin: {
  readOnly: true, // Disables field in admin UI
}
```

**Layer 2: Access Control Protection**
```typescript
access: {
  update: () => false, // Rejects all update attempts
}
```

**Layer 3: Hook Validation**
```typescript
// trackCampaignCreator hook
if (originalCreatedBy !== newCreatedBy) {
  throw new Error('created_by field is immutable');
}
```

### SP-004: No Business Intelligence in Logs

Error messages and logs NEVER contain:
- Budget amounts
- Target numbers
- Conversion rates
- Cost per lead
- Campaign names (use IDs instead)

**Implementation**:
```typescript
// ❌ WRONG - Exposes business intelligence
throw new Error(`Budget of €${budget} is invalid`);

// ✅ CORRECT - No business data
throw new Error('Budget validation failed');

// Logging
req.payload.logger.error({
  msg: 'Error calculating campaign metrics',
  campaignId: doc.id, // ID only, not name
  error: error.message, // Generic message
});
```

## Performance Optimizations

### 1. Query Optimization

**Problem**: N+1 queries when calculating conversions
**Solution**: Single query with IN operator

```typescript
// ❌ WRONG - N+1 queries
for (const studentId of studentIds) {
  const enrollments = await payload.find({
    collection: 'enrollments',
    where: { student: { equals: studentId } },
  });
}

// ✅ CORRECT - Single query
const enrollments = await payload.find({
  collection: 'enrollments',
  where: {
    student: { in: studentIds }, // Batch query
  },
});
```

### 2. Count-Only Queries

```typescript
// Use limit: 0, pagination: false for count-only queries
const result = await payload.find({
  collection: 'leads',
  where: { campaign: { equals: id } },
  limit: 0, // Don't load documents
  pagination: false,
});
const count = result.totalDocs; // Only count
```

### 3. Infinite Loop Prevention

```typescript
// Check if values actually changed before updating
if (
  doc.total_leads !== totalLeads ||
  doc.total_conversions !== totalConversions ||
  doc.conversion_rate !== conversionRate ||
  doc.cost_per_lead !== costPerLead
) {
  // Only update if changed
  await payload.update({ ... });
}
```

### 4. Database Indexes

```typescript
{
  name: 'name',
  index: true, // Index for fast lookups
  unique: true, // Enforces uniqueness
}

{
  name: 'created_by',
  index: true, // Index for ownership queries
}
```

## Test Coverage

### Test Suite Structure (120+ tests)

1. **CRUD Operations (15 tests)**
   - Create with all/minimal fields
   - Read by different roles
   - Update by different roles
   - Delete by different roles
   - Duplicate prevention

2. **Validation Tests (25 tests)**
   - Date validation (3 tests)
   - Budget validation (4 tests)
   - Target validation (5 tests)
   - UTM parameter validation (7 tests)
   - Status workflow validation (6 tests)

3. **Access Control Tests (18 tests)**
   - Create access by role (6 tests)
   - Read access by role (6 tests)
   - Update access by role (4 tests)
   - Delete access by role (2 tests)

4. **Relationship Tests (12 tests)**
   - Course relationship (4 tests)
   - User relationship (4 tests)
   - Lead relationship (4 tests)

5. **Hook Tests (15 tests)**
   - Validation hooks (10 tests)
   - Tracking hooks (3 tests)
   - Analytics hooks (2 tests)

6. **Security Tests (15 tests)**
   - SP-001 immutability (9 tests)
   - SP-004 log protection (3 tests)
   - Ownership enforcement (3 tests)

7. **Business Logic Tests (20 tests)**
   - Analytics calculation (8 tests)
   - Status workflow (4 tests)
   - Multi-campaign support (4 tests)
   - ROI calculations (4 tests)

### Test Execution

```bash
# Run all tests
npm test collections/Campaigns

# Run with coverage
npm test -- --coverage collections/Campaigns

# Watch mode
npm test -- --watch collections/Campaigns
```

## Database Schema

### PostgreSQL Table Structure

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  campaign_type VARCHAR(20) NOT NULL DEFAULT 'organic',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(10, 2),
  target_leads INTEGER,
  target_enrollments INTEGER,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  total_leads INTEGER DEFAULT 0 NOT NULL,
  total_conversions INTEGER DEFAULT 0 NOT NULL,
  conversion_rate DECIMAL(5, 2),
  cost_per_lead DECIMAL(10, 2),
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaigns_name ON campaigns(name);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_course_id ON campaigns(course_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_active ON campaigns(active);

-- Constraints
ALTER TABLE campaigns ADD CONSTRAINT chk_campaign_dates
  CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE campaigns ADD CONSTRAINT chk_budget
  CHECK (budget IS NULL OR budget >= 0);

ALTER TABLE campaigns ADD CONSTRAINT chk_targets
  CHECK (target_leads IS NULL OR target_leads >= 0);

ALTER TABLE campaigns ADD CONSTRAINT chk_target_enrollments
  CHECK (target_enrollments IS NULL OR target_enrollments >= 0);

ALTER TABLE campaigns ADD CONSTRAINT chk_target_relationship
  CHECK (
    target_enrollments IS NULL OR
    target_leads IS NULL OR
    target_enrollments <= target_leads
  );
```

## API Documentation

### REST API Endpoints

#### Create Campaign
```http
POST /api/campaigns
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Summer 2025 Campaign",
  "campaign_type": "paid_ads",
  "status": "draft",
  "start_date": "2025-06-01",
  "end_date": "2025-08-31",
  "budget": 5000,
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "summer-2025"
}

Response: 201 Created
{
  "doc": {
    "id": "uuid",
    "name": "Summer 2025 Campaign",
    "campaign_type": "paid_ads",
    "status": "draft",
    "created_by": "user-uuid",
    "total_leads": 0,
    "total_conversions": 0,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "updatedAt": "2025-06-01T00:00:00.000Z"
  }
}
```

#### List Campaigns
```http
GET /api/campaigns?where[status][equals]=active&limit=10&page=1
Authorization: Bearer {token}

Response: 200 OK
{
  "docs": [...],
  "totalDocs": 42,
  "totalPages": 5,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true
}
```

#### Get Campaign by ID
```http
GET /api/campaigns/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "name": "Summer 2025 Campaign",
  "total_leads": 150,
  "total_conversions": 30,
  "conversion_rate": 20,
  "cost_per_lead": 33.33
}
```

#### Update Campaign
```http
PATCH /api/campaigns/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "active",
  "budget": 6000
}

Response: 200 OK
{
  "doc": { ... }
}
```

#### Delete Campaign
```http
DELETE /api/campaigns/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "doc": { ... }
}
```

### GraphQL API

#### Schema
```graphql
type Campaign {
  id: String!
  name: String!
  campaign_type: CampaignTypeEnum!
  status: CampaignStatusEnum!
  start_date: DateTime!
  end_date: DateTime
  budget: Float
  target_leads: Int
  target_enrollments: Int
  utm_source: String
  utm_medium: String
  utm_campaign: String
  utm_term: String
  utm_content: String
  course: Course
  created_by: User!
  total_leads: Int!
  total_conversions: Int!
  conversion_rate: Float
  cost_per_lead: Float
  active: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum CampaignTypeEnum {
  email
  social
  paid_ads
  organic
  event
  referral
  other
}

enum CampaignStatusEnum {
  draft
  active
  paused
  completed
  archived
}
```

#### Queries
```graphql
query GetCampaigns {
  Campaigns(where: { status: { equals: active } }) {
    docs {
      id
      name
      campaign_type
      total_leads
      conversion_rate
      cost_per_lead
    }
  }
}

query GetCampaign($id: String!) {
  Campaign(id: $id) {
    id
    name
    status
    start_date
    end_date
    budget
    total_leads
    total_conversions
    conversion_rate
    cost_per_lead
    course {
      id
      name
    }
    created_by {
      id
      email
    }
  }
}
```

#### Mutations
```graphql
mutation CreateCampaign($data: mutationCampaignInput!) {
  createCampaign(data: $data) {
    id
    name
    status
    created_by {
      id
      email
    }
  }
}

mutation UpdateCampaign($id: String!, $data: mutationCampaignUpdateInput!) {
  updateCampaign(id: $id, data: $data) {
    id
    name
    status
    total_leads
  }
}

mutation DeleteCampaign($id: String!) {
  deleteCampaign(id: $id) {
    id
    name
  }
}
```

## Integration Points

### Lead Creation Integration

When a lead is created with a campaign association:
1. Lead is created in Leads collection
2. calculateCampaignMetrics hook is triggered
3. total_leads is incremented
4. cost_per_lead is recalculated (if budget set)

### Lead Conversion Integration

When a lead converts to student with enrollment:
1. Student is created with converted_from_lead reference
2. Enrollment is created for student
3. calculateCampaignMetrics hook is triggered
4. total_conversions is incremented
5. conversion_rate is recalculated

### Course Association

Campaigns can be associated with courses:
- Relationship: Many-to-One (multiple campaigns → one course)
- On Delete: SET NULL (campaign remains, course reference removed)
- Query Pattern: Find campaigns by course

## Deployment Considerations

### Environment Variables

No specific environment variables required. Uses standard Payload configuration.

### Database Migrations

Run migrations after deploying collection:
```bash
npm run payload migrate
```

### Performance Monitoring

Monitor these metrics:
- Campaign metrics calculation time (<100ms target)
- Query performance for campaigns with >10,000 leads
- Database index usage
- API response times

### Backup Strategy

Critical data to backup:
- Campaign configurations (name, dates, budgets, targets)
- UTM parameters (for attribution analysis)
- Historical calculated metrics (for trend analysis)

## Troubleshooting

### Metrics Not Calculating

**Symptom**: total_leads, total_conversions remain 0
**Causes**:
1. calculateCampaignMetrics hook not registered
2. Leads not properly associated with campaign
3. Hook error being silently caught

**Solution**:
```typescript
// Check hook registration in collection config
hooks: {
  afterChange: [calculateCampaignMetrics],
}

// Check lead association
const lead = await payload.findByID({
  collection: 'leads',
  id: leadId,
});
console.log('Campaign:', lead.campaign); // Should be campaign ID
```

### Ownership Permissions Not Working

**Symptom**: Marketing users can't update their own campaigns
**Causes**:
1. created_by not set correctly
2. Access control function not returning query constraint

**Solution**:
```typescript
// Verify created_by is set
const campaign = await payload.findByID({
  collection: 'campaigns',
  id: campaignId,
});
console.log('Created by:', campaign.created_by);

// Verify access control returns query
const access = canUpdateCampaigns({ req: { user: marketingUser } });
console.log('Access constraint:', access);
// Should be: { created_by: { equals: 'user-id' } }
```

### Status Workflow Errors

**Symptom**: Cannot change campaign status
**Causes**:
1. Attempting to change from archived status
2. Date validation failing

**Solution**:
```typescript
// Check current status
const campaign = await payload.findByID({
  collection: 'campaigns',
  id: campaignId,
});

if (campaign.status === 'archived') {
  // Cannot change from archived - create new campaign
  console.log('Campaign is archived, create new campaign instead');
}
```

## Future Enhancements

Potential improvements for future versions:

1. **Advanced Analytics**
   - Revenue tracking per campaign
   - Multi-touch attribution
   - Lifetime value calculation

2. **A/B Testing**
   - Campaign variant management
   - Statistical significance testing
   - Winner selection automation

3. **Budget Alerts**
   - Automated notifications when budget thresholds reached
   - Spend pacing alerts
   - ROI threshold warnings

4. **Scheduling**
   - Automated status changes based on dates
   - Recurring campaign templates
   - Auto-archiving of old campaigns

5. **Reporting**
   - Custom report builder
   - Scheduled report exports
   - Dashboard widgets

## Version History

### v1.0.0 (2025-10-30)
- Initial implementation
- 20 fields covering campaign lifecycle
- 6-tier RBAC with ownership-based permissions
- Performance-optimized analytics
- 120+ test coverage
- SP-001 and SP-004 security patterns

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-30
**Maintainer**: SOLARIA AGENCY Development Team
