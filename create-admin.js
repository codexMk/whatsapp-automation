import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function createAdmin() {
  try {
    console.log("🔍 Checking if admin exists...");

    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@gmail.com" }
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      console.log("Role:", existingAdmin.role);
      console.log("Name:", existingAdmin.name);
      console.log("Password hash length:", existingAdmin.password?.length);
      return;
    }

    console.log("❌ Admin not found. Creating admin account...");

    // Hash password with 12 rounds (same as in auth.ts)
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    console.log("✔️ Password hashed successfully");

    const admin = await db.user.create({
      data: {
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
        name: "System Admin",
        businessName: "System"
      }
    });

    console.log("✅ Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("Name:", admin.name);
    console.log("\n🔐 Login credentials:");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");
    console.log("\n📍 Go to http://localhost:3000/login");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
