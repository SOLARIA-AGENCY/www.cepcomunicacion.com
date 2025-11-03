# Students Collection - Developer Guide

**Status:** ✅ Production Ready
**Security Level:** 🔴 P0 CRITICAL - MAXIMUM GDPR COMPLIANCE

---

## Quick Start

### Import and Use
```typescript
import { Students } from '@/collections/Students';
import { validateDNI, validateSpanishPhone, validateMinimumAge } from '@/collections/Students/validators';
```

### API Endpoints

**Base URL:** `/api/students`

```bash
# Create student (asesor, marketing, gestor, admin)
POST /api/students
{
  "first_name": "Carlos",
  "last_name": "García López",
  "email": "carlos.garcia@example.com",
  "phone": "+34 612 345 678",
  "dni": "12345678Z",
  "date_of_birth": "1995-06-15",
  "gdpr_consent": true,
  "privacy_policy_accepted": true
}

# Read students (authenticated users only)
GET /api/students?active=true&status=active

# Update student (asesor/marketing: own only, gestor/admin: all)
PATCH /api/students/:id
{
  "phone": "+34 687 654 321",
  "marketing_consent": true
}

# Delete student (admin only - right to be forgotten)
DELETE /api/students/:id
```

---

## Field Access by Role

### Lectura (Read-Only, NO PII)
**Can Read:**
- ✅ student_id, status, enrollment_count, active
- ✅ gdpr_consent, privacy_policy_accepted, marketing_consent

**CANNOT Read:**
- ❌ ALL PII fields (name, email, phone, DNI, address, emergency, etc.)

### Marketing
**Can Read:**
- ✅ Basic info: first_name, last_name, email, phone
- ✅ Demographics: date_of_birth, gender, nationality
- ✅ Address: address, city, postal_code, province, country

**CANNOT Read:**
- ❌ DNI
- ❌ Emergency contact fields
- ❌ consent_ip_address

### Asesor
**Can Read:**
- ✅ ALL fields (including DNI and emergency contact)

### Gestor / Admin
**Can Read:**
- ✅ ALL fields (including inactive students)

---

## Validators

### Spanish DNI Validation
```typescript
import { validateDNI, normalizeDNI } from '@/collections/Students/validators';

const dni = normalizeDNI('12345678z'); // Returns: '12345678Z'
const isValid = validateDNI('12345678Z'); // Returns: true

// DNI Format: 8 digits + 1 letter (modulo 23 checksum)
// Valid letters: TRWAGMYFPDXBNJZSQVHLCKE
```

### Spanish Phone Validation
```typescript
import { validateSpanishPhone, formatSpanishPhone } from '@/collections/Students/validators';

const isValid = validateSpanishPhone('+34 612 345 678'); // Returns: true
const formatted = formatSpanishPhone('+34612345678'); // Returns: '+34 612 345 678'

// Format: +34 XXX XXX XXX (with or without spaces)
// Accepts: 6XX, 7XX, 9XX
```

### Age Validation (>= 16 years)
```typescript
import { validateMinimumAge, calculateAge } from '@/collections/Students/validators';

const isValid = validateMinimumAge('1995-06-15'); // Returns: true (30 years old)
const age = calculateAge('2009-10-30'); // Returns: 16

// Spanish legal requirement: minimum 16 years
```

### Emergency Contact Validation
```typescript
import { validateEmergencyContact } from '@/collections/Students/validators';

// All-or-nothing rule: If ANY field provided, ALL three required
const result = validateEmergencyContact({
  emergency_contact_name: 'María García',
  emergency_contact_phone: '+34 687 654 321',
  emergency_contact_relationship: 'madre'
});

if (!result.isValid) {
  console.error(result.error);
}
```

---

## Security Patterns

### SP-001: Immutable Fields (Defense in Depth)
**Applied to:** `created_by`, `enrollment_count`, `student_id`

```typescript
// 3-Layer Protection:
// Layer 1: admin.readOnly = true (UI)
// Layer 2: access.update = () => false (API)
// Layer 3: Hook validation (Business Logic)

// ❌ Attempting to update will fail at ALL three layers
```

### SP-002: GDPR Critical Fields (MAXIMUM Immutability)
**Applied to:** `gdpr_consent`, `privacy_policy_accepted`, `consent_timestamp`, `consent_ip_address`

```typescript
// IMMUTABLE after creation - Cannot be modified via API
// Use admin database tools for GDPR erasure requests only

// ❌ These fields CANNOT be updated after student creation
```

### SP-004: No PII in Logs
**All hooks compliant**

```typescript
// ✅ Correct: Use student_id in error messages
throw new Error(`Student ${studentId} validation failed: DNI format invalid`);

// ❌ WRONG: Never expose PII in errors
throw new Error(`Student Carlos García (12345678Z) validation failed`);
```

---

## Common Workflows

### Create Student with Full Data
```typescript
const studentData = {
  // Required fields
  first_name: 'Carlos',
  last_name: 'García López',
  email: 'carlos.garcia@example.com',
  phone: '+34 612 345 678',
  dni: '12345678Z',
  date_of_birth: '1995-06-15',
  gdpr_consent: true,
  privacy_policy_accepted: true,

  // Optional fields
  gender: 'male',
  nationality: 'España',
  language: 'es',

  // Address (optional)
  address: 'Calle Mayor 123, 3º A',
  city: 'Madrid',
  postal_code: '28001',
  province: 'Madrid',
  country: 'España',
  address_complete: true,

  // Emergency contact (all-or-nothing)
  emergency_contact_name: 'María García',
  emergency_contact_phone: '+34 687 654 321',
  emergency_contact_relationship: 'madre',

  // Marketing consent
  marketing_consent: true
};

const student = await payload.create({
  collection: 'students',
  data: studentData,
  user: currentUser // Required for created_by tracking
});

// student_id auto-generated: STU-20251030-0001
// consent_timestamp auto-set: 2025-10-30T14:23:45.123Z
// consent_ip_address auto-captured: 203.0.113.42
```

### Update Student (Allowed Fields Only)
```typescript
// ✅ Can update: Basic info, address, emergency, marketing_consent
const updated = await payload.update({
  collection: 'students',
  id: studentId,
  data: {
    phone: '+34 687 654 321',
    address: 'Calle Nueva 456',
    marketing_consent: false
  }
});

// ❌ CANNOT update: GDPR consent fields (SP-002)
// ❌ CANNOT update: created_by, enrollment_count, student_id (SP-001)
```

### Query Students by Role

#### Lectura (NO PII)
```typescript
const students = await payload.find({
  collection: 'students',
  where: { active: { equals: true } }
  // Only returns: student_id, status, enrollment_count, active
});
```

#### Marketing (NO DNI, NO Emergency)
```typescript
const students = await payload.find({
  collection: 'students',
  where: { active: { equals: true } }
  // Returns: All fields EXCEPT dni, emergency_contact_*, consent_ip_address
});
```

#### Asesor (ALL Fields)
```typescript
const students = await payload.find({
  collection: 'students',
  where: {
    created_by: { equals: currentUser.id } // Can only update own
  }
  // Returns: ALL fields including DNI and emergency contact
});
```

---

## Testing

### Run Tests
```bash
# Run all Students tests (166 test cases)
npm test collections/Students

# Run specific test suite
npm test collections/Students -- --grep "DNI Validation"

# Watch mode
npm test collections/Students -- --watch
```

### Test Coverage
- ✅ 166 test cases
- ✅ 18 test suites
- ✅ CRUD operations
- ✅ Spanish validations (DNI, phone, age)
- ✅ GDPR compliance
- ✅ 6-tier RBAC
- ✅ Field-level access control
- ✅ Security patterns (SP-001, SP-002, SP-004)

---

## Troubleshooting

### DNI Validation Fails
```typescript
// ❌ Common errors
'12345678a' // Lowercase letter - use uppercase
'1234567Z'  // Too few digits - must be 8
'12345678A' // Wrong checksum - A doesn't match (should be Z)

// ✅ Correct format
'12345678Z' // 8 digits + valid checksum letter
```

### Age Validation Fails
```typescript
// ❌ Error: Must be at least 16 years old
'2010-06-15' // Only 15 years old

// ✅ Valid: Born 2009-06-15 or earlier
'2009-10-30' // Exactly 16 years old (today)
```

### Emergency Contact Validation Fails
```typescript
// ❌ Error: All three fields required
{
  emergency_contact_name: 'María García',
  emergency_contact_phone: '+34 687 654 321',
  // Missing: emergency_contact_relationship
}

// ✅ Provide all three or none
{
  emergency_contact_name: 'María García',
  emergency_contact_phone: '+34 687 654 321',
  emergency_contact_relationship: 'madre'
}
```

### Access Denied Errors
```typescript
// ❌ Lectura role trying to read PII fields
// Response: Fields filtered out (empty strings or undefined)

// ❌ Marketing role trying to update student created by asesor
// Error: 403 Forbidden (can only update own students)

// ❌ Gestor trying to delete student
// Error: 403 Forbidden (only admin can delete - right to be forgotten)
```

---

## Best Practices

### 1. Always Validate Input
```typescript
import { validateDNI, validateSpanishPhone } from '@/collections/Students/validators';

// Validate BEFORE calling API
if (!validateDNI(dni)) {
  showError('DNI inválido. Formato: 12345678Z');
  return;
}

if (!validateSpanishPhone(phone)) {
  showError('Teléfono inválido. Formato: +34 XXX XXX XXX');
  return;
}
```

### 2. Use student_id for Logging
```typescript
// ✅ Good: No PII in logs
logger.info(`Student ${student.student_id} created successfully`);

// ❌ Bad: PII in logs (GDPR violation)
logger.info(`Student ${student.first_name} ${student.last_name} created`);
```

### 3. Handle Field-Level Access
```typescript
// Fields may be filtered based on user role
const student = await payload.findByID({
  collection: 'students',
  id: studentId
});

// Check if field is accessible
if (student.dni) {
  // Only visible to admin, gestor, asesor
  console.log('DNI:', student.dni);
} else {
  // Filtered out for marketing, lectura
  console.log('DNI not accessible for this role');
}
```

### 4. Soft Delete Preferred
```typescript
// ✅ Preferred: Soft delete
await payload.update({
  collection: 'students',
  id: studentId,
  data: { active: false }
});

// ⚠️ Use sparingly: Hard delete (admin only, GDPR erasure)
await payload.delete({
  collection: 'students',
  id: studentId
});
```

---

## Related Collections

- **Users** - created_by relationship
- **Enrollments** - Student enrollment tracking (updates enrollment_count)
- **Leads** - Lead conversion to students
- **Campaigns** - Marketing campaign attribution

---

## References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Spanish DNI Algorithm](https://es.wikipedia.org/wiki/Documento_nacional_de_identidad_(España))
- [Spanish Phone Numbering](https://en.wikipedia.org/wiki/Telephone_numbers_in_Spain)

---

**Last Updated:** 2025-10-30
**Maintainer:** Payload CMS Team
