import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { signSessionToken } from '@/lib/session';

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auto-login
 * Auto-login endpoint that sets session and redirects to admin
 */
export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session token
    const token = signSessionToken(user.id);

    // Create response and set cookie
    const response = NextResponse.redirect(new URL('/admin', request.url));
    response.cookies.set('wa_session', token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[AUTO-LOGIN] Error:', error);
    return NextResponse.json(
      {
        error: 'Auto-login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
