/**
 * Validate Dates Hook
 *
 * Validates campaign date logic:
 * 1. end_date must be >= start_date (same day allowed)
 * 2. If status=draft, start_date cannot be in past
 *
 * Security: SP-004 compliant (no PII/business data in logs)
 */

import type { FieldHook } from 'payload';

export const validateDates: FieldHook = async ({
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

  const startDate = siblingData?.start_date ? new Date(siblingData.start_date) : null;
  const endDate = siblingData?.end_date ? new Date(siblingData.end_date) : null;
  const status = siblingData?.status || data?.status;

  // Validation 1: end_date must be >= start_date
  if (startDate && endDate) {
    // Reset time to compare dates only
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (endDateOnly < startDateOnly) {
      throw new Error('End date must be on or after start date');
    }
  }

  // Validation 2: Draft campaigns cannot have past start_date
  if (status === 'draft' && startDate) {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    if (startDateOnly < todayDateOnly) {
      throw new Error('Draft campaigns cannot have past start dates');
    }
  }

  return value;
};

export default validateDates;
