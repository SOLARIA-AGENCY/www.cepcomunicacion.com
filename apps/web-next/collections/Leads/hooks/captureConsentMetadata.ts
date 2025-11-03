import type { CollectionBeforeCreateHook } from 'payload';

/**
 * Captures GDPR consent metadata on lead creation
 *
 * Auto-sets:
 * - consent_timestamp: Current timestamp (ISO 8601)
 * - consent_ip_address: Client IP address from request
 *
 * These fields become COMPLETELY IMMUTABLE after creation (SP-002 pattern).
 *
 * Security:
 * - SP-002: MAXIMUM immutability for GDPR audit trail
 * - SP-004: No PII in error messages
 *
 * IP Address Detection Priority:
 * 1. X-Forwarded-For header (proxy/load balancer)
 * 2. X-Real-IP header (nginx)
 * 3. req.ip (direct connection)
 *
 * @returns CollectionBeforeCreateHook
 */
export const captureConsentMetadataHook: CollectionBeforeCreateHook = async ({
  data,
  req,
}) => {
  // Auto-set consent_timestamp (current timestamp)
  data.consent_timestamp = new Date().toISOString();

  // Auto-capture consent_ip_address from request
  // Priority: X-Forwarded-For > X-Real-IP > req.ip
  const xForwardedFor = req.headers?.['x-forwarded-for'];
  const xRealIP = req.headers?.['x-real-ip'];
  const directIP = req.ip;

  let ipAddress: string;

  if (xForwardedFor) {
    // X-Forwarded-For can be a comma-separated list, take the first one
    if (typeof xForwardedFor === 'string') {
      ipAddress = xForwardedFor.split(',')[0].trim();
    } else if (Array.isArray(xForwardedFor)) {
      ipAddress = xForwardedFor[0];
    } else {
      ipAddress = String(xForwardedFor);
    }
  } else if (xRealIP) {
    ipAddress = typeof xRealIP === 'string' ? xRealIP : String(xRealIP[0]);
  } else if (directIP) {
    ipAddress = directIP;
  } else {
    // Fallback if no IP detected (should not happen in normal operation)
    ipAddress = 'unknown';
  }

  data.consent_ip_address = ipAddress;

  return data;
};
