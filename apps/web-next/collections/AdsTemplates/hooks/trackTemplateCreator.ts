import type { FieldHook } from 'payload';

/**
 * trackTemplateCreator Hook
 *
 * Auto-populates created_by field with authenticated user on template creation.
 *
 * Security Pattern: SP-001 (Defense in Depth - Immutability)
 * - Layer 1: admin.readOnly = true (UI-level protection)
 * - Layer 2: access.update = () => false (API-level protection)
 * - Layer 3: Hook validation (this layer)
 *
 * Business Rules:
 * - created_by is auto-populated on create
 * - created_by is IMMUTABLE (cannot be changed after creation)
 * - Used for ownership-based permissions (Marketing role)
 * - Required for audit trail
 *
 * Triggered: beforeChange (create and update operations)
 */
export const trackTemplateCreator: FieldHook = async ({ data, operation, originalDoc, req, value }) => {
  // LAYER 3: Hook-level validation for immutability

  // On CREATE: Auto-populate created_by with current user
  if (operation === 'create') {
    const userId = req?.user?.id;

    if (!userId) {
      throw new Error(
        'Authentication required: Cannot create template without authenticated user. ' +
        'Please log in and try again.'
      );
    }

    // Auto-populate created_by
    return userId;
  }

  // On UPDATE: Enforce immutability (SP-001 Layer 3)
  if (operation === 'update') {
    const originalCreatedBy = originalDoc?.created_by;
    const newCreatedBy = value;

    // If created_by is being changed, block the operation
    if (originalCreatedBy && newCreatedBy && originalCreatedBy !== newCreatedBy) {
      throw new Error(
        'created_by field is immutable and cannot be changed after template creation. ' +
        'This field is protected for audit trail integrity (SP-001).'
      );
    }

    // If created_by is missing (should never happen), preserve original
    if (originalCreatedBy && !newCreatedBy) {
      return originalCreatedBy;
    }

    // Return existing value (no change)
    return value;
  }

  return value;
};
