// Plan configuration
export const PLANS = {
  starter: { quota: 100 },
  growth: { quota: 1000 },
  pro: { quota: 10000 }
} as const;

export type PlanName = keyof typeof PLANS;

import { db } from "./db";

export async function getUserPlan(userId: string): Promise<PlanName> {
  // TODO: Replace with real user plan lookup if/when implemented
  // For now, default all users to 'starter'
  return "starter";
}

export async function getUserUsage(userId: string) {
  const count = await db.messageLog.count({ where: { userId } });
  const plan = await getUserPlan(userId);
  const quota = PLANS[plan].quota;
  return {
    used: count,
    remaining: Math.max(0, quota - count),
    quota,
    plan
  };
}

export async function checkUserQuota(userId: string) {
  const usage = await getUserUsage(userId);
  if (usage.used >= usage.quota) {
    throw new Error("Message quota exceeded for your plan");
  }
  return usage;
}
