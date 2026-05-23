import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { createCustomer, customerInputSchema, listCustomers } from "@/lib/customers";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CUSTOMERS-API] Fetching customers for user:", payload.userId);
    const customers = await listCustomers(payload.userId);
    console.log("[CUSTOMERS-API] Found customers:", customers.length);
    return NextResponse.json({ customers });
  } catch (error) {
    console.error("[CUSTOMERS-API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("wa_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifySession(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = customerInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const customer = await createCustomer(payload.userId, parseResult.data);

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    console.error("[CUSTOMERS-API] Error creating customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}

