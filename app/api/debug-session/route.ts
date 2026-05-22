import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("wa_session");

    console.log("[DEBUG-SESSION] Session Cookie Exists:", !!sessionCookie);
    console.log("[DEBUG-SESSION] Cookie Value:", sessionCookie?.value?.substring(0, 20) + "...");

    if (!sessionCookie) {
      return NextResponse.json({
        status: "error",
        message: "No session cookie found",
        cookie: null,
        allCookies: cookieStore.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + "..." }))
      });
    }

    // Try to verify the session
    const { verifySession } = await import("@/lib/session");
    const payload = verifySession(sessionCookie.value);

    console.log("[DEBUG-SESSION] Verification Result:", payload);

    return NextResponse.json({
      status: "success",
      message: "Session found and verified",
      cookie: {
        name: sessionCookie.name,
        exists: true,
        valueStart: sessionCookie.value.substring(0, 20) + "..."
      },
      payload: payload,
      allCookies: cookieStore.getAll().map(c => ({ name: c.name, length: c.value.length }))
    });
  } catch (error) {
    console.error("[DEBUG-SESSION] Error:", error);
    return NextResponse.json({
      status: "error",
      message: String(error),
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
