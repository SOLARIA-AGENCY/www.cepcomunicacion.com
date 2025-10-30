/**
 * CourseRuns Collection Access Control
 *
 * Exports all access control functions implementing 6-tier RBAC:
 * - admin: Full access
 * - gestor: Full access
 * - marketing: Create + update own + read all
 * - asesor: Read all only
 * - lectura: Read active only
 * - public: Read published/enrollment_open only
 */

export { canReadCourseRuns } from './canReadCourseRuns';
export { canCreateCourseRuns } from './canCreateCourseRuns';
export { canUpdateCourseRuns } from './canUpdateCourseRuns';
export { canDeleteCourseRuns } from './canDeleteCourseRuns';
