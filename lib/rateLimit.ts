import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limit placeholder
const ipHits: Record<string, number> = {};
const WINDOW = 60 * 1000; // 1 min
const LIMIT = 60;

export function rateLimit(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  ipHits[ip] = (ipHits[ip] || 0) + 1;
  setTimeout(() => { ipHits[ip] = Math.max(0, ipHits[ip] - 1); }, WINDOW);
  if (ipHits[ip] > LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  return null;
}
