import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
