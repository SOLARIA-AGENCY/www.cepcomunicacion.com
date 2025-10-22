import { CollectionAfterChangeHook } from 'payload';

/**
 * Creates an audit log entry for GDPR compliance
 *
 * This hook records:
 * - Entity type and ID
 * - Action performed (create, update, delete)
 * - User responsible
 * - Timestamp
 * - IP address (from request)
 * - Before/after snapshots for updates
 *
 * @param operation - The operation type (create, update, delete)
 * @returns Payload hook function
 */
export function createAuditLogHook(operation: 'create' | 'update' | 'delete'): CollectionAfterChangeHook {
  return async ({ doc, req, previousDoc, collection }) => {
    try {
      // Get user ID (if authenticated)
      const userId = req.user?.id;

      // Get IP address from request
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';

      // Create audit log entry
      await req.payload.create({
        collection: 'audit_logs',
        data: {
          entity_type: collection.slug,
          entity_id: doc.id,
          action: operation,
          user_id: userId || null,
          ip_address: typeof ipAddress === 'string' ? ipAddress : ipAddress[0],
          changes: operation === 'update' ? { before: previousDoc, after: doc } : null,
        },
      });
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Failed to create audit log:', error);
    }

    return doc;
  };
}

/**
 * Audit log hook for create operations
 */
export const auditCreate = createAuditLogHook('create');

/**
 * Audit log hook for update operations
 */
export const auditUpdate = createAuditLogHook('update');

/**
 * Audit log hook for delete operations
 */
export const auditDelete = createAuditLogHook('delete');
