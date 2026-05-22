import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';

/**
 * GET /api/admin/overview
 * Get admin overview statistics
 * Only SUPER_ADMIN allowed
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wa_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is SUPER_ADMIN
    const currentUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE' || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all admins
    const allAdmins = await db.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate statistics
    const totalAdmins = allAdmins.length;
    const activeAdmins = allAdmins.filter(a => a.isActive).length;
    const inactiveAdmins = totalAdmins - activeAdmins;
    const superAdmins = allAdmins.filter(a => a.role === 'SUPER_ADMIN').length;
    const regularAdmins = allAdmins.filter(a => a.role === 'ADMIN').length;

    // Get admins who have never logged in
    const neverLoggedIn = allAdmins.filter(a => !a.lastLoginAt).length;

    // Get recently active admins (logged in within last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentlyActive = allAdmins.filter(a => a.lastLoginAt && a.lastLoginAt > sevenDaysAgo).length;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalAdmins,
          activeAdmins,
          inactiveAdmins,
          superAdmins,
          regularAdmins,
          neverLoggedIn,
          recentlyActive
        },
        admins: allAdmins
      }
    });
  } catch (error) {
    console.error('[ADMIN_OVERVIEW]', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin overview' },
      { status: 500 }
    );
  }
}
