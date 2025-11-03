/**
 * Validate UTM Parameters Hook
 *
 * Validates UTM parameter requirements:
 * 1. If ANY UTM parameter is provided, utm_campaign is REQUIRED
 * 2. Format validation is handled by field validators
 *
 * Security: SP-004 compliant (no business data in logs)
 */

import type { FieldHook } from 'payload';

export const validateUTMParameters: FieldHook = async ({
  data,
  req,
  operation,
  value,
  siblingData,
}) => {
  // Only validate on create and update
  if (operation !== 'create' && operation !== 'update') {
    return value;
  }

  // Get all UTM parameters from sibling data or existing data
  const utmSource = siblingData?.utm_source || data?.utm_source;
  const utmMedium = siblingData?.utm_medium || data?.utm_medium;
  const utmCampaign = siblingData?.utm_campaign || data?.utm_campaign;
  const utmTerm = siblingData?.utm_term || data?.utm_term;
  const utmContent = siblingData?.utm_content || data?.utm_content;

  // Check if any UTM parameter is provided (excluding utm_campaign itself)
  const hasAnyUTM = utmSource || utmMedium || utmTerm || utmContent;

  // If any UTM parameter is provided, utm_campaign is REQUIRED
  if (hasAnyUTM && !utmCampaign) {
    throw new Error('utm_campaign is required when any UTM parameter is provided');
  }

  return value;
};

export default validateUTMParameters;
