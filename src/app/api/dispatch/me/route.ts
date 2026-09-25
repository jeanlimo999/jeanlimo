import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { countDispatchers } from "@/lib/dispatch-users";

export async function GET() {
  const session = readDispatchSession();
  if (session) return NextResponse.json({ ok: true, email: session.email, name: session.name, needsSetup: false });
  const count = await countDispatchers();
  return NextResponse.json({ error: "Sign in required", needsSetup: count === 0 }, { status: 401 });
}
