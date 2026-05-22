const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const db = new PrismaClient();

  try {
    console.log("🔐 Starting admin creation...");

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    console.log("✅ Password hashed");

    // Delete existing admin if any
    const deleted = await db.user.deleteMany({
      where: { email: "admin@gmail.com" }
    });
    console.log(`✅ Deleted ${deleted.count} existing admin accounts`);

    // Create admin with OWNER role (ADMIN may not be in this system)
    const admin = await db.user.create({
      data: {
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "OWNER",
        name: "System Admin",
        businessName: "System"
      }
    });

    console.log("\n✅ ADMIN CREATED SUCCESSFULLY!");
    console.log("ID:", admin.id);
    console.log("Email:", admin.email);
    console.log("Name:", admin.name);
    console.log("Role:", admin.role);
    console.log("\n📝 Login with:");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");
    console.log("\nAt: http://localhost:3000/login");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
