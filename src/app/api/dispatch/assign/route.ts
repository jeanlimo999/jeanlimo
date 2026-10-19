import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { blacklaneDate, formatTimeDisplay, rideDetailsHtml, jeanLimoSubject } from "@/lib/booking";

function prettyTime(value?: string) {
  const m = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  if (!m) return "";
  let hour = parseInt(m[1], 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour}:${m[2]} ${ampm}`;
}
function money(cents: number) {
  return "$" + Math.round(Number(cents || 0) / 100);
}

async function emailDrivers(db: any, booking: any) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return 0;
  const { data: drivers } = await db.from("drivers").select("*").eq("active", true);
  const emails = (drivers || []).map((d: any) => String(d.email || "").trim()).filter((e: string) => e.includes("@"));
  if (!emails.length) return 0;

  const total = Number(booking.amount_cents || 0);
  const hasReturn = Boolean(booking.return_date || booking.return_pickup);
  const pay = Math.round((hasReturn ? total / 2 : total) * 0.80);
  const dateStr = booking.ride_date;
  const time = prettyTime(booking.ride_time);

  const guestName = booking.clients?.full_name || booking.guest_name || "Guest";

  const html = `
    <p style="font-weight:700;">You've been offered a ride</p>
    <p>A job is available. Open the driver app and check Available.</p>
    ${rideDetailsHtml({
      confirmation: booking.confirmation,
      dateLabel: blacklaneDate(dateStr),
      time,
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      flight: booking.flight_number,
      name: guestName,
      amount: `Pay: ${money(pay)}`,
      extra: `<div style="margin-top:12px;"><a href="https://jeanlimo.com/driver">Open driver app</a></div>`,
    })}
  `;

  const subject = jeanLimoSubject({
    time,
    customer: guestName,
    pickingUp: true,
  });

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transporter.sendMail({
    from: `"Jean Limo" <${user}>`,
    to: emails.join(","),
    subject,
    html,
  });
  return emails.length;
}

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const bookingId = String(body.bookingId || "");
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });

  const leg = String(body.leg || "outbound");
  const isReturn = leg === "return";
  if (body.auction) {
    const patch = isReturn
      ? { return_assigned_driver_id: null, return_trip_status: "auction", updated_at: new Date().toISOString() }
      : { assigned_driver_id: null, trip_status: "auction", updated_at: new Date().toISOString() };
    const { data: booking, error } = await db
      .from("bookings")
      .update(patch)
      .eq("id", bookingId)
      .select("*, clients(full_name)")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const emailed = await emailDrivers(db, booking).catch(() => 0);
    return NextResponse.json({ ok: true, auction: true, emailed });
  }

  const driverId = body.driverId ? String(body.driverId) : null;
  const patch = isReturn
    ? { return_assigned_driver_id: driverId, return_trip_status: driverId ? "assigned" : "confirmed", updated_at: new Date().toISOString() }
    : { assigned_driver_id: driverId, trip_status: driverId ? "assigned" : "confirmed", updated_at: new Date().toISOString() };
  const { error } = await db
    .from("bookings")
    .update(patch)
    .eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
