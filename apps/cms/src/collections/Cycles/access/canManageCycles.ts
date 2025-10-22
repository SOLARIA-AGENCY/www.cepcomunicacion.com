import { Access } from 'payload';
import { ROLES } from '../../../access/roles';

/**
 * Access control for managing Cycles
 *
 * Allowed roles:
 * - Admin: Full access
 * - Gestor: Full access
 *
 * All other roles: Read-only access
 */
export const canManageCycles: Access = ({ req: { user } }) => {
  // Not authenticated
  if (!user) return false;

  // Admin and Gestor can manage cycles
  return user.role === ROLES.ADMIN || user.role === ROLES.GESTOR;
};
