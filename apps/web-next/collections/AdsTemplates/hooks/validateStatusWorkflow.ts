import type { FieldHook } from 'payload';

/**
 * validateStatusWorkflow Hook
 *
 * Enforces status workflow rules:
 * 1. Once status = 'archived', it cannot transition to any other status (terminal state)
 * 2. Auto-sets archived_at timestamp when transitioning to archived
 *
 * Status Flow:
 * - draft → active ✓
 * - draft → archived ✓
 * - active → draft ✓
 * - active → archived ✓
 * - archived → * ✗ (BLOCKED - terminal state)
 *
 * Triggered: beforeChange
 */
export const validateStatusWorkflow: FieldHook = async ({ data, operation, originalDoc, req }) => {
  // Only validate on update operations (not create)
  if (operation !== 'update') {
    return;
  }

  const oldStatus = originalDoc?.status;
  const newStatus = data?.status;

  // If status is not changing, no validation needed
  if (oldStatus === newStatus) {
    return;
  }

  // Enforce terminal state: archived cannot transition to any other status
  if (oldStatus === 'archived' && newStatus !== 'archived') {
    throw new Error(
      'Cannot change status from archived (terminal state). ' +
      'Archived templates cannot be reactivated. Create a new template instead.'
    );
  }

  // Auto-set archived_at timestamp when transitioning to archived
  if (newStatus === 'archived' && oldStatus !== 'archived') {
    data.archived_at = new Date().toISOString();

    // Log archival action (no PII per SP-004)
    if (req?.payload?.logger) {
      req.payload.logger.info({
        collection: 'ads-templates',
        operation: 'archive',
        documentId: originalDoc?.id,
        userId: req?.user?.id,
        message: 'Template archived',
      });
    }
  }
};
