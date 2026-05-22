// test-db-connection.js
// Simple database smoke test using the project's Prisma client configuration.

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const [nowResult, userCount] = await Promise.all([
    prisma.$queryRaw`SELECT NOW() AS now`,
    prisma.user.count(),
  ]);

  console.log("DB connected");
  console.log("Current time:", nowResult[0]?.now ?? null);
  console.log("Users count:", userCount);
}

main()
  .catch((error) => {
    console.error("Connection error:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
