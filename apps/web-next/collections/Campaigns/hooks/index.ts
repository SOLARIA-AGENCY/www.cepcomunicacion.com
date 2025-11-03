/**
 * Campaigns Collection - Hooks Export
 *
 * Validation Hooks (5):
 * - validateDates: Date logic validation
 * - validateUTMParameters: UTM requirements
 * - validateTargets: Target metrics logic
 * - validateStatusWorkflow: Status transition rules
 * - trackCampaignCreator: Auto-populate and enforce immutability of created_by
 *
 * Analytics Hook (1):
 * - calculateCampaignMetrics: Performance-optimized metrics calculation
 */

export { validateDates } from './validateDates';
export { validateUTMParameters } from './validateUTMParameters';
export { validateTargets } from './validateTargets';
export { validateStatusWorkflow } from './validateStatusWorkflow';
export { trackCampaignCreator } from './trackCampaignCreator';
export { calculateCampaignMetrics } from './calculateCampaignMetrics';
