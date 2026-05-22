"use server";

// Server-only session functions that use next/headers
import { cookies } from "next/headers";
import { verifySession, signSession } from "./session";
import { db } from "./db";

const SESSION_COOKIE_NAME = "wa_session";
const SESSION_TTL_DAYS = 7;

export interface SessionData {
  userId: string;
  role?: string;
  email?: string;
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    // Delete the session cookie
    cookieStore.delete(SESSION_COOKIE_NAME);
    console.log("[SESSION] Session cleared");
  } catch (error) {
    console.error("[SESSION] Error clearing session:", error);
    throw error;
  }
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySession(token);
  if (!payload) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return payload.userId;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + SESSION_TTL_DAYS * 24 * 60 * 60;

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60
  });
}

/**
 * Validate session and get full user details including role
 * Returns session data with userId, role, and email
 */
export async function validateSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!token) return null;

    const payload = verifySession(token);
    if (!payload) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Fetch user details from database
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        email: true,
        status: true,
        isActive: true
      }
    });

    if (!user) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Check if user account is suspended
    if (user.status !== "ACTIVE") {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    // Check if admin account is inactive
    if ((user.role === "ADMIN" || user.role === "SUPER_ADMIN") && !user.isActive) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return null;
    }

    return {
      userId: user.id,
      role: user.role,
      email: user.email
    };
  } catch (error) {
    console.error("[VALIDATE_SESSION] Error:", error);
    return null;
  }
}
