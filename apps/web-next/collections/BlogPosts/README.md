# BlogPosts Collection

SEO-optimized blog/news content management with multi-language support for CEPComunicacion v2.

## Overview

The BlogPosts collection manages educational blog content, tutorials, announcements, and case studies with comprehensive SEO features and multi-language support (Spanish, English, Catalan).

## Features

- **22 Fields** covering complete blog post lifecycle
- **Multi-language Support**: Spanish (es), English (en), Catalan (ca)
- **SEO Optimization**:
  - Auto-generated slugs with Spanish character normalization
  - Meta title/description fields
  - Keywords management
  - Read time calculation (200 words/minute)
- **Rich Content**: Slate rich text editor
- **Taxonomy**: Categories, tags, featured posts
- **Relationships**: Course and cycle associations
- **6-Tier RBAC**: Granular role-based permissions
- **Ownership-based Permissions**: Marketing users can only edit their own posts
- **View Tracking**: Immutable view counter
- **Publication Management**: Draft/published/archived states
- **Soft Delete**: Active flag for non-destructive removal

## Schema

### Basic Information (5 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `title` | text | Yes | unique, 5-200 chars | Post title |
| `slug` | text | Yes | unique, lowercase-hyphen | URL-friendly identifier |
| `status` | select | Yes | draft, published, archived | Publication status |
| `language` | select | Yes | es, en, ca | Content language |
| `published_at` | date | No | - | Publication timestamp |

### Content (3 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `excerpt` | textarea | Yes | 20-300 chars | Short summary |
| `content` | richText | Yes | - | Main post content (Slate) |
| `featured_image` | upload | No | relationTo: media | Featured image |

### Taxonomy & Metadata (4 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `author` | relationship | Yes | relationTo: users | Content author |
| `category` | select | Yes | news, tutorial, etc. | Post category |
| `tags` | array | No | max 10, 2-30 chars each | Tags for search |
| `read_time` | number | Auto | IMMUTABLE | Estimated reading time |

### Relationships (2 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `related_course` | relationship | No | relationTo: courses | Associated course |
| `related_cycle` | relationship | No | relationTo: cycles | Associated cycle |

### SEO Fields (3 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `seo_title` | text | No | max 60 chars | Meta title (auto-filled) |
| `seo_description` | textarea | No | max 160 chars | Meta description |
| `seo_keywords` | array | No | max 10 | SEO keywords |

### Engagement & Tracking (3 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `view_count` | number | Auto | IMMUTABLE | Total views |
| `featured` | checkbox | No | default: false | Featured on homepage |
| `allow_comments` | checkbox | No | default: true | Enable comments |

### Audit & Soft Delete (2 fields)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `created_by` | relationship | Auto | IMMUTABLE | Post creator |
| `active` | checkbox | No | default: true | Soft delete flag |

## Access Control (6-Tier RBAC)

### Create
- **Allowed**: marketing, gestor, admin
- **Denied**: public, lectura, asesor

### Read
- **Public**: Published and active posts only
- **Authenticated**: All posts (regardless of status/active)

### Update
- **Admin, Gestor**: All posts
- **Marketing**: Own posts only (`created_by = user.id`)
- **Denied**: lectura, asesor

### Delete
- **Allowed**: gestor, admin
- **Denied**: marketing, lectura, asesor
- **Note**: Marketing should use soft delete (`active = false`)

## Security Patterns

### SP-001: Defense in Depth (3-Layer Immutability)

**Immutable Fields**:
- `created_by` (who created the post)
- `view_count` (system-managed view counter)
- `read_time` (system-calculated reading time)

**Layer 1**: UI protection (`readOnly: true`)
**Layer 2**: Access control (`update: () => false`)
**Layer 3**: Hook validation (rejects/overrides changes)

### SP-004: No Content in Logs

Error logs contain only post IDs, never content, titles, or sensitive data.

## Hooks

### Before Validate

**validateSlug** (`hooks/validateSlug.ts`)
- Auto-generates slug from title if not provided
- Normalizes Spanish characters (á → a, ñ → n)
- Converts to lowercase with hyphens
- Removes special characters

### Before Change

**validateSEO** (`hooks/validateSEO.ts`)
- Auto-populates `seo_title` from `title` if empty
- Truncates to 60 characters for SEO best practices

**calculateReadTime** (`hooks/calculateReadTime.ts`)
- Extracts text from rich text content
- Counts words
- Calculates read time at 200 words/minute
- Minimum 1 minute

**setPublishedTimestamp** (`hooks/setPublishedTimestamp.ts`)
- Sets `published_at` when `status` changes to 'published'
- Only sets on first publish (preserves existing timestamp)

### Before Create/Update

**trackBlogPostCreator** (`hooks/trackBlogPostCreator.ts`)
- Auto-populates `created_by` on creation
- Enforces `created_by` immutability (SP-001 Layer 3)

## Validation

### Custom Validators

**slugValidator** (`validators/slugValidator.ts`)
- Ensures slug contains only: `[a-z0-9-]`
- Rejects uppercase, spaces, special characters

## Usage Examples

### Creating a Blog Post

```typescript
const blogPost = await payload.create({
  collection: 'blog-posts',
  data: {
    title: 'Getting Started with Online Education',
    excerpt: 'Learn how to start your online education journey with our comprehensive guide.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'This is the main content...' }],
          },
        ],
      },
    },
    author: 'user-id',
    category: 'tutorial',
    tags: ['online-education', 'beginners'],
  },
  user: currentUser,
});

// Result:
// - slug: auto-generated as "getting-started-with-online-education"
// - seo_title: auto-filled as "Getting Started with Online Education"
// - read_time: auto-calculated from content
// - created_by: auto-set to currentUser.id
// - view_count: initialized to 0
```

### Querying Published Posts (Public)

```typescript
const posts = await payload.find({
  collection: 'blog-posts',
  // No user context = public access
  where: {
    language: {
      equals: 'es',
    },
  },
});
// Returns only posts with status='published' AND active=true
```

### Querying All Posts (Authenticated)

```typescript
const posts = await payload.find({
  collection: 'blog-posts',
  user: authenticatedUser,
});
// Returns all posts regardless of status/active
```

### Updating Own Post (Marketing)

```typescript
const updated = await payload.update({
  collection: 'blog-posts',
  id: postId,
  data: {
    title: 'Updated Title',
  },
  user: marketingUser,
});
// Success if marketingUser.id === post.created_by
// Fails with permission error otherwise
```

### Publishing a Post

```typescript
const published = await payload.update({
  collection: 'blog-posts',
  id: postId,
  data: {
    status: 'published',
  },
  user: adminUser,
});
// Automatically sets published_at to current timestamp (if not already set)
```

### Soft Delete

```typescript
const deleted = await payload.update({
  collection: 'blog-posts',
  id: postId,
  data: {
    active: false,
  },
  user: marketingUser,
});
// Post no longer visible to public queries
```

### Featured Posts Query

```typescript
const featured = await payload.find({
  collection: 'blog-posts',
  where: {
    featured: {
      equals: true,
    },
    status: {
      equals: 'published',
    },
  },
  limit: 5,
});
```

## SEO Best Practices

### Slug Generation

- Auto-generated from title
- Spanish character normalization:
  - `á, é, í, ó, ú` → `a, e, i, o, u`
  - `ñ` → `n`
  - `ü` → `u`
- Lowercase with hyphens
- No special characters

**Example**:
- Title: `"Introducción a la Educación Ágil"`
- Slug: `"introduccion-a-la-educacion-agil"`

### Meta Title

- Auto-populated from `title` if not provided
- Truncated to 60 characters (SEO best practice)
- Can be manually overridden

### Meta Description

- Manual entry recommended
- Max 160 characters
- Should be compelling and include target keywords

### Read Time

- Auto-calculated from content
- Standard 200 words/minute reading speed
- Rounded up to nearest minute
- Minimum 1 minute

## Relationships

### Course Association

```typescript
related_course: 'course-id'
```
- Links blog post to specific course
- SET NULL on course deletion (preserves post)

### Cycle Association

```typescript
related_cycle: 'cycle-id'
```
- Links blog post to professional training cycle
- SET NULL on cycle deletion (preserves post)

## Testing

**Test Suite**: `__tests__/BlogPosts.test.ts`
**Total Tests**: 80+

### Test Categories
- CRUD Operations (12 tests)
- Validation Tests (18 tests)
- Access Control Tests (15 tests)
- Relationship Tests (8 tests)
- Hook Tests (12 tests)
- Security Tests (10 tests)
- SEO Tests (5 tests)

### Running Tests

```bash
# Run all BlogPosts tests
npm test -- BlogPosts.test.ts

# Run specific test suite
npm test -- BlogPosts.test.ts -t "CRUD Operations"

# Run with coverage
npm test -- BlogPosts.test.ts --coverage
```

## File Structure

```
collections/BlogPosts/
├── index.ts                          # Main collection definition
├── access/
│   ├── canCreateBlogPosts.ts        # Create permission logic
│   ├── canReadBlogPosts.ts          # Read permission logic
│   ├── canUpdateBlogPosts.ts        # Update permission logic (ownership)
│   ├── canDeleteBlogPosts.ts        # Delete permission logic
│   └── index.ts                     # Access exports
├── hooks/
│   ├── validateSlug.ts              # Auto-generate slug
│   ├── validateSEO.ts               # Auto-populate SEO fields
│   ├── calculateReadTime.ts         # Calculate reading time
│   ├── setPublishedTimestamp.ts     # Manage published_at
│   ├── trackBlogPostCreator.ts      # Enforce created_by immutability
│   └── index.ts                     # Hook exports
├── validators/
│   └── slugValidator.ts             # Slug format validation
├── __tests__/
│   └── BlogPosts.test.ts            # Test suite (80+ tests)
├── README.md                         # This file
└── IMPLEMENTATION_SUMMARY.md         # Implementation report
```

## TypeScript Types

After running Payload type generation:

```typescript
import type { BlogPost } from '../payload-types';

// Usage
const post: BlogPost = {
  title: 'My Post',
  slug: 'my-post',
  status: 'published',
  language: 'es',
  excerpt: 'Short summary...',
  content: { /* rich text */ },
  author: 'user-id',
  category: 'tutorial',
  // ... etc
};
```

## Admin UI

**Group**: Content
**Title Field**: `title`
**Default Columns**: title, status, language, category, published_at, view_count, featured, active

**Sidebar Fields**:
- status
- language
- published_at
- category
- read_time
- view_count
- featured
- allow_comments
- created_by
- active

## Performance Considerations

- **Indexed Fields**: title, slug, author, created_by
- **Slug normalization**: O(n) where n = title length
- **Read time calculation**: O(n) where n = content length
- **View tracking**: Immutable field prevents accidental updates

## Future Enhancements

1. **Comment System**: Dedicated Comments collection with relationship to BlogPosts
2. **Analytics**: Track views, shares, engagement metrics
3. **Scheduling**: Future publication dates
4. **A/B Testing**: Multiple versions for testing
5. **AI Content Generation**: Integration with LLM for drafts
6. **Translation Management**: Linking related posts across languages
7. **Media Gallery**: Multiple images per post
8. **Social Sharing**: Auto-generate social media preview cards

## Related Collections

- **Users** (author, created_by)
- **Media** (featured_image)
- **Courses** (related_course)
- **Cycles** (related_cycle)

## Compliance

- **RGPD**: No PII in blog posts (unless explicitly in content)
- **SP-004**: No content in error logs
- **Audit Trail**: created_by tracking + timestamps

## Support

For issues or questions:
- Check test suite for usage examples
- Review IMPLEMENTATION_SUMMARY.md for detailed specs
- Contact: SOLARIA AGENCY development team
