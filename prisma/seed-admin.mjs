import { db } from "../lib/db";
import { hashPassword } from "../lib/auth";

async function main() {
  const email = "admin@example.com";
  const password = "AdminPass123!";
  const hashed = await hashPassword(password);

  const user = await db.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role: "OWNER",
      name: "Admin User"
    }
  });

  console.log("Admin user created:", user);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
