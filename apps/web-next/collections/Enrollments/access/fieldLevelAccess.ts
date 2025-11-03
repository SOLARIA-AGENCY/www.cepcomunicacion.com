/**
 * Field-Level Access Control for Financial Data
 *
 * Implements granular access control for sensitive financial fields.
 *
 * Financial Fields (6 protected):
 * - total_amount
 * - amount_paid
 * - financial_aid_amount
 * - financial_aid_approved
 * - payment_method
 * - payment_reference
 *
 * Access Rules:
 * - Admin: Full read/write access to all financial fields
 * - Gestor: Full read/write access to all financial fields
 * - Asesor: Read-only access to financial fields, NO write
 * - Marketing: NO access to financial fields
 * - Lectura: NO access to financial fields
 * - Public: NO access
 *
 * Read-Only Fields (all roles):
 * - payment_status (auto-calculated)
 * - enrollment_id (auto-generated)
 * - All timestamps (auto-set)
 */

import type { FieldAccess } from 'payload';

/**
 * Financial Field Update Access
 * Only admin and gestor can update financial fields
 */
export const financialFieldUpdateAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  // Only admin and gestor can modify financial data
  return ['admin', 'gestor'].includes(user.role);
};

/**
 * Financial Field Read Access
 * Admin, gestor, and asesor can read financial fields
 */
export const financialFieldReadAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  // Admin, gestor, and asesor can view financial data
  return ['admin', 'gestor', 'asesor'].includes(user.role);
};

/**
 * Read-Only Field Access
 * All authenticated users can read, but nobody can update
 * (used for auto-calculated/auto-generated fields)
 */
export const readOnlyFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  // All authenticated users can read
  return true;
};

/**
 * Asesor Update Access
 * Asesor can only update status and notes fields
 */
export const asesorCanUpdate = (fieldName: string): FieldAccess => {
  return ({ req: { user } }) => {
    if (!user) {
      return false;
    }

    // Admin and gestor can always update
    if (['admin', 'gestor'].includes(user.role)) {
      return true;
    }

    // Asesor can only update status and notes
    if (user.role === 'asesor') {
      return ['status', 'notes'].includes(fieldName);
    }

    // Marketing cannot update this field
    return false;
  };
};

/**
 * Marketing Update Access
 * Marketing can only update notes field
 */
export const marketingCanUpdate = (fieldName: string): FieldAccess => {
  return ({ req: { user } }) => {
    if (!user) {
      return false;
    }

    // Admin and gestor can always update
    if (['admin', 'gestor'].includes(user.role)) {
      return true;
    }

    // Asesor can update status and notes
    if (user.role === 'asesor' && ['status', 'notes'].includes(fieldName)) {
      return true;
    }

    // Marketing can only update notes
    if (user.role === 'marketing') {
      return fieldName === 'notes';
    }

    return false;
  };
};

/**
 * Standard Field Access
 * All authenticated users can read and update (except lectura)
 */
export const standardFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user) {
    return false;
  }

  // Lectura cannot update
  if (user.role === 'lectura') {
    return false;
  }

  // All other roles can update
  return true;
};
