import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOTPExpired } from "@/lib/otp-utils";
import { sendVerificationConfirmationEmail } from "@/lib/email-service";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, userId } = body;

    if (!email || !otp || !userId) {
      return NextResponse.json(
        { error: "Email, OTP, and userId are required" },
        { status: 400 }
      );
    }

    // Find the OTP verification record
    const otpRecord = await db.oTPVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        type: "EMAIL",
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
      data: { emailVerified: true }
    });

    // Send confirmation email
    await sendVerificationConfirmationEmail(email, user.name || "User");

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("[VERIFY_EMAIL_OTP] Error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
