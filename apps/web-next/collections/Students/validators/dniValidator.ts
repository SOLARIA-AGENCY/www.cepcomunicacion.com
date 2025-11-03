/**
 * Spanish DNI Validator
 *
 * Validates Spanish DNI (Documento Nacional de Identidad) format and checksum.
 *
 * Format: 8 digits + 1 letter (e.g., 12345678Z)
 * Algorithm: Letter is calculated using modulo 23 on the number part
 *
 * Valid letters: TRWAGMYFPDXBNJZSQVHLCKE (23 letters, no I, Ñ, O, U)
 *
 * Examples:
 * - 12345678Z ✅ (valid)
 * - 87654321X ✅ (valid)
 * - 12345678A ❌ (invalid checksum, should be Z)
 * - 1234567Z ❌ (too few digits)
 * - 12345678z ❌ (lowercase letter)
 *
 * Security: SP-004 compliant - no PII in error messages
 */

/**
 * Validates Spanish DNI format and checksum
 *
 * @param dni - DNI string to validate
 * @returns true if valid, false otherwise
 */
export function validateDNI(dni: string): boolean {
  // Check null/undefined
  if (!dni) {
    return false;
  }

  // Check format: 8 digits + 1 uppercase letter
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  if (!dniRegex.test(dni)) {
    return false;
  }

  // Extract number and letter parts
  const numberPart = dni.substr(0, 8);
  const letterPart = dni.charAt(8);

  // Valid DNI letters (position corresponds to modulo 23 result)
  const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

  // Calculate expected letter using modulo 23 algorithm
  const number = parseInt(numberPart, 10);
  const expectedLetter = validLetters.charAt(number % 23);

  // Verify letter matches expected
  return letterPart === expectedLetter;
}

/**
 * Gets a non-PII error message for DNI validation failure
 *
 * @param studentId - Student ID to use in error message (SP-004 compliant)
 * @returns Error message without PII
 */
export function getDNIErrorMessage(studentId?: string): string {
  const prefix = studentId ? `Student ${studentId}` : 'Student';
  return `${prefix} validation failed: DNI format invalid or checksum mismatch`;
}

/**
 * Normalizes DNI input by removing spaces and converting to uppercase
 *
 * @param dni - Raw DNI input
 * @returns Normalized DNI
 */
export function normalizeDNI(dni: string): string {
  if (!dni) return '';
  return dni.trim().replace(/\s/g, '').toUpperCase();
}
