/**
 * Enrollments Collection Access Control
 *
 * Exports all access control functions for the Enrollments collection.
 *
 * Collection-Level Access:
 * - canCreateEnrollments: Who can create enrollments
 * - canReadEnrollments: Who can read enrollments
 * - canUpdateEnrollments: Who can update enrollments
 * - canDeleteEnrollments: Who can delete enrollments (admin only)
 *
 * Field-Level Access:
 * - financialFieldUpdateAccess: Admin/Gestor only for financial fields
 * - financialFieldReadAccess: Admin/Gestor/Asesor can read financial fields
 * - readOnlyFieldAccess: All authenticated users can read, nobody can update
 * - asesorCanUpdate: Asesor restricted to specific fields
 * - marketingCanUpdate: Marketing restricted to notes only
 * - standardFieldAccess: All roles except lectura
 */

// Collection-level access
export { canCreateEnrollments } from './canCreateEnrollments';
export { canReadEnrollments } from './canReadEnrollments';
export { canUpdateEnrollments } from './canUpdateEnrollments';
export { canDeleteEnrollments } from './canDeleteEnrollments';

// Field-level access
export {
  financialFieldUpdateAccess,
  financialFieldReadAccess,
  readOnlyFieldAccess,
  asesorCanUpdate,
  marketingCanUpdate,
  standardFieldAccess,
} from './fieldLevelAccess';
