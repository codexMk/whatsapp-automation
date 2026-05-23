import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { validateSession } from "@/lib/session-server";
import { sendPasswordChangedEmail } from "@/lib/email-service";
export const dynamic = "force-dynamic";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

export async function POST(request: Request) {
  try {
    // Validate session - user must be logged in
    const session = await validateSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const parseResult = changePasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;

    console.log("[CHANGE_PASSWORD] Request from user:", session.email);

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      console.log("[CHANGE_PASSWORD] User not found:", session.userId);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const passwordValid = await verifyPassword(currentPassword, user.password);
    if (!passwordValid) {
      console.log("[CHANGE_PASSWORD] Invalid current password for user:", user.email);
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log("[CHANGE_PASSWORD] Password changed for user:", user.email);

    // Send confirmation email
    await sendPasswordChangedEmail(user.email);

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("[CHANGE_PASSWORD] Error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
