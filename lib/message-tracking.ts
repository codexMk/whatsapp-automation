/**
 * Message Usage Tracking Utility
 * Functions to track and manage user message usage
 */

import { db } from "@/lib/db";
import { calculateExtraCost, getPlanById, PRICING_PLANS } from "@/lib/pricing";

export interface TrackMessageParams {
  userId: string;
  allowOverage?: boolean; // If false, reject sending when limit exceeded
}

export interface TrackMessageResult {
  allowed: boolean;
  reason?: string;
  currentUsage: number;
  messageLimit: number;
  remainingMessages: number;
  extraCost?: number;
}

/**
 * Track a sent message for a user
 * Increments their message count and calculates extra cost if applicable
 */
export async function trackMessageUsage(
  params: TrackMessageParams
): Promise<TrackMessageResult> {
  const { userId, allowOverage = true } = params;

  try {
    // Get user with plan
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        messagesUsedThisMonth: true,
        extraMessagesUsed: true,
        lastMessageResetDate: true,
        plan: {
          select: {
            messageLimit: true,
            extraMessagePrice: true
          }
        }
      }
    });

    if (!user) {
      return {
        allowed: false,
        reason: "User not found",
        currentUsage: 0,
        messageLimit: 0,
        remainingMessages: 0
      };
    }

    if (!user.plan) {
      return {
        allowed: false,
        reason: "User has no active plan",
        currentUsage: user.messagesUsedThisMonth,
        messageLimit: 0,
        remainingMessages: 0
      };
    }

    // Check if we need to reset monthly counter
    const now = new Date();
    const lastReset = new Date(user.lastMessageResetDate);
    const needsReset =
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    let currentUsage = user.messagesUsedThisMonth;
    let extraUsed = user.extraMessagesUsed;

    if (needsReset) {
      // Reset monthly counter
      await db.user.update({
        where: { id: userId },
        data: {
          messagesUsedThisMonth: 0,
          extraMessagesUsed: 0,
          estimatedExtraCost: 0,
          lastMessageResetDate: now
        }
      });
      currentUsage = 0;
      extraUsed = 0;
    }

    // Check if within limit
    const messageLimit = user.plan.messageLimit;
    const withinLimit = currentUsage < messageLimit;

    if (!withinLimit && !allowOverage) {
      return {
        allowed: false,
        reason: "Message limit exceeded",
        currentUsage,
        messageLimit,
        remainingMessages: 0
      };
    }

    // Calculate new usage
    let newUsage = currentUsage + 1;
    let newExtraUsed = extraUsed;

    if (newUsage > messageLimit) {
      newExtraUsed = (newUsage - messageLimit) || extraUsed + 1;
    }

    const estimatedCost = calculateExtraCost(newExtraUsed, user.plan.extraMessagePrice);

    // Update user message count
    await db.user.update({
      where: { id: userId },
      data: {
        messagesUsedThisMonth: newUsage,
        extraMessagesUsed: newExtraUsed,
        estimatedExtraCost: estimatedCost
      }
    });

    // Calculate remaining
    const remainingMessages = Math.max(0, messageLimit - newUsage);

    return {
      allowed: true,
      currentUsage: newUsage,
      messageLimit,
      remainingMessages,
      extraCost: estimatedCost
    };
  } catch (error) {
    console.error("[TRACK_MESSAGE_USAGE] Error:", error);
    return {
      allowed: false,
      reason: "Error tracking message usage",
      currentUsage: 0,
      messageLimit: 0,
      remainingMessages: 0
    };
  }
}

/**
 * Get current usage for a user
 */
export async function getUserUsage(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        messagesUsedThisMonth: true,
        extraMessagesUsed: true,
        estimatedExtraCost: true,
        lastMessageResetDate: true,
        plan: {
          select: {
            messageLimit: true,
            extraMessagePrice: true
          }
        }
      }
    });

    if (!user?.plan) return null;

    const messageLimit = user.plan.messageLimit;
    const remainingMessages = Math.max(0, messageLimit - user.messagesUsedThisMonth);

    return {
      messagesUsedThisMonth: user.messagesUsedThisMonth,
      messageLimit,
      remainingMessages,
      extraMessagesUsed: user.extraMessagesUsed,
      estimatedExtraCost: user.estimatedExtraCost,
      lastMessageResetDate: user.lastMessageResetDate
    };
  } catch (error) {
    console.error("[GET_USER_USAGE] Error:", error);
    return null;
  }
}

/**
 * Manually reset user's monthly usage
 * Call at the start of each month for all users
 */
export async function resetMonthlyUsage(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        messagesUsedThisMonth: 0,
        extraMessagesUsed: 0,
        estimatedExtraCost: 0,
        lastMessageResetDate: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error("[RESET_MONTHLY_USAGE] Error:", error);
    return false;
  }
}

/**
 * Reset monthly usage for all users (call monthly)
 */
export async function resetAllMonthlyUsage() {
  try {
    const now = new Date();
    const result = await db.user.updateMany({
      data: {
        messagesUsedThisMonth: 0,
        extraMessagesUsed: 0,
        estimatedExtraCost: 0,
        lastMessageResetDate: now
      }
    });
    console.log(`✅ Reset usage for ${result.count} users`);
    return result.count;
  } catch (error) {
    console.error("[RESET_ALL_MONTHLY_USAGE] Error:", error);
    return 0;
  }
}

/**
 * Assign or update user's plan
 */
export async function assignPlanToUser(userId: string, planId: string) {
  try {
    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return { success: false, error: "Plan not found" };
    }

    await db.user.update({
      where: { id: userId },
      data: {
        planId,
        messagesUsedThisMonth: 0,
        extraMessagesUsed: 0,
        estimatedExtraCost: 0,
        lastMessageResetDate: new Date()
      }
    });

    return { success: true, plan };
  } catch (error) {
    console.error("[ASSIGN_PLAN_TO_USER] Error:", error);
    return { success: false, error: "Failed to assign plan" };
  }
}
