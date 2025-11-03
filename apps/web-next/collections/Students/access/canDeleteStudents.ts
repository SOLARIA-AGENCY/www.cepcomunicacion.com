import type { Access } from 'payload';

/**
 * Delete access control for Students collection
 *
 * GDPR "Right to be Forgotten" implementation.
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED
 * - Lectura: DENIED
 * - Asesor: DENIED
 * - Marketing: DENIED
 * - Gestor: DENIED
 * - Admin: ALLOWED (implements right to be forgotten)
 *
 * Security:
 * - MAXIMUM restriction: Admin-only
 * - GDPR compliance: Right to erasure
 * - Prefer soft delete (active=false) over hard delete
 * - Audit logging recommended before deletion
 *
 * Note: Deletion should be rare. Prefer soft delete via active=false.
 * Hard delete should only be used for GDPR erasure requests.
 */
export const canDeleteStudents: Access = ({ req: { user } }) => {
  // Only admin can delete students (right to be forgotten)
  if (user && user.role === 'admin') {
    return true;
  }

  // Deny everyone else
  return false;
};
