import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[VERIFY] Starting comprehensive verification...");

    // Step 1: Check if admin exists
    console.log("[VERIFY] Checking if admin exists in database...");
    const admin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    if (!admin) {
      console.log("[VERIFY] ❌ Admin does NOT exist in database!");
      return NextResponse.json({
        status: "missing",
        message: "❌ Admin account does NOT exist in database",
        foundAdmin: false,
        action: "Visit http://localhost:3000/api/reset-admin to create it",
        nextStep: "After creation, visit this endpoint again to verify"
      });
    }

    console.log("[VERIFY] ✅ Admin found:", admin.email);
    console.log("[VERIFY] Password hash exists:", !!admin.password);

    // Step 2: Test password verification
    console.log("[VERIFY] Testing password verification...");
    const testPassword = "Admin@123";
    const passwordValid = await verifyPassword(testPassword, admin.password);
    console.log("[VERIFY] Password verification result:", passwordValid);

    // Step 3: Hash a fresh password to compare
    console.log("[VERIFY] Creating fresh password hash for comparison...");
    const freshHash = await hashPassword("Admin@123");
    const freshVerify = await verifyPassword("Admin@123", freshHash);
    console.log("[VERIFY] Fresh hash verification:", freshVerify);

    return NextResponse.json({
      status: "verification",
      message: "✅ Verification Complete",
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        id: admin.id,
        hasPasswordHash: !!admin.password,
        passwordHashLength: admin.password?.length || 0
      },
      passwordVerification: {
        currentPasswordValid: passwordValid,
        testPassword: "Admin@123",
        freshHashCreated: !!freshHash,
        freshHashVerifies: freshVerify
      },
      recommendation: passwordValid
        ? "✅ Password is correct. Login should work. Try: http://localhost:3000/login"
        : "❌ Password hash is corrupted. Visit http://localhost:3000/api/reset-admin to fix it",
      loginUrl: "http://localhost:3000/login",
      credentials: {
        email: "admin@system.local",
        password: "Admin@123"
      }
    });
  } catch (error) {
    console.error("[VERIFY] ❌ Error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: "Verification failed",
        details: String(error)
      },
      { status: 500 }
    );
  }
}
