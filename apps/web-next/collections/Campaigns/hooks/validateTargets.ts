/**
 * Validate Targets Hook
 *
 * Validates target metrics logic:
 * If both target_leads and target_enrollments are provided,
 * target_enrollments must be <= target_leads
 *
 * Security: SP-004 compliant (no business intelligence in logs)
 */

import type { FieldHook } from 'payload';

export const validateTargets: FieldHook = async ({
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

  // Get target values from sibling data or existing data
  const targetLeads = siblingData?.target_leads ?? data?.target_leads;
  const targetEnrollments = siblingData?.target_enrollments ?? data?.target_enrollments;

  // Only validate if both values are provided
  if (
    targetLeads !== null &&
    targetLeads !== undefined &&
    targetEnrollments !== null &&
    targetEnrollments !== undefined
  ) {
    if (targetEnrollments > targetLeads) {
      throw new Error('Target enrollments cannot exceed target leads');
    }
  }

  return value;
};

export default validateTargets;
