import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSession } from "@/lib/session-server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user with all settings
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        category: true,
        whatsappNumber: true,
        ownerName: true,
        address: true,
        phone: true,
        emailVerified: true,
        phoneVerified: true,
        isBusinessVerified: true,
        settings: {
          select: {
            timezone: true
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

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        businessName: user.businessName,
        category: user.category,
        whatsappNumber: user.whatsappNumber,
        ownerName: user.ownerName,
        address: user.address,
        phone: user.phone,
        timezone: user.settings?.timezone || "Asia/Kolkata",
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        isBusinessVerified: user.isBusinessVerified
      }
    });
  } catch (error) {
    console.error("[GET_SETTINGS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { businessName, category, whatsappNumber, timezone } = body;

    // Update user profile
    const user = await db.user.update({
      where: { id: session.userId },
      data: {
        ...(businessName && { businessName }),
        ...(category && { category }),
        ...(whatsappNumber && { whatsappNumber })
      }
    });

    // Update or create business settings (for timezone)
    if (timezone) {
      await db.businessSettings.upsert({
        where: { userId: session.userId },
        create: {
          userId: session.userId,
          timezone,
          businessName: businessName || user.businessName,
          whatsappNumber: whatsappNumber || user.whatsappNumber
        },
        update: {
          timezone,
          ...(businessName && { businessName }),
          ...(whatsappNumber && { whatsappNumber })
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
      data: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        category: user.category,
        whatsappNumber: user.whatsappNumber,
        timezone: timezone || "Asia/Kolkata"
      }
    });
  } catch (error) {
    console.error("[POST_SETTINGS] Error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
