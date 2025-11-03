/**
 * Can Read AdsTemplates Access Control
 *
 * 6-Tier RBAC:
 * - Public: DENIED (business intelligence protection)
 * - Lectura: ALLOWED (read-only access for reporting)
 * - Asesor: ALLOWED (read-only for context)
 * - Marketing: ALLOWED (full read access)
 * - Gestor: ALLOWED (full read access)
 * - Admin: ALLOWED (full read access)
 *
 * Business Intelligence Protection:
 * Templates contain marketing strategy and competitive intelligence.
 * No public access to protect business strategy.
 *
 * Filtering:
 * - All authenticated users see only active templates by default
 * - Admin/Gestor can see inactive templates via admin UI filters
 */

import type { Access } from 'payload';

export const canReadAdsTemplates: Access = ({ req: { user } }) => {
  // Deny public access (business intelligence protection)
  if (!user) {
    return false;
  }

  // Admin and gestor: Full access (including inactive templates)
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing, asesor, lectura: Active templates only
  if (['marketing', 'asesor', 'lectura'].includes(user.role)) {
    return {
      active: {
        equals: true,
      },
    };
  }

  // Deny any other roles
  return false;
};

export default canReadAdsTemplates;
