// Admin permissions
export enum AdminPermission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_CAMPAIGNS = 'MANAGE_CAMPAIGNS',
  MANAGE_TEMPLATES = 'MANAGE_TEMPLATES',
  MANAGE_BLOG = 'MANAGE_BLOG',
  MANAGE_PAGES = 'MANAGE_PAGES',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_PLANS = 'MANAGE_PLANS',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS: Record<string, AdminPermission[]> = {
  SUPER_ADMIN: Object.values(AdminPermission),
  ADMIN: [
    AdminPermission.MANAGE_USERS,
    AdminPermission.MANAGE_CAMPAIGNS,
    AdminPermission.MANAGE_TEMPLATES,
    AdminPermission.VIEW_ANALYTICS,
  ],
  USER: [],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: AdminPermission | string
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has any of the required permissions
 */
export function hasAnyPermission(
  userPermissions: string[],
  permissions: (AdminPermission | string)[]
): boolean {
  return permissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if a user has all of the required permissions
 */
export function hasAllPermissions(
  userPermissions: string[],
  permissions: (AdminPermission | string)[]
): boolean {
  return permissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Get permission label
 */
export function getPermissionLabel(permission: AdminPermission): string {
  const labels: Record<AdminPermission, string> = {
    [AdminPermission.MANAGE_USERS]: 'Manage Users',
    [AdminPermission.MANAGE_CAMPAIGNS]: 'Manage Campaigns',
    [AdminPermission.MANAGE_TEMPLATES]: 'Manage Templates',
    [AdminPermission.MANAGE_BLOG]: 'Manage Blog',
    [AdminPermission.MANAGE_PAGES]: 'Manage Pages',
    [AdminPermission.VIEW_ANALYTICS]: 'View Analytics',
    [AdminPermission.MANAGE_PLANS]: 'Manage Plans',
    [AdminPermission.MANAGE_ADMINS]: 'Manage Admin Accounts',
  };
  return labels[permission] || permission;
}
