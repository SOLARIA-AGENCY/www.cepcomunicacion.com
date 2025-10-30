import type { FieldHook } from 'payload';

/**
 * trackUsage Hook
 *
 * Tracks template usage when it's used in campaigns or ad generation.
 * This is a SYSTEM-MANAGED hook triggered by external events.
 *
 * Security Pattern: SP-001 (Defense in Depth - Immutability)
 * - Layer 1: admin.readOnly = true (UI-level protection)
 * - Layer 2: access.update = () => false (API-level protection)
 * - Layer 3: Hook validation (this layer)
 *
 * Business Rules:
 * - usage_count increments when template is used
 * - last_used_at updates to current timestamp
 * - Fields are SYSTEM-MANAGED (users cannot manually edit)
 * - Used for analytics and template performance tracking
 * - Triggered externally by campaign/ad creation
 *
 * Usage Triggers:
 * - Campaign created with this template
 * - Ad generated using this template
 * - Marketing automation uses this template
 *
 * Note: This hook is called programmatically when usage events occur.
 * It is NOT triggered by normal user updates.
 *
 * Triggered: Custom (external trigger via API)
 */

/**
 * Increment usage count and update last_used_at timestamp
 * Call this function when a template is used
 */
export async function incrementTemplateUsage(
  payload: any,
  templateId: string,
  userId?: string
): Promise<void> {
  try {
    // Fetch current template
    const template = await payload.findByID({
      collection: 'ads-templates',
      id: templateId,
    });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const currentUsageCount = template.usage_count || 0;
    const newUsageCount = currentUsageCount + 1;
    const now = new Date().toISOString();

    // Update usage metrics (system operation)
    await payload.update({
      collection: 'ads-templates',
      id: templateId,
      data: {
        usage_count: newUsageCount,
        last_used_at: now,
      },
      // Mark as system operation to bypass user permissions
      overrideAccess: true,
    });

    // Log usage event (no PII per SP-004)
    if (payload.logger) {
      payload.logger.info({
        collection: 'ads-templates',
        operation: 'usage_tracked',
        documentId: templateId,
        usageCount: newUsageCount,
        userId,
        timestamp: now,
        message: 'Template usage tracked',
      });
    }
  } catch (error) {
    // Log error but don't block the calling operation
    if (payload.logger) {
      payload.logger.error({
        collection: 'ads-templates',
        operation: 'usage_tracking_failed',
        documentId: templateId,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to track template usage',
      });
    }
  }
}

/**
 * Hook to prevent manual changes to usage tracking fields
 * This ensures fields remain system-managed (SP-001 Layer 3)
 */
export const validateUsageFields: FieldHook = async ({ data, operation, originalDoc, req, value, field }) => {
  // Only enforce on UPDATE operations (create sets defaults)
  if (operation !== 'update') {
    return value;
  }

  const fieldName = field?.name;

  // Prevent manual changes to usage_count
  if (fieldName === 'usage_count') {
    const originalValue = originalDoc?.usage_count || 0;
    const newValue = value;

    // If user attempts to change usage_count, block it
    if (newValue !== originalValue) {
      // Log warning
      if (req?.payload?.logger) {
        req.payload.logger.warn({
          collection: 'ads-templates',
          operation: 'usage_count_override_blocked',
          documentId: originalDoc?.id,
          attemptedValue: newValue,
          correctValue: originalValue,
          userId: req?.user?.id,
          message: 'Manual usage_count change blocked (system-managed)',
        });
      }

      // Return original value (block change)
      return originalValue;
    }
  }

  // Prevent manual changes to last_used_at
  if (fieldName === 'last_used_at') {
    const originalValue = originalDoc?.last_used_at;
    const newValue = value;

    // If user attempts to change last_used_at, block it
    if (newValue !== originalValue) {
      // Log warning
      if (req?.payload?.logger) {
        req.payload.logger.warn({
          collection: 'ads-templates',
          operation: 'last_used_at_override_blocked',
          documentId: originalDoc?.id,
          attemptedValue: newValue,
          correctValue: originalValue,
          userId: req?.user?.id,
          message: 'Manual last_used_at change blocked (system-managed)',
        });
      }

      // Return original value (block change)
      return originalValue;
    }
  }

  return value;
};
