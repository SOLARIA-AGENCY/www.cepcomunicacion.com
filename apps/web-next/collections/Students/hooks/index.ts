/**
 * Hooks Index
 *
 * Exports all hooks for Students collection
 */

export { validateDNIHook } from './validateDNI';
export { validatePhoneHook, validateEmergencyPhoneHook } from './validatePhone';
export { validateAgeHook } from './validateAge';
export { validateEmergencyContactHook } from './validateEmergencyContact';
export { captureConsentMetadataHook } from './captureConsentMetadata';
export { generateStudentIDHook } from './generateStudentID';
export { trackCreator } from './trackCreator';
