import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { DISPATCH_COOKIE, dispatchPins, makeDispatchToken, sessionCookieOptions } from "@/lib/session";

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pin = String(body.pin || "").trim();
  if (!pin || !dispatchPins().some((allowed) => same(pin, allowed))) {
    return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DISPATCH_COOKIE, makeDispatchToken(), {
    ...sessionCookieOptions(),
    maxAge: 60 * 60 * 12,
  });
  return res;
}
