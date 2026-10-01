import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function code() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `INH-${n}`;
}

export async function POST(req: Request) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const pickup = String(body.pickup || "").trim();
  const dropoff = String(body.dropoff || "").trim();
  const date = String(body.date || "").slice(0, 10);
  const time = String(body.time || "").slice(0, 8);
  if (!name || !pickup || !dropoff || !date || !time) {
    return NextResponse.json({ error: "Name, date, time, pickup, and drop-off are required" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase() || `manual+${Date.now()}@jeanlimo.local`;
  const { data: existing } = await db.from("clients").select("id").eq("email", email).maybeSingle();
  let clientId = existing?.id;
  if (!clientId) {
    const { data: client, error: cErr } = await db
      .from("clients")
      .insert({ email, phone, full_name: name })
      .select("id")
      .single();
    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    clientId = client.id;
  }

  const amount = Number(body.amount || 0);
  const notes = [String(body.notes || "").trim(), "In-house manual trip"].filter(Boolean).join(" | ");
  const confirmation = code();
  const row = {
    confirmation,
    client_id: clientId,
    status: "confirmed",
    trip_status: "confirmed",
    vehicle: String(body.vehicle || "sedan"),
    trip_type: "oneway",
    ride_date: date,
    ride_time: time,
    pickup,
    dropoff,
    flight_number: String(body.flight || "").slice(0, 20),
    passengers: Number(body.passengers || 0) || null,
    amount_cents: Math.round((Number.isFinite(amount) ? amount : 0) * 100),
    passenger_notes: notes,
    breakdown: "Manual in-house",
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from("bookings").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, confirmation });
}
