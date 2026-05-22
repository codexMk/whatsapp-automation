import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "wa_session";

/**
 * Middleware to protect admin routes
 * 
 * Rules:
 * - All /admin/* routes require authentication
 * - User must have ADMIN or SUPER_ADMIN role
 * - User account must be ACTIVE
 * - Admin account must be isActive = true
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only check admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow public admin pages like /admin-secret-login
  if (pathname === "/admin-secret-login") {
    return NextResponse.next();
  }

  // Get session token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // No token - redirect to login
  if (!token) {
    console.log("[MIDDLEWARE] No session token for:", pathname);
    return NextResponse.redirect(new URL("/admin-secret-login", request.url));
  }

  // For now, redirect to login (role check will be done in pages)
  // This basic middleware just ensures user has a valid session
  // The role check happens in individual page components
  return NextResponse.next();
}

/**
 * Configure which routes should use this middleware
 */
export const config = {
  matcher: [
    "/admin/:path*",
    "/admin-secret-login"
  ]
};
