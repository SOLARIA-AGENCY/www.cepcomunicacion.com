/**
 * Can Delete AdsTemplates Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (not involved in marketing)
 * - Marketing: DENIED (use soft delete via active flag instead)
 * - Gestor: ALLOWED (full content management)
 * - Admin: ALLOWED (full system access)
 *
 * Business Rules:
 * - Hard deletes are restricted to admin and gestor only
 * - Marketing should use soft delete (active = false)
 * - Preserves audit trail and template history
 * - Prevents accidental data loss
 *
 * Soft Delete Pattern:
 * Instead of deleting, set active = false to deactivate the template.
 * This maintains referential integrity and audit trail.
 */

import type { Access } from 'payload';

export const canDeleteAdsTemplates: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Allow: admin, gestor only
  // Hard deletes are restricted to prevent data loss
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Deny: marketing, lectura, asesor, and any other roles
  // Marketing should use soft delete (active = false) instead
  return false;
};

export default canDeleteAdsTemplates;
