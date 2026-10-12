import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const { data, error } = await db.from("partners").select("id, company, contact, phone, email, city, airports, vehicles, pin, active").eq("active", true).order("city");
  if (error) return NextResponse.json({ error: "Run supabase/partners.sql in Supabase, then add a partner. " + error.message, partners: [] }, { status: 200 });
  return NextResponse.json({ partners: data || [] });
}

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const company = String(body.company || "").trim();
  if (!company) return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  const { data, error } = await db.from("partners").insert({
    company,
    contact: body.contact || "",
    phone: body.phone || "",
    email: body.email || "",
    city: body.city || "",
    airports: body.airports || "",
    vehicles: body.vehicles || "",
    active: true,
  }).select("id, company, city, phone, email").single();
  if (error) return NextResponse.json({ error: "Run supabase/partners.sql in Supabase first. " + error.message }, { status: 500 });
  return NextResponse.json({ partner: data });
}

export async function PATCH(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Pick a partner" }, { status: 400 });
  const update: Record<string, string> = {};
  for (const key of ["company", "contact", "phone", "email", "city", "airports", "vehicles"]) {
    if (body[key] != null) update[key] = String(body[key]).trim();
  }
  if (body.pin != null) {
    const pin = String(body.pin).trim();
    if (pin && pin.length < 4) return NextResponse.json({ error: "PIN needs at least 4 digits" }, { status: 400 });
    if (pin) update.pin = pin;
  }
  if (!Object.keys(update).length) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  const { error } = await db.from("partners").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const id = String(new URL(req.url).searchParams.get("id") || "");
  if (!id) return NextResponse.json({ error: "Pick a partner" }, { status: 400 });
  const { error } = await db.from("partners").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
