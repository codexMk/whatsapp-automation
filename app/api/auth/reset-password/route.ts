import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendPasswordChangedEmail } from "@/lib/email-service";
import crypto from "crypto";
export const dynamic = "force-dynamic";

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { token, password } = parseResult.data;

    console.log("[RESET_PASSWORD] Processing password reset with token");

    // Hash the token to match what's stored in database
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching reset token
    const user = await db.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetTokenExpiresAt: {
          gt: new Date() // Token must not be expired
        }
      }
    });

    if (!user) {
      console.log("[RESET_PASSWORD] Invalid or expired token");
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    console.log("[RESET_PASSWORD] Valid token found for user:", user.email);

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password and clear reset token
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null
      }
    });

    console.log("[RESET_PASSWORD] Password updated for user:", user.email);

    // Send confirmation email
    await sendPasswordChangedEmail(user.email);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. Please log in with your new password."
    });
  } catch (error) {
    console.error("[RESET_PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
