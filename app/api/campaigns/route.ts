import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-server";
import { campaignInputSchema, createCampaignWithLogs, listCampaigns } from "@/lib/campaigns";
export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaigns = await listCampaigns(userId);
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = campaignInputSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const campaign = await createCampaignWithLogs(userId, parseResult.data);
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Failed to create campaign" },
      { status: 400 }
    );
  }
}

