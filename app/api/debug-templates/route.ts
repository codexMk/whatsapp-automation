import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[DEBUG-TEMPLATES] Checking template status...");

    // Get admin user
    const admin = await db.user.findUnique({
      where: { email: "admin@system.local" },
      include: { templates: true }
    });

    // Get raj clinic user
    const rajClinic = await db.user.findFirst({
      where: { businessName: { contains: "Raj" } },
      include: { templates: true }
    });

    // Get all templates in database
    const allTemplates = await db.template.findMany();

    // Count templates by category
    const categoryCount: Record<string, number> = {};
    allTemplates.forEach((template) => {
      const categoryKey = template.category ?? "uncategorized";
      categoryCount[categoryKey] = (categoryCount[categoryKey] || 0) + 1;
    });

    return NextResponse.json({
      admin: {
        email: admin?.email,
        id: admin?.id,
        templatesCount: admin?.templates.length || 0,
        templates: admin?.templates.map(t => ({ name: t.name, category: t.category })) || []
      },
      rajClinic: {
        email: rajClinic?.email,
        businessName: rajClinic?.businessName,
        id: rajClinic?.id,
        templatesCount: rajClinic?.templates.length || 0,
        templates: rajClinic?.templates.map(t => ({ name: t.name, category: t.category })) || []
      },
      totals: {
        totalTemplatesInDB: allTemplates.length,
        byCategory: categoryCount
      }
    });
  } catch (error) {
    console.error("[DEBUG-TEMPLATES] Error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: String(error) },
      { status: 500 }
    );
  }
}
