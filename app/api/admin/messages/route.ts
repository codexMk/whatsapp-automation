import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { canViewAnalytics } from "@/lib/auth/permissions";
export const dynamic = "force-dynamic";

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

    if (!canViewAnalytics(currentUser?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily"; // daily, monthly, weekly
    const userId_ = searchParams.get("userId");

    // Calculate date range
    let startDate = new Date();
    if (period === "daily") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "weekly") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate.setDate(1);
    }

    const where: Prisma.MessageLogWhereInput = {
      createdAt: { gte: startDate },
      ...(userId_ ? { userId: userId_ } : {})
    };

    const [totalMessages, messagesByStatus, messagesByTemplate, messagesByUser] = await Promise.all([
      db.messageLog.count({ where }),
      db.messageLog.groupBy({
        by: ["status"],
        _count: {
          _all: true
        },
        where
      }),
      db.messageLog.groupBy({
        by: ["templateId"],
        _count: {
          _all: true
        },
        where,
        orderBy: {
          _count: {
            templateId: "desc"
          }
        },
        take: 10
      }),
      db.messageLog.groupBy({
        by: ["userId"],
        _count: {
          _all: true
        },
        where,
        orderBy: {
          _count: {
            userId: "desc"
          }
        },
        take: 10
      })
    ]);

    const templateIds = messagesByTemplate
      .map((messageGroup) => messageGroup.templateId)
      .filter((templateId): templateId is string => Boolean(templateId));

    const templates = templateIds.length
      ? await db.template.findMany({
          where: { id: { in: templateIds } },
          select: { id: true, name: true }
        })
      : [];

    const templateNameById = new Map(templates.map((template) => [template.id, template.name]));

    return NextResponse.json({
      messages: {
        period,
        totalMessages,
        byStatus: messagesByStatus.map((messageGroup) => ({
          status: messageGroup.status,
          count: messageGroup._count._all
        })),
        byCategory: messagesByTemplate.map((messageGroup) => ({
          templateId: messageGroup.templateId,
          templateName: messageGroup.templateId
            ? (templateNameById.get(messageGroup.templateId) ?? "Deleted Template")
            : "Unassigned Template",
          count: messageGroup._count._all
        })),
        byUser: messagesByUser.map((messageGroup) => ({
          userId: messageGroup.userId,
          count: messageGroup._count._all
        }))
      }
    });
  } catch (error) {
    console.error("[ADMIN-MESSAGES] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch message data" },
      { status: 500 }
    );
  }
}
