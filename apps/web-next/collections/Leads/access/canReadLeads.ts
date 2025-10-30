import type { Access } from 'payload';

/**
 * Read access control for Leads collection
 *
 * Access Matrix:
 * - Public/Anonymous: DENIED (NO PII exposure)
 * - Lectura: DENIED (privacy protection)
 * - Asesor: ALLOWED for assigned leads only + unassigned leads
 * - Marketing: ALLOWED (all active leads)
 * - Gestor: ALLOWED (all leads including inactive)
 * - Admin: ALLOWED (all leads including inactive)
 *
 * Security:
 * - NO PII exposure to public or lectura role
 * - Asesor can only see leads assigned to them + unassigned
 * - Active/inactive filtering for non-admin roles
 */
export const canReadLeads: Access = ({ req: { user } }) => {
  // Deny if not authenticated (NO public access to lead data)
  if (!user) {
    return false;
  }

  // Lectura role: DENIED (privacy protection - no access to PII)
  if (user.role === 'lectura') {
    return false;
  }

  // Admin and gestor: Full access to all leads (including inactive)
  if (['admin', 'gestor'].includes(user.role)) {
    return true;
  }

  // Marketing: Access to all active leads
  if (user.role === 'marketing') {
    return {
      active: {
        equals: true,
      },
    };
  }

  // Asesor: Only leads assigned to them OR unassigned leads (active only)
  if (user.role === 'asesor') {
    return {
      and: [
        {
          active: {
            equals: true,
          },
        },
        {
          or: [
            {
              assigned_to: {
                equals: user.id,
              },
            },
            {
              assigned_to: {
                equals: null,
              },
            },
          ],
        },
      ],
    };
  }

  // Deny any other role
  return false;
};
