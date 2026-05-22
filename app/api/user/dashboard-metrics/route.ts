import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';
import { getRecommendedTemplatesLimited } from '@/lib/default-templates';

/**
 * GET /api/user/dashboard-metrics
 * Returns user-specific dashboard metrics (NOT platform-wide)
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

    const userId = payload.userId;

    // Fetch user's own metrics only (not platform-wide)
    const [
      totalCustomers,
      totalCampaigns,
      messagesToday,
      messagesThisMonth,
      activeAutomations,
      messageStats,
      recentActivity,
      hasMessageLog,
      hasEnabledAutomation,
      userSettings,
    ] = await Promise.all([
      // User's customers
      db.customer.count({ where: { userId } }),

      // User's campaigns
      db.campaign.count({ where: { userId } }),

      // User's messages today
      db.messageLog.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // User's messages this month
      db.messageLog.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // User's active automations
      db.automation.count({
        where: {
          userId,
          enabled: true,
        },
      }),

      // User's message success rate
      db.messageLog.findMany({
        where: { userId },
        select: { status: true },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),

      // User's recent activity
      db.messageLog.findMany({
        where: { userId },
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

      // Check if user has sent any messages (for onboarding)
      db.messageLog.findFirst({
        where: { userId },
        select: { id: true },
      }),

      // Check if user has enabled any automation (for onboarding)
      db.automation.findFirst({
        where: { userId, enabled: true },
        select: { id: true },
      }),

      // Fetch user's business settings (for recommendations)
      db.businessSettings.findUnique({
        where: { userId },
        select: { industry: true },
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

    // Build onboarding checklist
    const onboardingChecklist = [
      {
        id: 'add-customer',
        label: 'Add first customer',
        description: 'Upload or create your first customer contact',
        icon: '👥',
        completed: totalCustomers > 0,
        actionLabel: 'Add Customer',
        actionPath: '/dashboard/customers',
      },
      {
        id: 'create-campaign',
        label: 'Create first campaign',
        description: 'Set up a campaign to send messages to customers',
        icon: '📢',
        completed: totalCampaigns > 0,
        actionLabel: 'Create Campaign',
        actionPath: '/dashboard/campaigns',
      },
      {
        id: 'send-message',
        label: 'Send first message',
        description: 'Send a test message to verify everything works',
        icon: '💬',
        completed: !!hasMessageLog,
        actionLabel: 'Send Message',
        actionPath: '/dashboard/campaigns',
      },
      {
        id: 'enable-automation',
        label: 'Enable first automation',
        description: 'Set up automation to send messages automatically',
        icon: '⚙️',
        completed: !!hasEnabledAutomation,
        actionLabel: 'Enable Automation',
        actionPath: '/dashboard/automations',
      },
    ];

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalCampaigns,
        messagesToday,
        messagesThisMonth,
        activeAutomations,
        successRate,
      },
      activityTimeline,
      summary: {
        hasCustomers: totalCustomers > 0,
        hasCampaigns: totalCampaigns > 0,
        hasActivity: activityTimeline.length > 0,
      },
      onboarding: {
        checklist: onboardingChecklist,
      },
      recommendations: {
        templates: getRecommendedTemplatesLimited(userSettings?.industry, 6),
      },
    });
  } catch (error) {
    console.error('[USER-DASHBOARD]', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
