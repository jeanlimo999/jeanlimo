import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function code() {
  return "FIN-" + Math.floor(1000 + Math.random() * 9000);
}

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("farm_ins").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) return NextResponse.json({ error: error.message, offers: [] });
  return NextResponse.json({ offers: data || [] });
}

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json();
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!id || !["accept", "decline"].includes(action)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { data: offer } = await db.from("farm_ins").select("*").eq("id", id).maybeSingle();
  if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  if (offer.status !== "pending") return NextResponse.json({ error: "Already " + offer.status }, { status: 400 });

  if (action === "decline") {
    await db.from("farm_ins").update({ status: "declined" }).eq("id", id);
    return NextResponse.json({ ok: true, status: "declined" });
  }

  const email = `farmin+${Date.now()}@jeanlimo.local`;
  const { data: client, error: cErr } = await db.from("clients").insert({ email, phone: offer.phone || "", full_name: offer.passenger }).select("id").single();
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
  const confirmation = code();
  const { error } = await db.from("bookings").insert({
    confirmation,
    client_id: client.id,
    status: "confirmed",
    trip_status: "confirmed",
    vehicle: offer.vehicle || "sedan",
    trip_type: "oneway",
    ride_date: offer.ride_date,
    ride_time: offer.ride_time,
    pickup: offer.pickup,
    dropoff: offer.dropoff,
    flight_number: offer.flight || "",
    passengers: offer.passengers,
    amount_cents: offer.pay_cents || 0,
    passenger_notes: `Farm-in from ${offer.partner_name}. They pay Jean Limo. Do not charge the passenger. ${offer.notes || ""}`.trim(),
    breakdown: "Farm-in",
    city: "Houston",
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await db.from("farm_ins").update({ status: "accepted", confirmation }).eq("id", id);
  return NextResponse.json({ ok: true, status: "accepted", confirmation });
}
