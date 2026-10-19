import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { blacklaneSubject, blacklaneDate, formatTimeDisplay } from "@/lib/booking";

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

async function sendCancel(to: string, subject: string, text: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass || !to.includes("@")) return;
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await transporter.sendMail({ from: `"Jean Limo" <${user}>`, to, subject, text }).catch(() => null);
}

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));

  if (body.kind === "partner") {
    const { data: row } = await db.from("farm_outs").select("*").eq("id", body.id).maybeSingle();
    if (!row) return NextResponse.json({ error: "Job not found" }, { status: 404 });
    const { error } = await db.from("farm_outs").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const dateStr = row.ride_date;
    const when = [blacklaneDate(dateStr), prettyTime(row.ride_time)].filter(Boolean).join(" ");
    const text = [
      "Ride reassigned",
      "This ride has been removed from your schedule.",
      "",
      "Ride details",
      `Booking no: ${row.confirmation || ""}`,
      "",
      when,
      "",
      `From ${row.pickup || ""}`,
      `To ${row.dropoff || ""}`,
      "",
      `Customer: ${row.guest_name || ""}`,
    ].join("\n");
    if (row.partner_email) {
      const subject = blacklaneSubject("Ride cancellation", row.confirmation || "", dateStr);
      await sendCancel(row.partner_email, subject, text);
    }
    return NextResponse.json({ ok: true });
  }

  const bookingId = String(body.bookingId || "");
  const isReturn = String(body.leg || "outbound") === "return";
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });
  const { data: booking } = await db.from("bookings").select("*, clients(full_name)").eq("id", bookingId).maybeSingle();
  if (!booking) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const driverId = isReturn ? booking.return_assigned_driver_id : booking.assigned_driver_id;
  let driver: any = null;
  if (driverId) {
    const { data } = await db.from("drivers").select("*").eq("id", driverId).maybeSingle();
    driver = data;
  }

  const patch = isReturn
    ? { return_trip_status: "cancelled", return_assigned_driver_id: null, updated_at: new Date().toISOString() }
    : { status: "cancelled", trip_status: "cancelled", assigned_driver_id: null, updated_at: new Date().toISOString() };
  const { error } = await db.from("bookings").update(patch).eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (driver?.email) {
    const dateStr = isReturn ? booking.return_date : booking.ride_date;
    const timeStr = isReturn ? booking.return_time : booking.ride_time;
    const when = [blacklaneDate(dateStr), prettyTime(timeStr)].filter(Boolean).join(" ");
    const guest = booking.clients || {};
    const conf = `${booking.confirmation || ""}${isReturn ? " return" : ""}`;
    const text = [
      "Ride reassigned",
      "This ride has been removed from your schedule.",
      "",
      "Ride details",
      `Booking no: ${conf}`,
      "",
      when,
      "",
      `From ${(isReturn ? booking.return_pickup : booking.pickup) || ""}`,
      `To ${(isReturn ? booking.return_dropoff : booking.dropoff) || ""}`,
      "",
      `Customer: ${guest.full_name || ""}`,
    ].join("\n");
    const subject = blacklaneSubject("Ride cancellation", conf, dateStr);
    await sendCancel(driver.email, subject, text);
  }
  return NextResponse.json({ ok: true, emailed: Boolean(driver?.email) });
}
