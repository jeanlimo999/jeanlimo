import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const row = {
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").replace(/\D/g, ""),
    pin: String(body.pin || "").trim(),
    vehicle: String(body.vehicle || "sedan").trim() || "sedan",
    photo_url: String(body.photo_url || "").trim(),
    active: true,
  };
  if (!row.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const { data, error } = await db.from("drivers").insert(row).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ driver: data });
}

export async function PATCH(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Driver required" }, { status: 400 });
  const patch: Record<string, string> = {};
  if (body.photo_url != null) patch.photo_url = String(body.photo_url);
  if (body.name != null) patch.name = String(body.name);
  if (body.phone != null) patch.phone = String(body.phone).replace(/\D/g, "");
  const { data, error } = await db.from("drivers").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ driver: data });
}
