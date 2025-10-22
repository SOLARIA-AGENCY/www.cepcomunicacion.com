/**
 * CourseRuns Collection - Hooks
 *
 * This module exports all hooks for the CourseRuns collection.
 *
 * Hook execution order:
 * 1. beforeValidate: validateCourseRunDates, validateCourseRunRelationships, validateEnrollmentCapacity
 * 2. validate: Payload's built-in validation
 * 3. beforeChange: trackCourseRunCreator
 * 4. afterChange: (none currently - future: trigger notifications, update indexes, etc.)
 * 5. afterRead: (none currently)
 *
 * Data Integrity:
 * - validateCourseRunDates: Ensures date and time logic is correct
 * - validateCourseRunRelationships: Ensures referential integrity
 * - validateEnrollmentCapacity: Validates capacity constraints
 * - trackCourseRunCreator: Auto-populates and protects created_by field
 *
 * Security:
 * - All hooks implement error handling to prevent data corruption
 * - Immutable fields (created_by, current_enrollments) are protected
 * - No PII is logged in console.log statements
 */

export { validateCourseRunDates } from './validateCourseRunDates';
export { validateCourseRunRelationships } from './validateCourseRunRelationships';
export { trackCourseRunCreator } from './trackCourseRunCreator';
export { validateEnrollmentCapacity } from './validateEnrollmentCapacity';
