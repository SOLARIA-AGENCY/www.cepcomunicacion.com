import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates Spanish DNI format with checksum (optional field)
 *
 * Format: 8 digits + 1 letter (uppercase)
 * Example: 12345678Z
 *
 * Checksum validation:
 * - Letter is calculated from number % 23
 * - Valid letters: TRWAGMYFPDXBNJZSQVHLCKE (23 letters)
 * - Invalid letters: I, Ñ, O, U (not in sequence)
 *
 * Security:
 * - SP-004: No PII in error messages (use lead_id only, not actual DNI)
 * - Validation only runs if DNI is provided (optional field)
 *
 * @returns CollectionBeforeChangeHook
 */
export const validateDNIHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only validate if DNI is provided (it's optional)
  if (data.dni) {
    const dni = data.dni.trim().toUpperCase();

    // DNI format regex: 8 digits + 1 uppercase letter
    const dniRegex = /^[0-9]{8}[A-Z]$/;

    if (!dniRegex.test(dni)) {
      const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';
      throw new Error(
        `Lead ${leadId} validation failed: DNI format invalid (expected 8 digits + letter, e.g., 12345678Z)`
      );
    }

    // Validate checksum
    const dniNumber = parseInt(dni.substring(0, 8), 10);
    const dniLetter = dni.charAt(8);

    // Valid DNI letters sequence
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const expectedLetter = validLetters.charAt(dniNumber % 23);

    if (dniLetter !== expectedLetter) {
      const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';
      throw new Error(
        `Lead ${leadId} validation failed: DNI checksum invalid (letter does not match number)`
      );
    }

    // Normalize DNI format (uppercase for storage consistency)
    data.dni = dni;
  }

  return data;
};
