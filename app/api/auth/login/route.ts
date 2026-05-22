import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { signSessionToken } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = await request.json();

  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password } = parseResult.data;

  // Normalize email: lowercase + trim whitespace
  const normalizedEmail = email.trim().toLowerCase();
  console.log("[LOGIN] Attempting login with email:", normalizedEmail);

  const user = await db.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (!user) {
    console.log("[LOGIN] User not found:", normalizedEmail);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  console.log("[LOGIN] User found:", user.email, "Role:", user.role);
  console.log("[LOGIN] Password hash exists:", !!user.password);

  const valid = await verifyPassword(password, user.password);
  console.log("[LOGIN] Password verification result:", valid);

  if (!valid) {
    console.log("[LOGIN] Invalid password for:", normalizedEmail);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signSessionToken(user.id);

  // Determine redirect URL based on role
  const redirectUrl = (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')
    ? '/admin/dashboard'
    : '/dashboard';

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: user.permissions || []
    },
    redirectUrl
  });
  response.cookies.set("wa_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });
  return response;
}

