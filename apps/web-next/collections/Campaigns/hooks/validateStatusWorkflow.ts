/**
 * Validate Status Workflow Hook
 *
 * Enforces campaign status workflow rules:
 * - Once status = 'archived', it's TERMINAL (cannot change to any other status)
 *
 * Status lifecycle:
 * draft -> active -> paused -> completed -> archived (TERMINAL)
 *                 -> completed -> archived (TERMINAL)
 *
 * Security: SP-004 compliant (no business data in logs)
 */

import type { FieldHook } from 'payload';

export const validateStatusWorkflow: FieldHook = async ({
  data,
  req,
  operation,
  value,
  originalDoc,
}) => {
  // Only validate on update operations
  if (operation !== 'update') {
    return value;
  }

  // Get the original status from the database
  const originalStatus = originalDoc?.status;
  const newStatus = value || data?.status;

  // Rule: Once archived, always archived (terminal state)
  if (originalStatus === 'archived' && newStatus !== 'archived') {
    throw new Error('Cannot change status from archived (terminal state)');
  }

  return value;
};

export default validateStatusWorkflow;
