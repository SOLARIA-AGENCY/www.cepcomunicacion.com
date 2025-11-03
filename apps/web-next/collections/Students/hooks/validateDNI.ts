import type { FieldHook } from 'payload';
import { validateDNI, normalizeDNI, getDNIErrorMessage } from '../validators';

/**
 * Validates Spanish DNI (Documento Nacional de Identidad)
 *
 * Validates format (8 digits + 1 letter) and checksum using modulo 23 algorithm.
 * Normalizes input by removing spaces and converting to uppercase.
 *
 * Security:
 * - SP-004 compliant: Error messages use student_id, never actual DNI
 * - No PII in logs
 *
 * @returns FieldHook for beforeChange
 */
export const validateDNIHook: FieldHook = ({ data, value, req }) => {
  // Skip validation if DNI not provided
  if (!value) {
    return value;
  }

  // Normalize DNI (remove spaces, uppercase)
  const normalizedDNI = normalizeDNI(value as string);

  // Validate DNI format and checksum
  if (!validateDNI(normalizedDNI)) {
    // SP-004: Use student_id in error message, NOT actual DNI
    const studentId = data?.student_id;
    throw new Error(getDNIErrorMessage(studentId));
  }

  // Return normalized DNI
  return normalizedDNI;
};
