import type { Access } from 'payload';

/**
 * Update access control for CourseRuns collection
 *
 * Access Matrix:
 * - Admin: ✅ Can update all runs
 * - Gestor: ✅ Can update all runs
 * - Marketing: ✅ Can update only runs they created (ownership)
 * - Asesor: ❌ Cannot update
 * - Lectura: ❌ Cannot update
 * - Public: ❌ Cannot update
 *
 * Security:
 * - Requires authentication
 * - Role-based authorization
 * - Ownership validation for marketing role
 */
export const canUpdateCourseRuns: Access = ({ req: { user } }) => {
  // Must be authenticated
  if (!user) {
    return false;
  }

  // Admin and gestor: Can update all course runs
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: Can only update course runs they created
  if (user.role === 'marketing') {
    return {
      created_by: {
        equals: user.id,
      },
    };
  }

  // All other roles: Cannot update
  return false;
};
