import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Generates unique student ID with format: STU-YYYYMMDD-XXXX
 *
 * Format:
 * - STU: Prefix for student
 * - YYYYMMDD: Current date (e.g., 20251030)
 * - XXXX: Auto-incrementing sequence number (padded to 4 digits)
 *
 * Examples:
 * - STU-20251030-0001 (first student on Oct 30, 2025)
 * - STU-20251030-0002 (second student on Oct 30, 2025)
 * - STU-20251031-0001 (first student on Oct 31, 2025 - sequence resets)
 *
 * The sequence number resets each day and auto-increments within the same day.
 *
 * Security:
 * - SP-001: Completely immutable after creation
 * - SP-004: Used in ALL error messages instead of PII
 * - No PII in logs
 *
 * @returns CollectionBeforeChangeHook
 */
export const generateStudentIDHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only generate on creation
  if (operation === 'create') {
    // Get current date in YYYYMMDD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Find the highest sequence number for today
    // Query students created today with matching date prefix
    const todayPrefix = `STU-${dateStr}-`;

    try {
      // Query students with today's date prefix
      const existingStudents = await req.payload.find({
        collection: 'students',
        where: {
          student_id: {
            contains: todayPrefix,
          },
        },
        limit: 1000, // Reasonable limit for same-day creations
        sort: '-student_id', // Sort descending to get highest sequence
      });

      let nextSequence = 1;

      if (existingStudents.docs.length > 0) {
        // Extract sequence numbers and find max
        const sequences = existingStudents.docs
          .map((doc: any) => {
            const match = doc.student_id?.match(/STU-\d{8}-(\d{4})/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter((seq: number) => !isNaN(seq));

        if (sequences.length > 0) {
          const maxSequence = Math.max(...sequences);
          nextSequence = maxSequence + 1;
        }
      }

      // Pad sequence to 4 digits
      const sequenceStr = String(nextSequence).padStart(4, '0');

      // Generate student ID
      data.student_id = `STU-${dateStr}-${sequenceStr}`;
    } catch (error) {
      // Fallback to random sequence if query fails
      const randomSequence = Math.floor(Math.random() * 9999) + 1;
      const sequenceStr = String(randomSequence).padStart(4, '0');
      data.student_id = `STU-${dateStr}-${sequenceStr}`;
    }
  }

  // On update, prevent modification of student_id (SP-001 Layer 3)
  if (operation === 'update') {
    if (data.student_id !== undefined && data.student_id !== req.data?.student_id) {
      const originalId = req.data?.student_id;
      throw new Error(
        `Student ${originalId || ''} validation failed: student_id is immutable (unique identifier)`
      );
    }
  }

  return data;
};
