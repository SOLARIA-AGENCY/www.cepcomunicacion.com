import type { FieldHook } from 'payload';
import { validateURL, validateURLArray } from '../validators/urlValidator';

/**
 * validateURLFields Hook
 *
 * Validates URL fields (cta_url and asset_urls) with security-hardened validation.
 *
 * Security Features:
 * - RFC-compliant URL validation
 * - Triple slash detection
 * - Control character blocking
 * - @ symbol in hostname prevention (open redirect)
 * - URL constructor validation
 *
 * Fields Validated:
 * - cta_url (optional single URL)
 * - asset_urls (optional array of URLs)
 *
 * Triggered: beforeChange
 */
export const validateURLFields: FieldHook = async ({ data, operation }) => {
  // Only validate on create and update operations
  if (operation !== 'create' && operation !== 'update') {
    return;
  }

  const errors: string[] = [];

  // Validate cta_url if present
  if (data?.cta_url) {
    const result = validateURL(data.cta_url, 'cta_url');
    if (!result.isValid) {
      errors.push(result.error || 'Invalid cta_url');
    }
  }

  // Validate asset_urls if present
  if (data?.asset_urls && Array.isArray(data.asset_urls)) {
    // Filter out empty strings
    const nonEmptyURLs = data.asset_urls.filter(
      (url: string) => url && typeof url === 'string' && url.trim().length > 0
    );

    if (nonEmptyURLs.length > 0) {
      const result = validateURLArray(nonEmptyURLs, 'asset_urls');
      if (!result.isValid) {
        errors.push(result.error || 'Invalid asset_urls');
      }
    }

    // Validate max number of assets (10)
    if (nonEmptyURLs.length > 10) {
      errors.push('asset_urls: Maximum 10 asset URLs allowed');
    }
  }

  // Throw error if any validation failed
  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
};
