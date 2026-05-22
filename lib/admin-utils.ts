/**
 * Admin utilities for role checking, access control, and admin operations
 */

import { UserRole } from "@prisma/client";

/**
 * Check if user has admin role
 */
export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user can access admin routes
 */
export function canAccessAdmin(role: UserRole): boolean {
  return isAdmin(role);
}

/**
 * Check if user can manage admins (create, delete, change status)
 */
export function canManageAdmins(role: UserRole): boolean {
  return isSuperAdmin(role);
}

/**
 * Check if user can activate/deactivate admins
 */
export function canChangeAdminStatus(role: UserRole): boolean {
  return isSuperAdmin(role);
}

/**
 * Check if user can create admin accounts
 */
export function canCreateAdmin(role: UserRole): boolean {
  return isSuperAdmin(role);
}

/**
 * Check if user can delete admin accounts
 */
export function canDeleteAdmin(role: UserRole): boolean {
  return isSuperAdmin(role);
}

/**
 * Check if new admin role is allowed for creator
 * ADMIN cannot create SUPER_ADMIN
 */
export function isValidAdminRoleAssignment(creatorRole: UserRole, newAdminRole: UserRole): boolean {
  if (!isSuperAdmin(creatorRole)) {
    return false; // Only SUPER_ADMIN can create admins
  }

  // ADMIN cannot create SUPER_ADMIN (though this shouldn't happen if creatorRole is checked)
  if (newAdminRole === UserRole.SUPER_ADMIN && creatorRole === UserRole.ADMIN) {
    return false;
  }

  return newAdminRole === UserRole.ADMIN || newAdminRole === UserRole.SUPER_ADMIN;
}

/**
 * Check if admin is trying to modify their own role
 */
export function isSelfModification(adminId: string, targetId: string): boolean {
  return adminId === targetId;
}

/**
 * Validate admin secret key if enabled
 */
export function validateAdminSecret(providedSecret: string): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  
  // If no secret key is set, allow access (optional feature)
  if (!adminSecret) {
    return true;
  }

  return providedSecret === adminSecret;
}
