/**
 * Generate Enrollment ID Hook
 *
 * Auto-generates unique enrollment IDs in format: ENR-YYYYMMDD-XXXX
 * - ENR: Prefix for enrollments
 * - YYYYMMDD: Current date
 * - XXXX: Auto-incrementing 4-digit number (resets daily)
 *
 * Security:
 * - SP-001: enrollment_id is immutable once set (Layer 3 protection)
 *
 * @param {Object} args - Hook arguments
 * @returns {Promise<void>} - Sets enrollment_id in data
 */

import type { FieldHook } from 'payload';

const formatNumber = (num: number): string => {
  return num.toString().padStart(4, '0');
};

const getDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

export const generateEnrollmentID: FieldHook = async ({ data, originalDoc, operation, req }) => {
  // Only generate on create (SP-001 Layer 3)
  if (operation !== 'create') {
    // On update, preserve original ID
    if (originalDoc?.enrollment_id && data) {
      data.enrollment_id = originalDoc.enrollment_id;
    }
    return;
  }

  // If enrollment_id already provided, validate format and use it
  if (data?.enrollment_id) {
    const pattern = /^ENR-\d{8}-\d{4}$/;
    if (!pattern.test(data.enrollment_id)) {
      throw new Error('Invalid enrollment ID format. Must be ENR-YYYYMMDD-XXXX');
    }
    return;
  }

  try {
    const dateString = getDateString();
    const prefix = `ENR-${dateString}-`;

    // Find the highest enrollment number for today
    const existingEnrollments = await req.payload.find({
      collection: 'enrollments',
      where: {
        enrollment_id: {
          like: prefix,
        },
      },
      sort: '-enrollment_id',
      limit: 1,
    });

    let nextNumber = 1;

    if (existingEnrollments.docs.length > 0) {
      const lastId = existingEnrollments.docs[0].enrollment_id;
      const lastNumber = parseInt(lastId.split('-')[2], 10);
      nextNumber = lastNumber + 1;
    }

    const enrollmentId = `${prefix}${formatNumber(nextNumber)}`;

    if (data) {
      data.enrollment_id = enrollmentId;
    }
  } catch (error) {
    // SP-004: No sensitive data in error
    throw new Error('Failed to generate enrollment ID');
  }
};

export default generateEnrollmentID;
