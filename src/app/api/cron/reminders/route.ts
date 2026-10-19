import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDateTime, blacklaneDate, rideDetailsHtml, jeanLimoSubject } from "@/lib/booking";

const SITE = "https://jeanlimo.com";
const CRON_SECRET = process.env.CRON_SECRET || "";

function isInSendWindow() {
  const now = new Date();
  const chicago = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const hour = chicago.getHours();
  return hour >= 9 && hour < 19;
}

function parseRideDateTime(date?: string, time?: string): Date | null {
  if (!date || !time) return null;
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const [_, h, m] = match;
  try {
    return new Date(`${date}T${h.padStart(2, "0")}:${m}:00`);
  } catch {
    return null;
  }
}

function reminderHtml(b: any, client: any) {
  let extra = "";
  if (b.return_date || b.return_pickup) {
    extra += `
      <div style="margin-top:16px;font-weight:700;">Return trip</div>
      <div>${formatDateTime(b.return_date, b.return_time)}</div>
      <div style="margin:6px 0;"><strong>From</strong> ${String(b.return_pickup || "").replace(/</g, "<")}</div>
      <div><strong>To</strong> ${String(b.return_dropoff || "").replace(/</g, "<")}</div>
    `;
  }
  extra += `
    <div style="margin-top:16px;">
      Need to make a change or cancel?<br/>
      <a href="${SITE}/manage">Manage booking</a> · <a href="${SITE}/app">Mobile</a><br/><br/>
      Questions? Call or text Jeannie at 281-917-0929.<br/><br/>
      Thank you for choosing Jean Limo.<br/>
      Jean Limo LLC · Houston, TX
    </div>
  `;

  return `
    <p>Hi ${String(client.full_name || "there").replace(/</g, "<")},</p>
    <p>This is a friendly reminder that your Jean Limo ride is scheduled for tomorrow.</p>
    ${rideDetailsHtml({
      confirmation: b.confirmation,
      dateLabel: blacklaneDate(b.ride_date),
      time: formatDateTime("", b.ride_time) || b.ride_time,
      pickup: b.pickup,
      dropoff: b.dropoff,
      vehicle: b.vehicle,
      flight: b.flight_number,
      extra,
    })}
  `;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.nextUrl.searchParams.get("secret") || "";
  if (CRON_SECRET && auth !== CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isInSendWindow()) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Outside 9am–7pm Houston time" });
  }

  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 22 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000);

  const { data: rows, error } = await db
    .from("bookings")
    .select(`
      confirmation,
      ride_date,
      ride_time,
      vehicle,
      pickup,
      dropoff,
      flight_number,
      return_date,
      return_time,
      return_pickup,
      return_dropoff,
      status,
      reminder_sent_at,
      clients!inner(email, full_name, phone)
    `)
    .is("reminder_sent_at", null)
    .not("status", "in", "(cancelled,completed)")
    .not("ride_date", "eq", "");

  if (error) {
    console.error("Reminder query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  let sent = 0;
  const results: string[] = [];

  for (const b of rows || []) {
    const client = Array.isArray(b.clients) ? b.clients[0] : b.clients;
    if (!client?.email || !String(client.email).includes("@")) continue;

    const pickup = parseRideDateTime(b.ride_date, b.ride_time);
    if (!pickup) continue;

    if (pickup < windowStart || pickup > windowEnd) continue;

    try {
      const time = formatDateTime("", b.ride_time) || b.ride_time || "";
      const subject = jeanLimoSubject({
        time,
        customer: client.full_name,
        pickingUp: true,
      });
      await transporter.sendMail({
        from: `"Jean Limo" <${user}>`,
        to: client.email,
        replyTo: process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com",
        subject,
        html: reminderHtml(b, client),
      });

      await db
        .from("bookings")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("confirmation", b.confirmation);

      sent += 1;
      results.push(b.confirmation);
    } catch (err: any) {
      console.error(`Failed to send reminder for ${b.confirmation}:`, err.message);
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    checked: rows?.length || 0,
    confirmations: results,
    window: "9am–7pm Houston time",
  });
}
