import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { createTemplate } from "@/lib/templates";
import {
  getAllReadyMadeTemplates,
  getReadyMadeTemplatesByCategory,
  getReadyMadeTemplateById,
} from "@/lib/default-templates";

export const dynamic = "force-dynamic";

/**
 * GET /api/templates/ready-made
 * Fetch ready-made templates, optionally filtered by category
 * 
 * Query params:
 * - category: optional, filter by category (e.g., ?category=clinic)
 * - search: optional, search by title/description/tags
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let templates = getAllReadyMadeTemplates();

    // Filter by category if provided
    if (category) {
      templates = getReadyMadeTemplatesByCategory(category);
    }

    // Filter by search query if provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      templates = templates.filter(
        (template) =>
          template.title.toLowerCase().includes(lowerSearch) ||
          template.description.toLowerCase().includes(lowerSearch) ||
          template.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    }

    return NextResponse.json({
      templates,
      count: templates.length,
    });
  } catch (error) {
    console.error("[READY-MADE-TEMPLATES-API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ready-made templates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/templates/ready-made
 * Copy a ready-made template to user's library
 * 
 * Body:
 * {
 *   "templateId": "clinic-001"  // ID of the ready-made template
 * }
 */
export async function POST(request: Request) {
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

    const body = await request.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 }
      );
    }

    // Get the ready-made template
    const readyMadeTemplate = getReadyMadeTemplateById(templateId);
    if (!readyMadeTemplate) {
      return NextResponse.json(
        { error: "Ready-made template not found" },
        { status: 404 }
      );
    }

    // Create a copy in user's library
    const newTemplate = await createTemplate(payload.userId, {
      name: `${readyMadeTemplate.title} (Ready-Made)`,
      category: readyMadeTemplate.category,
      content: readyMadeTemplate.content,
      variables: extractVariables(readyMadeTemplate.content),
    });

    return NextResponse.json(
      { template: newTemplate, message: "Template copied to your library" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[READY-MADE-TEMPLATES-API] Error creating copy:", error);
    return NextResponse.json(
      { error: "Failed to copy template" },
      { status: 500 }
    );
  }
}

/**
 * Extract variables from template content
 * Looks for {{variable}} patterns and returns array of variable names
 */
function extractVariables(content: string): string[] {
  const pattern = /\{\{(\w+)\}\}/g;
  const matches = content.match(pattern) || [];
  const variables = matches.map((match) => match.replace(/\{\{|\}\}/g, ""));
  return [...new Set(variables)]; // Remove duplicates
}
