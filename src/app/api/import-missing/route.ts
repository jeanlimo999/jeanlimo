import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const confirmation = "JL-261009-PMVN";
  const email = "samta.kapoor@ey.com";
  const { data: existingBooking } = await db.from("bookings").select("id, confirmation").eq("confirmation", confirmation).maybeSingle();
  if (existingBooking) return NextResponse.json({ ok: true, already: true, confirmation });

  const { data: existing } = await db.from("clients").select("id").eq("email", email).maybeSingle();
  let clientId = existing?.id;
  if (!clientId) {
    const { data: client, error: cErr } = await db
      .from("clients")
      .insert({ email, phone: "7329103787", full_name: "Samta Kapoor" })
      .select("id")
      .single();
    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    clientId = client.id;
  }

  const { error } = await db.from("bookings").insert({
    confirmation,
    client_id: clientId,
    status: "confirmed",
    trip_status: "confirmed",
    vehicle: "sedan",
    trip_type: "oneway",
    ride_date: "2026-10-18",
    ride_time: "23:10",
    pickup: "George Bush Intercontinental Airport (IAH), North Terminal Road, Houston, TX, USA",
    dropoff: "255 N Sam Houston Pkwy E, Houston, TX 77060, USA",
    flight_number: "UA1649",
    passengers: 1,
    amount_cents: 11000,
    passenger_notes: "6.7 mi · sedan flat",
    breakdown: "6.7 mi · sedan flat",
    city: "Houston",
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, confirmation });
}
