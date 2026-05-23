import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session-server";
import { isAdmin, getAdminDashboardStats } from "@/lib/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats
 * Returns dashboard statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await validateSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await isAdmin(session.userId);
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const stats = await getAdminDashboardStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
