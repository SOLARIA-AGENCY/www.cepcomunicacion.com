import type { FieldHook } from 'payload';

/**
 * setArchivedTimestamp Hook
 *
 * Auto-sets archived_at timestamp when status changes to 'archived'.
 *
 * Security Pattern: SP-001 (Defense in Depth - Immutability)
 * - Layer 1: admin.readOnly = true (UI-level protection)
 * - Layer 2: access.update = () => false (API-level protection)
 * - Layer 3: Hook validation (this layer)
 *
 * Business Rules:
 * - archived_at is set when status = 'archived'
 * - archived_at is SYSTEM-MANAGED (users cannot manually set)
 * - Once set, archived_at is IMMUTABLE
 * - Used for audit trail and compliance
 *
 * Workflow:
 * - Status changes to 'archived' → archived_at = now()
 * - Status is already 'archived' → archived_at unchanged
 * - Status is not 'archived' → archived_at remains null
 *
 * Note: This hook works in conjunction with validateStatusWorkflow
 * which ensures archived status is terminal.
 *
 * Triggered: beforeChange (update operations)
 */
export const setArchivedTimestamp: FieldHook = async ({ data, operation, originalDoc, req, value }) => {
  // LAYER 3: Hook-level validation for system-managed field

  // Only process on UPDATE operations (create doesn't archive)
  if (operation !== 'update') {
    return value;
  }

  const oldStatus = originalDoc?.status;
  const newStatus = data?.status;
  const oldArchivedAt = originalDoc?.archived_at;

  // Case 1: Status is changing TO 'archived' (first time)
  if (newStatus === 'archived' && oldStatus !== 'archived') {
    const now = new Date().toISOString();

    // Log archival timestamp (no PII per SP-004)
    if (req?.payload?.logger) {
      req.payload.logger.info({
        collection: 'ads-templates',
        operation: 'archived_timestamp_set',
        documentId: originalDoc?.id,
        timestamp: now,
        userId: req?.user?.id,
        message: 'Template archived timestamp set',
      });
    }

    return now;
  }

  // Case 2: Status remains 'archived' - preserve existing timestamp (SP-001 Layer 3)
  if (newStatus === 'archived' && oldStatus === 'archived') {
    // Prevent manual changes to archived_at (immutability)
    const attemptedValue = value;
    if (attemptedValue && attemptedValue !== oldArchivedAt) {
      // Log warning but preserve original value
      if (req?.payload?.logger) {
        req.payload.logger.warn({
          collection: 'ads-templates',
          operation: 'archived_at_override_blocked',
          documentId: originalDoc?.id,
          attemptedValue,
          correctValue: oldArchivedAt,
          userId: req?.user?.id,
          message: 'Manual archived_at change blocked (immutable)',
        });
      }
    }

    // Always return original value (enforce immutability)
    return oldArchivedAt;
  }

  // Case 3: Status is NOT 'archived' - archived_at should be null
  // Note: This case should not happen due to terminal state enforcement
  // in validateStatusWorkflow, but we handle it for completeness
  if (newStatus !== 'archived') {
    // If there's an archived_at value, it means status was changed from archived
    // This should be blocked by validateStatusWorkflow, but we handle it here too
    if (oldArchivedAt) {
      if (req?.payload?.logger) {
        req.payload.logger.warn({
          collection: 'ads-templates',
          operation: 'archived_at_terminal_violation',
          documentId: originalDoc?.id,
          oldStatus,
          newStatus,
          userId: req?.user?.id,
          message: 'Attempted to change archived template status (should be blocked)',
        });
      }

      // Preserve archived_at even if status is being changed
      // This maintains audit trail integrity
      return oldArchivedAt;
    }

    // Status not archived, no archived_at value - keep it null
    return null;
  }

  // Default: return existing value
  return value;
};
