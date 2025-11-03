/**
 * Set Certificate Issue Date Hook
 *
 * Auto-sets certificate_issued_at when certificate_issued becomes true.
 * Prevents changing certificate_issued_at once set.
 *
 * Security:
 * - SP-001: certificate_issued_at is immutable once set (Layer 3 protection)
 *
 * Note: This logic is also in setEnrollmentTimestamps, but kept separate
 * for clarity and single responsibility.
 *
 * @param {Object} args - Hook arguments
 * @returns {void} - Sets certificate_issued_at in data
 */

import type { FieldHook } from 'payload';

export const setCertificateIssueDate: FieldHook = async ({ data, originalDoc, operation }) => {
  // Skip on create (no certificate issued yet)
  if (operation !== 'update') {
    return;
  }

  // Prevent changing certificate_issued_at once set (SP-001 Layer 3)
  if (originalDoc?.certificate_issued_at) {
    if (data) {
      data.certificate_issued_at = originalDoc.certificate_issued_at;
    }
    return;
  }

  // Set certificate_issued_at when certificate_issued becomes true
  if (data?.certificate_issued && !originalDoc?.certificate_issued_at) {
    const now = new Date().toISOString();
    if (data) {
      data.certificate_issued_at = now;
    }
  }
};

export default setCertificateIssueDate;
