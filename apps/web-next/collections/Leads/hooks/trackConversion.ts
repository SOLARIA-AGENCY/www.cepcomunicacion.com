import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Tracks lead conversion to student
 *
 * When converted_to_student field is set:
 * - Auto-set conversion_date to current timestamp
 * - Auto-update status to 'converted'
 * - Both fields become immutable after conversion
 *
 * Security:
 * - SP-001: conversion_date is system-managed (immutable)
 * - SP-004: No PII in error messages
 *
 * @returns CollectionBeforeChangeHook
 */
export const trackConversionHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // On update, check if lead is being converted
  if (operation === 'update') {
    const existingConversion = req.data?.converted_to_student;
    const newConversion = data.converted_to_student;

    // If converted_to_student is being set (and wasn't set before)
    if (newConversion && !existingConversion) {
      // Auto-set conversion_date
      data.conversion_date = new Date().toISOString();

      // Auto-update status to 'converted'
      data.status = 'converted';
    }

    // Prevent modification of conversion_date after it's set (SP-001 Layer 3)
    if (existingConversion && data.conversion_date !== undefined) {
      if (data.conversion_date !== req.data?.conversion_date) {
        const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';
        throw new Error(
          `Lead ${leadId} validation failed: conversion_date is immutable (cannot modify after conversion)`
        );
      }
    }

    // Prevent unsetting converted_to_student after it's set
    if (existingConversion && !newConversion) {
      const leadId = data.lead_id || req.data?.lead_id || 'UNKNOWN';
      throw new Error(
        `Lead ${leadId} validation failed: cannot unset converted_to_student (conversion is permanent)`
      );
    }
  }

  return data;
};
