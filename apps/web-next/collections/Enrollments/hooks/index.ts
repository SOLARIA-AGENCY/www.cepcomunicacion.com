/**
 * Enrollments Collection Hooks
 *
 * Exports all validation and business logic hooks for the Enrollments collection.
 *
 * Hook Categories:
 * 1. Validation Hooks (beforeChange):
 *    - validateUniqueEnrollment: Enforce (student + course_run) unique constraint
 *    - validateFinancialAmounts: Validate all financial amounts and constraints
 *    - validateStatusTransitions: Enforce valid status workflow
 *    - validateAcademicRequirements: Validate academic data (grades, attendance)
 *
 * 2. Auto-Calculation Hooks (beforeChange):
 *    - calculatePaymentStatus: Auto-set payment_status from amounts
 *    - generateEnrollmentID: Auto-generate unique enrollment IDs
 *    - trackCreator: Set created_by to authenticated user
 *
 * 3. Timestamp Hooks (beforeChange):
 *    - setEnrollmentTimestamps: Manage all immutable timestamps
 *    - setCertificateIssueDate: Set certificate_issued_at
 *
 * 4. Relationship Hooks (afterChange):
 *    - updateCourseRunCapacity: Update course_run.current_enrollments
 */

// Validation hooks (beforeChange)
export { validateUniqueEnrollment } from './validateUniqueEnrollment';
export { validateFinancialAmounts } from './validateFinancialAmounts';
export { validateStatusTransitions } from './validateStatusTransitions';
export { validateAcademicRequirements } from './validateAcademicRequirements';

// Auto-calculation hooks (beforeChange)
export { calculatePaymentStatus } from './calculatePaymentStatus';
export { generateEnrollmentID } from './generateEnrollmentID';
export { trackCreator } from './trackCreator';

// Timestamp hooks (beforeChange)
export { setEnrollmentTimestamps } from './setEnrollmentTimestamps';
export { setCertificateIssueDate } from './setCertificateIssueDate';

// Relationship hooks (afterChange)
export { updateCourseRunCapacity } from './updateCourseRunCapacity';
