import type { Access } from 'payload';

/**
 * Create access control for Students collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED (no public student creation)
 * - Lectura: DENIED (read-only role)
 * - Asesor: ALLOWED (can create student profiles)
 * - Marketing: ALLOWED (can create leads/students)
 * - Gestor: ALLOWED (full management)
 * - Admin: ALLOWED (full access)
 *
 * Security:
 * - No PII in access control logic
 * - Authentication required
 * - Role-based authorization
 */
export const canCreateStudents: Access = ({ req: { user } }) => {
  // Deny if not authenticated
  if (!user) {
    return false;
  }

  // Allow: admin, gestor, asesor, marketing
  if (['admin', 'gestor', 'asesor', 'marketing'].includes(user.role)) {
    return true;
  }

  // Deny: lectura, any other role
  return false;
};
