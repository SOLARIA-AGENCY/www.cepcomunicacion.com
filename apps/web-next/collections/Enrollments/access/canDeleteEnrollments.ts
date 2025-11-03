/**
 * Can Delete Enrollments Access Control
 *
 * Determines who can delete enrollments.
 *
 * Access Levels:
 * - Public: DENIED
 * - Lectura: DENIED
 * - Asesor: DENIED
 * - Marketing: DENIED
 * - Gestor: DENIED
 * - Admin: ALLOWED
 *
 * Note: Soft delete (active flag) is preferred over hard delete.
 * Hard delete should only be used for data cleanup or compliance reasons.
 *
 * @param {Object} args - Access control arguments
 * @returns {boolean} - True if user can delete enrollments
 */

import type { Access } from 'payload';

export const canDeleteEnrollments: Access = ({ req: { user } }) => {
  // Only admin can delete enrollments
  if (!user) {
    return false;
  }

  return user.role === 'admin';
};

export default canDeleteEnrollments;
