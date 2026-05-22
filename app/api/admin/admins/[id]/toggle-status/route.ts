import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';

/**
 * PATCH /api/admin/admins/[id]/toggle-status
 * Toggle admin active/inactive status
 * Only SUPER_ADMIN allowed
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: adminId } = await params;
    
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
      select: { role: true, status: true, id: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE' || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot modify yourself
    if (currentUser.id === adminId) {
      return NextResponse.json(
        { error: 'Cannot modify your own status' },
        { status: 400 }
      );
    }

    // Check if target is an admin
    const targetAdmin = await db.user.findUnique({
      where: { id: adminId },
      select: { role: true, isActive: true }
    });

    if (!targetAdmin || (targetAdmin.role !== 'ADMIN' && targetAdmin.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Target user is not an admin' },
        { status: 400 }
      );
    }

    // Toggle active status
    const updatedAdmin = await db.user.update({
      where: { id: adminId },
      data: { isActive: !targetAdmin.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Admin ${updatedAdmin.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedAdmin
    });
  } catch (error) {
    console.error('[TOGGLE_ADMIN_STATUS]', error);
    return NextResponse.json(
      { error: 'Failed to update admin status' },
      { status: 500 }
    );
  }
}
