import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates Spanish phone number format (optional field)
 *
 * Format: +34 XXX XXX XXX or +34XXXXXXXXX
 * - Must start with +34 (Spain country code)
 * - First digit after +34 must be 6-9 (mobile/landline)
 * - Total 9 digits after country code
 * - Spaces optional
 *
 * Valid examples:
 * - +34 612 345 678 (mobile)
 * - +34 912 345 678 (landline)
 * - +34612345678 (no spaces)
 *
 * Security:
 * - SP-004: No PII in error messages (use lead_id only, not actual phone)
 * - Validation only runs if phone is provided (optional field)
 *
 * @returns CollectionBeforeChangeHook
 */
export const validatePhoneHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only validate if phone is provided (it's optional)
  if (data.phone) {
    const phone = data.phone.trim();

    // Spanish phone format regex: +34 followed by 6-9, then 8 more digits
    // Spaces are optional
    const phoneRegex = /^\+34\s?[6-9][0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/;

    if (!phoneRegex.test(phone)) {
      const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';
      throw new Error(
        `Lead ${leadId} validation failed: phone format invalid (expected Spanish format: +34 XXX XXX XXX)`
      );
    }

    // Normalize phone format (remove spaces for storage consistency)
    data.phone = phone.replace(/\s/g, '');
  }

  return data;
};
