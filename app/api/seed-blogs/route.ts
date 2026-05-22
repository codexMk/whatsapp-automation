import { NextRequest, NextResponse } from "next/server";
import { seedDefaultBlogs } from "@/lib/seed-blogs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    await seedDefaultBlogs();

    return NextResponse.json({
      success: true,
      message: "Default blogs seeded successfully"
    });
  } catch (error) {
    console.error("[SEED_BLOGS] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed blogs" },
      { status: 500 }
    );
  }
}
