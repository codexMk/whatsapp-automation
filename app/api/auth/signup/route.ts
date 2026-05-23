import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { signSessionToken } from "@/lib/session";
export const dynamic = "force-dynamic";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().optional(),
  category: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json();

  const parseResult = signupSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, businessName, category } = parseResult.data;

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();
  console.log("[SIGNUP] Attempting signup for email:", normalizedEmail);

  // Check if email already exists
  const existing = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    console.log("[SIGNUP] Email already in use:", normalizedEmail);
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  // Hash password
  console.log("[SIGNUP] Hashing password...");
  const hashed = await hashPassword(password);

  // Create user with USER role (regular business user)
  console.log("[SIGNUP] Creating user in database...");
  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      password: hashed,
      businessName: businessName || undefined,
      role: "USER",  // Set default role for regular users
      status: "ACTIVE"
    }
  });

  console.log("[SIGNUP] User created successfully:", user.id);

  // Verify user was persisted
  const persisted = await db.user.findUnique({ where: { id: user.id } });

  if (!persisted) {
    console.log("[SIGNUP] User verification failed");
    return NextResponse.json(
      { error: "Failed to create user account" },
      { status: 500 }
    );
  }

  // Auto-seed templates for the selected category
  if (category) {
    console.log(`[SIGNUP] Auto-seeding templates for category: ${category}`);
    try {
      // Get admin user
      const admin = await db.user.findUnique({
        where: { email: "admin@system.local" }
      });

      if (admin) {
        // Get templates from admin for this category
        const categoryTemplates = await db.template.findMany({
          where: {
            userId: admin.id,
            category: category
          }
        });

        console.log(`[SIGNUP] Found ${categoryTemplates.length} templates for category: ${category}`);

        // Copy templates to new user
        let copiedCount = 0;
        for (const template of categoryTemplates) {
          await db.template.create({
            data: {
              userId: persisted.id,
              name: template.name,
              category: template.category,
              content: template.content,
              variables: template.variables || undefined
            }
          });
          copiedCount++;
        }

        console.log(`[SIGNUP] Copied ${copiedCount} templates to new user: ${persisted.id}`);
      } else {
        console.log("[SIGNUP] Admin user not found - skipping template seeding");
      }
    } catch (templateError) {
      console.error("[SIGNUP] Error seeding templates:", templateError);
      // Continue with signup even if template seeding fails
    }
  }

  // Create session token
  console.log("[SIGNUP] Creating session token...");
  const token = signSessionToken(persisted.id);
  
  const response = NextResponse.json({
    user: {
      id: persisted.id,
      email: persisted.email,
      name: persisted.name,
      businessName: persisted.businessName
    }
  });
  
  // Set session cookie
  response.cookies.set("wa_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60
  });
  
  console.log("[SIGNUP] Signup successful for:", normalizedEmail);
  return response;
}


