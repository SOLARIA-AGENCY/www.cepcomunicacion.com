import type { Access } from 'payload';

/**
 * Access Control: Can Create Users
 *
 * Determines who can create new user records.
 *
 * Rules:
 * - Admin: Can create any user (including other admins)
 * - Gestor: Can create non-admin users only
 * - Marketing/Asesor/Lectura: Cannot create users
 *
 * Security Notes:
 * - Prevents privilege escalation by limiting who can create admins
 * - Only admins can create other admin accounts
 *
 * @param req - Payload request object containing authenticated user
 * @param data - User data being created (contains role)
 * @returns Boolean indicating if creation is allowed
 */
export const canCreateUsers: Access = ({ req: { user }, data }) => {
  // Not authenticated - deny access
  if (!user) {
    return false;
  }

  // Admin can create any user
  if (user.role === 'admin') {
    return true;
  }

  // Gestor can create non-admin users
  if (user.role === 'gestor') {
    // Check if trying to create an admin user
    if (data?.role === 'admin') {
      return false; // Gestor cannot create admins
    }
    return true;
  }

  // All other roles cannot create users
  return false;
};
