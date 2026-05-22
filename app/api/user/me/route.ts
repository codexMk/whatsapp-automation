import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("[USER-ME] Getting session...");
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    console.log("[USER-ME] Session token exists:", !!token);

    if (!token) {
      console.log("[USER-ME] No session token found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifySession(token);
    console.log("[USER-ME] Verified payload:", payload);

    if (!payload || !payload.userId) {
      console.log("[USER-ME] Session verification failed");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        isBusinessVerified: true,
        category: true,
        whatsappNumber: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("[USER-ME] User authenticated:", user.id);
    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("[USER-ME] Error:", error);
    return NextResponse.json(
      { error: "Failed to get user info", details: String(error) },
      { status: 500 }
    );
  }
}

