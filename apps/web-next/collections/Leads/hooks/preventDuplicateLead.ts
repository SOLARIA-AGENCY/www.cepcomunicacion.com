import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Prevents duplicate lead submissions within 24 hours
 *
 * Logic:
 * - Check for existing lead with same email
 * - If found within 24 hours: Update existing lead instead of creating new
 * - If older than 24 hours: Allow new lead creation
 *
 * This prevents spam submissions and data duplication while allowing
 * legitimate re-submissions after a reasonable time period.
 *
 * Security:
 * - SP-004: No PII in error messages (use lead_id only)
 * - Case-insensitive email comparison
 * - Preserves original lead_id when updating
 *
 * @returns CollectionBeforeChangeHook
 */
export const preventDuplicateLeadHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only check for duplicates on creation
  if (operation === 'create' && data.email) {
    try {
      // Calculate 24 hours ago timestamp
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Search for existing lead with same email (case-insensitive)
      const existingLeads = await req.payload.find({
        collection: 'leads',
        where: {
          and: [
            {
              email: {
                equals: data.email.toLowerCase(),
              },
            },
            {
              createdAt: {
                greater_than: twentyFourHoursAgo.toISOString(),
              },
            },
          ],
        },
        limit: 1,
      });

      // If duplicate found within 24 hours, throw error with lead_id
      // The calling code should catch this and update instead
      if (existingLeads.docs.length > 0) {
        const existingLead = existingLeads.docs[0];

        // Store the existing lead ID for the caller to handle update
        // This is a special error that signals update behavior
        const error: any = new Error(
          `Lead ${existingLead.lead_id} already exists for this email (created within 24h). Update instead of create.`
        );
        error.code = 'DUPLICATE_LEAD';
        error.existingLeadId = existingLead.id;
        error.existingLeadData = existingLead;
        throw error;
      }
    } catch (error: any) {
      // Re-throw if it's our duplicate error
      if (error.code === 'DUPLICATE_LEAD') {
        throw error;
      }

      // Log other errors but don't block creation
      // (fallback to allow creation if duplicate check fails)
      console.error('Error checking for duplicate lead:', error.message);
    }
  }

  return data;
};
