import { NextRequest, NextResponse } from "next/server";
import { readPartnerSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("farm_outs").select("*").eq("partner_id", session.partnerId).order("created_at", { ascending: false }).limit(40);
  if (error) return NextResponse.json({ error: error.message, jobs: [] });
  const ids = (data || []).map((row) => row.booking_id).filter(Boolean);
  const { data: bookings } = ids.length
    ? await db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_notes, clients(full_name, phone)").in("id", ids)
    : { data: [] };
  const byId = new Map((bookings || []).map((b: any) => [b.id, b]));
  const jobs = (data || []).map((row: any) => {
    const booking: any = byId.get(row.booking_id) || {};
    const guest = booking.clients || {};
    return {
      id: row.id,
      status: row.status,
      pay: Math.round((row.pay_cents || 0) / 100),
      confirmation: booking.confirmation || row.confirmation,
      date: booking.ride_date || "",
      time: booking.ride_time || "",
      pickup: booking.pickup || "",
      dropoff: booking.dropoff || "",
      flight: booking.flight_number || "",
      passengers: booking.passengers || "",
      notes: booking.passenger_notes || "",
      guest: guest.full_name || "Guest",
      phone: guest.phone || "",
      driver: row.driver_name || "",
      driverPhone: row.driver_phone || "",
    };
  });
  return NextResponse.json({ company: session.company, jobs });
}

export async function POST(req: NextRequest) {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const driver = String(body.driver || "").trim();
  const driverPhone = String(body.driverPhone || "").trim();
  if (!id || !driver) return NextResponse.json({ error: "Driver name is required" }, { status: 400 });
  const { error } = await db.from("farm_outs").update({
    driver_name: driver,
    driver_phone: driverPhone,
    status: "accepted",
    updated_at: new Date().toISOString(),
  }).eq("id", id).eq("partner_id", session.partnerId);
  if (error) return NextResponse.json({ error: "Run the partner driver script in Supabase. " + error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
