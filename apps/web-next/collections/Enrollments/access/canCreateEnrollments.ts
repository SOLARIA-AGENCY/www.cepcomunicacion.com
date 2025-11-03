/**
 * Can Create Enrollments Access Control
 *
 * Determines who can create enrollments.
 *
 * Access Levels:
 * - Public: DENIED
 * - Lectura: DENIED
 * - Asesor: ALLOWED
 * - Marketing: ALLOWED
 * - Gestor: ALLOWED
 * - Admin: ALLOWED
 *
 * @param {Object} args - Access control arguments
 * @returns {boolean} - True if user can create enrollments
 */

import type { Access } from 'payload';

export const canCreateEnrollments: Access = ({ req: { user } }) => {
  // No user = public access = denied
  if (!user) {
    return false;
  }

  // Lectura role cannot create
  if (user.role === 'lectura') {
    return false;
  }

  // All other authenticated roles can create
  // (asesor, marketing, gestor, admin)
  return ['asesor', 'marketing', 'gestor', 'admin'].includes(user.role);
};

export default canCreateEnrollments;
