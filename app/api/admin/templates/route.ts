import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import {
  getAllReadyMadeTemplates,
  getReadyMadeTemplatesByCategory,
  searchReadyMadeTemplates,
} from "@/lib/default-templates";

/**
 * GET /api/admin/templates
 * Admin endpoint to view and manage ready-made templates
 * 
 * Query params:
 * - category: optional, filter by category
 * - search: optional, search templates
 * - includeStats: optional, include usage statistics
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const includeStats = searchParams.get("includeStats") === "true";

    let templates = getAllReadyMadeTemplates();

    // Filter by category
    if (category) {
      templates = getReadyMadeTemplatesByCategory(category);
    }

    // Search templates
    if (search) {
      templates = searchReadyMadeTemplates(search);
    }

    // Get statistics if requested
    let stats = null;
    if (includeStats) {
      // Count how many times each template was copied
      const templateCopies = await Promise.all(
        templates.map(async (template) => {
          const count = await db.template.count({
            where: {
              name: {
                contains: `${template.title} (Ready-Made)`,
              },
            },
          });
          return { templateId: template.id, copies: count };
        })
      );

      stats = {
        totalTemplates: templates.length,
        totalCopies: templateCopies.reduce((sum, t) => sum + t.copies, 0),
        templateCopies,
      };
    }

    // Get category breakdown
    const categories = [
      "clinic",
      "shop",
      "real_estate",
      "coaching",
      "csc",
    ];
    const categoryBreakdown = categories.map((cat) => ({
      category: cat,
      count: getAllReadyMadeTemplates().filter(
        (t) => t.category === cat
      ).length,
    }));

    return NextResponse.json({
      templates,
      count: templates.length,
      categoryBreakdown,
      ...(stats && { stats }),
    });
  } catch (error) {
    console.error("[ADMIN-TEMPLATES-API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
