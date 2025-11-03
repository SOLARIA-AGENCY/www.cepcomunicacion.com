import type { Access } from 'payload';

/**
 * Delete access control for CourseRuns collection
 *
 * Access Matrix:
 * - Admin: ✅ Can delete
 * - Gestor: ✅ Can delete
 * - Marketing: ❌ Cannot delete
 * - Asesor: ❌ Cannot delete
 * - Lectura: ❌ Cannot delete
 * - Public: ❌ Cannot delete
 *
 * Note: Prefer soft delete via active=false flag
 *
 * Security:
 * - Requires authentication
 * - Role-based authorization
 * - Only highest privilege roles can hard delete
 */
export const canDeleteCourseRuns: Access = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) {
    return false;
  }

  // Only admin and gestor can delete course runs
  return ['admin', 'gestor'].includes(user.role);
};
