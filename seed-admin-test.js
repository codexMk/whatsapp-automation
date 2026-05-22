// seed-admin-test.js
// CommonJS version to create admin user

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@system.local";
  const password = "Admin@123";
  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: "ADMIN",
      name: "System Admin",
      businessName: "System",
      status: "ACTIVE",
      isActive: true
    }
  });

  console.log("✓ Admin user created/updated:");
  console.log("  ID:", user.id);
  console.log("  Email:", user.email);
  console.log("  Role:", user.role);
  console.log("  Name:", user.name);
}

main()
  .then(() => {
    console.log("\n✓ Database seeding completed successfully!");
    console.log("\n📝 Admin Credentials:");
    console.log("   Email: admin@system.local");
    console.log("   Password: Admin@123");
    process.exit(0);
  })
  .catch(e => {
    console.error("✗ Seeding failed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
