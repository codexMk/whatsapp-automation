import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/setup/reset-super-admin
 * Refreshes the primary super admin credentials in development.
 */
export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { hashPassword } = await import("@/lib/auth");

    const email = "superadmin@test.com";
    const password = "password123";
    const hashedPassword = await hashPassword(password);

    const existingSuperAdmin = await db.user.findFirst({
      where: {
        role: "SUPER_ADMIN"
      }
    });

    const superAdmin = existingSuperAdmin
      ? await db.user.update({
          where: { id: existingSuperAdmin.id },
          data: {
            email,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            name: "System Admin",
            businessName: "System Administration",
            industry: "admin"
          }
        })
      : await db.user.create({
          data: {
            email,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            status: "ACTIVE",
            name: "System Admin",
            businessName: "System Administration",
            industry: "admin"
          }
        });

    return NextResponse.json(
      {
        message: "Super admin reset successfully",
        email: superAdmin.email,
        password,
        note: "Existing super admin credentials were refreshed without deleting related records."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RESET-SUPER-ADMIN]", error);
    return NextResponse.json(
      {
        error: "Failed to reset super admin",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
