import type { Access } from 'payload';

/**
 * Read access control for Students collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED (no PII exposure)
 * - Lectura: ALLOWED with field-level restrictions (NO PII fields)
 * - Asesor: ALLOWED (all fields, active students only)
 * - Marketing: ALLOWED with field-level restrictions (NO DNI, NO emergency)
 * - Gestor: ALLOWED (all fields, all students)
 * - Admin: ALLOWED (all fields, all students including inactive)
 *
 * Security:
 * - NO PII exposure to public
 * - Field-level access control enforced separately
 * - Role-based data filtering
 *
 * Note: Field-level access is handled by field.access configuration,
 * not in this function. This controls document-level access only.
 */
export const canReadStudents: Access = ({ req: { user } }) => {
  // Deny if not authenticated (NO public access to student data)
  if (!user) {
    return false;
  }

  // Admin and gestor: Full access to all students (including inactive)
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Asesor, marketing, lectura: Only active students
  if (['asesor', 'marketing', 'lectura'].includes(user.role)) {
    return {
      active: {
        equals: true,
      },
    };
  }

  // Deny any other role
  return false;
};
