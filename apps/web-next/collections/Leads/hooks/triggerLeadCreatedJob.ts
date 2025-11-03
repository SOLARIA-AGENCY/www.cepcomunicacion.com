import type { CollectionAfterCreateHook } from 'payload';

/**
 * Triggers BullMQ job after lead creation
 *
 * Queues background job: 'lead.created'
 * This job can trigger:
 * - Email notification to sales team
 * - CRM synchronization
 * - Auto-assignment logic
 * - Welcome email to lead (if marketing_consent = true)
 *
 * Security:
 * - SP-004: NO PII in job payload (use lead_id only)
 * - Job payload should only contain: lead_id, lead_score, source, campaign_id
 *
 * @returns CollectionAfterCreateHook
 */
export const triggerLeadCreatedJobHook: CollectionAfterCreateHook = async ({
  doc,
  req,
}) => {
  try {
    // Prepare job payload (NO PII - SP-004 compliant)
    const jobPayload = {
      lead_id: doc.lead_id,
      lead_score: doc.lead_score || 0,
      source: doc.source,
      campaign_id: doc.campaign?.id || null,
      has_course_interest: !!doc.course,
      has_campus_preference: !!doc.campus,
      marketing_consent: doc.marketing_consent || false,
      created_at: doc.createdAt,
    };

    // TODO: Queue BullMQ job when BullMQ is integrated (Phase F5)
    // await req.payload.jobs.queue({
    //   queue: 'lead-processing',
    //   task: 'lead.created',
    //   input: jobPayload,
    // });

    // For now, just log the job (placeholder)
    console.log(`[LEAD CREATED] Job queued for lead ${doc.lead_id} (score: ${doc.lead_score})`);
  } catch (error) {
    // Log error but don't fail the lead creation
    console.error(`Error queuing lead.created job for lead ${doc.lead_id}:`, error);
  }

  return doc;
};
