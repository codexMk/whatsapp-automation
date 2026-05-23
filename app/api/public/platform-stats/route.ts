import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Count total messages sent
    const totalMessages = await db.messageLog.count({
      where: {
        status: { in: ["SENT", "DELIVERED"] }
      }
    });

    // Count delivered messages for delivery rate
    const deliveredMessages = await db.messageLog.count({
      where: {
        status: "DELIVERED"
      }
    });

    // Count total messages ever sent (for delivery rate denominator)
    const totalMessagesSent = await db.messageLog.count({
      where: {
        status: { in: ["SENT", "DELIVERED", "FAILED", "PENDING"] }
      }
    });

    // Count active users (users with at least one campaign or automation in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeUsers = await db.user.count({
      where: {
        OR: [
          {
            campaigns: {
              some: {
                createdAt: { gte: thirtyDaysAgo }
              }
            }
          },
          {
            automations: {
              some: {
                createdAt: { gte: thirtyDaysAgo }
              }
            }
          },
          {
            messageLogs: {
              some: {
                createdAt: { gte: thirtyDaysAgo }
              }
            }
          }
        ]
      }
    });

    // Count all active campaigns
    const activeCampaigns = await db.campaign.count({
      where: {
        status: { in: ["SENT", "SCHEDULED"] }
      }
    });

    // Calculate delivery rate
    const deliveryRate = totalMessagesSent > 0 
      ? Math.round((deliveredMessages / totalMessagesSent) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalMessagesSent: totalMessages,
        totalActiveBusinesses: activeUsers,
        deliveryRate: deliveryRate,
        totalCampaigns: activeCampaigns,
        activeUsers: activeUsers,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("[PLATFORM_STATS] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch platform statistics",
        data: {
          totalMessagesSent: 0,
          totalActiveBusinesses: 0,
          deliveryRate: 0,
          totalCampaigns: 0,
          activeUsers: 0,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// Cache stats for 30 seconds to avoid database overload
export const revalidate = 30;
