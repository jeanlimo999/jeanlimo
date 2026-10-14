import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

const OWNER = "cashtienlam@gmail.com";

function prettyDate(value?: string) {
  const m = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : "";
}
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

async function emailOwner(booking: any, driverName: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;
  const total = Number(booking.amount_cents || 0);
  const hasReturn = Boolean(booking.return_date || booking.return_pickup);
  const pay = Math.round((hasReturn ? total / 2 : total) * 0.85);
  const when = [prettyDate(booking.ride_date), prettyTime(booking.ride_time)].filter(Boolean).join(" at ");
  const guest = booking.clients || {};
  const text = [
    `${driverName} accepted the booking.`,
    "",
    `Confirmation: ${booking.confirmation || ""}`,
    `Customer: ${guest.full_name || ""}`,
    `Date: ${when}`,
    `Pay: ${money(pay)}`,
    `Pickup: ${booking.pickup || ""}`,
    `Drop-off: ${booking.dropoff || ""}`,
  ].join("\n");
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transporter.sendMail({
    from: `"Jean Limo" <${user}>`,
    to: OWNER,
    subject: `${driverName} accepted ${booking.confirmation || "a job"}`,
    text,
  });
}

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "");
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });

  const { data: booking } = await db
    .from("bookings")
    .select("*, clients(full_name, phone)")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking || booking.trip_status !== "auction" || booking.assigned_driver_id) {
    return NextResponse.json({ error: "That job is no longer available" }, { status: 409 });
  }

  const { error } = await db
    .from("bookings")
    .update({
      assigned_driver_id: session.driverId,
      trip_status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .eq("trip_status", "auction");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await emailOwner(booking, session.name || "A driver").catch(() => null);
  return NextResponse.json({ ok: true });
}
