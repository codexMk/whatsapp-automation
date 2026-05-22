import { db } from "../lib/db";
import { hashPassword } from "../lib/auth";
import { UserRole } from "@prisma/client";

async function main() {
  const email = "admin@system.local";
  const password = "Admin@123";
  
  console.log("🔐 Creating/checking admin account...");

  const hashed = await hashPassword(password);

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: UserRole.ADMIN,
      name: "System Admin",
      businessName: "System",
    }
  });

  console.log("✓ Admin account created/verified:", {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  console.log("\n📝 Admin credentials:");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
}

main()
  .then(() => {
    console.log("\n✓ Admin seeding completed successfully!");
    process.exit(0);
  })
  .catch(e => {
    console.error("✗ Seeding failed:", e);
    process.exit(1);
  });
