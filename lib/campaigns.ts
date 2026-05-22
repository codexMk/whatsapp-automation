import { z } from "zod";
import { CampaignStatus } from "@prisma/client";
import { db } from "./db";

export const campaignInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateId: z.string().cuid(),
  customerIds: z.array(z.string().cuid()).min(1)
});

export const campaignStatusSchema = z.nativeEnum(CampaignStatus);

export type CampaignInput = z.infer<typeof campaignInputSchema>;

export async function listCampaigns(userId: string) {
  return db.campaign.findMany({
    where: { userId },
    include: {
      template: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getCampaignById(userId: string, id: string) {
  return db.campaign.findFirst({
    where: { id, userId },
    include: {
      template: true,
      messageLogs: true
    }
  });
}

export async function createCampaignWithLogs(userId: string, input: CampaignInput) {
  const data = campaignInputSchema.parse(input);

  const [template, customers] = await Promise.all([
    db.template.findFirst({
      where: { id: data.templateId, userId }
    }),
    db.customer.findMany({
      where: { id: { in: data.customerIds }, userId }
    })
  ]);

  if (!template) {
    throw new Error("Template not found for this user");
  }
  if (customers.length === 0) {
    throw new Error("No valid customers selected");
  }

  const campaign = await db.$transaction(async (tx) => {
    const createdCampaign = await tx.campaign.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        status: CampaignStatus.DRAFT,
        templateId: template.id
      }
    });

    await tx.messageLog.createMany({
      data: customers.map((customer) => ({
        userId,
        customerId: customer.id,
        campaignId: createdCampaign.id,
        templateId: template.id,
        toPhone: customer.phone,
        content: template.content,
        status: "PENDING"
      }))
    });

    return createdCampaign;
  });

  return campaign;
}

export async function updateCampaignStatus(
  userId: string,
  id: string,
  status: CampaignStatus
) {
  const existing = await db.campaign.findFirst({
    where: { id, userId }
  });

  if (!existing) {
    return null;
  }

  const updated = await db.campaign.update({
    where: { id },
    data: { status }
  });

  return updated;
}

