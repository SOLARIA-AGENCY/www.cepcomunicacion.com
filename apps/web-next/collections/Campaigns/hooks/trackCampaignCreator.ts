/**
 * Track Campaign Creator Hook
 *
 * Auto-populates created_by field with current user ID on creation.
 * Enforces immutability of created_by field (SP-001 Layer 3).
 *
 * Security Patterns:
 * - SP-001: Defense in Depth (Layer 3 - Hook validation)
 * - SP-004: No PII in logs
 */

import type { FieldHook } from 'payload';

export const trackCampaignCreator: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // On CREATE: Auto-populate with current user
  if (operation === 'create') {
    if (!req.user) {
      throw new Error('Authentication required to create campaigns');
    }
    return req.user.id;
  }

  // On UPDATE: Enforce immutability (SP-001 Layer 3)
  if (operation === 'update') {
    const originalCreatedBy = originalDoc?.created_by;
    const newCreatedBy = value || data?.created_by;

    // If created_by is being changed, reject
    if (originalCreatedBy && newCreatedBy && originalCreatedBy !== newCreatedBy) {
      throw new Error('created_by field is immutable and cannot be changed after creation');
    }

    // Always return original value to prevent any changes
    return originalCreatedBy;
  }

  return value;
};

export default trackCampaignCreator;
