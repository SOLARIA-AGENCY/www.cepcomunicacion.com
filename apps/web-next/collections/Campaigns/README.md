# Campaigns Collection - User Documentation

## Overview

The Campaigns collection manages marketing campaigns with comprehensive UTM tracking, budget allocation, and automated ROI analytics. This collection is essential for tracking marketing performance, lead attribution, and campaign effectiveness.

## Features

- **Campaign Management**: Create and manage marketing campaigns across multiple channels
- **UTM Tracking**: Full UTM parameter support for accurate attribution
- **Budget Control**: Track budgets and calculate cost per lead automatically
- **ROI Analytics**: Automated calculation of leads, conversions, rates, and costs
- **Status Workflow**: Enforced campaign lifecycle from draft to archived
- **Multi-Channel**: Support for email, social, paid ads, organic, events, and referrals
- **Ownership-Based Permissions**: Marketing users can only edit their own campaigns
- **Performance Optimized**: Handles 10,000+ leads per campaign efficiently

## Collection Details

- **Slug**: `campaigns`
- **Total Fields**: 20
- **Access Control**: 6-tier RBAC with ownership-based permissions
- **Security Patterns**: SP-001 (immutability), SP-004 (no PII in logs)
- **Performance**: <100ms metrics calculation for 10,000 leads

## Fields Reference

### Basic Information (5 fields)

#### 1. name (required, unique)
- **Type**: Text
- **Validation**: 3-100 characters, unique
- **Description**: Campaign display name
- **Example**: "Summer 2025 Facebook Ads"

#### 2. campaign_type (required)
- **Type**: Select
- **Options**:
  - `email` - Email marketing
  - `social` - Social media campaigns
  - `paid_ads` - Paid advertising (Facebook, Google, etc.)
  - `organic` - Organic traffic campaigns
  - `event` - Event-based marketing
  - `referral` - Referral programs
  - `other` - Other campaign types
- **Default**: `organic`

#### 3. status (required)
- **Type**: Select
- **Options**:
  - `draft` - Campaign being planned (cannot have past start date)
  - `active` - Currently running
  - `paused` - Temporarily stopped
  - `completed` - Finished successfully
  - `archived` - **TERMINAL STATE** (cannot change from archived)
- **Default**: `draft`
- **Workflow**: Once archived, status cannot be changed

#### 4. start_date (required)
- **Type**: Date
- **Validation**: Cannot be in past if status = draft
- **Description**: Campaign start date

#### 5. end_date (optional)
- **Type**: Date
- **Validation**: Must be >= start_date (same day allowed)
- **Description**: Campaign end date

### Budget & Targets (3 fields)

#### 6. budget (optional)
- **Type**: Number (Euro amount)
- **Validation**: Min 0, 2 decimal places
- **Description**: Total campaign budget in euros
- **Used for**: Cost per lead calculation

#### 7. target_leads (optional)
- **Type**: Integer
- **Validation**: Min 0, must be integer
- **Description**: Target number of leads to capture

#### 8. target_enrollments (optional)
- **Type**: Integer
- **Validation**: Min 0, must be integer, must be <= target_leads
- **Description**: Target number of enrollments/conversions

### UTM Tracking Parameters (5 fields)

All UTM parameters must be **lowercase alphanumeric with hyphens only** (pattern: `^[a-z0-9-]+$`).

#### 9. utm_source (optional)
- **Example**: `facebook`, `google`, `instagram`
- **Description**: Traffic source identifier

#### 10. utm_medium (optional)
- **Example**: `cpc`, `email`, `social`, `banner`
- **Description**: Marketing medium

#### 11. utm_campaign (required if any UTM used)
- **Example**: `summer-2025`, `back-to-school`
- **Description**: Campaign identifier
- **Rule**: REQUIRED if any other UTM parameter is provided

#### 12. utm_term (optional)
- **Example**: `curso-online`, `formacion-profesional`
- **Description**: Paid search keywords (for SEM campaigns)

#### 13. utm_content (optional)
- **Example**: `variant-a`, `blue-cta`, `header-banner`
- **Description**: Content variation for A/B testing

### UTM Parameter Rules

1. **Format**: All UTM parameters must be lowercase with only alphanumeric characters and hyphens
   - ✅ Valid: `facebook-ads`, `summer-2025`, `variant-a1`
   - ❌ Invalid: `Facebook_Ads`, `summer 2025`, `variant@a`

2. **Requirement**: If you provide ANY UTM parameter (source, medium, term, or content), you MUST provide `utm_campaign`

3. **URL Construction**: UTM parameters are appended to URLs like:
   ```
   https://cepcomunicacion.com/cursos?utm_source=facebook&utm_medium=cpc&utm_campaign=summer-2025&utm_content=variant-a
   ```

### Relationships (2 fields)

#### 14. course (optional)
- **Type**: Relationship to Courses
- **Description**: Course targeted by this campaign
- **Note**: Multiple campaigns can target the same course
- **On Delete**: SET NULL

#### 15. created_by (auto-populated, IMMUTABLE)
- **Type**: Relationship to Users
- **Description**: User who created the campaign
- **Auto-populated**: Set automatically on creation
- **Immutability**: Cannot be changed after creation (SP-001 pattern)

### Calculated Metrics (4 fields - READ ONLY)

These fields are automatically calculated and cannot be edited manually.

#### 16. total_leads (auto-calculated)
- **Type**: Number
- **Calculation**: COUNT(leads WHERE campaign = this campaign)
- **Description**: Total leads captured by this campaign
- **Updates**: Automatically when leads are created/updated

#### 17. total_conversions (auto-calculated)
- **Type**: Number
- **Calculation**: COUNT(DISTINCT students with enrollments WHERE lead.campaign = this)
- **Description**: Number of leads that converted to enrolled students
- **Updates**: Automatically when enrollments are created

#### 18. conversion_rate (auto-calculated)
- **Type**: Number (percentage)
- **Calculation**: (total_conversions / total_leads) * 100
- **Description**: Percentage of leads that converted
- **Special**: Returns `undefined` if no leads (avoids division by zero)
- **Example**: 20 conversions / 100 leads = 20%

#### 19. cost_per_lead (auto-calculated)
- **Type**: Number (euros)
- **Calculation**: budget / total_leads
- **Description**: Average cost per lead captured
- **Special**: Returns `undefined` if no leads or no budget
- **Example**: €5,000 budget / 100 leads = €50 per lead

### System Fields (1 field)

#### 20. active (soft delete)
- **Type**: Checkbox
- **Default**: true
- **Description**: Campaign is active and visible
- **Usage**: Uncheck to soft delete (hide campaign without permanent deletion)

## Access Control Matrix

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| **Public** | ❌ | ❌ | ❌ | ❌ |
| **Lectura** | ❌ | ✅ | ❌ | ❌ |
| **Asesor** | ❌ | ✅ | ❌ | ❌ |
| **Marketing** | ✅ | ✅ | ✅ (own only)* | ❌ |
| **Gestor** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |

*Marketing users can only update campaigns where `created_by = their user ID`

## Campaign Status Workflow

```
draft ──────┐
            │
            ▼
         active ──────┐
            │         │
            ▼         ▼
         paused    completed
            │         │
            └────┬────┘
                 │
                 ▼
             archived (TERMINAL - Cannot change from this state)
```

### Status Transition Rules

1. **Draft**: Initial state, can transition to any active state
   - Restriction: Cannot have start_date in the past
2. **Active**: Campaign is running, can pause or complete
3. **Paused**: Temporarily stopped, can resume (active) or complete
4. **Completed**: Successfully finished, can be archived
5. **Archived**: TERMINAL STATE - once archived, status cannot be changed

## Usage Examples

### Create a Basic Campaign

```typescript
const campaign = await payload.create({
  collection: 'campaigns',
  data: {
    name: 'Fall 2025 Email Campaign',
    campaign_type: 'email',
    status: 'draft',
    start_date: '2025-09-01',
    end_date: '2025-11-30',
    budget: 3000,
    target_leads: 150,
    target_enrollments: 30,
  },
  user: currentUser,
});
```

### Create Campaign with UTM Tracking

```typescript
const campaign = await payload.create({
  collection: 'campaigns',
  data: {
    name: 'Summer Facebook Ads',
    campaign_type: 'paid_ads',
    status: 'active',
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    budget: 10000,
    // UTM parameters for tracking
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'summer-2025', // REQUIRED when using UTM
    utm_content: 'carousel-ad',
  },
  user: currentUser,
});
```

### Query Campaigns with Filters

```typescript
// Get all active campaigns
const activeCampaigns = await payload.find({
  collection: 'campaigns',
  where: {
    status: {
      equals: 'active',
    },
    active: {
      equals: true,
    },
  },
});

// Get campaigns by course
const courseCampaigns = await payload.find({
  collection: 'campaigns',
  where: {
    course: {
      equals: courseId,
    },
  },
});

// Get campaigns created by specific user (Marketing)
const myCampaigns = await payload.find({
  collection: 'campaigns',
  where: {
    created_by: {
      equals: userId,
    },
  },
});
```

### Update Campaign Status

```typescript
// Activate a draft campaign
const activated = await payload.update({
  collection: 'campaigns',
  id: campaignId,
  data: {
    status: 'active',
  },
  user: currentUser,
});

// Complete a campaign
const completed = await payload.update({
  collection: 'campaigns',
  id: campaignId,
  data: {
    status: 'completed',
  },
  user: currentUser,
});
```

### View Campaign Analytics

```typescript
const campaign = await payload.findByID({
  collection: 'campaigns',
  id: campaignId,
});

console.log(`Campaign: ${campaign.name}`);
console.log(`Total Leads: ${campaign.total_leads}`);
console.log(`Conversions: ${campaign.total_conversions}`);
console.log(`Conversion Rate: ${campaign.conversion_rate}%`);
console.log(`Cost per Lead: €${campaign.cost_per_lead}`);

// Calculate ROI
const revenue = campaign.total_conversions * averageStudentValue;
const roi = ((revenue - campaign.budget) / campaign.budget) * 100;
console.log(`ROI: ${roi}%`);
```

## Validation Rules Summary

| Rule | Description |
|------|-------------|
| **Unique name** | Campaign names must be unique across all campaigns |
| **Date logic** | end_date >= start_date (same day allowed) |
| **Draft dates** | Draft campaigns cannot have past start dates |
| **Target logic** | target_enrollments <= target_leads (if both provided) |
| **UTM requirement** | utm_campaign REQUIRED if any UTM parameter provided |
| **UTM format** | Lowercase alphanumeric with hyphens only (^[a-z0-9-]+$) |
| **Status workflow** | Cannot change status from 'archived' (terminal) |
| **Immutability** | created_by and calculated metrics cannot be changed |

## Common Errors and Solutions

### Error: "End date must be on or after start date"
**Cause**: end_date is before start_date
**Solution**: Ensure end_date is the same day or later than start_date

### Error: "Draft campaigns cannot have past start dates"
**Cause**: Creating a draft campaign with start_date in the past
**Solution**: Use today's date or future date for draft campaigns, or change status to 'active'

### Error: "Target enrollments cannot exceed target leads"
**Cause**: target_enrollments > target_leads
**Solution**: Set target_enrollments to be equal to or less than target_leads

### Error: "utm_campaign is required when any UTM parameter is provided"
**Cause**: Provided utm_source, utm_medium, utm_term, or utm_content without utm_campaign
**Solution**: Add utm_campaign parameter

### Error: "UTM parameters must be lowercase alphanumeric with hyphens only"
**Cause**: UTM parameter contains uppercase, spaces, underscores, or special characters
**Solution**: Use only lowercase letters, numbers, and hyphens

### Error: "Cannot change status from archived (terminal state)"
**Cause**: Attempting to change status of an archived campaign
**Solution**: Archived campaigns cannot be modified. Create a new campaign instead.

### Error: "created_by field is immutable"
**Cause**: Attempting to change created_by after creation
**Solution**: created_by is automatically set and cannot be changed

## Performance Considerations

- **Metrics Calculation**: Optimized for 10,000+ leads per campaign (<100ms)
- **Query Optimization**: Uses single query with IN operator (no N+1 queries)
- **Indexes**: Campaign name and created_by are indexed for fast queries
- **Pagination**: Use pagination for large result sets

## Security Features

- **No Public Access**: Business intelligence protection (campaigns are internal only)
- **Ownership-Based**: Marketing users can only edit their own campaigns
- **Immutability**: SP-001 pattern protects created_by and calculated metrics
- **No PII in Logs**: SP-004 compliant (no business data in error logs)
- **Field-Level Access**: Calculated metrics are read-only for all users

## Best Practices

1. **UTM Consistency**: Use consistent naming conventions for UTM parameters
2. **Budget Tracking**: Always set budget for paid campaigns to track ROI
3. **Target Setting**: Set realistic targets based on historical data
4. **Status Management**: Update status as campaign progresses
5. **Soft Delete**: Use active flag instead of hard delete for data retention
6. **Campaign Review**: Regularly review conversion_rate and cost_per_lead metrics
7. **Course Association**: Link campaigns to specific courses for better tracking

## API Endpoints

### REST API

```
POST   /api/campaigns          - Create campaign
GET    /api/campaigns          - List campaigns
GET    /api/campaigns/:id      - Get campaign by ID
PATCH  /api/campaigns/:id      - Update campaign
DELETE /api/campaigns/:id      - Delete campaign
```

### GraphQL

```graphql
# Create campaign
mutation {
  createCampaign(data: {
    name: "Summer 2025"
    campaign_type: paid_ads
    status: draft
    start_date: "2025-06-01"
    budget: 5000
  }) {
    id
    name
    total_leads
    conversion_rate
  }
}

# Query campaigns
query {
  Campaigns(where: { status: { equals: active } }) {
    docs {
      id
      name
      campaign_type
      total_leads
      total_conversions
      conversion_rate
      cost_per_lead
    }
  }
}
```

## Related Collections

- **Leads**: Leads can be associated with campaigns via campaign field
- **Courses**: Campaigns can target specific courses
- **Users**: created_by field links to Users collection

## Support

For questions or issues with the Campaigns collection:
- Check this README for common errors
- Review IMPLEMENTATION_SUMMARY.md for technical details
- Contact the development team

---

**Collection Version**: 1.0.0
**Last Updated**: 2025-10-30
**Payload CMS Version**: 3.61.1
