import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDateTime } from "@/lib/booking";

function code() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `INH-${n}`;
}

async function emailOwner(booking: {
  confirmation: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  vehicle: string;
  flight: string;
  passengers: string;
  amount: string;
  notes: string;
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
  if (!user || !pass) return false;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const text = [
      `Confirmation: ${booking.confirmation}`,
      `Name: ${booking.name}`,
      `Phone: ${booking.phone}`,
      `Vehicle: ${booking.vehicle}`,
      `Type: transfer`,
      "",
      `Date / time: ${formatDateTime(booking.date, booking.time)}`,
      `Flight: ${booking.flight}`,
      `Passengers: ${booking.passengers}`,
      `Additional note: ${booking.notes}`,
      `Pickup address: ${booking.pickup}`,
      `Drop-off address: ${booking.dropoff}`,
      "",
      `Amount: ${booking.amount ? "$" + Number(booking.amount).toFixed(2) : ""}`,
      `Notes: Manual in-house trip`,
      "",
      "Jean Limo LLC",
      "Jeannie 281-917-0929 · Cash 281-917-0085",
    ].join("\n");

    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to,
      subject: `New Jean Limo booking ${booking.confirmation}`,
      text,
    });
    return true;
  } catch (err) {
    console.error("Manual trip email failed:", err);
    return false;
  }
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
    city: String(body.city || "Houston").slice(0, 40) || "Houston",
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from("bookings").insert(row);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const emailed = await emailOwner({
    confirmation,
    name,
    phone,
    date,
    time,
    pickup,
    dropoff,
    vehicle: String(body.vehicle || "sedan"),
    flight: String(body.flight || ""),
    passengers: String(body.passengers || ""),
    amount: String(body.amount || ""),
    notes: String(body.notes || ""),
  });

  return NextResponse.json({ ok: true, confirmation, emailed });
}
