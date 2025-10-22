import type { Access } from 'payload';

/**
 * Access Control: Can Read Users
 *
 * Determines who can read user records.
 *
 * Rules:
 * - Admin: Can read all users
 * - Gestor: Can read all users
 * - Marketing/Asesor/Lectura: Can only read themselves
 *
 * Implementation:
 * - Returns `true` for admin/gestor (full access)
 * - Returns query constraint for others (filter to self only)
 *
 * @param req - Payload request object containing authenticated user
 * @returns Boolean true for full access, or query constraint object
 */
export const canReadUsers: Access = ({ req: { user } }) => {
  // Not authenticated - deny access
  if (!user) {
    return false;
  }

  // Admin and Gestor can read all users
  if (user.role === 'admin' || user.role === 'gestor') {
    return true;
  }

  // Other roles can only read themselves
  return {
    id: {
      equals: user.id,
    },
  };
};
