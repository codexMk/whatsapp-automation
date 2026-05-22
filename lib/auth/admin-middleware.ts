import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export interface ProtectedRequest {
  userId: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    status: string;
  };
}

export async function verifyAdminRequest(
  requiredRole: "SUPER_ADMIN" | "ADMIN" | "ANY_ADMIN" = "ADMIN"
): Promise<{ error?: NextResponse; request?: ProtectedRequest }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized: No session" },
          { status: 401 }
        )
      };
    }

    const payload = verifySession(token);
    if (!payload) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized: Invalid session" },
          { status: 401 }
        )
      };
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!user) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized: User not found" },
          { status: 404 }
        )
      };
    }

    if (user.status !== "ACTIVE") {
      return {
        error: NextResponse.json(
          { error: "Forbidden: Account suspended" },
          { status: 403 }
        )
      };
    }

    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN" || isSuperAdmin;

    let hasPermission = false;
    if (requiredRole === "SUPER_ADMIN") {
      hasPermission = isSuperAdmin;
    } else if (requiredRole === "ADMIN") {
      hasPermission = isAdmin;
    } else if (requiredRole === "ANY_ADMIN") {
      hasPermission = isAdmin;
    }

    if (!hasPermission) {
      return {
        error: NextResponse.json(
          { error: "Forbidden: Insufficient permissions" },
          { status: 403 }
        )
      };
    }

    return {
      request: {
        userId: user.id,
        user
      }
    };
  } catch (error) {
    console.error("[ADMIN-AUTH] Verification error:", error);
    return {
      error: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    };
  }
}

export async function verifyUserRequest(): Promise<{
  error?: NextResponse;
  userId?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      };
    }

    const payload = verifySession(token);
    if (!payload) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      };
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { status: true }
    });

    if (user?.status !== "ACTIVE") {
      return {
        error: NextResponse.json(
          { error: "Account suspended" },
          { status: 403 }
        )
      };
    }

    return { userId: payload.userId };
  } catch (error) {
    console.error("[USER-AUTH] Verification error:", error);
    return {
      error: NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    };
  }
}
