import type { CollectionBeforeChangeHook } from 'payload';

/**
 * Generates unique lead ID with format: LEAD-YYYYMMDD-XXXX
 *
 * Format:
 * - LEAD: Prefix for lead
 * - YYYYMMDD: Current date (e.g., 20251030)
 * - XXXX: Auto-incrementing sequence number (padded to 4 digits)
 *
 * Examples:
 * - LEAD-20251030-0001 (first lead on Oct 30, 2025)
 * - LEAD-20251030-0002 (second lead on Oct 30, 2025)
 * - LEAD-20251031-0001 (first lead on Oct 31, 2025 - sequence resets)
 *
 * The sequence number resets each day and auto-increments within the same day.
 *
 * Security:
 * - SP-001: Completely immutable after creation
 * - SP-004: Used in ALL error messages instead of PII
 * - No PII in logs
 *
 * @returns CollectionBeforeChangeHook
 */
export const generateLeadIDHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  // Only generate on creation
  if (operation === 'create') {
    // Get current date in YYYYMMDD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Find the highest sequence number for today
    const todayPrefix = `LEAD-${dateStr}-`;

    try {
      // Query leads with today's date prefix
      const existingLeads = await req.payload.find({
        collection: 'leads',
        where: {
          lead_id: {
            contains: todayPrefix,
          },
        },
        limit: 1000, // Reasonable limit for same-day creations
        sort: '-lead_id', // Sort descending to get highest sequence
      });

      let nextSequence = 1;

      if (existingLeads.docs.length > 0) {
        // Extract sequence numbers and find max
        const sequences = existingLeads.docs
          .map((doc: any) => {
            const match = doc.lead_id?.match(/LEAD-\d{8}-(\d{4})/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter((seq: number) => !isNaN(seq));

        if (sequences.length > 0) {
          const maxSequence = Math.max(...sequences);
          nextSequence = maxSequence + 1;
        }
      }

      // Pad sequence to 4 digits
      const sequenceStr = String(nextSequence).padStart(4, '0');

      // Generate lead ID
      data.lead_id = `LEAD-${dateStr}-${sequenceStr}`;
    } catch (error) {
      // Fallback to random sequence if query fails
      const randomSequence = Math.floor(Math.random() * 9999) + 1;
      const sequenceStr = String(randomSequence).padStart(4, '0');
      data.lead_id = `LEAD-${dateStr}-${sequenceStr}`;
    }
  }

  // On update, prevent modification of lead_id (SP-001 Layer 3)
  if (operation === 'update') {
    if (data.lead_id !== undefined && data.lead_id !== req.data?.lead_id) {
      const originalId = req.data?.lead_id;
      throw new Error(
        `Lead ${originalId || 'UNKNOWN'} validation failed: lead_id is immutable (unique identifier)`
      );
    }
  }

  return data;
};
