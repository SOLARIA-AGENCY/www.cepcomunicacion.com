/**
 * Track Creator Hook
 *
 * Sets created_by to the authenticated user on creation.
 * Prevents manipulation of created_by field.
 *
 * Security:
 * - SP-001: created_by is immutable after creation (Layer 3 protection)
 *
 * @param {Object} args - Hook arguments
 * @returns {void} - Sets created_by in data
 */

import type { FieldHook } from 'payload';

export const trackCreator: FieldHook = async ({ data, req, operation, originalDoc }) => {
  // On create, set created_by to authenticated user
  if (operation === 'create') {
    if (req.user && data) {
      data.created_by = req.user.id;
    }
    return;
  }

  // On update, prevent changing created_by (SP-001 Layer 3)
  if (operation === 'update' && originalDoc?.created_by) {
    if (data) {
      data.created_by = originalDoc.created_by;
    }
  }
};

export default trackCreator;
