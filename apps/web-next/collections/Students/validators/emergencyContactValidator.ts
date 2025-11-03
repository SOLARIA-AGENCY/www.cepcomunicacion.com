/**
 * Emergency Contact Validator
 *
 * Validates emergency contact information with "all or nothing" rule:
 * - If ANY emergency field is provided, ALL three fields are required
 * - If NO emergency fields provided, validation passes
 *
 * Fields:
 * - emergency_contact_name
 * - emergency_contact_phone (must be valid Spanish phone)
 * - emergency_contact_relationship
 *
 * Examples:
 * - All three provided ✅
 * - All three empty ✅
 * - Only name provided ❌
 * - Name + phone provided, no relationship ❌
 *
 * Security: SP-004 compliant - no PII in error messages
 */

import { validateSpanishPhone } from './phoneValidator';

/**
 * Emergency contact data interface
 */
interface EmergencyContactData {
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates emergency contact information
 *
 * @param data - Emergency contact fields
 * @param studentId - Student ID for error messages (SP-004 compliant)
 * @returns Validation result
 */
export function validateEmergencyContact(
  data: EmergencyContactData,
  studentId?: string
): ValidationResult {
  const { emergency_contact_name, emergency_contact_phone, emergency_contact_relationship } = data;

  // Check which fields are provided
  const hasName = !!emergency_contact_name && emergency_contact_name.trim() !== '';
  const hasPhone = !!emergency_contact_phone && emergency_contact_phone.trim() !== '';
  const hasRelationship =
    !!emergency_contact_relationship && emergency_contact_relationship.trim() !== '';

  // Count provided fields
  const providedCount = [hasName, hasPhone, hasRelationship].filter(Boolean).length;

  // All or nothing rule
  if (providedCount === 0) {
    // No emergency contact provided - valid
    return { isValid: true };
  }

  if (providedCount === 3) {
    // All fields provided - validate phone format
    if (!validateSpanishPhone(emergency_contact_phone!)) {
      const prefix = studentId ? `Student ${studentId}` : 'Student';
      return {
        isValid: false,
        error: `${prefix} validation failed: emergency_contact_phone must be a valid Spanish phone number (+34 XXX XXX XXX)`,
      };
    }

    // All valid
    return { isValid: true };
  }

  // Partial data provided - invalid
  const prefix = studentId ? `Student ${studentId}` : 'Student';
  const missingFields: string[] = [];

  if (!hasName) missingFields.push('emergency_contact_name');
  if (!hasPhone) missingFields.push('emergency_contact_phone');
  if (!hasRelationship) missingFields.push('emergency_contact_relationship');

  return {
    isValid: false,
    error: `${prefix} validation failed: if any emergency contact field is provided, all three fields are required (missing: ${missingFields.join(', ')})`,
  };
}

/**
 * Checks if emergency contact data is complete
 *
 * @param data - Emergency contact fields
 * @returns true if all three fields provided, false otherwise
 */
export function hasCompleteEmergencyContact(data: EmergencyContactData): boolean {
  const { emergency_contact_name, emergency_contact_phone, emergency_contact_relationship } = data;

  return (
    !!emergency_contact_name &&
    emergency_contact_name.trim() !== '' &&
    !!emergency_contact_phone &&
    emergency_contact_phone.trim() !== '' &&
    !!emergency_contact_relationship &&
    emergency_contact_relationship.trim() !== ''
  );
}

/**
 * Checks if any emergency contact field is provided
 *
 * @param data - Emergency contact fields
 * @returns true if at least one field provided
 */
export function hasPartialEmergencyContact(data: EmergencyContactData): boolean {
  const { emergency_contact_name, emergency_contact_phone, emergency_contact_relationship } = data;

  return (
    (!!emergency_contact_name && emergency_contact_name.trim() !== '') ||
    (!!emergency_contact_phone && emergency_contact_phone.trim() !== '') ||
    (!!emergency_contact_relationship && emergency_contact_relationship.trim() !== '')
  );
}
