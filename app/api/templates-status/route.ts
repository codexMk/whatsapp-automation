import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Count total templates in database
    const totalTemplates = await db.template.count();
    console.log("[TEMPLATE-STATUS] Total templates in DB:", totalTemplates);

    // Get all templates grouped by userId
    const allTemplates = await db.template.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        category: true,
        createdAt: true
      },
      orderBy: { userId: "asc" }
    });

    console.log("[TEMPLATE-STATUS] Templates by userId:");
    const grouped: { [key: string]: number } = {};
    allTemplates.forEach((t) => {
      grouped[t.userId] = (grouped[t.userId] || 0) + 1;
    });

    return NextResponse.json({
      status: "Template Status",
      totalTemplates,
      templatesByUser: grouped,
      sampleTemplates: allTemplates.slice(0, 5),
      issue: "Templates are user-specific. Each user only sees their own templates. If templates were created with admin userId, other users won't see them.",
      solution: "Visit /api/seed-user-templates to copy templates to all users, or create templates while logged in as each user."
    });
  } catch (error) {
    console.error("[TEMPLATE-STATUS] Error:", error);
    return NextResponse.json(
      { error: "Failed to get template status", details: String(error) },
      { status: 500 }
    );
  }
}
