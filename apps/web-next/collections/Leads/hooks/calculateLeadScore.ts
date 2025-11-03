import type { CollectionAfterChangeHook } from 'payload';

/**
 * Calculates lead score based on completeness of information
 *
 * Scoring System (max 100 points):
 * - Has phone: +20 points
 * - Has course interest: +30 points
 * - Has campus preference: +20 points
 * - Has DNI: +15 points
 * - Has message: +15 points
 *
 * Higher scores indicate higher quality leads that are more likely to convert.
 *
 * Security:
 * - SP-001: lead_score is system-managed (immutable by users)
 * - SP-004: No PII in logs
 *
 * @returns CollectionAfterChangeHook
 */
export const calculateLeadScoreHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Calculate score on both create and update
  if (operation === 'create' || operation === 'update') {
    let score = 0;

    // Base score for having basic info (always present)
    // first_name, last_name, email are required, so no points for these

    // +20 points for phone
    if (doc.phone) {
      score += 20;
    }

    // +30 points for course interest (highest value)
    if (doc.course) {
      score += 30;
    }

    // +20 points for campus preference
    if (doc.campus) {
      score += 20;
    }

    // +15 points for DNI (shows serious intent)
    if (doc.dni) {
      score += 15;
    }

    // +15 points for message (personalized interest)
    if (doc.message && doc.message.trim().length > 0) {
      score += 15;
    }

    // Update lead_score if it has changed
    if (doc.lead_score !== score) {
      try {
        await req.payload.update({
          collection: 'leads',
          id: doc.id,
          data: {
            lead_score: score,
          },
        });
      } catch (error) {
        // Log error but don't fail the operation
        console.error(`Error updating lead score for lead ${doc.lead_id}:`, error);
      }
    }
  }

  return doc;
};
