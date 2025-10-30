/**
 * Set Enrollment Timestamps Hook
 *
 * Auto-sets timestamps based on status changes:
 * - enrolled_at: Set on creation (immutable)
 * - confirmed_at: Set when status → confirmed (immutable once set)
 * - completed_at: Set when status → completed (immutable once set)
 * - cancelled_at: Set when status → cancelled or withdrawn (immutable once set)
 * - certificate_issued_at: Set when certificate_issued → true (immutable once set)
 *
 * Security:
 * - SP-001: All timestamps are immutable once set (Layer 3 protection)
 *
 * @param {Object} args - Hook arguments
 * @returns {void} - Sets timestamps in data
 */

import type { FieldHook } from 'payload';

export const setEnrollmentTimestamps: FieldHook = async ({ data, originalDoc, operation }) => {
  const now = new Date().toISOString();

  // Set enrolled_at on creation (Layer 3 of SP-001)
  if (operation === 'create') {
    if (data) {
      data.enrolled_at = now;
    }
    return;
  }

  // For updates, prevent changes to immutable timestamps (SP-001 Layer 3)
  if (operation === 'update' && originalDoc) {
    // Prevent changing enrolled_at
    if (originalDoc.enrolled_at) {
      if (data) {
        data.enrolled_at = originalDoc.enrolled_at;
      }
    }

    // Prevent changing confirmed_at once set
    if (originalDoc.confirmed_at) {
      if (data) {
        data.confirmed_at = originalDoc.confirmed_at;
      }
    } else if (data?.status === 'confirmed' && !originalDoc.confirmed_at) {
      // Set confirmed_at when status becomes confirmed
      if (data) {
        data.confirmed_at = now;
      }
    }

    // Prevent changing completed_at once set
    if (originalDoc.completed_at) {
      if (data) {
        data.completed_at = originalDoc.completed_at;
      }
    } else if (data?.status === 'completed' && !originalDoc.completed_at) {
      // Set completed_at when status becomes completed
      if (data) {
        data.completed_at = now;
      }
    }

    // Prevent changing cancelled_at once set
    if (originalDoc.cancelled_at) {
      if (data) {
        data.cancelled_at = originalDoc.cancelled_at;
      }
    } else if (
      (data?.status === 'cancelled' || data?.status === 'withdrawn') &&
      !originalDoc.cancelled_at
    ) {
      // Set cancelled_at when status becomes cancelled or withdrawn
      if (data) {
        data.cancelled_at = now;
      }
    }

    // Prevent changing certificate_issued_at once set
    if (originalDoc.certificate_issued_at) {
      if (data) {
        data.certificate_issued_at = originalDoc.certificate_issued_at;
      }
    } else if (data?.certificate_issued && !originalDoc.certificate_issued_at) {
      // Set certificate_issued_at when certificate_issued becomes true
      if (data) {
        data.certificate_issued_at = now;
      }
    }

    // Prevent changing certificate_issued once true (SP-001 Layer 3)
    if (originalDoc.certificate_issued === true) {
      if (data) {
        data.certificate_issued = true;
      }
    }

    // Prevent changing certificate_url once set (SP-001 Layer 3)
    if (originalDoc.certificate_url) {
      if (data) {
        data.certificate_url = originalDoc.certificate_url;
      }
    }
  }
};

export default setEnrollmentTimestamps;
