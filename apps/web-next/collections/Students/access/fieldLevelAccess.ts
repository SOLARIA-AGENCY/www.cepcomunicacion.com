import type { FieldAccess } from 'payload';

/**
 * Field-Level Access Control for PII Protection
 *
 * Implements granular field-level permissions to protect 15+ PII fields.
 *
 * Field Visibility Matrix:
 *
 * | Field Type | Lectura | Asesor | Marketing | Gestor | Admin |
 * |------------|---------|--------|-----------|--------|-------|
 * | Non-PII (student_id, status, enrollment_count) | ✅ | ✅ | ✅ | ✅ | ✅ |
 * | Basic PII (first_name, last_name, email, phone) | ❌ | ✅ | ✅ | ✅ | ✅ |
 * | Sensitive PII (DNI) | ❌ | ✅ | ❌ | ✅ | ✅ |
 * | Demographics (date_of_birth, gender) | ❌ | ✅ | ✅ | ✅ | ✅ |
 * | Address (address, city, postal_code) | ❌ | ✅ | ✅ | ✅ | ✅ |
 * | Emergency Contact | ❌ | ✅ | ❌ | ✅ | ✅ |
 * | GDPR Metadata (consent_timestamp, consent_ip) | ❌ | ✅ | ❌ | ✅ | ✅ |
 *
 * Security: SP-004 compliant - field filtering prevents PII leaks
 */

/**
 * NO PII fields - Visible to all authenticated users including Lectura
 */
export const nonPIIFieldAccess: FieldAccess = ({ req: { user } }) => {
  // Allow all authenticated users
  return !!user;
};

/**
 * Basic PII fields - Blocked from Lectura only
 * (first_name, last_name, email, phone)
 */
export const basicPIIFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Block lectura
  if (user.role === 'lectura') {
    return false;
  }

  // Allow all other roles
  return true;
};

/**
 * Sensitive PII fields - Admin, Gestor, Asesor only
 * (DNI)
 */
export const sensitivePIIFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Allow admin, gestor, asesor
  if (['admin', 'gestor', 'asesor'].includes(user.role)) {
    return true;
  }

  // Block marketing, lectura
  return false;
};

/**
 * Emergency contact fields - Admin, Gestor, Asesor only
 * (emergency_contact_name, emergency_contact_phone, emergency_contact_relationship)
 */
export const emergencyContactFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Allow admin, gestor, asesor
  if (['admin', 'gestor', 'asesor'].includes(user.role)) {
    return true;
  }

  // Block marketing, lectura
  return false;
};

/**
 * GDPR consent metadata fields - Admin, Gestor, Asesor only
 * (consent_timestamp, consent_ip_address)
 */
export const gdprMetadataFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Allow admin, gestor, asesor
  if (['admin', 'gestor', 'asesor'].includes(user.role)) {
    return true;
  }

  // Block marketing, lectura
  return false;
};

/**
 * Demographics fields - Blocked from Lectura only
 * (date_of_birth, gender, nationality, language)
 */
export const demographicsFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Block lectura
  if (user.role === 'lectura') {
    return false;
  }

  // Allow all other roles
  return true;
};

/**
 * Address fields - Blocked from Lectura only
 * (address, city, postal_code, province, country, address_complete)
 */
export const addressFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) return false;

  // Block lectura
  if (user.role === 'lectura') {
    return false;
  }

  // Allow all other roles
  return true;
};
