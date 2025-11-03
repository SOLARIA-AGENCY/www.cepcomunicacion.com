/**
 * Spanish Phone Number Validator
 *
 * Validates Spanish phone numbers (mobile and landline).
 *
 * Format: +34 XXX XXX XXX (with or without spaces)
 * - Mobile: Starts with 6, 7, or 9
 * - Landline: Starts with 9 (regional codes)
 *
 * Examples:
 * - +34 612 345 678 ✅ (mobile with spaces)
 * - +34612345678 ✅ (mobile without spaces)
 * - +34 912 345 678 ✅ (Madrid landline)
 * - +34 512 345 678 ❌ (invalid starting digit)
 * - 612 345 678 ❌ (missing country code)
 * - +34 612 345 67 ❌ (too few digits)
 *
 * Security: SP-004 compliant - no PII in error messages
 */

/**
 * Validates Spanish phone number format
 *
 * @param phone - Phone number string to validate
 * @returns true if valid, false otherwise
 */
export function validateSpanishPhone(phone: string): boolean {
  // Check null/undefined
  if (!phone) {
    return false;
  }

  // Check format: +34 followed by 9 digits starting with 6, 7, or 9
  // Allows optional spaces after +34 and between digit groups
  const phoneRegex = /^\+34\s?[6-9][0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/;

  return phoneRegex.test(phone);
}

/**
 * Gets a non-PII error message for phone validation failure
 *
 * @param studentId - Student ID to use in error message (SP-004 compliant)
 * @param fieldName - Field name (phone or emergency_contact_phone)
 * @returns Error message without PII
 */
export function getPhoneErrorMessage(
  studentId?: string,
  fieldName: string = 'phone'
): string {
  const prefix = studentId ? `Student ${studentId}` : 'Student';
  return `${prefix} validation failed: ${fieldName} must be a valid Spanish phone number (+34 XXX XXX XXX)`;
}

/**
 * Normalizes phone input by removing extra spaces
 *
 * @param phone - Raw phone input
 * @returns Normalized phone
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  // Keep +34 and single spaces between digit groups
  return phone.trim().replace(/\s+/g, ' ');
}

/**
 * Formats phone number with standard spacing
 *
 * @param phone - Phone number to format
 * @returns Formatted phone (+34 XXX XXX XXX)
 */
export function formatSpanishPhone(phone: string): string {
  if (!phone) return '';

  // Remove all spaces
  const cleaned = phone.replace(/\s/g, '');

  // Extract parts
  const countryCode = cleaned.substring(0, 3); // +34
  const part1 = cleaned.substring(3, 6); // XXX
  const part2 = cleaned.substring(6, 9); // XXX
  const part3 = cleaned.substring(9, 12); // XXX

  return `${countryCode} ${part1} ${part2} ${part3}`;
}
