import type { Access } from 'payload';

/**
 * Delete access control for Leads collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED
 * - Lectura: DENIED
 * - Asesor: DENIED
 * - Marketing: DENIED
 * - Gestor: ALLOWED (can delete spam/GDPR requests)
 * - Admin: ALLOWED (right to be forgotten)
 *
 * Security:
 * - Only admin and gestor can delete leads
 * - Gestor can delete spam submissions
 * - Admin can delete for GDPR right to be forgotten
 * - Prefer soft delete (active = false) over hard delete
 */
export const canDeleteLeads: Access = ({ req: { user } }) => {
  // Deny if not authenticated
  if (!user) {
    return false;
  }

  // Only admin and gestor can delete leads
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Deny all other roles (including marketing and asesor)
  return false;
};
