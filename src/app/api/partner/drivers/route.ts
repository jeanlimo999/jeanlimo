import { NextRequest, NextResponse } from "next/server";
import { readPartnerSession } from "@/lib/session";
import { normEmail, supabaseAdmin } from "@/lib/supabase";

const SQL = "create table if not exists partner_drivers (id uuid primary key default gen_random_uuid(), partner_id uuid, name text, phone text, email text, active boolean default true, created_at timestamptz default now());";

export async function GET() {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("partner_drivers").select("id, name, phone, email").eq("partner_id", session.partnerId).eq("active", true).order("name");
  if (error) return NextResponse.json({ error: "Run this in Supabase: " + SQL, drivers: [] });
  return NextResponse.json({ drivers: data || [] });
}

export async function POST(req: NextRequest) {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = normEmail(body.email || "");
  if (!name || !phone || !email.includes("@")) {
    return NextResponse.json({ error: "Name, phone, and email are required" }, { status: 400 });
  }
  const { data, error } = await db.from("partner_drivers").insert({
    partner_id: session.partnerId,
    name,
    phone,
    email,
    active: true,
  }).select("id, name, phone, email").single();
  if (error) return NextResponse.json({ error: "Run this in Supabase: " + SQL }, { status: 500 });
  return NextResponse.json({ driver: data });
}

export async function DELETE(req: NextRequest) {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const id = String(new URL(req.url).searchParams.get("id") || "");
  if (!id) return NextResponse.json({ error: "Driver required" }, { status: 400 });
  const { error } = await db.from("partner_drivers").update({ active: false }).eq("id", id).eq("partner_id", session.partnerId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
