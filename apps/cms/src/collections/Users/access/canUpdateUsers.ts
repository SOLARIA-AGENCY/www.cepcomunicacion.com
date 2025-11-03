import type { Access } from 'payload';

/**
 * Access Control: Can Update Users
 *
 * Determines who can update user records.
 *
 * Rules:
 * - Admin: Can update any user
 * - Gestor: Can update any user (but role changes restricted via field-level access)
 * - Marketing/Asesor/Lectura: Can only update themselves
 *
 * Additional Restrictions (enforced via field-level access or hooks):
 * - Users cannot change their own role (except admin)
 * - Users cannot change their own is_active status (except admin)
 * - Users cannot change their email address
 *
 * Implementation:
 * - Returns `true` for admin (full access)
 * - Returns `true` for gestor (full access to updates, but some fields restricted)
 * - Returns query constraint for others (filter to self only)
 *
 * @param req - Payload request object containing authenticated user
 * @param id - ID of user being updated
 * @returns Boolean true for full access, or query constraint object
 */
export const canUpdateUsers: Access = ({ req: { user } }) => {
  // Not authenticated - deny access
  if (!user) {
    return false;
  }

  // Admin can update any user
  if (user.role === 'admin') {
    return true;
  }

  // Gestor can update any user (but some fields are restricted via field-level access)
  if (user.role === 'gestor') {
    return true;
  }

  // Other roles can only update themselves
  return {
    id: {
      equals: user.id,
    },
  };
};
