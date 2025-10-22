import { Access } from 'payload';
import { ROLES } from '../../../access/roles';

/**
 * Check if user is viewing/editing their own profile or is admin
 */
export const isSelfOrAdmin: Access = ({ req: { user }, id }) => {
  // Admin can access all users
  if (user?.role === ROLES.ADMIN) return true;

  // Users can access their own profile
  return user?.id === id;
};
