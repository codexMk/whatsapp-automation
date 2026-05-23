import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOTP, getOTPExpiryTime, validateEmail } from "@/lib/otp-utils";
import { sendOTPEmail } from "@/lib/email-service";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiryTime(5); // 5 minutes

    // Clear any existing OTP for this email
    await db.oTPVerification.deleteMany({
      where: {
        email: email.toLowerCase(),
        type: "EMAIL"
      }
    });

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Create new user (will be completed during signup)
      user = await db.user.create({
        data: {
          email: email.toLowerCase(),
          password: "", // Temporary, will be set during signup
          emailVerified: false,
          phoneVerified: false
        }
      });
    }

    // Store OTP
    await db.oTPVerification.create({
      data: {
        userId: user.id,
        email: email.toLowerCase(),
        otp,
        type: "EMAIL",
        expiresAt
      }
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      userId: user.id
    });
  } catch (error) {
    console.error("[SEND_EMAIL_OTP] Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
