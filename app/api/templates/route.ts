import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { createTemplate, listTemplates, templateInputSchema } from "@/lib/templates";

export async function GET() {
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

    console.log("[TEMPLATES-API] Fetching templates for user:", payload.userId);
    const templates = await listTemplates(payload.userId);
    console.log("[TEMPLATES-API] Found templates:", templates.length);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[TEMPLATES-API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

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
    const parseResult = templateInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const template = await createTemplate(payload.userId, parseResult.data);

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("[TEMPLATES-API] Error creating template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

