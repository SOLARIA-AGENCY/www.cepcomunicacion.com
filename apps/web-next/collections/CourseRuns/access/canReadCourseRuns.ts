import type { Access } from 'payload';

/**
 * Read access control for CourseRuns collection
 *
 * Access Matrix:
 * - Public/Anonymous: Only published and enrollment_open status, active=true
 * - Lectura: All active course runs
 * - Asesor: All course runs (including inactive)
 * - Marketing: All course runs (including inactive)
 * - Gestor: All course runs (including inactive)
 * - Admin: All course runs (including inactive)
 *
 * Security:
 * - No PII in query constraints
 * - Role-based filtering
 */
export const canReadCourseRuns: Access = ({ req: { user } }) => {
  // Admin and gestor: Full access to all runs
  if (user && ['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing and asesor: All course runs (including inactive)
  if (user && ['marketing', 'asesor'].includes(user.role)) {
    return true;
  }

  // Lectura: All active runs
  if (user && user.role === 'lectura') {
    return {
      active: {
        equals: true,
      },
    };
  }

  // Public/Anonymous: Only published and enrollment_open runs that are active
  return {
    and: [
      {
        active: {
          equals: true,
        },
      },
      {
        or: [
          {
            status: {
              equals: 'published',
            },
          },
          {
            status: {
              equals: 'enrollment_open',
            },
          },
        ],
      },
    ],
  };
};
