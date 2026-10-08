import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { makePartnerToken, PARTNER_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const pin = String(body.pin || "").trim();
  if (!email || !pin) return NextResponse.json({ error: "Email and PIN are required" }, { status: 400 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("partners").select("id, company, email, pin, active").ilike("email", email).maybeSingle();
  if (error) return NextResponse.json({ error: "Run the partner PIN script in Supabase. " + error.message }, { status: 500 });
  if (!data || data.active === false || String(data.pin || "") !== pin) {
    return NextResponse.json({ error: "Wrong email or PIN. Ask Jean Limo to approve you first." }, { status: 401 });
  }
  cookies().set(PARTNER_COOKIE, makePartnerToken(data.id, data.company, data.email), sessionCookieOptions());
  return NextResponse.json({ ok: true, company: data.company });
}
