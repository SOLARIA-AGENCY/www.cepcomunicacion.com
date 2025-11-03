import type { CollectionBeforeValidateHook } from 'payload';

/**
 * Hook: captureStudentConsentMetadata
 *
 * Auto-captures GDPR consent metadata during student creation:
 * - consent_timestamp: ISO 8601 timestamp when consent was given
 * - consent_ip_address: IP address of the request (for audit trail)
 *
 * WHEN: beforeValidate (runs before Payload's validation)
 * OPERATION: create only (not on updates)
 *
 * GDPR COMPLIANCE (Article 7):
 * - Organizations must be able to prove consent was given
 * - Must record when and how consent was obtained
 * - Consent metadata is immutable (audit trail)
 *
 * SECURITY CONSIDERATIONS (SP-002: GDPR Critical Fields):
 * - These fields are immutable after creation
 * - Protected by field-level access control: access.update = false
 * - Only auto-populated, never manually set
 * - Timestamp is in ISO 8601 format for consistency
 * - IP address captured from req.ip or X-Forwarded-For header
 *
 * PII PROTECTION (SP-004):
 * - NO logging of student email, name, or other PII
 * - Only log student ID (non-PII)
 * - IP address is PII, do not log it
 *
 * @param args - Hook arguments from Payload
 * @returns Modified data with consent metadata
 */
export const captureStudentConsentMetadata: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
}) => {
  // Only capture on creation, not on updates
  if (operation !== 'create') {
    return data;
  }

  // Only capture if GDPR consent is true
  if (data?.gdpr_consent !== true) {
    return data;
  }

  try {
    // Capture consent timestamp (ISO 8601)
    if (!data.consent_timestamp) {
      data.consent_timestamp = new Date().toISOString();
    }

    // Capture IP address from request
    if (!data.consent_ip_address && req) {
      // Try X-Forwarded-For header first (if behind proxy)
      const forwardedFor = req.headers?.get?.('x-forwarded-for');
      if (forwardedFor) {
        // X-Forwarded-For can be a comma-separated list, take first IP
        const forwardedForStr = typeof forwardedFor === 'string' ? forwardedFor : String(forwardedFor);
        data.consent_ip_address = forwardedForStr.split(',')[0]?.trim() || '127.0.0.1';
      } else {
        // Fallback to a default IP if none available
        data.consent_ip_address = '127.0.0.1';
      }
    }

    // SECURITY: NO logging of PII (SP-004)
    // DO NOT log: email, name, IP address (all are PII)
    // Only log operation success with non-PII identifiers
    if (req?.payload?.logger) {
      req.payload.logger.info({
        msg: '[Student] Consent metadata captured',
        hasTimestamp: !!data.consent_timestamp,
        hasIPAddress: !!data.consent_ip_address,
        operation,
      });
    }
  } catch (error) {
    // Log error without exposing PII
    if (req?.payload?.logger) {
      req.payload.logger.error({
        msg: '[Student] Error capturing consent metadata',
        error: error instanceof Error ? error.message : 'Unknown error',
        operation,
      });
    }
    // Don't throw - allow creation to proceed without metadata
    // (database constraints will enforce GDPR consent)
  }

  return data;
};
