import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { DEFAULT_PERMISSIONS } from '@/lib/auth/permissions-util';
import { z } from 'zod';
export const dynamic = "force-dynamic";

const createAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']),
  permissions: z.array(z.string()).optional(),
});

const updateAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
});

/**
 * GET /api/admin/admins - List all admin users
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const admins = await db.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('[ADMIN-MANAGEMENT-GET]', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

/**
 * POST /api/admin/admins - Create new admin user
 */
export async function POST(request: NextRequest) {
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE' || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = createAdminSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role, permissions } = parseResult.data;

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Use provided permissions or default permissions for role
    const adminPermissions = permissions || DEFAULT_PERMISSIONS[role] || [];

    // Create admin user
    const newAdmin = await db.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: role as any,
        status: 'ACTIVE',
        permissions: adminPermissions,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error('[ADMIN-MANAGEMENT-POST]', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/admins/:id - Update admin user
 */
export async function PUT(request: NextRequest) {
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE' || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { adminId, ...updateData } = body;

    const parseResult = updateAdminSchema.safeParse(updateData);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password, role, permissions, status } = parseResult.data;

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email.toLowerCase();
    if (password) updatePayload.password = await hashPassword(password);
    if (role) updatePayload.role = role;
    if (permissions !== undefined) updatePayload.permissions = permissions;
    if (status) updatePayload.status = status;

    const updatedAdmin = await db.user.update({
      where: { id: adminId },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        status: true,
      },
    });

    return NextResponse.json({ admin: updatedAdmin });
  } catch (error) {
    console.error('[ADMIN-MANAGEMENT-PUT]', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/admins/:id - Delete admin user
 */
export async function DELETE(request: NextRequest) {
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

    const currentUser = await db.user.findUnique({
      where: { id: payload.userId },
      select: { role: true, status: true },
    });

    if (!currentUser || currentUser.status !== 'ACTIVE' || currentUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: 'adminId required' }, { status: 400 });
    }

    if (adminId === payload.userId) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: adminId },
    });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('[ADMIN-MANAGEMENT-DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
