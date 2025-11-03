import type { FieldHook } from 'payload';
import { validateSpanishPhone, normalizePhone, getPhoneErrorMessage } from '../validators';

/**
 * Validates Spanish phone number
 *
 * Validates format: +34 XXX XXX XXX (with or without spaces)
 * Accepts mobile (6XX, 7XX, 9XX) and landline numbers.
 *
 * Security:
 * - SP-004 compliant: Error messages use student_id, never actual phone
 * - No PII in logs
 *
 * @param fieldName - Field name for error messages (phone or emergency_contact_phone)
 * @returns FieldHook for beforeChange
 */
export const createValidatePhoneHook = (fieldName: string = 'phone'): FieldHook => {
  return ({ data, value, req }) => {
    // Skip validation if phone not provided
    if (!value) {
      return value;
    }

    // Normalize phone (trim spaces)
    const normalizedPhone = normalizePhone(value as string);

    // Validate phone format
    if (!validateSpanishPhone(normalizedPhone)) {
      // SP-004: Use student_id in error message, NOT actual phone
      const studentId = data?.student_id;
      throw new Error(getPhoneErrorMessage(studentId, fieldName));
    }

    // Return normalized phone
    return normalizedPhone;
  };
};

/**
 * Validates main phone field
 */
export const validatePhoneHook: FieldHook = createValidatePhoneHook('phone');

/**
 * Validates emergency contact phone field
 */
export const validateEmergencyPhoneHook: FieldHook = createValidatePhoneHook('emergency_contact_phone');
