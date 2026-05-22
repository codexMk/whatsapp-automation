const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const db = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('[SUPER_ADMIN] Creating super admin user...');

    // Hash password with 12 rounds
    const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 12);

    // Check if super admin already exists
    const existing = await db.user.findUnique({
      where: { email: 'superadmin@system.local' }
    });

    if (existing) {
      console.log('[SUPER_ADMIN] Super admin already exists. Updating...');
      const updated = await db.user.update({
        where: { email: 'superadmin@system.local' },
        data: {
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          name: 'Super Admin',
          status: 'ACTIVE',
          isActive: true
        }
      });
      console.log('[SUPER_ADMIN] ✅ Super admin updated');
      console.log('Email:', updated.email);
      console.log('Password: SuperAdmin@2024');
      console.log('Role:', updated.role);
      return updated;
    }

    // Create new super admin
    const superAdmin = await db.user.create({
      data: {
        email: 'superadmin@system.local',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
        isBusinessVerified: false
      }
    });

    console.log('[SUPER_ADMIN] ✅ Super admin created successfully');
    console.log('ID:', superAdmin.id);
    console.log('Email:', superAdmin.email);
    console.log('Password: SuperAdmin@2024');
    console.log('Role:', superAdmin.role);

  } catch (error) {
    console.error('[SUPER_ADMIN] Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

createSuperAdmin();
