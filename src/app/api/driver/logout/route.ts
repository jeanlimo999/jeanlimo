import { NextResponse } from "next/server";
import { DRIVER_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DRIVER_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
