/**
 * Set Published Timestamp Hook
 *
 * Auto-sets published_at when status changes to 'published'.
 * Only sets on first publish - does not overwrite existing timestamp.
 */

import type { FieldHook } from 'payload';

export const setPublishedTimestamp: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // If published_at is already set, preserve it
  if (value || originalDoc?.published_at) {
    return value || originalDoc?.published_at;
  }

  // Check if status is being set to 'published'
  const newStatus = data?.status;
  if (newStatus === 'published') {
    // Set current timestamp
    return new Date().toISOString();
  }

  return value;
};

export default setPublishedTimestamp;
