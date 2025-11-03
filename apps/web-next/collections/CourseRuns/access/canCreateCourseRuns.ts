import type { Access } from 'payload';

/**
 * Create access control for CourseRuns collection
 *
 * Access Matrix:
 * - Admin: ✅ Can create
 * - Gestor: ✅ Can create
 * - Marketing: ✅ Can create
 * - Asesor: ❌ Cannot create
 * - Lectura: ❌ Cannot create
 * - Public: ❌ Cannot create
 *
 * Security:
 * - Requires authentication
 * - Role-based authorization
 */
export const canCreateCourseRuns: Access = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) {
    return false;
  }

  // Admin, gestor, and marketing can create course runs
  return ['admin', 'gestor', 'marketing'].includes(user.role);
};
