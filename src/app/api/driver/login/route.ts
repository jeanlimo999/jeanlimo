import { NextRequest, NextResponse } from "next/server";
import { DRIVER_COOKIE, makeDriverToken, sessionCookieOptions } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function norm(s: string) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const username = String(body.username || body.name || "").trim();
  const id = String(body.id || "").trim();
  const pin = String(body.pin || "").trim();
  if ((!username && !id) || !pin) {
    return NextResponse.json({ error: "Enter your name and PIN" }, { status: 400 });
  }

  let query = db.from("drivers").select("id, name, phone, pin, active");
  if (id) query = query.eq("id", id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const wanted = norm(username);
  const match = (data || []).find((row) => {
    if (row.active === false) return false;
    if (id && String(row.id) === id) return true;
    if (!wanted) return false;
    const n = norm(row.name);
    return n === wanted || n.split(" ")[0] === wanted;
  });

  if (!match) return NextResponse.json({ error: "Name not found. Use the name on Dispatch." }, { status: 404 });
  if (String(match.pin || "") !== pin) return NextResponse.json({ error: "Wrong PIN" }, { status: 401 });

  const res = NextResponse.json({ ok: true, driver: { id: match.id, name: match.name, phone: match.phone || "" } });
  res.cookies.set(DRIVER_COOKIE, makeDriverToken(match.id, match.name, match.phone || ""), {
    ...sessionCookieOptions(),
    maxAge: 60 * 60 * 12,
  });
  return res;
}
