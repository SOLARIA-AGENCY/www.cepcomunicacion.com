/**
 * Leads Collection Hooks
 *
 * Exports all hooks for the Leads collection with MAXIMUM GDPR compliance
 * and public endpoint security.
 *
 * Hook Categories:
 * 1. GDPR Compliance (2 hooks)
 * 2. Validation (3 hooks)
 * 3. Security (2 hooks)
 * 4. System Management (3 hooks)
 *
 * Total: 10 hooks
 */

// GDPR Compliance Hooks
export { validateGDPRConsentHook } from './validateGDPRConsent';
export { captureConsentMetadataHook } from './captureConsentMetadata';

// Validation Hooks
export { validatePhoneHook } from './validatePhone';
export { validateDNIHook } from './validateDNI';
export { preventDuplicateLeadHook } from './preventDuplicateLead';

// Security Hooks
export { sanitizeInputHook } from './sanitizeInput';

// System Management Hooks
export { generateLeadIDHook } from './generateLeadID';
export { calculateLeadScoreHook } from './calculateLeadScore';
export { trackConversionHook } from './trackConversion';
export { triggerLeadCreatedJobHook } from './triggerLeadCreatedJob';
