/**
 * URL Validator with Multi-Layer Security
 *
 * Implements defense-in-depth URL validation to prevent:
 * - XSS attacks via malformed URLs
 * - Open redirect vulnerabilities
 * - Injection attacks
 * - Protocol confusion
 *
 * Security Layers:
 * 1. RFC-compliant regex validation
 * 2. Triple slash detection (malformed URLs)
 * 3. Newline and control character blocking
 * 4. @ symbol in hostname prevention (open redirect)
 * 5. URL constructor validation (final check)
 */

export interface URLValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedURL?: string;
}

/**
 * RFC-compliant URL regex pattern
 * Validates: protocol, hostname, port (optional), path (optional)
 *
 * Pattern breakdown:
 * - ^https?:// - Must start with http:// or https://
 * - (?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+ - Hostname (subdomains + domain)
 * - (?:\.[a-zA-Z]{2,})+ - TLD (at least 2 characters)
 * - (?::\d{1,5})? - Optional port (1-5 digits)
 * - (?:\/[^\s]*)? - Optional path
 * - $ - End of string
 */
const RFC_URL_REGEX = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?::\d{1,5})?(?:\/[^\s]*)?$/;

/**
 * Validates a URL with multiple security layers
 *
 * @param url - The URL to validate
 * @param fieldName - The field name for error messages
 * @returns Validation result with error details if invalid
 */
export function validateURL(url: string, fieldName: string = 'URL'): URLValidationResult {
  // Layer 0: Empty/null check
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: `${fieldName}: URL is required and must be a string`,
    };
  }

  // Trim whitespace
  const trimmedURL = url.trim();

  if (trimmedURL.length === 0) {
    return {
      isValid: false,
      error: `${fieldName}: URL cannot be empty`,
    };
  }

  // Layer 1: RFC-compliant regex validation
  if (!RFC_URL_REGEX.test(trimmedURL)) {
    return {
      isValid: false,
      error: `${fieldName}: Invalid URL format. Must be a valid HTTP/HTTPS URL (example: https://example.com)`,
    };
  }

  // Layer 2: Triple slash detection (malformed URLs like https:///example.com)
  if (trimmedURL.includes('///')) {
    return {
      isValid: false,
      error: `${fieldName}: Malformed URL detected (triple slashes not allowed)`,
    };
  }

  // Layer 3: Newline and control character blocking (XSS prevention)
  // Control characters: 0x00-0x1F (includes \n, \r, \t, etc.)
  // eslint-disable-next-line no-control-regex
  const hasControlChars = /[\x00-\x1F]/.test(trimmedURL);
  if (hasControlChars) {
    return {
      isValid: false,
      error: `${fieldName}: URL contains invalid control characters`,
    };
  }

  // Layer 4: @ symbol in hostname prevention (open redirect protection)
  // Block patterns like https://trusted.com@attacker.com
  try {
    const urlObj = new URL(trimmedURL);

    // Check if username/password authentication is present (indicates @ in authority section)
    if (urlObj.username || urlObj.password) {
      return {
        isValid: false,
        error: `${fieldName}: URLs with authentication credentials are not allowed`,
      };
    }

    // Additional check: ensure hostname doesn't contain @
    if (urlObj.hostname.includes('@')) {
      return {
        isValid: false,
        error: `${fieldName}: Invalid hostname format (@ symbol not allowed)`,
      };
    }

    // Layer 5: Protocol validation (must be http or https)
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        isValid: false,
        error: `${fieldName}: Only HTTP and HTTPS protocols are allowed`,
      };
    }

    // Layer 6: Hostname validation (prevent localhost and IP addresses for security)
    const hostname = urlObj.hostname.toLowerCase();

    // Block localhost and loopback addresses
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
      return {
        isValid: false,
        error: `${fieldName}: Localhost URLs are not allowed`,
      };
    }

    // Block private IP ranges (optional - uncomment if needed)
    // const privateIPRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;
    // if (privateIPRegex.test(hostname)) {
    //   return {
    //     isValid: false,
    //     error: `${fieldName}: Private IP addresses are not allowed`,
    //   };
    // }

    // All validations passed
    return {
      isValid: true,
      sanitizedURL: trimmedURL,
    };
  } catch (error) {
    // Layer 5: URL constructor validation (catches any remaining malformed URLs)
    return {
      isValid: false,
      error: `${fieldName}: Malformed URL (failed URL constructor validation)`,
    };
  }
}

/**
 * Validates an array of URLs
 *
 * @param urls - Array of URLs to validate
 * @param fieldName - The field name for error messages
 * @returns Validation result with index of first invalid URL if any
 */
export function validateURLArray(urls: string[], fieldName: string = 'URLs'): URLValidationResult {
  if (!Array.isArray(urls)) {
    return {
      isValid: false,
      error: `${fieldName}: Must be an array`,
    };
  }

  for (let i = 0; i < urls.length; i++) {
    const result = validateURL(urls[i], `${fieldName}[${i}]`);
    if (!result.isValid) {
      return result;
    }
  }

  return {
    isValid: true,
  };
}

/**
 * Validates a URL field in Payload CMS
 * Returns true if valid, throws error if invalid
 *
 * @param value - The URL value to validate
 * @param args - Payload validation arguments
 */
export function payloadURLValidator(value: unknown): true | string {
  if (!value) {
    return true; // Allow empty values (use required field validation instead)
  }

  if (typeof value !== 'string') {
    return 'URL must be a string';
  }

  const result = validateURL(value);

  if (!result.isValid) {
    return result.error || 'Invalid URL';
  }

  return true;
}

/**
 * Validates an array of URL fields in Payload CMS
 * Returns true if valid, throws error if invalid
 *
 * @param value - The URL array value to validate
 */
export function payloadURLArrayValidator(value: unknown): true | string {
  if (!value) {
    return true; // Allow empty values
  }

  if (!Array.isArray(value)) {
    return 'Must be an array of URLs';
  }

  const result = validateURLArray(value);

  if (!result.isValid) {
    return result.error || 'Invalid URL in array';
  }

  return true;
}
