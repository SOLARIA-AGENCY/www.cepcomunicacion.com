/**
 * UTM Format Validator
 *
 * Validates UTM parameters format:
 * - Lowercase only
 * - Alphanumeric characters
 * - Hyphens allowed
 * - No special characters, underscores, or spaces
 *
 * Pattern: ^[a-z0-9-]+$
 */

/**
 * Validates a single UTM parameter format
 *
 * @param value - UTM parameter value to validate
 * @returns true if valid, error message if invalid
 */
export const validateUTMFormat = (value: string | null | undefined): true | string => {
  // Allow null/undefined (optional fields)
  if (value === null || value === undefined || value === '') {
    return true;
  }

  // Convert to string if not already
  const stringValue = String(value);

  // Pattern: lowercase alphanumeric and hyphens only
  const utmPattern = /^[a-z0-9-]+$/;

  if (!utmPattern.test(stringValue)) {
    return 'UTM parameters must be lowercase alphanumeric with hyphens only (no spaces, underscores, or special characters)';
  }

  return true;
};

/**
 * Field validator function for Payload CMS
 * Can be used directly in field definitions
 */
export const utmFieldValidator = (value: unknown): true | string => {
  return validateUTMFormat(value as string);
};

export default validateUTMFormat;
