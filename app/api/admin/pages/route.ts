import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { isSuperAdmin } from "@/lib/auth/permissions";
export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!isSuperAdmin(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pages = await db.page.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("[ADMIN-PAGES] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!isSuperAdmin(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    let { title, slug, content, visible } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    slug = slug || generateSlug(title);

    const page = await db.page.create({
      data: {
        title,
        slug,
        content,
        visible: visible !== false
      }
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("[ADMIN-PAGES] Create error:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!isSuperAdmin(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { pageId, title, slug, content, visible } = body;

    if (!pageId) {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    const page = await db.page.update({
      where: { id: pageId },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content && { content }),
        ...(visible !== undefined && { visible })
      }
    });

    return NextResponse.json({ page });
  } catch (error) {
    console.error("[ADMIN-PAGES] Update error:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!isSuperAdmin(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { pageId } = await request.json();

    if (!pageId) {
      return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
    }

    await db.page.delete({
      where: { id: pageId }
    });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("[ADMIN-PAGES] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
