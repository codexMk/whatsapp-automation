import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';
export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard/insights
 * Returns PLATFORM-WIDE dashboard metrics (admin only)
 * This endpoint should ONLY be accessible to SUPER_ADMIN and ADMIN users
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wa_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch ALL metrics (platform-wide, not user-specific)
    const [
      totalCustomers,
      totalCampaigns,
      messagesToday,
      messagesThisMonth,
      activeAutomations,
      messageStats,
      recentActivity,
    ] = await Promise.all([
      // Total customers (all users)
      db.customer.count({}),

      // Total campaigns (all users)
      db.campaign.count({}),

      // Messages sent today (all users)
      db.messageLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Messages sent this month (all users)
      db.messageLog.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Active automations (all users)
      db.automation.count({
        where: {
          enabled: true,
        },
      }),

      // Message success rate and stats (all users)
      db.messageLog.findMany({
        select: { status: true },
        orderBy: { createdAt: 'desc' },
        take: 1000, // Sample last 1000 messages for success rate
      }),

      // Recent activity timeline (last 10 events, all users)
      db.messageLog.findMany({
        select: {
          id: true,
          createdAt: true,
          status: true,
          content: true,
          toPhone: true,
          customer: {
            select: { name: true, phone: true },
          },
          campaign: {
            select: { name: true },
          },
          automation: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Calculate success rate
    const successCount = messageStats.filter(
      (m) => m.status === 'SENT' || m.status === 'DELIVERED'
    ).length;
    const successRate =
      messageStats.length > 0
        ? Math.round((successCount / messageStats.length) * 100)
        : 0;

    // Calculate message breakdown
    const messageBreakdown = messageStats.reduce(
      (acc, msg) => {
        const status = msg.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Format activity timeline
    const activityTimeline = recentActivity.map((entry) => ({
      id: entry.id,
      timestamp: entry.createdAt,
      type: 'message_sent',
      status: entry.status,
      description: `Message sent to ${entry.customer?.name || entry.toPhone}`,
      details: {
        phone: entry.toPhone,
        customerName: entry.customer?.name,
        campaignName: entry.campaign?.name,
        automationName: entry.automation?.name,
        preview: entry.content.substring(0, 60) + (entry.content.length > 60 ? '...' : ''),
      },
    }));

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalCampaigns,
        messagesToday,
        messagesThisMonth,
        activeAutomations,
        successRate,
      },
      messageBreakdown,
      activityTimeline,
      summary: {
        hasCustomers: totalCustomers > 0,
        hasCampaigns: totalCampaigns > 0,
        hasActivity: activityTimeline.length > 0,
      },
    });
  } catch (error) {
    console.error('[DASHBOARD-INSIGHTS]', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}
