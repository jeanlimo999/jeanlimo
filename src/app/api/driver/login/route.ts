import { NextRequest, NextResponse } from "next/server";
import { DRIVER_COOKIE, makeDriverToken, sessionCookieOptions } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const pin = String(body.pin || "").trim();
  if (!id || !pin) return NextResponse.json({ error: "Choose a driver and enter the PIN" }, { status: 400 });

  const { data, error } = await db.from("drivers").select("id, name, phone, pin, active").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.active === false) return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  if (String(data.pin || "") !== pin) return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });

  const res = NextResponse.json({ ok: true, driver: { id: data.id, name: data.name, phone: data.phone || "" } });
  res.cookies.set(DRIVER_COOKIE, makeDriverToken(data.id, data.name, data.phone || ""), {
    ...sessionCookieOptions(),
    maxAge: 60 * 60 * 16,
  });
  return res;
}
