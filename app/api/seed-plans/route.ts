import { NextRequest, NextResponse } from "next/server";
import { seedDefaultPlans } from "@/lib/seed-plans";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await seedDefaultPlans();

    return NextResponse.json({
      success: true,
      message: "Default plans seeded successfully"
    });
  } catch (error) {
    console.error("[SEED_PLANS] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed plans" },
      { status: 500 }
    );
  }
}
