import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session-server";
import { db } from "@/lib/db";
import { calculateRemainingMessages, calculateUsagePercentage, calculateExtraCost } from "@/lib/pricing";

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

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const planFilter = searchParams.get("plan");
    const highUsageOnly = searchParams.get("highUsage") === "true";
    const exceededOnly = searchParams.get("exceeded") === "true";

    // Build filters
    let where: any = {};

    if (planFilter) {
      where.plan = {
        name: planFilter
      };
    }

    // Fetch all users with their usage data
    let users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        role: true,
        messagesUsedThisMonth: true,
        extraMessagesUsed: true,
        createdAt: true,
        plan: {
          select: {
            id: true,
            name: true,
            messageLimit: true,
            extraMessagePrice: true
          }
        }
      },
      orderBy: { messagesUsedThisMonth: "desc" }
    });

    // Process and filter users
    const processedUsers = users.map(u => {
      const messageLimit = u.plan?.messageLimit || 0;
      const remainingMessages = calculateRemainingMessages(u.messagesUsedThisMonth, messageLimit);
      const usagePercentage = calculateUsagePercentage(u.messagesUsedThisMonth, messageLimit);
      const extraMessagePrice = u.plan?.extraMessagePrice || 0;
      const estimatedCost = calculateExtraCost(u.extraMessagesUsed, extraMessagePrice);

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        businessName: u.businessName,
        role: u.role,
        planName: u.plan?.name || "No Plan",
        messagesUsedThisMonth: u.messagesUsedThisMonth,
        messageLimit,
        remainingMessages,
        usagePercentage,
        extraMessagesUsed: u.extraMessagesUsed,
        estimatedExtraCost: estimatedCost,
        joinedDate: u.createdAt
      };
    });

    // Apply additional filters
    let filteredUsers = processedUsers;

    if (highUsageOnly) {
      filteredUsers = filteredUsers.filter(u => u.usagePercentage >= 80);
    }

    if (exceededOnly) {
      filteredUsers = filteredUsers.filter(u => u.usagePercentage >= 100);
    }

    // Calculate summary stats
    const totalUsers = filteredUsers.length;
    const totalMessagesUsed = filteredUsers.reduce((sum, u) => sum + u.messagesUsedThisMonth, 0);
    const usersExceeded = filteredUsers.filter(u => u.usagePercentage >= 100).length;
    const usersNearLimit = filteredUsers.filter(u => u.usagePercentage >= 80 && u.usagePercentage < 100).length;
    const totalExtraCost = filteredUsers.reduce((sum, u) => sum + u.estimatedExtraCost, 0);

    return NextResponse.json({
      success: true,
      data: {
        users: filteredUsers,
        summary: {
          totalUsers,
          totalMessagesUsed,
          usersExceeded,
          usersNearLimit,
          totalEstimatedExtraCost: Math.round(totalExtraCost * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error("[ADMIN_USER_USAGE_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user usage data" },
      { status: 500 }
    );
  }
}
