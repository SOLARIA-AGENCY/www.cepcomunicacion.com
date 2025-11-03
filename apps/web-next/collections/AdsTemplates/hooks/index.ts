/**
 * AdsTemplates Collection Hooks
 *
 * Centralized export for all collection hooks.
 */

export { validateURLFields } from './validateURLFields';
export { validateStatusWorkflow } from './validateStatusWorkflow';
export { validateLLMFields } from './validateLLMFields';
export { validateHashtags } from './validateHashtags';
export { trackTemplateCreator } from './trackTemplateCreator';
export { autoIncrementVersion } from './autoIncrementVersion';
export { incrementTemplateUsage, validateUsageFields } from './trackUsage';
export { setArchivedTimestamp } from './setArchivedTimestamp';
