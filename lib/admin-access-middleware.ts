/**
 * Admin Access Middleware
 * Checks if user has admin permissions and is active
 */

import { UserRole, UserStatus } from "@prisma/client";
import { db } from "@/lib/db";

export interface AdminAccessCheckResult {
  allowed: boolean;
  reason?: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

/**
 * Check if user can access admin routes
 */
export async function checkAdminAccess(userId: string): Promise<AdminAccessCheckResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isActive: true
      }
    });

    if (!user) {
      return { allowed: false, reason: "User not found" };
    }

    // Check if user has admin role
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      return { allowed: false, reason: "Insufficient permissions" };
    }

    // Check if user account is active
    if (user.status !== UserStatus.ACTIVE) {
      return { allowed: false, reason: "Account is suspended or deleted" };
    }

    // Check if admin is active
    if (!user.isActive) {
      return { allowed: false, reason: "Admin account is inactive" };
    }

    return {
      allowed: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  } catch (error) {
    console.error("[CHECK_ADMIN_ACCESS] Error:", error);
    return { allowed: false, reason: "Failed to verify admin access" };
  }
}

/**
 * Check if user is SUPER_ADMIN
 */
export async function checkSuperAdminAccess(userId: string): Promise<AdminAccessCheckResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isActive: true
      }
    });

    if (!user) {
      return { allowed: false, reason: "User not found" };
    }

    // Check if user is SUPER_ADMIN
    if (user.role !== UserRole.SUPER_ADMIN) {
      return { allowed: false, reason: "Only SUPER_ADMIN allowed" };
    }

    // Check if user account is active
    if (user.status !== UserStatus.ACTIVE) {
      return { allowed: false, reason: "Account is suspended or deleted" };
    }

    // Check if admin is active
    if (!user.isActive) {
      return { allowed: false, reason: "Admin account is inactive" };
    }

    return {
      allowed: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  } catch (error) {
    console.error("[CHECK_SUPER_ADMIN_ACCESS] Error:", error);
    return { allowed: false, reason: "Failed to verify SUPER_ADMIN access" };
  }
}

/**
 * Update admin last login time
 */
export async function updateLastLogin(userId: string): Promise<void> {
  try {
    await db.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  } catch (error) {
    console.error("[UPDATE_LAST_LOGIN] Error:", error);
  }
}

/**
 * Check if admin can manage other admins
 */
export async function canManageAdmins(userId: string): Promise<boolean> {
  const result = await checkSuperAdminAccess(userId);
  return result.allowed;
}
