import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/setup/create-super-admin
 * Creates the first super admin account if none exists
 */
export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check if any SUPER_ADMIN already exists
    const existingSuperAdmin = await db.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });

    if (existingSuperAdmin) {
      return NextResponse.json(
        {
          message: 'Super admin already exists',
          email: existingSuperAdmin.email,
        },
        { status: 200 }
      );
    }

    // Create new super admin account
    const email = 'superadmin@test.com';
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    const superAdmin = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        name: 'System Admin',
        businessName: 'System Administration',
        industry: 'admin', // Using admin as industry
      },
    });

    return NextResponse.json(
      {
        message: 'Super admin created successfully',
        email: superAdmin.email,
        password: password, // Return plaintext password only for this setup endpoint
        note: '⚠️ Store this password somewhere safe. You can change it after logging in.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CREATE-SUPER-ADMIN]', error);
    return NextResponse.json(
      {
        error: 'Failed to create super admin',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
