import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CampaignStatus, Prisma } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { canViewAllCampaigns } from "@/lib/auth/permissions";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!canViewAllCampaigns(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const statusParam = searchParams.get("status");
    const status = Object.values(CampaignStatus).find((value) => value === statusParam);

    const skip = (page - 1) * limit;

    const where: Prisma.CampaignWhereInput = status ? { status } : {};

    const [campaigns, total] = await Promise.all([
      db.campaign.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, businessName: true }
          },
          template: {
            select: { id: true, name: true }
          },
          messageLogs: {
            select: { status: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      db.campaign.count({ where })
    ]);

    return NextResponse.json({
      campaigns: campaigns.map((campaign) => ({
        ...campaign,
        messageStats: {
          total: campaign.messageLogs.length,
          sent: campaign.messageLogs.filter((messageLog) => messageLog.status === "SENT").length,
          failed: campaign.messageLogs.filter((messageLog) => messageLog.status === "FAILED").length
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("[ADMIN-CAMPAIGNS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId }
    });

    if (!canViewAllCampaigns(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { campaignId, action } = body;

    if (!campaignId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action === "suspend") {
      await db.campaign.update({
        where: { id: campaignId },
        data: { status: "DRAFT" }
      });
    }

    return NextResponse.json({ message: `Campaign ${action} successful` });
  } catch (error) {
    console.error("[ADMIN-CAMPAIGNS] Action error:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
