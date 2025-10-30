/**
 * Can Read Enrollments Access Control
 *
 * Determines who can read enrollments.
 *
 * Access Levels:
 * - Public: DENIED
 * - Lectura: ALL active enrollments (read-only)
 * - Asesor: ALL enrollments
 * - Marketing: ALL enrollments
 * - Gestor: ALL enrollments
 * - Admin: ALL enrollments
 *
 * @param {Object} args - Access control arguments
 * @returns {boolean | object} - True if full access, query object if filtered access
 */

import type { Access } from 'payload';

export const canReadEnrollments: Access = ({ req: { user } }) => {
  // No user = public access = denied
  if (!user) {
    return false;
  }

  // Lectura can read all active enrollments
  if (user.role === 'lectura') {
    return {
      active: {
        equals: true,
      },
    };
  }

  // All other roles can read all enrollments
  // (asesor, marketing, gestor, admin)
  return true;
};

export default canReadEnrollments;
