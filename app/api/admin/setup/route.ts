import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const DEFAULT_PLANS = [
  {
    name: "Starter",
    price: 599,
    messageLimit: 1000,
    automationLimit: 5,
    features: [
      "Basic templates",
      "Single category",
      "Manual campaigns",
      "Email support"
    ],
    description: "Perfect for getting started"
  },
  {
    name: "Growth",
    price: 1999,
    messageLimit: 10000,
    automationLimit: 20,
    features: [
      "All Starter features",
      "Multiple categories",
      "Scheduled campaigns",
      "Basic analytics",
      "Priority support"
    ],
    description: "For growing businesses"
  },
  {
    name: "Pro",
    price: 3999,
    messageLimit: 100000,
    automationLimit: 100,
    features: [
      "All Growth features",
      "Unlimited categories",
      "Advanced automation",
      "Advanced analytics",
      "24/7 phone support",
      "Custom integrations"
    ],
    description: "For established businesses"
  }
];

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[SEED-ADMIN-SETUP] Starting admin setup...");

    // Check if plans already exist
    const existingPlans = await db.plan.count();
    
    if (existingPlans === 0) {
      console.log("[SEED-ADMIN-SETUP] Creating default plans...");
      
      for (const plan of DEFAULT_PLANS) {
        await db.plan.create({
          data: plan
        });
      }
      
      console.log("[SEED-ADMIN-SETUP] Created 3 default plans");
    }

    // Get stats
    const stats = {
      totalPlans: await db.plan.count(),
      totalUsers: await db.user.count(),
      superAdmins: await db.user.count({ where: { role: "SUPER_ADMIN" } }),
      admins: await db.user.count({ where: { role: "ADMIN" } }),
      regularUsers: await db.user.count({ where: { role: "USER" } })
    };

    return NextResponse.json({
      status: "success",
      message: "Admin system setup complete",
      stats,
      nextSteps: [
        "Run: npx prisma migrate dev",
        "Visit /admin/dashboard to access admin panel",
        "Use admin credentials to log in",
        "Create super admin account via /api/admin/setup/create-super-admin"
      ]
    });
  } catch (error) {
    console.error("[SEED-ADMIN-SETUP] Error:", error);
    return NextResponse.json(
      { error: "Setup failed", details: String(error) },
      { status: 500 }
    );
  }
}
