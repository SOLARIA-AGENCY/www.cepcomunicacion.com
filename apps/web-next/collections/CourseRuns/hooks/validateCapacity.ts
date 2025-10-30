import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates student capacity constraints in CourseRuns
 *
 * Business Rules:
 * 1. max_students MUST be greater than min_students
 * 2. min_students MUST be >= 1
 * 3. current_enrollments MUST be <= max_students
 *
 * Security:
 * - No PII in error messages
 * - Sanitized validation errors
 *
 * @throws ValidationError with descriptive message
 */
export const validateCapacity: CollectionBeforeChangeHook = ({ data }) => {
  // Data is only available on create/update operations

  const { min_students, max_students, current_enrollments = 0 } = data || {};

  // Both capacity fields are required, so they should exist
  if (min_students === undefined || max_students === undefined) {
    return data; // Let Payload's required validation handle this
  }

  // Rule 1: min_students >= 1
  if (min_students < 1) {
    throw new Error(
      'El número mínimo de estudiantes debe ser al menos 1. ' +
        'Verifique la capacidad e intente nuevamente.'
    );
  }

  // Rule 2: max_students > min_students
  if (max_students <= min_students) {
    throw new Error(
      'El número máximo de estudiantes debe ser mayor que el mínimo. ' +
        'Verifique la capacidad e intente nuevamente.'
    );
  }

  // Rule 3: current_enrollments <= max_students
  if (current_enrollments > max_students) {
    throw new Error(
      'El número actual de inscripciones excede la capacidad máxima. ' +
        'Aumente la capacidad máxima o reduzca las inscripciones.'
    );
  }

  return data;
};
