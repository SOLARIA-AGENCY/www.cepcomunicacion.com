/**
 * Validate Academic Requirements Hook
 *
 * Ensures academic data meets requirements:
 * - If status = completed, attendance_percentage required (0-100)
 * - If status = completed, final_grade required (0-100)
 * - Validates percentage and grade ranges
 *
 * Security:
 * - SP-004: No grades or percentages in error messages
 *
 * @param {Object} args - Hook arguments
 * @returns {Promise<void>} - Throws error if validation fails
 */

import type { FieldHook } from 'payload';

export const validateAcademicRequirements: FieldHook = async ({ data }) => {
  const { status, attendance_percentage, final_grade } = data || {};

  // If status is completed, require academic data
  if (status === 'completed') {
    if (attendance_percentage === undefined || attendance_percentage === null) {
      throw new Error('Attendance percentage is required for completed enrollments');
    }

    if (final_grade === undefined || final_grade === null) {
      throw new Error('Final grade is required for completed enrollments');
    }
  }

  // Validate attendance_percentage range if provided
  if (attendance_percentage !== undefined && attendance_percentage !== null) {
    if (attendance_percentage < 0 || attendance_percentage > 100) {
      // SP-004: No actual percentage in error
      throw new Error('Attendance percentage must be between 0 and 100');
    }
  }

  // Validate final_grade range if provided
  if (final_grade !== undefined && final_grade !== null) {
    if (final_grade < 0 || final_grade > 100) {
      // SP-004: No actual grade in error
      throw new Error('Final grade must be between 0 and 100');
    }
  }
};

export default validateAcademicRequirements;
