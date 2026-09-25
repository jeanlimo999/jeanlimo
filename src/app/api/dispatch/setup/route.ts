import { NextRequest, NextResponse } from "next/server";
import { DISPATCH_COOKIE, makeDispatchToken, sessionCookieOptions } from "@/lib/session";
import { countDispatchers, createDispatcher } from "@/lib/dispatch-users";

export async function POST(req: NextRequest) {
  const existing = await countDispatchers();
  if (existing > 0) {
    return NextResponse.json({ error: "Setup is already complete. Sign in instead." }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "");
  const password = String(body.password || "");
  const name = String(body.name || "Owner");
  if (!email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "Use a real email and a password of at least 8 characters." }, { status: 400 });
  }
  try {
    const user = await createDispatcher(email, password, name);
    const res = NextResponse.json({ ok: true, email: user.email, name: user.name });
    res.cookies.set(DISPATCH_COOKIE, makeDispatchToken(user.email, user.name), {
      ...sessionCookieOptions(),
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (err: any) {
    const hint =
      /dispatch_users|schema cache|does not exist/i.test(err.message || "")
        ? " Run the dispatch_users SQL in Supabase first."
        : "";
    return NextResponse.json({ error: (err.message || "Could not create owner") + hint }, { status: 500 });
  }
}
