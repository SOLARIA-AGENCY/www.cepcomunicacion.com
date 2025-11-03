/**
 * CourseRuns Collection Hooks
 *
 * Exports all validation and tracking hooks for CourseRuns collection.
 */

export { generateSlug } from '../../shared/hooks';
export { validateDates } from './validateDates';
export { validateCapacity } from './validateCapacity';
export { validateSchedule } from './validateSchedule';
export { trackCreator } from './trackCreator';
