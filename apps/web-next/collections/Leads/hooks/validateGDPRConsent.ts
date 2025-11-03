import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates GDPR consent requirements for lead creation
 *
 * CRITICAL SECURITY - SP-002:
 * - gdpr_consent MUST be true (cannot create without explicit consent)
 * - privacy_policy_accepted MUST be true (legal requirement)
 * - Enforces immutability of consent fields (3-layer defense Layer 3)
 *
 * These fields are COMPLETELY IMMUTABLE after creation to maintain
 * legal audit trail for GDPR compliance.
 *
 * Security:
 * - SP-002: MAXIMUM immutability for GDPR audit trail
 * - SP-004: No PII in error messages (use lead_id only)
 *
 * @returns CollectionBeforeChangeHook
 */
export const validateGDPRConsentHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // On creation, enforce GDPR consent requirements
  if (operation === 'create') {
    // Validate gdpr_consent is explicitly true
    if (data.gdpr_consent !== true) {
      throw new Error(
        'GDPR consent is required and must be explicitly accepted (true) to submit lead form'
      );
    }

    // Validate privacy_policy_accepted is explicitly true
    if (data.privacy_policy_accepted !== true) {
      throw new Error(
        'Privacy policy acceptance is required and must be explicitly accepted (true) to submit lead form'
      );
    }
  }

  // On update, prevent modification of GDPR consent fields (SP-002 Layer 3)
  // These fields are COMPLETELY IMMUTABLE after creation
  if (operation === 'update') {
    const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';

    // Prevent modification of gdpr_consent
    if (data.gdpr_consent !== undefined && data.gdpr_consent !== req.data?.gdpr_consent) {
      throw new Error(
        `Lead ${leadId} validation failed: gdpr_consent is immutable (GDPR audit trail)`
      );
    }

    // Prevent modification of privacy_policy_accepted
    if (
      data.privacy_policy_accepted !== undefined &&
      data.privacy_policy_accepted !== req.data?.privacy_policy_accepted
    ) {
      throw new Error(
        `Lead ${leadId} validation failed: privacy_policy_accepted is immutable (GDPR audit trail)`
      );
    }

    // Prevent modification of consent_timestamp
    if (data.consent_timestamp !== undefined && data.consent_timestamp !== req.data?.consent_timestamp) {
      throw new Error(
        `Lead ${leadId} validation failed: consent_timestamp is immutable (GDPR audit trail)`
      );
    }

    // Prevent modification of consent_ip_address
    if (
      data.consent_ip_address !== undefined &&
      data.consent_ip_address !== req.data?.consent_ip_address
    ) {
      throw new Error(
        `Lead ${leadId} validation failed: consent_ip_address is immutable (GDPR audit trail)`
      );
    }
  }

  return data;
};
