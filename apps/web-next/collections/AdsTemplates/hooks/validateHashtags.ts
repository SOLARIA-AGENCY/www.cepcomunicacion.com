import type { FieldHook } from 'payload';

/**
 * validateHashtags Hook
 *
 * Validates hashtag format and constraints:
 * - Each hashtag: alphanumeric and underscores only (no # symbol stored)
 * - Format regex: ^[a-zA-Z0-9_]{2,30}$
 * - Min 2 characters, max 30 characters per tag
 * - Max 20 tags per template
 *
 * Security:
 * - Prevents injection attacks via strict character set
 * - No special characters allowed except underscore
 * - Length limits prevent abuse
 *
 * Business Rules:
 * - Hashtags are stored WITHOUT the # symbol
 * - Frontend should display with # prefix
 * - Used for social media post generation
 *
 * Triggered: beforeChange
 */
export const validateHashtags: FieldHook = async ({ data, operation }) => {
  // Only validate on create and update operations
  if (operation !== 'create' && operation !== 'update') {
    return;
  }

  const hashtags = data?.hashtags;

  // If no hashtags provided, validation passes
  if (!hashtags) {
    return;
  }

  // Ensure hashtags is an array
  if (!Array.isArray(hashtags)) {
    throw new Error('hashtags must be an array');
  }

  // Validate max number of hashtags (20)
  if (hashtags.length > 20) {
    throw new Error('Maximum 20 hashtags allowed per template');
  }

  // Hashtag format regex: alphanumeric and underscores only
  const hashtagPattern = /^[a-zA-Z0-9_]{2,30}$/;

  const errors: string[] = [];

  // Validate each hashtag
  hashtags.forEach((tag: unknown, index: number) => {
    // Ensure hashtag is a string
    if (typeof tag !== 'string') {
      errors.push(`hashtags[${index}]: Must be a string`);
      return;
    }

    const trimmedTag = tag.trim();

    // Check length constraints
    if (trimmedTag.length < 2) {
      errors.push(`hashtags[${index}]: Must be at least 2 characters (got: "${trimmedTag}")`);
      return;
    }

    if (trimmedTag.length > 30) {
      errors.push(`hashtags[${index}]: Must be 30 characters or less (got: ${trimmedTag.length} characters)`);
      return;
    }

    // Validate format (alphanumeric and underscores only)
    if (!hashtagPattern.test(trimmedTag)) {
      errors.push(
        `hashtags[${index}]: Invalid format. Only alphanumeric characters and underscores allowed (no # symbol). ` +
        `Got: "${trimmedTag}"`
      );
      return;
    }

    // Check for # symbol (common mistake)
    if (trimmedTag.includes('#')) {
      errors.push(
        `hashtags[${index}]: Do not include # symbol. Store hashtag without the prefix (e.g., "marketing" not "#marketing")`
      );
      return;
    }
  });

  // Throw error if any validation failed
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  // Sanitize: trim all hashtags and remove duplicates
  const sanitized = [...new Set(hashtags.map((tag: string) => tag.trim()))];

  // Update data with sanitized hashtags
  data.hashtags = sanitized;
};
