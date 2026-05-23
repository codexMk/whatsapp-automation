import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSession } from "@/lib/session-server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get the current user's session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Get total customers
    const totalCustomers = await db.customer.count({
      where: { userId }
    });

    // Get total campaigns
    const totalCampaigns = await db.campaign.count({
      where: { userId }
    });

    // Get messages sent (delivered)
    const messagesSent = await db.messageLog.count({
      where: {
        userId,
        status: "DELIVERED"
      }
    });

    // Get active automations
    const activeAutomations = await db.automation.count({
      where: {
        userId,
        enabled: true
      }
    });

    // Get campaign progress (sent vs total)
    const campaignStats = await db.messageLog.groupBy({
      by: ["campaignId", "status"],
      where: { userId },
      _count: true
    });

    // Get recent activities (last 10)
    const recentActivities = await db.messageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        toPhone: true,
        status: true,
        content: true,
        createdAt: true,
        campaign: {
          select: { name: true }
        },
        customer: {
          select: { name: true }
        }
      }
    });

    // Format campaign progress
    const campaignProgress = campaignStats.reduce((acc: any, stat: any) => {
      if (!acc[stat.campaignId]) {
        acc[stat.campaignId] = { sent: 0, total: 0 };
      }
      acc[stat.campaignId].total += stat._count;
      if (stat.status === "DELIVERED") {
        acc[stat.campaignId].sent += stat._count;
      }
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalCampaigns,
          messagesSent,
          activeAutomations
        },
        campaignProgress,
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          toPhone: activity.toPhone,
          status: activity.status,
          content: activity.content.substring(0, 100) + "...", // Truncate for display
          timestamp: activity.createdAt,
          campaignName: activity.campaign?.name || "N/A",
          customerName: activity.customer?.name || "N/A"
        })),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
