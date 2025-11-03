/**
 * Slug Validator
 *
 * Validates that slug contains only:
 * - Lowercase letters (a-z)
 * - Numbers (0-9)
 * - Hyphens (-)
 *
 * No uppercase, no spaces, no special characters
 */

export const slugValidator = (value: string | undefined | null): true | string => {
  if (!value) {
    return true; // Allow empty - will be auto-generated
  }

  const slugPattern = /^[a-z0-9-]+$/;

  if (!slugPattern.test(value)) {
    return 'Slug must contain only lowercase letters, numbers, and hyphens';
  }

  return true;
};

export default slugValidator;
