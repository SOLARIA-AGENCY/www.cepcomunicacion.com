import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Sanitizes user input to prevent XSS attacks
 *
 * Applies to text fields that accept user input:
 * - first_name, last_name
 * - city
 * - message
 * - notes
 *
 * Operations:
 * - Strip all HTML tags (prevents script injection)
 * - Trim whitespace
 * - Preserve legitimate characters (accents, spaces, etc.)
 *
 * Security:
 * - Prevents XSS attacks via form submissions
 * - SP-004: No PII in error messages
 *
 * @returns CollectionBeforeChangeHook
 */
export const sanitizeInputHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  /**
   * Sanitizes a string by removing HTML tags and trimming whitespace
   */
  const sanitize = (value: string | undefined): string | undefined => {
    if (!value) return value;

    // Strip HTML tags (prevents XSS)
    let sanitized = value.replace(/<[^>]*>/g, '');

    // Remove script tags explicitly (extra safety)
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');

    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
  };

  // Sanitize first_name
  if (data.first_name) {
    data.first_name = sanitize(data.first_name) || '';
  }

  // Sanitize last_name
  if (data.last_name) {
    data.last_name = sanitize(data.last_name) || '';
  }

  // Sanitize city
  if (data.city) {
    data.city = sanitize(data.city);
  }

  // Sanitize message (longer text field)
  if (data.message) {
    data.message = sanitize(data.message);
  }

  // Sanitize notes (admin field)
  if (data.notes) {
    data.notes = sanitize(data.notes);
  }

  return data;
};
