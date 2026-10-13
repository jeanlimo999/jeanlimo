import { NextRequest, NextResponse } from "next/server";
import { readPartnerSession } from "@/lib/session";
import { normEmail, supabaseAdmin } from "@/lib/supabase";

function driversFrom(rows: any[]) {
  const seen = new Map<string, any>();
  rows.forEach((row) => {
    const email = normEmail(row.driver_email || "");
    if (!email || !row.driver_name) return;
    if (!seen.has(email)) seen.set(email, { name: row.driver_name, phone: row.driver_phone || "", email });
  });
  return Array.from(seen.values());
}

export async function GET() {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("farm_outs").select("*").eq("partner_id", session.partnerId).order("created_at", { ascending: false }).limit(80);
  if (error) return NextResponse.json({ error: error.message, jobs: [] });
  const open = (data || []).filter((row: any) => row.status !== "returned");
  const ids = open.map((row: any) => row.booking_id).filter(Boolean);
  const { data: bookings } = ids.length
    ? await db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_notes, clients(full_name, phone)").in("id", ids)
    : { data: [] };
  const byId = new Map((bookings || []).map((b: any) => [b.id, b]));
  const jobs = open.map((row: any) => {
    const booking: any = byId.get(row.booking_id) || {};
    const guest = Array.isArray(booking.clients) ? booking.clients[0] : booking.clients || {};
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
      driverEmail: row.driver_email || "",
    };
  });
  return NextResponse.json({ company: session.company, jobs, drivers: driversFrom(data || []) });
}

export async function POST(req: NextRequest) {
  const session = readPartnerSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ error: "Job required" }, { status: 400 });

  if (body.action === "return") {
    const { error } = await db.from("farm_outs").update({
      status: "returned",
      driver_name: "",
      driver_phone: "",
      driver_email: "",
      updated_at: new Date().toISOString(),
    }).eq("id", id).eq("partner_id", session.partnerId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, returned: true });
  }

  const driver = String(body.driver || "").trim();
  const driverPhone = String(body.driverPhone || "").trim();
  const driverEmail = normEmail(body.driverEmail || "");
  if (!driver || !driverPhone || !driverEmail.includes("@")) {
    return NextResponse.json({ error: "Driver name, phone, and email are required" }, { status: 400 });
  }
  const { error } = await db.from("farm_outs").update({
    driver_name: driver,
    driver_phone: driverPhone,
    driver_email: driverEmail,
    status: "accepted",
    updated_at: new Date().toISOString(),
  }).eq("id", id).eq("partner_id", session.partnerId);
  if (error) return NextResponse.json({ error: "Run the driver email script in Supabase. " + error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
