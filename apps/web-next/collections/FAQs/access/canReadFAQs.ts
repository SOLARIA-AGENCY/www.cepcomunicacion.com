/**
 * Can Read FAQs Access Control
 *
 * 6-Tier RBAC:
 * - Public: ALLOWED (active FAQs only)
 * - Lectura: ALLOWED (all FAQs)
 * - Asesor: ALLOWED (all FAQs)
 * - Marketing: ALLOWED (all FAQs)
 * - Gestor: ALLOWED (all FAQs)
 * - Admin: ALLOWED (all FAQs)
 *
 * Business Logic:
 * - Public users see only FAQs with active=true
 * - Authenticated users see all FAQs regardless of active status
 */

import type { Access } from 'payload';

export const canReadFAQs: Access = ({ req: { user } }) => {
  // Authenticated users can read all FAQs
  if (user) {
    return true;
  }

  // Public users can only read active FAQs
  return {
    active: {
      equals: true,
    },
  };
};

export default canReadFAQs;
