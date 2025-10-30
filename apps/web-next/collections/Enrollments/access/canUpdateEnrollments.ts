/**
 * Can Update Enrollments Access Control
 *
 * Determines who can update enrollments.
 *
 * Access Levels:
 * - Public: DENIED
 * - Lectura: DENIED
 * - Asesor: ALLOWED (status and notes only - enforced at field level)
 * - Marketing: ALLOWED (notes only - enforced at field level)
 * - Gestor: ALLOWED (all fields except some financial - enforced at field level)
 * - Admin: ALLOWED (all fields)
 *
 * Note: Field-level restrictions are enforced in fieldLevelAccess.ts
 *
 * @param {Object} args - Access control arguments
 * @returns {boolean} - True if user can update enrollments
 */

import type { Access } from 'payload';

export const canUpdateEnrollments: Access = ({ req: { user } }) => {
  // No user = public access = denied
  if (!user) {
    return false;
  }

  // Lectura role cannot update
  if (user.role === 'lectura') {
    return false;
  }

  // All other authenticated roles can update
  // (asesor, marketing, gestor, admin)
  // Field-level access controls what they can actually change
  return ['asesor', 'marketing', 'gestor', 'admin'].includes(user.role);
};

export default canUpdateEnrollments;
