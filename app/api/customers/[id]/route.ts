import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session-server";
import { customerUpdateSchema, getCustomerById, updateCustomer } from "@/lib/customers";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await getCustomerById(userId, params.id);
  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ customer });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = customerUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await updateCustomer(userId, params.id, parseResult.data);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ customer: updated });
}

