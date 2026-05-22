import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUserId } from "@/lib/session-server";
import { campaignStatusSchema, getCampaignById, updateCampaignStatus } from "@/lib/campaigns";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaign = await getCampaignById(userId, params.id);
  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ campaign });
}

const statusBodySchema = z.object({
  status: campaignStatusSchema
});

export async function PATCH(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = statusBodySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await updateCampaignStatus(userId, params.id, parseResult.data.status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ campaign: updated });
}

