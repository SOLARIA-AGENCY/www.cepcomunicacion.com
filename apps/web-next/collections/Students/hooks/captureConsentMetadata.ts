import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Captures GDPR consent metadata on student creation
 *
 * Auto-sets:
 * - consent_timestamp: Current timestamp (ISO 8601)
 * - consent_ip_address: Client IP address from request
 *
 * These fields become COMPLETELY IMMUTABLE after creation (SP-002 pattern).
 *
 * Security:
 * - SP-002: MAXIMUM immutability for GDPR audit trail
 * - 3-layer defense in depth:
 *   Layer 1: admin.readOnly = true (UI protection)
 *   Layer 2: access.update = () => false (API protection)
 *   Layer 3: This hook (validation protection)
 * - SP-004: No PII in error messages
 *
 * IP Address Detection Priority:
 * 1. X-Forwarded-For header (proxy/load balancer)
 * 2. X-Real-IP header (nginx)
 * 3. req.ip (direct connection)
 *
 * @returns CollectionBeforeChangeHook
 */
export const captureConsentMetadataHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only capture on creation
  if (operation === 'create') {
    // Validate GDPR consent fields are true
    if (!data.gdpr_consent) {
      throw new Error('GDPR consent is required to create a student profile');
    }

    if (!data.privacy_policy_accepted) {
      throw new Error('Privacy policy acceptance is required to create a student profile');
    }

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
        ipAddress = xForwardedFor;
      }
    } else if (xRealIP) {
      ipAddress = typeof xRealIP === 'string' ? xRealIP : xRealIP[0];
    } else if (directIP) {
      ipAddress = directIP;
    } else {
      // Fallback if no IP detected (should not happen in normal operation)
      ipAddress = 'unknown';
    }

    data.consent_ip_address = ipAddress;
  }

  // On update, prevent modification of GDPR metadata (SP-002 Layer 3)
  // These fields are COMPLETELY IMMUTABLE after creation
  if (operation === 'update') {
    // Prevent any modification attempts (these should already be blocked by access control)
    // This is Layer 3 defense - additional validation
    if (data.consent_timestamp !== undefined && data.consent_timestamp !== req.data?.consent_timestamp) {
      const studentId = data.student_id || req.data?.student_id;
      throw new Error(
        `Student ${studentId || ''} validation failed: consent_timestamp is immutable (GDPR audit trail)`
      );
    }

    if (data.consent_ip_address !== undefined && data.consent_ip_address !== req.data?.consent_ip_address) {
      const studentId = data.student_id || req.data?.student_id;
      throw new Error(
        `Student ${studentId || ''} validation failed: consent_ip_address is immutable (GDPR audit trail)`
      );
    }
  }

  return data;
};
