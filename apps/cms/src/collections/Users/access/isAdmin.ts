import { Access } from 'payload';
import { ROLES } from '../../../access/roles';

/**
 * Check if user is admin
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === ROLES.ADMIN;
};
