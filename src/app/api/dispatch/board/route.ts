import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function chicagoYmd(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);
}

function addDays(ymd: string, days: number) {
  const [y, m, day] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, day + days));
  return dt.toISOString().slice(0, 10);
}

function bookingDay(row: any) {
  return String(row.ride_date || row.created_at || "").slice(0, 10);
}

function cents(row: any) {
  const n = Number(row.amount_cents || row.amount || 0);
  if (!Number.isFinite(n)) return 0;
  return n > 100000 ? n : n;
}

async function ensureHannahTrip(db: any, drivers: any[]) {
  const confirmation = "INH-UA1872";
  const { data: existing } = await db.from("bookings").select("id").eq("confirmation", confirmation).maybeSingle();
  if (existing) return;
  const email = "hannah.ua1872@jeanlimo.local";
  const { data: found } = await db.from("clients").select("id").eq("email", email).maybeSingle();
  let clientId = found?.id;
  if (!clientId) {
    const { data: client, error } = await db
      .from("clients")
      .insert({ email, phone: "(832) 851-7259", full_name: "Hannah" })
      .select("id")
      .single();
    if (error || !client) return;
    clientId = client.id;
  }
  const tien = (drivers || []).find((d) => /tien/i.test(String(d.name || "")));
  await db.from("bookings").insert({
    confirmation,
    client_id: clientId,
    status: "confirmed",
    trip_status: "confirmed",
    vehicle: "suv",
    trip_type: "oneway",
    ride_date: "2026-10-01",
    ride_time: "18:30",
    pickup: "George Bush Intercontinental Airport (IAH)",
    dropoff: "13411 Ambler Springs Dr, Tomball, TX 77377",
    flight_number: "UA1872",
    passengers: 1,
    amount_cents: 0,
    passenger_notes: "Paid. Driver pay $120. Airline United. Driver Tien Lam.",
    breakdown: "Manual in-house. $120 is driver pay, not customer fare.",
    assigned_driver_id: tien?.id || null,
    city: "Houston",
    updated_at: new Date().toISOString(),
  });
}

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data: driverRows } = await db.from("drivers").select("id, name").eq("active", true);
  await ensureHannahTrip(db, driverRows || []);
  await db.from("bookings").update({ city: "Houston" }).or("city.is.null,city.eq.");

  const [{ data: drivers, error: dErr }, { data: bookings, error: bErr }] = await Promise.all([
    db.from("drivers").select("id, name, phone, pin, vehicle, photo_url, active, last_lat, last_lng").eq("active", true).order("name"),
    db.from("bookings").select("*, clients(full_name, phone, email)").not("status", "eq", "cancelled").order("ride_date", { ascending: true }),
  ]);
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });
  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 });

  const today = chicagoYmd();
  const weekStart = addDays(today, -6);
  const month = today.slice(0, 7);
  const year = today.slice(0, 4);

  const revenue = { week: 0, month: 0, year: 0, lifetime: 0 };
  (bookings || []).forEach((row: any) => {
    const amt = cents(row);
    const day = bookingDay(row);
    revenue.lifetime += amt;
    if (day >= weekStart && day <= today) revenue.week += amt;
    if (day.startsWith(month)) revenue.month += amt;
    if (day.startsWith(year)) revenue.year += amt;
  });

  const jobs = (bookings || []).flatMap((row: any) => {
    const guest = row.clients || {};
    const base = {
      bookingId: row.id,
      guestName: guest.full_name || "Guest",
      guestPhone: guest.phone || "",
      vehicle: row.vehicle,
      assignedDriverId: row.assigned_driver_id || "",
      tripStatus: row.trip_status || row.status || "confirmed",
      confirmation: row.confirmation,
      amountCents: cents(row),
      city: row.city || "Houston",
    };
    const rawNotes = String(row.passenger_notes || row.notes || "");
    const split = rawNotes.indexOf("Return:");
    const outboundNotes = (split >= 0 ? rawNotes.slice(0, split) : rawNotes).replace(/\s*\|\s*$/, "").trim();
    const returnNotes = split >= 0 ? rawNotes.slice(split + 7).trim() : "";
    const pax = row.passengers || row.passenger_count || row.pax || "";
    const list = [
      {
        ...base,
        id: row.confirmation,
        when: [row.ride_date, row.ride_time].filter(Boolean).join(" "),
        rideDate: row.ride_date || "",
        pickup: row.pickup,
        dropoff: row.dropoff,
        flight: row.flight_number || "",
        passengers: pax === 0 || pax ? String(pax) : "",
        notes: outboundNotes,
      },
    ];
    if (row.return_date || row.return_pickup) {
      list.push({
        ...base,
        amountCents: 0,
        id: row.confirmation + "-R",
        confirmation: row.confirmation + " return",
        when: [row.return_date, row.return_time].filter(Boolean).join(" "),
        rideDate: row.return_date || "",
        pickup: row.return_pickup || row.dropoff,
        dropoff: row.return_dropoff || row.pickup,
        flight: row.return_flight_number || "",
        passengers: pax === 0 || pax ? String(pax) : "",
        notes: returnNotes,
      });
    }
    return list;
  });

  return NextResponse.json({ drivers: drivers || [], jobs, revenue });
}
