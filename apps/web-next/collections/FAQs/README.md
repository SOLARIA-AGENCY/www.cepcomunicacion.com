# FAQs Collection

Frequently Asked Questions management with categorization, search optimization, and engagement tracking for CEPComunicacion v2.

## Overview

The FAQs collection provides a structured help center with category-based organization, multi-language support, and engagement metrics tracking.

## Features

- **12 Fields** covering FAQ lifecycle and engagement
- **Multi-language Support**: Spanish (es), English (en), Catalan (ca)
- **Category-based Organization**: general, enrollment, courses, payment, technical, other
- **Display Order Management**: Customizable ordering within categories
- **Search Optimization**: Keywords for improved findability
- **Rich Content**: Slate rich text editor for answers
- **Relationships**: Course and cycle associations
- **Engagement Tracking**: Helpful votes and view counts (immutable)
- **6-Tier RBAC**: Granular role-based permissions
- **Ownership-based Permissions**: Marketing users can only edit their own FAQs
- **Soft Delete**: Active flag for non-destructive removal

## Schema

### Basic Information (4 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `question` | text | Yes | 10-300 chars | The FAQ question |
| `answer` | richText | Yes | - | Detailed answer (Slate) |
| `category` | select | Yes | 6 options | FAQ category |
| `language` | select | Yes | es, en, ca | Content language |

### Organization (1 field)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `order` | number | No | >= 0, default: 0 | Display order in category |

### Relationships (2 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `related_course` | relationship | No | relationTo: courses | Associated course |
| `related_cycle` | relationship | No | relationTo: cycles | Associated cycle |

### Search Optimization (1 field)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `keywords` | array | No | max 10 | Search keywords |

### Engagement Tracking (2 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `helpful_count` | number | Auto | IMMUTABLE | Positive votes |
| `view_count` | number | Auto | IMMUTABLE | Total views |

### Audit & Soft Delete (2 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `created_by` | relationship | Auto | IMMUTABLE | FAQ creator |
| `active` | checkbox | No | default: true | Soft delete flag |

## Access Control (6-Tier RBAC)

### Create
- **Allowed**: marketing, gestor, admin
- **Denied**: public, lectura, asesor

### Read
- **Public**: Active FAQs only
- **Authenticated**: All FAQs

### Update
- **Admin, Gestor**: All FAQs
- **Marketing**: Own FAQs only (`created_by = user.id`)
- **Denied**: lectura, asesor

### Delete
- **Allowed**: gestor, admin
- **Denied**: marketing, lectura, asesor
- **Note**: Marketing should use soft delete (`active = false`)

## Security Patterns

### SP-001: Defense in Depth (3-Layer Immutability)

**Immutable Fields**:
- `created_by` (FAQ creator)
- `helpful_count` (system-managed helpful votes)
- `view_count` (system-managed view counter)

**Layer 1**: UI protection (`readOnly: true`)
**Layer 2**: Access control (`update: () => false`)
**Layer 3**: Hook validation (rejects/overrides changes)

### SP-004: No Content in Logs

Error logs contain only FAQ IDs, never question/answer content.

## Hooks

### Before Change

**validateOrder** (`hooks/validateOrder.ts`)
- Ensures `order >= 0`
- Converts negative values to 0
- Defaults to 0 if not provided

### Before Create/Update

**trackFAQCreator** (`hooks/trackFAQCreator.ts`)
- Auto-populates `created_by` on creation
- Enforces `created_by` immutability (SP-001 Layer 3)

## Usage Examples

### Creating a FAQ

```typescript
const faq = await payload.create({
  collection: 'faqs',
  data: {
    question: 'How do I enroll in a course?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { text: 'To enroll, visit the course page and click "Enroll Now"...' }
            ],
          },
        ],
      },
    },
    category: 'enrollment',
    language: 'es',
    order: 1,
    keywords: ['enrollment', 'registration'],
  },
  user: currentUser,
});

// Result:
// - created_by: auto-set to currentUser.id
// - helpful_count: initialized to 0
// - view_count: initialized to 0
// - active: default true
```

### Querying Active FAQs (Public)

```typescript
const faqs = await payload.find({
  collection: 'faqs',
  where: {
    category: {
      equals: 'enrollment',
    },
    language: {
      equals: 'es',
    },
  },
  sort: 'order',
});
// Returns only active FAQs, sorted by order
```

### Querying FAQs by Category (Authenticated)

```typescript
const enrollmentFAQs = await payload.find({
  collection: 'faqs',
  user: authenticatedUser,
  where: {
    category: {
      equals: 'enrollment',
    },
  },
  sort: 'order',
});
// Returns all FAQs (including inactive), sorted by order
```

### Updating Own FAQ (Marketing)

```typescript
const updated = await payload.update({
  collection: 'faqs',
  id: faqId,
  data: {
    answer: { /* updated rich text */ },
  },
  user: marketingUser,
});
// Success if marketingUser.id === faq.created_by
```

### Soft Delete

```typescript
await payload.update({
  collection: 'faqs',
  id: faqId,
  data: {
    active: false,
  },
  user: marketingUser,
});
// FAQ no longer visible to public queries
```

## Categories

| Value | Label | Use Case |
|-------|-------|----------|
| `general` | General | General information |
| `enrollment` | Enrollment | Registration process |
| `courses` | Courses | Course information |
| `payment` | Payment | Payment and billing |
| `technical` | Technical | Technical support |
| `other` | Other | Miscellaneous |

## Testing

**Test Suite**: `__tests__/FAQs.test.ts`
**Total Tests**: 60+

### Test Categories
- CRUD Operations (10 tests)
- Validation Tests (12 tests)
- Access Control Tests (12 tests)
- Relationship Tests (6 tests)
- Hook Tests (8 tests)
- Security Tests (8 tests)
- Categorization Tests (4 tests)

### Running Tests

```bash
# Run all FAQs tests
npm test -- FAQs.test.ts

# Run specific test suite
npm test -- FAQs.test.ts -t "CRUD Operations"

# Run with coverage
npm test -- FAQs.test.ts --coverage
```

## File Structure

```
collections/FAQs/
├── index.ts                          # Main collection definition
├── access/
│   ├── canCreateFAQs.ts             # Create permission logic
│   ├── canReadFAQs.ts               # Read permission logic
│   ├── canUpdateFAQs.ts             # Update permission logic (ownership)
│   ├── canDeleteFAQs.ts             # Delete permission logic
│   └── index.ts                     # Access exports
├── hooks/
│   ├── validateOrder.ts             # Ensure order >= 0
│   ├── trackFAQCreator.ts           # Enforce created_by immutability
│   └── index.ts                     # Hook exports
├── __tests__/
│   └── FAQs.test.ts                 # Test suite (60+ tests)
├── README.md                         # This file
└── IMPLEMENTATION_SUMMARY.md         # Implementation report
```

## Admin UI

**Group**: Content
**Title Field**: `question`
**Default Columns**: question, category, language, order, view_count, helpful_count, active

**Sidebar Fields**:
- category
- language
- order
- helpful_count (read-only)
- view_count (read-only)
- created_by (read-only)
- active

## Performance Considerations

- **Indexed Fields**: question, created_by
- **Order validation**: O(1) constant time
- **Query by category**: O(log n) with index
- **Sort by order**: O(n log n) standard sorting

## Future Enhancements

1. **Helpful Voting System**: Public endpoint to increment `helpful_count`
2. **Search Functionality**: Full-text search on question/answer/keywords
3. **Related FAQs**: Suggest similar FAQs based on keywords
4. **FAQ Analytics**: Track which FAQs are most viewed/helpful
5. **Auto-translation**: Link FAQ versions across languages
6. **FAQ Feedback**: Collect user feedback beyond helpful votes

## Related Collections

- **Users** (created_by)
- **Courses** (related_course)
- **Cycles** (related_cycle)

## Compliance

- **RGPD**: No PII in FAQs (unless explicitly in content)
- **SP-004**: No content in error logs
- **Audit Trail**: created_by tracking + timestamps

## Support

For issues or questions:
- Check test suite for usage examples
- Review IMPLEMENTATION_SUMMARY.md for detailed specs
- Contact: SOLARIA AGENCY development team
