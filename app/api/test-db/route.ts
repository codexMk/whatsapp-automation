import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Use Prisma's $queryRaw to run raw SQL
    const result = await db.$queryRaw<Array<{ now: Date }>>`SELECT NOW()`;
    return NextResponse.json({ now: result[0]?.now || null });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
