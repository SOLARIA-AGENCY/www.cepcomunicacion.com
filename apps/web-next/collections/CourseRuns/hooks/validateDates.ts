import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates date relationships in CourseRuns
 *
 * Business Rules:
 * 1. end_date MUST be after start_date
 * 2. enrollment_deadline (if provided) MUST be before start_date
 *
 * Security:
 * - No PII in error messages
 * - Sanitized validation errors
 *
 * @throws ValidationError with descriptive message
 */
export const validateDates: CollectionBeforeChangeHook = ({ data }) => {
  // Data is only available on create/update operations

  const { start_date, end_date, enrollment_deadline } = data || {};

  // Both dates are required, so they should exist
  if (!start_date || !end_date) {
    return data; // Let Payload's required validation handle this
  }

  // Parse dates for comparison
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Validate date objects are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Formato de fecha inválido. Use formato ISO 8601 (YYYY-MM-DD).');
  }

  // Rule 1: end_date > start_date
  if (endDate <= startDate) {
    throw new Error(
      'La fecha de fin debe ser posterior a la fecha de inicio. ' +
        'Verifique las fechas e intente nuevamente.'
    );
  }

  // Rule 2: enrollment_deadline < start_date (if provided)
  if (enrollment_deadline) {
    const enrollmentDeadlineDate = new Date(enrollment_deadline);

    if (isNaN(enrollmentDeadlineDate.getTime())) {
      throw new Error('Formato de fecha límite de inscripción inválido. Use formato ISO 8601 (YYYY-MM-DD).');
    }

    if (enrollmentDeadlineDate >= startDate) {
      throw new Error(
        'La fecha límite de inscripción debe ser anterior a la fecha de inicio del curso. ' +
          'Verifique las fechas e intente nuevamente.'
      );
    }
  }

  return data;
};
