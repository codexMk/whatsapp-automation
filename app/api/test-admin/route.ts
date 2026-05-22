import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check if admin exists
    const admin = await db.user.findUnique({
      where: { email: "admin@system.local" }
    });

    if (admin) {
      return NextResponse.json({
        status: "Admin exists",
        email: admin.email,
        name: admin.name,
        role: admin.role,
        message: "Admin account found. Try logging in with password: Admin@123"
      });
    } else {
      return NextResponse.json({
        status: "Admin does NOT exist",
        message: "Visit http://localhost:3000/api/seed-admin to create admin account"
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Database error", details: String(error) },
      { status: 500 }
    );
  }
}
