const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await db.user.findUnique({
      where: { email: 'admin@system.local' }
    });
    console.log('Admin User found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Status:', admin.status);
    console.log('IsActive:', admin.isActive);
    console.log('Full Data:', JSON.stringify(admin, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.$disconnect();
  }
}

checkAdmin();
