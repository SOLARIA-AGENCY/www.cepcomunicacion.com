/**
 * Validate Order Hook
 *
 * Ensures order field is >= 0 (no negative values).
 * Converts negative values to 0 instead of rejecting.
 */

import type { FieldHook } from 'payload';

export const validateOrder: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // Get order value (from update data or original)
  const orderValue = value !== undefined ? value : originalDoc?.order;

  // If no order specified, default to 0
  if (orderValue === undefined || orderValue === null) {
    return 0;
  }

  // Ensure order is >= 0
  if (orderValue < 0) {
    return 0;
  }

  return orderValue;
};

export default validateOrder;
