import { NextRequest, NextResponse } from "next/server";
import { DISPATCH_COOKIE, makeDispatchToken, sessionCookieOptions } from "@/lib/session";
import { findDispatcher } from "@/lib/dispatch-users";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const password = String(body.password || "");
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Enter email and a password of at least 8 characters." }, { status: 400 });
  }
  const user = await findDispatcher(email, password);
  if (!user) return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  const res = NextResponse.json({ ok: true, name: user.name, email: user.email });
  res.cookies.set(DISPATCH_COOKIE, makeDispatchToken(user.email, user.name), {
    ...sessionCookieOptions(),
    maxAge: 60 * 60 * 12,
  });
  return res;
}
