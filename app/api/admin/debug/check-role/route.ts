import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';

/**
 * GET /api/admin/debug/check-role
 * Check current logged-in user's role (for debugging)
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wa_session')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session cookie found',
      });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        message: 'Session verification failed',
      });
    }

    const userId = payload.userId;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'User not found',
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
      canAccessAdmin: user.role === 'SUPER_ADMIN' || user.role === 'ADMIN',
    });
  } catch (error) {
    console.error('[CHECK-ROLE]', error);
    return NextResponse.json({
      error: 'Failed to check role',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
