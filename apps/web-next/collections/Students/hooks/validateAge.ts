import type { FieldHook } from 'payload';
import { validateMinimumAge, validateBirthDate, getAgeErrorMessage, getBirthDateErrorMessage } from '../validators';

/**
 * Validates student age (Spanish legal requirement: >= 16 years)
 *
 * Validates:
 * - Birth date is valid (not in future, reasonable range)
 * - Student meets minimum age requirement (16 years)
 *
 * Handles:
 * - Leap years (Feb 29 birthdays)
 * - Month edge cases (birthday hasn't occurred yet)
 * - Day edge cases (birthday is tomorrow)
 *
 * Security:
 * - SP-004 compliant: Error messages use student_id, never actual birth date
 * - No PII in logs
 *
 * @returns FieldHook for beforeChange
 */
export const validateAgeHook: FieldHook = ({ data, value, req }) => {
  // Skip validation if date_of_birth not provided
  if (!value) {
    return value;
  }

  const dateOfBirth = value as string;
  const studentId = data?.student_id;

  // Validate birth date is valid
  if (!validateBirthDate(dateOfBirth)) {
    // SP-004: Use student_id in error message, NOT actual birth date
    throw new Error(getBirthDateErrorMessage(studentId));
  }

  // Validate minimum age (16 years)
  if (!validateMinimumAge(dateOfBirth, 16)) {
    // SP-004: Use student_id in error message, NOT actual age or birth date
    throw new Error(getAgeErrorMessage(studentId, 16));
  }

  return value;
};
