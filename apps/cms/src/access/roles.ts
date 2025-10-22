export const ROLES = {
  ADMIN: 'admin',
  GESTOR: 'gestor',
  MARKETING: 'marketing',
  ASESOR: 'asesor',
  LECTURA: 'lectura',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy (for permissions inheritance)
export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.ADMIN]: 5,
  [ROLES.GESTOR]: 4,
  [ROLES.MARKETING]: 3,
  [ROLES.ASESOR]: 2,
  [ROLES.LECTURA]: 1,
};

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}
