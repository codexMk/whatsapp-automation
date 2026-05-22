import { NextResponse } from "next/server";
import { seedAdminAccount } from "@/lib/admin";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[SEED] Starting admin seed...");

    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    if (existingAdmin) {
      console.log("[SEED] Admin already exists");
      return NextResponse.json({
        message: "Admin already exists",
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role,
        info: "If login fails, the password hash may be corrupted. Delete and recreate the user."
      });
    }

    const admin = await seedAdminAccount(
      "admin@system.local",
      "Admin@123"
    );

    console.log("[SEED] Admin created successfully:", admin.email);

    return NextResponse.json({
      message: "Admin user created successfully",
      email: admin.email,
      name: admin.name,
      role: admin.role,
      instruction: "Log in with email: admin@system.local and password: Admin@123 at /login"
    });
  } catch (error) {
    console.error("[SEED] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed admin account", details: String(error) },
      { status: 500 }
    );
  }
}
