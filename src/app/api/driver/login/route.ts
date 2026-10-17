import { NextRequest, NextResponse } from "next/server";
import { DRIVER_COOKIE, makeDriverToken, sessionCookieOptions } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function norm(s: string) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function last4(phone: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.slice(-4);
}

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const phoneLast4 = String(body.last4 || body.phone || "").replace(/\D/g, "").slice(-4);
  const username = String(body.username || body.name || "").trim();
  const pin = String(body.pin || "").trim();
  const id = String(body.id || "").trim();

  const { data, error } = await db.from("drivers").select("id, name, phone, email, pin, active");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let match: any = null;

  // Preferred: email + last 4 of phone
  if (email && phoneLast4.length === 4) {
    match = (data || []).find((row) => {
      if (row.active === false) return false;
      const rowEmail = String(row.email || "").trim().toLowerCase();
      return rowEmail === email && last4(row.phone) === phoneLast4;
    });
    if (!match) return NextResponse.json({ error: "Email or last 4 digits not found" }, { status: 404 });
  }
  // Fallback: name + PIN (for drivers without email yet)
  else if ((username || id) && pin) {
    const wanted = norm(username);
    match = (data || []).find((row) => {
      if (row.active === false) return false;
      if (id && String(row.id) === id) return true;
      if (!wanted) return false;
      const n = norm(row.name);
      return n === wanted || n.split(" ")[0] === wanted;
    });
    if (!match) return NextResponse.json({ error: "Name not found. Use the name on Dispatch." }, { status: 404 });
    if (String(match.pin || "") !== pin) return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });
  } else {
    return NextResponse.json({ error: "Enter email and last 4 digits of phone" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, driver: { id: match.id, name: match.name, phone: match.phone || "" } });
  res.cookies.set(DRIVER_COOKIE, makeDriverToken(match.id, match.name, match.phone || ""), {
    ...sessionCookieOptions(),
    maxAge: 60 * 60 * 12,
  });
  return res;
}
