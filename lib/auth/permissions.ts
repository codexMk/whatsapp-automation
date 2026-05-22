import { UserRole } from "@prisma/client";

export function isSuperAdmin(role: UserRole | null | undefined): boolean {
  return role === UserRole.SUPER_ADMIN;
}

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

export function isUser(role: UserRole | null | undefined): boolean {
  return role === UserRole.USER;
}

export function canAccessAdminPanel(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManageUsers(role: UserRole | null | undefined): boolean {
  return isSuperAdmin(role);
}

export function canViewAllCampaigns(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManageTemplates(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManagePlans(role: UserRole | null | undefined): boolean {
  return isSuperAdmin(role);
}

export function canManageCategories(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManageBlog(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}

export function canManagePages(role: UserRole | null | undefined): boolean {
  return isSuperAdmin(role);
}

export function canViewAnalytics(role: UserRole | null | undefined): boolean {
  return isAdmin(role);
}
