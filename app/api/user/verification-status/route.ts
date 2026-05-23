import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSession } from "@/lib/session-server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Validate session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user verification status
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        phoneVerified: true,
        isBusinessVerified: true,
        businessName: true,
        ownerName: true,
        category: true,
        phone: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate verification status
    const isFullyVerified =
      user.emailVerified && user.phoneVerified && user.isBusinessVerified;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email
        },
        verification: {
          email: user.emailVerified,
          phone: user.phoneVerified,
          business: user.isBusinessVerified,
          fullyVerified: isFullyVerified
        },
        businessDetails: {
          businessName: user.businessName,
          ownerName: user.ownerName,
          category: user.category,
          phone: user.phone
        },
        nextStep: !isFullyVerified
          ? !user.emailVerified
            ? "EMAIL_VERIFICATION"
            : !user.phoneVerified
            ? "PHONE_VERIFICATION"
            : "BUSINESS_VERIFICATION"
          : null
      }
    });
  } catch (error) {
    console.error("[VERIFICATION_STATUS] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verification status" },
      { status: 500 }
    );
  }
}
