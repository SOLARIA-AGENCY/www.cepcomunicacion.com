/**
 * Calculate Payment Status Hook
 *
 * Auto-calculates payment_status based on amounts:
 * - unpaid: amount_paid = 0
 * - partial: 0 < amount_paid < total_amount
 * - paid: amount_paid = total_amount
 * - refunded: status = cancelled or withdrawn
 *
 * This field is read-only and system-managed.
 *
 * @param {Object} args - Hook arguments
 * @returns {void} - Sets payment_status in data
 */

import type { FieldHook } from 'payload';

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

export const calculatePaymentStatus: FieldHook = async ({ data }) => {
  const { total_amount, amount_paid = 0, status } = data || {};

  // If cancelled or withdrawn, status is refunded
  if (status === 'cancelled' || status === 'withdrawn') {
    if (data) {
      data.payment_status = 'refunded';
    }
    return;
  }

  // Round amounts to avoid floating point comparison issues
  const roundedTotal = roundToTwoDecimals(total_amount || 0);
  const roundedPaid = roundToTwoDecimals(amount_paid);

  // Calculate payment status
  let paymentStatus: string;

  if (roundedPaid === 0) {
    paymentStatus = 'unpaid';
  } else if (roundedPaid >= roundedTotal) {
    paymentStatus = 'paid';
  } else {
    paymentStatus = 'partial';
  }

  // Set payment_status in data
  if (data) {
    data.payment_status = paymentStatus;
  }
};

export default calculatePaymentStatus;
