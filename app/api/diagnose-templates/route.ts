import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[DIAGNOSE-TEMPLATES] Starting diagnosis...");

    // Get current user
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;
    const payload = token ? verifySession(token) : null;
    const userId = payload?.userId ?? null;

    console.log("[DIAGNOSE-TEMPLATES] Current userId:", userId);

    // Get admin user
    const admin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    console.log("[DIAGNOSE-TEMPLATES] Admin user:", admin?.id);

    // Get current user details
    const currentUser = userId ? await db.user.findUnique({
      where: { id: userId }
    }) : null;

    console.log("[DIAGNOSE-TEMPLATES] Current user email:", currentUser?.email);
    console.log("[DIAGNOSE-TEMPLATES] Current user business name:", currentUser?.businessName);

    // Count all templates by userId
    const templatesByUser = await db.template.findMany();

    const groupedByUser: Record<
      string,
      Array<{ name: string; category: string | null; id: string }>
    > = {};
    for (const template of templatesByUser) {
      if (!groupedByUser[template.userId]) {
        groupedByUser[template.userId] = [];
      }
      groupedByUser[template.userId].push({
        name: template.name,
        category: template.category,
        id: template.id
      });
    }

    // Get templates for current user
    const currentUserTemplates = userId ? await db.template.findMany({
      where: { userId }
    }) : [];

    console.log("[DIAGNOSE-TEMPLATES] Current user template count:", currentUserTemplates.length);

    // Get admin templates
    const adminTemplates = admin ? await db.template.findMany({
      where: { userId: admin.id }
    }) : [];

    console.log("[DIAGNOSE-TEMPLATES] Admin template count:", adminTemplates.length);

    return NextResponse.json({
      diagnosis: {
        currentUser: {
          id: userId,
          email: currentUser?.email,
          businessName: currentUser?.businessName,
          templatesCount: currentUserTemplates.length,
          templates: currentUserTemplates.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category
          }))
        },
        admin: {
          id: admin?.id,
          email: admin?.email,
          templatesCount: adminTemplates.length,
          templates: adminTemplates.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category
          }))
        },
        allUsersWithTemplates: Object.entries(groupedByUser).map(([uid, temps]) => ({
          userId: uid,
          templateCount: temps.length,
          categories: [...new Set(temps.map(t => t.category))]
        })),
        totalTemplatesInDB: templatesByUser.length
      }
    });
  } catch (error) {
    console.error("[DIAGNOSE-TEMPLATES] Error:", error);
    return NextResponse.json(
      { error: "Diagnosis failed", details: String(error) },
      { status: 500 }
    );
  }
}
