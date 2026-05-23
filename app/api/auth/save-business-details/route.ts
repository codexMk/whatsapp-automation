import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateSession } from "@/lib/session-server";
import { sendBusinessVerifiedEmail } from "@/lib/email-service";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Validate session
    const session = await validateSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { businessName, ownerName, category, address, phone, whatsappNumber } = body;

    // Validate required fields
    if (!businessName || !ownerName || !category || !address || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update user with business details
    const user = await db.user.update({
      where: { id: session.userId },
      data: {
        businessName,
        ownerName,
        category,
        address,
        phone,
        whatsappNumber,
        isBusinessVerified: true
      }
    });

    // Send confirmation email
    await sendBusinessVerifiedEmail(user.email, businessName);

    return NextResponse.json({
      success: true,
      message: "Business verified successfully",
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        ownerName: user.ownerName,
        category: user.category,
        isBusinessVerified: user.isBusinessVerified
      }
    });
  } catch (error) {
    console.error("[SAVE_BUSINESS_DETAILS] Error:", error);
    return NextResponse.json(
      { error: "Failed to save business details" },
      { status: 500 }
    );
  }
}
