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

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "");
  const isReturn = String(body.leg || "outbound") === "return";
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });

  const { data: booking } = await db.from("bookings").select("*, clients(full_name)").eq("id", bookingId).maybeSingle();
  if (!booking) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  const mine = isReturn ? booking.return_assigned_driver_id === session.driverId : booking.assigned_driver_id === session.driverId;
  if (!mine) return NextResponse.json({ error: "This job is not assigned to you" }, { status: 403 });

  const patch = isReturn
    ? { return_assigned_driver_id: null, return_trip_status: "confirmed", updated_at: new Date().toISOString() }
    : { assigned_driver_id: null, trip_status: "confirmed", updated_at: new Date().toISOString() };
  const { error } = await db.from("bookings").update(patch).eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (user && pass) {
    const when = [prettyDate(isReturn ? booking.return_date : booking.ride_date), prettyTime(isReturn ? booking.return_time : booking.ride_time)].filter(Boolean).join(" at ");
    const guest = booking.clients || {};
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: OWNER,
      subject: `${session.name || "A driver"} gave back ${booking.confirmation || "a job"}`,
      text: [
        `${session.name || "A driver"} gave this job back to dispatch.`,
        "",
        `Confirmation: ${booking.confirmation || ""}${isReturn ? " return" : ""}`,
        `Customer: ${guest.full_name || ""}`,
        `Date: ${when}`,
        `Pickup: ${(isReturn ? booking.return_pickup : booking.pickup) || ""}`,
        `Drop-off: ${(isReturn ? booking.return_dropoff : booking.dropoff) || ""}`,
      ].join("\n"),
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}
