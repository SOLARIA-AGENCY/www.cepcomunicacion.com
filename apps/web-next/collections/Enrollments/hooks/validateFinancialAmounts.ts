/**
 * Validate Financial Amounts Hook
 *
 * Ensures all financial amounts are valid:
 * - amount_paid <= total_amount
 * - financial_aid_amount <= total_amount (if requested)
 * - All amounts >= 0
 * - Max 2 decimal places
 *
 * Security:
 * - SP-004: No financial amounts in error messages
 *
 * @param {Object} args - Hook arguments
 * @returns {Promise<void>} - Throws error if validation fails
 */

import type { FieldHook } from 'payload';

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

const hasMoreThanTwoDecimals = (num: number): boolean => {
  const str = num.toString();
  const decimalPart = str.split('.')[1];
  return decimalPart ? decimalPart.length > 2 : false;
};

export const validateFinancialAmounts: FieldHook = async ({ data }) => {
  const {
    total_amount,
    amount_paid = 0,
    financial_aid_requested = false,
    financial_aid_amount = 0,
  } = data || {};

  // Validate total_amount is present and positive
  if (total_amount === undefined || total_amount === null) {
    throw new Error('Total amount is required');
  }

  if (total_amount < 0) {
    // SP-004: No actual amount in error
    throw new Error('Total amount must be non-negative');
  }

  // Validate decimal places for total_amount
  if (hasMoreThanTwoDecimals(total_amount)) {
    throw new Error('Total amount cannot have more than 2 decimal places');
  }

  // Validate amount_paid
  if (amount_paid < 0) {
    // SP-004: No actual amount in error
    throw new Error('Amount paid must be non-negative');
  }

  if (hasMoreThanTwoDecimals(amount_paid)) {
    throw new Error('Amount paid cannot have more than 2 decimal places');
  }

  // Round for comparison to avoid floating point issues
  const roundedTotal = roundToTwoDecimals(total_amount);
  const roundedPaid = roundToTwoDecimals(amount_paid);

  if (roundedPaid > roundedTotal) {
    // SP-004: No actual amounts in error
    throw new Error('Amount paid cannot exceed total amount');
  }

  // Validate financial aid amounts if requested
  if (financial_aid_requested && financial_aid_amount) {
    if (financial_aid_amount < 0) {
      throw new Error('Financial aid amount must be non-negative');
    }

    if (hasMoreThanTwoDecimals(financial_aid_amount)) {
      throw new Error('Financial aid amount cannot have more than 2 decimal places');
    }

    const roundedAid = roundToTwoDecimals(financial_aid_amount);
    if (roundedAid > roundedTotal) {
      // SP-004: No actual amounts in error
      throw new Error('Financial aid amount cannot exceed total amount');
    }
  }

  // Ensure amount_paid is rounded to 2 decimals
  if (data) {
    data.amount_paid = roundToTwoDecimals(amount_paid);
    data.total_amount = roundToTwoDecimals(total_amount);
    if (financial_aid_amount) {
      data.financial_aid_amount = roundToTwoDecimals(financial_aid_amount);
    }
  }
};

export default validateFinancialAmounts;
