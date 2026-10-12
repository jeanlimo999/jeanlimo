import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { createDispatcher } from "@/lib/dispatch-users";
import { normEmail, supabaseAdmin } from "@/lib/supabase";

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

export async function PATCH(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const from = normEmail(body.from || "");
  const to = normEmail(body.to || "");
  if (!from.includes("@") || !to.includes("@")) {
    return NextResponse.json({ error: "Enter the wrong email and the correct email" }, { status: 400 });
  }
  const { data, error } = await db.from("dispatch_users").update({ email: to }).eq("email", from).select("id, email, name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "No login found for " + from }, { status: 404 });
  await db.from("partners").update({ email: to }).eq("email", from);
  return NextResponse.json({ ok: true, user: data[0] });
}
