import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/session-server";
import { db } from "@/lib/db";
import { calculateRemainingMessages, calculateUsagePercentage, calculateExtraCost, getPlanById } from "@/lib/pricing";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Validate user session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user with plan
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        planId: true,
        messagesUsedThisMonth: true,
        extraMessagesUsed: true,
        estimatedExtraCost: true,
        lastMessageResetDate: true,
        plan: {
          select: {
            name: true,
            messageLimit: true,
            extraMessagePrice: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate derived metrics
    const messageLimit = user.plan?.messageLimit || 0;
    const remainingMessages = calculateRemainingMessages(user.messagesUsedThisMonth, messageLimit);
    const usagePercentage = calculateUsagePercentage(user.messagesUsedThisMonth, messageLimit);
    const extraMessagePrice = user.plan?.extraMessagePrice || 0;
    const estimatedCost = calculateExtraCost(user.extraMessagesUsed, extraMessagePrice);

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        planName: user.plan?.name || "No Plan",
        messagesUsedThisMonth: user.messagesUsedThisMonth,
        messageLimit,
        remainingMessages,
        usagePercentage,
        extraMessagesUsed: user.extraMessagesUsed,
        estimatedExtraCost: estimatedCost,
        extraMessagePrice,
        lastMessageResetDate: user.lastMessageResetDate
      }
    });
  } catch (error) {
    console.error("[USER_USAGE_GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
