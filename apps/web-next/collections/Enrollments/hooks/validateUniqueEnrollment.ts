/**
 * Validate Unique Enrollment Hook
 *
 * Ensures (student + course_run) composite unique constraint.
 * Prevents duplicate enrollments for the same student in the same course run.
 *
 * Security:
 * - SP-004: No PII in error messages (uses enrollment_id only)
 *
 * @param {Object} args - Hook arguments
 * @returns {Promise<void>} - Throws error if duplicate found
 */

import type { FieldHook } from 'payload';

export const validateUniqueEnrollment: FieldHook = async ({ data, req, operation }) => {
  // Only validate on create operations
  if (operation !== 'create') {
    return;
  }

  const { student, course_run } = data || {};

  // Skip if missing required fields (will be caught by required validation)
  if (!student || !course_run) {
    return;
  }

  try {
    // Query for existing enrollment with same student + course_run
    const existingEnrollment = await req.payload.find({
      collection: 'enrollments',
      where: {
        and: [
          {
            student: {
              equals: student,
            },
          },
          {
            course_run: {
              equals: course_run,
            },
          },
        ],
      },
      limit: 1,
    });

    if (existingEnrollment.docs.length > 0) {
      const existingId = existingEnrollment.docs[0].enrollment_id || 'unknown';
      // SP-004: Error message uses enrollment_id only, no student data
      throw new Error(
        `Duplicate enrollment detected. Existing enrollment: ${existingId}`,
      );
    }
  } catch (error) {
    // Re-throw our custom error, or wrap database errors
    if (error instanceof Error && error.message.includes('Duplicate enrollment')) {
      throw error;
    }
    // SP-004: Generic error, no data exposure
    throw new Error('Enrollment validation failed');
  }
};

export default validateUniqueEnrollment;
