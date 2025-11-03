import type { FieldHook } from 'payload';

/**
 * Tracks the user who created the course run
 *
 * Sets created_by field to current user ID on creation.
 * This field becomes immutable after creation (SP-001 pattern).
 *
 * Security:
 * - 3-layer defense in depth:
 *   Layer 1: admin.readOnly = true (UI protection)
 *   Layer 2: access.update = () => false (API protection)
 *   Layer 3: This hook (validation protection)
 * - No PII in error messages
 *
 * @returns FieldHook for beforeChange
 */
export const trackCreator: FieldHook = ({ req, operation, value }) => {
  // Only set on create operation
  if (operation === 'create') {
    if (!req.user) {
      throw new Error('Usuario no autenticado. Debe iniciar sesión para crear una convocatoria.');
    }
    return req.user.id;
  }

  // On update, return existing value (immutable - SP-001 Layer 3)
  // This prevents any attempt to modify created_by after creation
  return value;
};
