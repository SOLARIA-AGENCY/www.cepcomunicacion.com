/**
 * Validate Status Transitions Hook
 *
 * Enforces valid status workflow transitions:
 * - pending → confirmed, waitlisted, cancelled
 * - confirmed → completed, cancelled, withdrawn
 * - waitlisted → confirmed, cancelled
 * - completed → TERMINAL (no transitions allowed)
 * - cancelled → pending (revert allowed)
 * - withdrawn → confirmed (revert allowed)
 *
 * Security:
 * - SP-004: No sensitive data in error messages
 *
 * @param {Object} args - Hook arguments
 * @returns {Promise<void>} - Throws error if invalid transition
 */

import type { FieldHook } from 'payload';

// Define allowed transitions map
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'waitlisted', 'cancelled'],
  confirmed: ['completed', 'cancelled', 'withdrawn'],
  waitlisted: ['confirmed', 'cancelled'],
  completed: [], // TERMINAL - no transitions allowed
  cancelled: ['pending'], // Allow reverting cancellation
  withdrawn: ['confirmed'], // Allow reverting withdrawal
};

export const validateStatusTransitions: FieldHook = async ({ data, originalDoc, operation }) => {
  // Only validate on update operations
  if (operation !== 'update') {
    return;
  }

  const newStatus = data?.status;
  const oldStatus = originalDoc?.status;

  // Skip if status hasn't changed
  if (!newStatus || !oldStatus || newStatus === oldStatus) {
    return;
  }

  // Check if transition is allowed
  const allowedTransitions = ALLOWED_TRANSITIONS[oldStatus] || [];

  if (!allowedTransitions.includes(newStatus)) {
    // SP-004: No enrollment data in error message
    throw new Error(
      `Status transition from '${oldStatus}' to '${newStatus}' is not allowed`,
    );
  }

  // Additional validation: completed is TERMINAL
  if (oldStatus === 'completed') {
    throw new Error(
      'Cannot change status from completed (terminal status)',
    );
  }
};

export default validateStatusTransitions;
