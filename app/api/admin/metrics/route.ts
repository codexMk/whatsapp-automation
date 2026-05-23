import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session-server";
import { db } from "@/lib/db";
import { calculateExtraCost, calculateUsagePercentage } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  try {
    // Validate admin session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { role: true }
    });

    if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get all users with their usage data
    const allUsers = await db.user.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        email: true,
        messagesUsedThisMonth: true,
        extraMessagesUsed: true,
        createdAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            messageLimit: true,
            price: true,
            // extraMessagePrice removed: field not present on PlanSelect
          }
        }
      }
    });

    // Calculate platform metrics
    let totalActiveUsers = allUsers.length;
    let totalMessagesUsed = 0;
    let totalRevenue = 0;
    let usersExceededLimit = 0;
    let usersNearLimit = 0;
    let totalExtraCost = 0;

    const usersByPlan: Record<string, number> = {};

    allUsers.forEach(u => {
      // Count users by plan
      const planName = u.plan?.name || "No Plan";
      usersByPlan[planName] = (usersByPlan[planName] || 0) + 1;

      // Count messages
      totalMessagesUsed += u.messagesUsedThisMonth;

      // Calculate usage percentage
      const messageLimit = u.plan?.messageLimit || 0;
      const usagePercentage = calculateUsagePercentage(u.messagesUsedThisMonth, messageLimit);

      if (usagePercentage >= 100) {
        usersExceededLimit++;
      }
      if (usagePercentage >= 80 && usagePercentage < 100) {
        usersNearLimit++;
      }

      // Calculate revenue from subscription + extra messages
      if (u.plan) {
        totalRevenue += u.plan.price;
        const extraCost = calculateExtraCost(u.extraMessagesUsed, u.plan.extraMessagePrice);
        totalExtraCost += extraCost;
        totalRevenue += extraCost;
      }
    });

    // Get plan details with user counts
    const plansData = await db.plan.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        price: true,
        messageLimit: true,
        _count: {
          select: { users: true }
        }
      }
    });

    const plansWithUsers = plansData.map(plan => ({
      name: plan.name,
      price: plan.price,
      messageLimit: plan.messageLimit,
      userCount: plan._count.users
    }));

    // Calculate MRR (Monthly Recurring Revenue) from plans
    const plannedMRR = plansWithUsers.reduce(
      (sum, plan) => sum + (plan.price * plan.userCount),
      0
    );

    // Average messages per user
    const avgMessagesPerUser = totalActiveUsers > 0 ? Math.round(totalMessagesUsed / totalActiveUsers) : 0;

    return NextResponse.json({
      success: true,
      data: {
        platformMetrics: {
          totalActiveUsers,
          totalMessagesUsed,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalExtraCost: Math.round(totalExtraCost * 100) / 100,
          plannedMRR: Math.round(plannedMRR * 100) / 100,
          avgMessagesPerUser,
          usersExceededLimit,
          usersNearLimit
        },
        usersByPlan: usersByPlan,
        planDetails: plansWithUsers
      }
    });
  } catch (error) {
    console.error("[ADMIN_METRICS_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
