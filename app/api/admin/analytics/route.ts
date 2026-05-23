import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { canViewAnalytics } from "@/lib/auth/permissions";
export const dynamic = "force-dynamic";

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

    if (!canViewAnalytics(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get basic stats
    const [totalUsers, activeUsers, totalCampaigns, totalMessages, newUsersToday] = await Promise.all([
      db.user.count(),
      db.user.count({
        where: { status: "ACTIVE" }
      }),
      db.campaign.count(),
      db.messageLog.count(),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      })
    ]);

    // Get top industries (fetch all and process in memory)
    const allUsers = await db.user.findMany({
      select: { industry: true },
      where: { status: 'ACTIVE' }
    });

    const industriesCounts = allUsers.reduce((acc: { [key: string]: number }, user) => {
      const industry = user.industry || 'Uncategorized';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {});

    const topIndustries = Object.entries(industriesCounts)
      .map(([category, count]) => ({ category, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get most used templates (fetch all and process in memory)
    const allTemplates = await db.template.findMany({
      select: { name: true }
    });

    const templateCounts = allTemplates.reduce((acc: { [key: string]: number }, template) => {
      const name = template.name || 'Unnamed';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const mostUsedTemplates = Object.entries(templateCounts)
      .map(([name, usageCount]) => ({ name, usageCount: usageCount as number }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // Get daily message trends (last 7 days)
    const dailyTrends: { date: string; messages: number; campaigns: number; newUsers: number }[] = [];

    // Generate daily entries for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      try {
        const [msgs, camps, newUsrs] = await Promise.all([
          db.messageLog.count({
            where: {
              createdAt: { gte: startOfDay, lte: endOfDay }
            }
          }),
          db.campaign.count({
            where: {
              createdAt: { gte: startOfDay, lte: endOfDay }
            }
          }),
          db.user.count({
            where: {
              createdAt: { gte: startOfDay, lte: endOfDay }
            }
          })
        ]);

        dailyTrends.push({
          date: startOfDay.toISOString().split('T')[0],
          messages: msgs,
          campaigns: camps,
          newUsers: newUsrs
        });
      } catch (err) {
        console.error(`[ADMIN-ANALYTICS] Error processing day ${i}:`, err);
        // Add zero values if query fails
        dailyTrends.push({
          date: startOfDay.toISOString().split('T')[0],
          messages: 0,
          campaigns: 0,
          newUsers: 0
        });
      }
    }

    return NextResponse.json({
      analytics: {
        totals: {
          users: totalUsers,
          activeUsers,
          campaigns: totalCampaigns,
          messagesSent: totalMessages,
          newUsersToday
        },
        topIndustries,
        mostUsedTemplates,
        dailyTrends
      }
    });
  } catch (error) {
    console.error("[ADMIN-ANALYTICS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
