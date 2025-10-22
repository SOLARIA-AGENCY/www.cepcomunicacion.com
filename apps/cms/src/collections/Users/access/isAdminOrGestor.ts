import { Access } from 'payload';
import { ROLES } from '../../../access/roles';

/**
 * Check if user is admin or gestor
 */
export const isAdminOrGestor: Access = ({ req: { user } }) => {
  return user?.role === ROLES.ADMIN || user?.role === ROLES.GESTOR;
};
