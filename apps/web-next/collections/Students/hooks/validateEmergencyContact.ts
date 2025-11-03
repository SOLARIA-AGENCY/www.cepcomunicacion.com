import type { CollectionBeforeChangeHook } from 'payload';
import { validateEmergencyContact } from '../validators';

/**
 * Validates emergency contact information (all or nothing rule)
 *
 * Rules:
 * - If ANY emergency field provided, ALL three required
 * - If NO emergency fields provided, validation passes
 * - emergency_contact_phone must be valid Spanish phone format
 *
 * Fields:
 * - emergency_contact_name
 * - emergency_contact_phone
 * - emergency_contact_relationship
 *
 * Security:
 * - SP-004 compliant: Error messages use student_id, never actual contact info
 * - No PII in logs
 *
 * @returns CollectionBeforeChangeHook
 */
export const validateEmergencyContactHook: CollectionBeforeChangeHook = async ({ data, req }) => {
  const studentId = data.student_id;

  // Extract emergency contact fields from data
  const emergencyData = {
    emergency_contact_name: data.emergency_contact_name,
    emergency_contact_phone: data.emergency_contact_phone,
    emergency_contact_relationship: data.emergency_contact_relationship,
  };

  // Validate emergency contact
  const result = validateEmergencyContact(emergencyData, studentId);

  if (!result.isValid) {
    throw new Error(result.error);
  }

  return data;
};
