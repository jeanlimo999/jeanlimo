import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t") || "";
  if (!token) return NextResponse.json({ error: "Missing link" }, { status: 400 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data: farm, error } = await db.from("farm_outs").select("*").eq("token", token).maybeSingle();
  if (error || !farm) return NextResponse.json({ error: "This link is not valid" }, { status: 404 });
  const { data: booking } = await db.from("bookings").select("confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_notes, clients(full_name, phone)").eq("id", farm.booking_id).maybeSingle();
  const guest = (booking as any)?.clients || {};
  return NextResponse.json({
    status: farm.status,
    partner: farm.partner_name,
    pay: (farm.pay_cents || 0) / 100,
    confirmation: booking?.confirmation || farm.confirmation,
    when: [booking?.ride_date, booking?.ride_time].filter(Boolean).join(" "),
    pickup: booking?.pickup || "",
    dropoff: booking?.dropoff || "",
    flight: booking?.flight_number || "",
    passengers: booking?.passengers || "",
    notes: booking?.passenger_notes || "",
    guest: guest.full_name || "Guest",
    phone: guest.phone || "",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = String(body.token || "");
  const status = String(body.status || "");
  if (!token || !["accepted", "on_the_way", "on_location", "completed"].includes(status)) {
    return NextResponse.json({ error: "Bad update" }, { status: 400 });
  }
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { error } = await db.from("farm_outs").update({ status, updated_at: new Date().toISOString() }).eq("token", token);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (status === "completed" || status === "on_the_way" || status === "on_location") {
    const { data: farm } = await db.from("farm_outs").select("booking_id").eq("token", token).maybeSingle();
    if (farm?.booking_id) {
      const trip = status === "completed" ? "dropped_off" : status;
      await db.from("bookings").update({ trip_status: trip }).eq("id", farm.booking_id);
    }
  }
  return NextResponse.json({ ok: true, status });
}
