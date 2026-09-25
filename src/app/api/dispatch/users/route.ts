import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { createDispatcher } from "@/lib/dispatch-users";

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const password = String(body.password || "");
  const name = String(body.name || "");
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Email and 8+ character password required" }, { status: 400 });
  }
  try {
    const user = await createDispatcher(email, password, name);
    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Could not add dispatcher" }, { status: 500 });
  }
}
