import type { Access } from 'payload';

/**
 * Access Control: Can Delete Users
 *
 * Determines who can delete user records.
 *
 * Rules:
 * - Admin: Can delete any user EXCEPT themselves
 * - All other roles: Cannot delete any users
 *
 * Security Notes:
 * - Prevents users from deleting themselves (could lock themselves out)
 * - Prevents accidental deletion of the last admin (enforced in beforeChange hook)
 * - Only admin role has delete privileges for user management
 *
 * Implementation:
 * - Checks if user is admin
 * - Checks if trying to delete self (denied)
 * - Additional check in beforeChange hook prevents deleting last admin
 *
 * @param req - Payload request object containing authenticated user
 * @param id - ID of user being deleted
 * @returns Boolean indicating if deletion is allowed
 */
export const canDeleteUsers: Access = ({ req: { user }, id }) => {
  // Not authenticated - deny access
  if (!user) {
    return false;
  }

  // Only admin can delete users
  if (user.role !== 'admin') {
    return false;
  }

  // Admin cannot delete themselves
  if (user.id === id) {
    return false;
  }

  return true;
};
