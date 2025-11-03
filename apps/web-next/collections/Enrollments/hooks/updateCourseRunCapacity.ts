/**
 * Update Course Run Capacity Hook
 *
 * Updates course_run.current_enrollments when enrollment status changes:
 * - Increment when status → confirmed
 * - Decrement when status → cancelled or withdrawn
 * - Ensure current_enrollments never goes negative
 *
 * This hook manages the relationship between enrollments and course run capacity.
 *
 * Security:
 * - SP-004: No enrollment data in error messages
 *
 * @param {Object} args - Hook arguments (afterChange)
 * @returns {Promise<void>}
 */

import type { CollectionAfterChangeHook } from 'payload';

export const updateCourseRunCapacity: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const newStatus = doc.status;
  const oldStatus = previousDoc?.status;
  const courseRunId = doc.course_run;

  // Skip if no course_run or no status change
  if (!courseRunId || newStatus === oldStatus) {
    return doc;
  }

  try {
    // Fetch current course run data
    const courseRun = await req.payload.findByID({
      collection: 'course-runs',
      id: courseRunId,
    });

    let currentEnrollments = courseRun.current_enrollments || 0;
    let shouldUpdate = false;

    // Determine if we need to increment or decrement
    const wasConfirmed = oldStatus === 'confirmed';
    const isConfirmed = newStatus === 'confirmed';
    const isCancelled = newStatus === 'cancelled' || newStatus === 'withdrawn';
    const wasCancelled = oldStatus === 'cancelled' || oldStatus === 'withdrawn';

    // Increment if becoming confirmed (and wasn't before)
    if (isConfirmed && !wasConfirmed) {
      currentEnrollments += 1;
      shouldUpdate = true;
    }

    // Decrement if leaving confirmed status to cancelled/withdrawn
    if (wasConfirmed && (isCancelled || (!isConfirmed && !isCancelled))) {
      currentEnrollments -= 1;
      shouldUpdate = true;
    }

    // Ensure current_enrollments never goes negative
    currentEnrollments = Math.max(0, currentEnrollments);

    // Update course run if needed
    if (shouldUpdate) {
      await req.payload.update({
        collection: 'course-runs',
        id: courseRunId,
        data: {
          current_enrollments: currentEnrollments,
        },
      });
    }
  } catch (error) {
    // Log error but don't fail the enrollment operation
    console.error('Failed to update course run capacity:', error);
    // SP-004: No sensitive data in error
  }

  return doc;
};

export default updateCourseRunCapacity;
