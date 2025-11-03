/**
 * Age Validator (Spanish Legal Requirement)
 *
 * Validates that student is at least 16 years old (Spanish legal minimum age
 * for professional training and certain educational programs).
 *
 * Handles:
 * - Leap years (Feb 29 birthdays)
 * - Month edge cases (birthday hasn't occurred yet this year)
 * - Day edge cases (birthday is tomorrow)
 * - Timezone considerations
 *
 * Examples:
 * - Born 2007-06-15, Today 2025-10-30 → Age 18 ✅
 * - Born 2009-10-30, Today 2025-10-30 → Age 16 ✅
 * - Born 2009-10-31, Today 2025-10-30 → Age 15 ❌ (birthday tomorrow)
 * - Born 2010-06-15, Today 2025-10-30 → Age 15 ❌
 *
 * Security: SP-004 compliant - no PII in error messages
 */

const MINIMUM_AGE = 16;

/**
 * Calculates age from date of birth
 *
 * @param dateOfBirth - Birth date (Date object or ISO string)
 * @param referenceDate - Date to calculate age from (defaults to today)
 * @returns Age in years
 */
export function calculateAge(
  dateOfBirth: string | Date,
  referenceDate: Date = new Date()
): number {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;

  // Invalid date check
  if (isNaN(birthDate.getTime())) {
    return -1;
  }

  // Calculate year difference
  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  // Calculate month difference
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Validates that student meets minimum age requirement
 *
 * @param dateOfBirth - Birth date (Date object or ISO string)
 * @param minimumAge - Minimum required age (defaults to 16)
 * @returns true if student is old enough, false otherwise
 */
export function validateMinimumAge(
  dateOfBirth: string | Date,
  minimumAge: number = MINIMUM_AGE
): boolean {
  const age = calculateAge(dateOfBirth);

  // Invalid date
  if (age < 0) {
    return false;
  }

  return age >= minimumAge;
}

/**
 * Validates that date is a valid birth date (not in future, reasonable range)
 *
 * @param dateOfBirth - Birth date to validate
 * @returns true if valid birth date, false otherwise
 */
export function validateBirthDate(dateOfBirth: string | Date): boolean {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();

  // Invalid date check
  if (isNaN(birthDate.getTime())) {
    return false;
  }

  // Cannot be born in the future
  if (birthDate > today) {
    return false;
  }

  // Reasonable age limit (not older than 120 years)
  const age = calculateAge(birthDate, today);
  if (age > 120) {
    return false;
  }

  return true;
}

/**
 * Gets a non-PII error message for age validation failure
 *
 * @param studentId - Student ID to use in error message (SP-004 compliant)
 * @param minimumAge - Minimum required age
 * @returns Error message without PII
 */
export function getAgeErrorMessage(
  studentId?: string,
  minimumAge: number = MINIMUM_AGE
): string {
  const prefix = studentId ? `Student ${studentId}` : 'Student';
  return `${prefix} validation failed: must be at least ${minimumAge} years old`;
}

/**
 * Gets a non-PII error message for invalid birth date
 *
 * @param studentId - Student ID to use in error message (SP-004 compliant)
 * @returns Error message without PII
 */
export function getBirthDateErrorMessage(studentId?: string): string {
  const prefix = studentId ? `Student ${studentId}` : 'Student';
  return `${prefix} validation failed: date_of_birth must be a valid date in the past`;
}
