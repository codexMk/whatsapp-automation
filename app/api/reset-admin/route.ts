import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[RESET-ADMIN] Starting admin reset...");

    // Step 1: Delete existing admin if any
    console.log("[RESET-ADMIN] Attempting to delete existing admin...");
    const deleteResult = await db.user.deleteMany({
      where: { email: "admin@system.local" }
    });
    console.log("[RESET-ADMIN] Deleted", deleteResult.count, "existing admin accounts");

    // Step 2: Hash password
    console.log("[RESET-ADMIN] Hashing password...");
    const hashedPassword = await hashPassword("Admin@123");
    console.log("[RESET-ADMIN] Password hashed successfully");

    // Step 3: Create fresh admin account
    console.log("[RESET-ADMIN] Creating new admin account...");
    const admin = await db.user.create({
      data: {
        email: "admin@system.local",
        password: hashedPassword,
        role: "ADMIN",
        name: "System Admin",
        businessName: "System"
      }
    });

    console.log("[RESET-ADMIN] ✅ Admin created successfully:", admin.email, "ID:", admin.id);

    return NextResponse.json({
      status: "success",
      message: "✅ Admin account created successfully!",
      email: admin.email,
      name: admin.name,
      role: admin.role,
      id: admin.id,
      nextStep: "Go to http://localhost:3000/login and login with:",
      credentials: {
        email: "admin@system.local",
        password: "Admin@123"
      }
    });
  } catch (error) {
    console.error("[RESET-ADMIN] ❌ Error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to reset admin account",
        details: String(error)
      },
      { status: 500 }
    );
  }
}
