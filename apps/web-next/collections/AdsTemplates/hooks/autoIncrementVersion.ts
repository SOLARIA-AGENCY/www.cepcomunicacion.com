import type { FieldHook } from 'payload';

/**
 * autoIncrementVersion Hook
 *
 * Auto-increments version number on template updates.
 *
 * Security Pattern: SP-001 (Defense in Depth - Immutability)
 * - Layer 1: admin.readOnly = true (UI-level protection)
 * - Layer 2: access.update = () => false (API-level protection)
 * - Layer 3: Hook validation (this layer)
 *
 * Business Rules:
 * - version starts at 1 on create
 * - version increments by 1 on each update
 * - version is SYSTEM-MANAGED (users cannot manually set)
 * - Used for tracking template evolution
 * - Can be used for version comparison and rollback
 *
 * Versioning Flow:
 * - Create: version = 1
 * - Update 1: version = 2
 * - Update 2: version = 3
 * - etc.
 *
 * Triggered: beforeChange (create and update operations)
 */
export const autoIncrementVersion: FieldHook = async ({ data, operation, originalDoc, req, value }) => {
  // LAYER 3: Hook-level validation for system-managed field

  // On CREATE: Initialize version to 1
  if (operation === 'create') {
    // If user tries to set a custom version, override it (system-managed)
    const initialVersion = 1;

    // Log version initialization (no PII per SP-004)
    if (req?.payload?.logger) {
      req.payload.logger.info({
        collection: 'ads-templates',
        operation: 'version_init',
        version: initialVersion,
        userId: req?.user?.id,
        message: 'Template version initialized',
      });
    }

    return initialVersion;
  }

  // On UPDATE: Auto-increment version
  if (operation === 'update') {
    const currentVersion = originalDoc?.version || 1;
    const newVersion = currentVersion + 1;

    // Prevent manual version changes (SP-001 Layer 3)
    const attemptedVersion = value;
    if (attemptedVersion && attemptedVersion !== newVersion) {
      // Log warning but don't block (override with correct value)
      if (req?.payload?.logger) {
        req.payload.logger.warn({
          collection: 'ads-templates',
          operation: 'version_override',
          documentId: originalDoc?.id,
          attemptedVersion,
          correctVersion: newVersion,
          userId: req?.user?.id,
          message: 'Manual version change blocked (system-managed)',
        });
      }
    }

    // Log version increment (no PII per SP-004)
    if (req?.payload?.logger) {
      req.payload.logger.info({
        collection: 'ads-templates',
        operation: 'version_increment',
        documentId: originalDoc?.id,
        oldVersion: currentVersion,
        newVersion,
        userId: req?.user?.id,
        message: 'Template version incremented',
      });
    }

    return newVersion;
  }

  return value;
};
