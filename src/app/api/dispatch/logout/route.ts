import { NextResponse } from "next/server";
import { DISPATCH_COOKIE } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DISPATCH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
