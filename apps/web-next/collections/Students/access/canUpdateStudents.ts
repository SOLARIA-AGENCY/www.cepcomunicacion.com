import type { Access } from 'payload';

/**
 * Update access control for Students collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: ALLOWED (only students they created)
 * - Marketing: ALLOWED (only students they created)
 * - Gestor: ALLOWED (all students)
 * - Admin: ALLOWED (all students)
 *
 * Security:
 * - No PII in access control logic
 * - Ownership validation for asesor/marketing
 * - GDPR consent fields immutable (enforced via field.access)
 */
export const canUpdateStudents: Access = ({ req: { user } }) => {
  // Deny if not authenticated
  if (!user) {
    return false;
  }

  // Admin and gestor: Can update all students
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Asesor and marketing: Can only update students they created
  if (['asesor', 'marketing'].includes(user.role)) {
    return {
      created_by: {
        equals: user.id,
      },
    };
  }

  // Deny: lectura, any other role
  return false;
};
