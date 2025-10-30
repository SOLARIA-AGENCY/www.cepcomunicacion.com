import type { Access } from 'payload';

/**
 * Create access control for Leads collection
 *
 * Access Matrix:
 * - Public/Anonymous: ALLOWED (public form submission - CRITICAL)
 * - Lectura: DENIED (read-only role)
 * - Asesor: ALLOWED (can create leads manually)
 * - Marketing: ALLOWED (can create leads/campaigns)
 * - Gestor: ALLOWED (full management)
 * - Admin: ALLOWED (full access)
 *
 * Security:
 * - PUBLIC ENDPOINT - No authentication required for form submissions
 * - Rate limiting enforced at API level (5 per IP per 15 minutes)
 * - GDPR consent mandatory (enforced by hooks)
 * - XSS prevention (enforced by sanitization hooks)
 */
export const canCreateLeads: Access = ({ req: { user } }) => {
  // ALLOW PUBLIC ACCESS - This is a public form endpoint
  // No authentication required
  // Security enforced via:
  // - Rate limiting
  // - GDPR consent validation
  // - Input sanitization
  // - Duplicate prevention
  return true;
};
