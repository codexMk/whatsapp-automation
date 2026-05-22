import { db } from "./db";
import { AutomationTrigger } from "@prisma/client";

export async function getAutomations(userId: string) {
  return db.automation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function createAutomation(userId: string, data: {
  name: string;
  description?: string;
  enabled?: boolean;
  triggerType?: AutomationTrigger;
}) {
  return db.automation.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      enabled: data.enabled ?? false,
      triggerType: data.triggerType ?? AutomationTrigger.NEW_CUSTOMER
    }
  });
}

export async function updateAutomation(
  userId: string,
  automationId: string,
  data: {
    name?: string;
    description?: string;
    enabled?: boolean;
    triggerType?: AutomationTrigger;
  }
) {
  const existing = await db.automation.findFirst({
    where: { id: automationId, userId }
  });

  if (!existing) {
    return null;
  }

  return db.automation.update({
    where: { id: automationId },
    data
  });
}

export async function toggleAutomation(userId: string, automationId: string, enabled: boolean) {
  const existing = await db.automation.findFirst({
    where: { id: automationId, userId }
  });

  if (!existing) {
    return null;
  }

  return db.automation.update({
    where: { id: automationId },
    data: { enabled }
  });
}
