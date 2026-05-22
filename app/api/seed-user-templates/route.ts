import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[SEED-USER-TEMPLATES] Starting template seeding...");

    // Get admin user
    const admin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    console.log("[SEED-USER-TEMPLATES] Found admin user:", admin.id);

    // Get all templates from admin
    const adminTemplates = await db.template.findMany({
      where: { userId: admin.id }
    });

    console.log(`[SEED-USER-TEMPLATES] Found ${adminTemplates.length} admin templates`);

    // Get all non-admin users
    const users = await db.user.findMany({
      where: {
        email: { not: "admin@system.local" }
      }
    });

    console.log(`[SEED-USER-TEMPLATES] Found ${users.length} non-admin users`);

    let createdCount = 0;

    // Copy templates to each user
    for (const user of users) {
      for (const template of adminTemplates) {
        // Check if template already exists for this user
        const existing = await db.template.findFirst({
          where: {
            userId: user.id,
            name: template.name
          }
        });

        if (!existing) {
          await db.template.create({
            data: {
              userId: user.id,
              name: template.name,
              category: template.category,
              content: template.content,
              variables: template.variables || undefined
            }
          });
          createdCount++;
        }
      }
    }

    console.log(`[SEED-USER-TEMPLATES] Created ${createdCount} new templates for users`);

    return NextResponse.json({
      status: "success",
      message: `✅ Seeded templates successfully`,
      stats: {
        adminId: admin.id,
        adminTemplatesCount: adminTemplates.length,
        totalUsersCount: users.length,
        newTemplatesCreated: createdCount
      },
      nextStep: "Users should now see these templates when they log in"
    });
  } catch (error) {
    console.error("[SEED-USER-TEMPLATES] Error:", error);
    return NextResponse.json(
      { error: "Failed to seed user templates", details: String(error) },
      { status: 500 }
    );
  }
}
