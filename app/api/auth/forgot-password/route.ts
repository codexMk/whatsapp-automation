import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email-service";
import crypto from "crypto";
export const dynamic = "force-dynamic";

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = forgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = parseResult.data;
    const normalizedEmail = email.trim().toLowerCase();

    console.log("[FORGOT_PASSWORD] Request for email:", normalizedEmail);

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: normalizedEmail }
    });

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log("[FORGOT_PASSWORD] User not found:", normalizedEmail);
      return NextResponse.json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent."
      });
    }

    // Check if user account is active
    if (user.status !== "ACTIVE") {
      console.log("[FORGOT_PASSWORD] Account not active:", normalizedEmail);
      return NextResponse.json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    // Save reset token to database
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
        passwordResetTokenExpiresAt: expiresAt
      }
    });

    // Send reset email with token
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, 30);

    if (!emailSent) {
      console.error("[FORGOT_PASSWORD] Failed to send email to:", user.email);
      // Even if email fails, we return success to not reveal if email service is down
    } else {
      console.log("[FORGOT_PASSWORD] Reset email sent to:", user.email);
    }

    return NextResponse.json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent."
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
