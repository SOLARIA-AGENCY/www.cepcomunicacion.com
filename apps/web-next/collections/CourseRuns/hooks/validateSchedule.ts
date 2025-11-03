import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Validates schedule time constraints in CourseRuns
 *
 * Business Rules:
 * 1. If schedule_time_start OR schedule_time_end is provided, BOTH are required
 * 2. schedule_time_end MUST be after schedule_time_start
 * 3. Times MUST be in HH:MM format (00:00 - 23:59)
 *
 * Security:
 * - No PII in error messages
 * - Sanitized validation errors
 *
 * @throws ValidationError with descriptive message
 */
export const validateSchedule: CollectionBeforeChangeHook = ({ data }) => {
  // Data is only available on create/update operations

  const { schedule_time_start, schedule_time_end } = data || {};

  // Rule 1: Both required if one is provided
  const hasStartTime = schedule_time_start !== undefined && schedule_time_start !== null && schedule_time_start !== '';
  const hasEndTime = schedule_time_end !== undefined && schedule_time_end !== null && schedule_time_end !== '';

  if (hasStartTime && !hasEndTime) {
    throw new Error(
      'Si especifica una hora de inicio, debe proporcionar también una hora de fin. ' +
        'Complete ambos campos o déjelos vacíos.'
    );
  }

  if (!hasStartTime && hasEndTime) {
    throw new Error(
      'Si especifica una hora de fin, debe proporcionar también una hora de inicio. ' +
        'Complete ambos campos o déjelos vacíos.'
    );
  }

  // If both are empty, validation passes (schedule times are optional)
  if (!hasStartTime && !hasEndTime) {
    return data;
  }

  // Rule 2: Validate HH:MM format
  const timeFormatRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeFormatRegex.test(schedule_time_start)) {
    throw new Error(
      'Formato de hora de inicio inválido. Use formato HH:MM (ejemplo: 09:00, 14:30).'
    );
  }

  if (!timeFormatRegex.test(schedule_time_end)) {
    throw new Error(
      'Formato de hora de fin inválido. Use formato HH:MM (ejemplo: 13:00, 18:30).'
    );
  }

  // Rule 3: schedule_time_end > schedule_time_start
  // Convert to comparable format (minutes since midnight)
  const [startHours, startMinutes] = schedule_time_start.split(':').map(Number);
  const [endHours, endMinutes] = schedule_time_end.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  if (endTotalMinutes <= startTotalMinutes) {
    throw new Error(
      'La hora de fin debe ser posterior a la hora de inicio. ' +
        'Verifique el horario e intente nuevamente.'
    );
  }

  return data;
};
