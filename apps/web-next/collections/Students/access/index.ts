/**
 * Students Collection Access Control
 *
 * Exports all access control functions implementing 6-tier RBAC
 * with field-level PII protection.
 *
 * Access Matrix:
 * - admin: Full access (including right to be forgotten)
 * - gestor: Full access (except delete)
 * - asesor: Create + update own + read all (all fields)
 * - marketing: Create + update own + read all (NO DNI, NO emergency)
 * - lectura: Read only (NO PII fields, only student_id/status/enrollment_count)
 * - public: DENIED (no PII exposure)
 *
 * Field-Level Protection:
 * - 15+ PII fields protected via field.access
 * - Granular visibility control by role
 * - GDPR compliance enforcement
 */

export { canReadStudents } from './canReadStudents';
export { canCreateStudents } from './canCreateStudents';
export { canUpdateStudents } from './canUpdateStudents';
export { canDeleteStudents } from './canDeleteStudents';
export * from './fieldLevelAccess';
