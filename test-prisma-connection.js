// test-prisma-connection.js
// Quick test to verify Prisma can connect to PostgreSQL

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    // Test connection by querying raw SQL
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✓ Database connection successful!');
    console.log('Current time from DB:', result[0]);

    // Try to check if user table exists
    const users = await prisma.user.findMany({ take: 1 });
    console.log('✓ User table accessible');
    console.log('Users count:', users.length);

    process.exit(0);
  } catch (err) {
    console.error('✗ Connection failed:');
    console.error(err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
