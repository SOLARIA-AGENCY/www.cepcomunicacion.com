import type { Access } from 'payload';

/**
 * Update access control for Leads collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED (no public updates)
 * - Lectura: DENIED (read-only role)
 * - Asesor: ALLOWED for assigned leads only
 * - Marketing: ALLOWED (all leads)
 * - Gestor: ALLOWED (all leads)
 * - Admin: ALLOWED (all leads)
 *
 * Security:
 * - No public updates allowed
 * - Asesor can only update leads assigned to them
 * - GDPR consent fields are immutable (enforced by field-level access)
 */
export const canUpdateLeads: Access = ({ req: { user } }) => {
  // Deny if not authenticated
  if (!user) {
    return false;
  }

  // Lectura role: DENIED
  if (user.role === 'lectura') {
    return false;
  }

  // Admin and gestor: Full access to all leads
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: Can update all leads
  if (user.role === 'marketing') {
    return true;
  }

  // Asesor: Can only update leads assigned to them
  if (user.role === 'asesor') {
    return {
      assigned_to: {
        equals: user.id,
      },
    };
  }

  // Deny any other role
  return false;
};
