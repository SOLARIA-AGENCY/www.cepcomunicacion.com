/**
 * Can Update AdsTemplates Access Control
 *
 * 6-Tier RBAC with Ownership-Based Permissions:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (not involved in marketing)
 * - Marketing: ALLOWED (own templates only - created_by = user.id)
 * - Gestor: ALLOWED (all templates)
 * - Admin: ALLOWED (all templates)
 *
 * Ownership Logic:
 * Marketing users can only update templates where created_by = req.user.id
 * This ensures marketing staff can only modify their own work.
 *
 * Business Rules:
 * - Templates contain strategic marketing content
 * - Ownership prevents unauthorized modifications
 * - Admin/Gestor have oversight access
 */

import type { Access } from 'payload';

export const canUpdateAdsTemplates: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Admin and gestor: Full access to all templates
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: Own templates only (ownership constraint)
  if (user.role === 'marketing') {
    return {
      created_by: {
        equals: user.id,
      },
    };
  }

  // Deny: lectura, asesor, and any other roles
  return false;
};

export default canUpdateAdsTemplates;
