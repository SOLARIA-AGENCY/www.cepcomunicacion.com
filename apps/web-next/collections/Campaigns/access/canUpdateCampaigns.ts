/**
 * Can Update Campaigns Access Control
 *
 * 6-Tier RBAC with Ownership-Based Permissions:
 * - Public: DENIED
 * - Lectura: DENIED (read-only role)
 * - Asesor: DENIED (read-only for campaigns)
 * - Marketing: ALLOWED (own campaigns only - created_by = user.id)
 * - Gestor: ALLOWED (all campaigns)
 * - Admin: ALLOWED (all campaigns)
 *
 * Ownership Logic:
 * Marketing users can only update campaigns where created_by = req.user.id
 */

import type { Access } from 'payload';

export const canUpdateCampaigns: Access = ({ req: { user } }) => {
  // Deny public access
  if (!user) {
    return false;
  }

  // Admin and gestor: Full access to all campaigns
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: Own campaigns only (ownership constraint)
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

export default canUpdateCampaigns;
