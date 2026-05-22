// seed-admin-commonjs.js
// CommonJS version to create admin user

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "Admin@123";
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: "OWNER",
      name: "Admin User"
    }
  });

  console.log("✓ Admin user created/updated:", user);
}

main()
  .then(() => {
    console.log("✓ Database seeding completed successfully!");
    process.exit(0);
  })
  .catch(e => {
    console.error("✗ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
