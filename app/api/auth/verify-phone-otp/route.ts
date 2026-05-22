import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOTPExpired, normalizeIndianPhone } from "@/lib/otp-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, userId } = body;

    if (!phone || !otp || !userId) {
      return NextResponse.json(
        { error: "Phone, OTP, and userId are required" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = normalizeIndianPhone(phone);

    // Find the OTP verification record
    const otpRecord = await db.oTPVerification.findFirst({
      where: {
        phone: normalizedPhone,
        type: "PHONE",
        userId,
        verified: false
      }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "OTP not found or already verified" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await db.oTPVerification.delete({ where: { id: otpRecord.id } });
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp.toString()) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await db.oTPVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true }
    });

    // Update user
    const user = await db.user.update({
      where: { id: userId },
      data: {
        phone: normalizedPhone,
        phoneVerified: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    console.error("[VERIFY_PHONE_OTP] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
