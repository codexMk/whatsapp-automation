import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/quick-start
 * Development-only helper that ensures a super admin and default plans exist.
 */
export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[QUICK-START] Starting admin setup...");

    const email = "admin@123.com";
    const password = "admin123";
    const hashedPassword = await hashPassword(password);

    await db.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        name: "Admin",
        businessName: "Admin Panel",
        industry: "admin"
      },
      create: {
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        name: "Admin",
        businessName: "Admin Panel",
        industry: "admin"
      }
    });

    const plans = [
      {
        name: "Starter",
        price: 599,
        messageLimit: 1000,
        automationLimit: 5,
        features: ["Basic support", "Single category", "Standard templates"],
        description: "Perfect for small businesses starting their WhatsApp journey"
      },
      {
        name: "Growth",
        price: 1999,
        messageLimit: 10000,
        automationLimit: 20,
        features: ["Priority support", "Multiple categories", "Custom templates", "Analytics"],
        description: "For growing businesses with increased needs"
      },
      {
        name: "Pro",
        price: 3999,
        messageLimit: 100000,
        automationLimit: 100,
        features: ["24/7 support", "All categories", "Unlimited templates", "Advanced analytics", "API access"],
        description: "Enterprise-grade solution for large-scale operations"
      }
    ];

    for (const plan of plans) {
      await db.plan.upsert({
        where: { name: plan.name },
        update: {
          ...plan,
          active: true
        },
        create: {
          ...plan,
          active: true
        }
      });
    }

    console.log("[QUICK-START] Admin and plans are ready");

    return NextResponse.json({
      success: true,
      message: "Admin panel is ready",
      credentials: {
        email,
        password
      },
      instructions: {
        step1: "Visit the login page and sign in with the credentials below.",
        step2: "Open /admin after logging in."
      },
      links: {
        loginPage: "http://localhost:3000/login",
        adminDashboard: "http://localhost:3000/admin",
        autoLogin: `http://localhost:3000/api/admin/auto-login?email=${email}&password=${password}`
      },
      note: "This helper is development-only and no longer deletes existing users."
    });
  } catch (error) {
    console.error("[QUICK-START] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to setup admin panel",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
