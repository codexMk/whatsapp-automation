import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session-server";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // Clear the session cookie
    await clearSession();

    console.log("[LOGOUT] User logged out successfully");

    return NextResponse.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("[LOGOUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
