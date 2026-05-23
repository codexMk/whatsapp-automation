import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOTP, getOTPExpiryTime, validateIndianPhone, normalizeIndianPhone } from "@/lib/otp-utils";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, userId } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!validateIndianPhone(phone)) {
      return NextResponse.json(
        { error: "Only Indian phone numbers (+91) are supported" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Normalize phone number
    const normalizedPhone = normalizeIndianPhone(phone);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiryTime(5); // 5 minutes

    // Clear any existing OTP for this phone
    await db.oTPVerification.deleteMany({
      where: {
        phone: normalizedPhone,
        type: "PHONE",
        userId
      }
    });

    // Store OTP
    await db.oTPVerification.create({
      data: {
        userId,
        phone: normalizedPhone,
        otp,
        type: "PHONE",
        expiresAt
      }
    });

    // Mock SMS: Log OTP to console
    // In production, integrate with SMS provider like Twilio, AWS SNS, etc.
    console.log(`📱 [MOCK SMS] OTP for ${normalizedPhone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your phone",
      phone: normalizedPhone,
      // In development, optionally return OTP for testing (remove in production)
      ...(process.env.NODE_ENV === "development" && { otp })
    });
  } catch (error) {
    console.error("[SEND_PHONE_OTP] Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
