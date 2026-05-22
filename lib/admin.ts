import { db } from "./db";
import { hashPassword } from "./auth";
import { UserRole } from "@prisma/client";

/**
 * Check if user has admin role
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  // Check for both ADMIN and OWNER roles (OWNER is used in database)
  return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Get all users (admin view)
 */
export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      businessName: true,
      industry: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get dashboard stats (admin view)
 */
export async function getAdminDashboardStats() {
  const [totalUsers, totalCampaigns, totalCustomers, totalMessages] =
    await Promise.all([
      db.user.count(),
      db.campaign.count(),
      db.customer.count(),
      db.messageLog.count(),
    ]);

  return {
    totalUsers,
    totalCampaigns,
    totalCustomers,
    totalMessages,
  };
}

/**
 * Seed admin account if it doesn't exist
 */
export async function seedAdminAccount(
  email: string = "admin@gmail.com",
  password: string = "Admin@123"
) {
  // Normalize email to lowercase
  const normalizedEmail = email.toLowerCase();

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create or update admin account - Use OWNER role (system uses OWNER for admins)
  const admin = await db.user.upsert({
    where: { email: normalizedEmail },
    update: {}, // Don't update if exists
    create: {
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,  // Using ADMIN role
      name: "System Admin",
      businessName: "System",
    },
  });

  return admin;
}
