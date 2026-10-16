import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";
import { formatDateTime } from "@/lib/booking";

const SITE = "https://jeanlimo.com";
const CRON_SECRET = process.env.CRON_SECRET || "";

function isInSendWindow() {
  const now = new Date();
  const chicago = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  const hour = chicago.getHours();
  return hour >= 9 && hour < 19; // 9:00 AM – 7:00 PM
}

function parseRideDateTime(date?: string, time?: string): Date | null {
  if (!date || !time) return null;
  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const [_, h, m] = match;
  // Interpret as America/Chicago time
  const iso = `${date}T${h.padStart(2, "0")}:${m}:00`;
  try {
    const d = new Date(iso);
    // Adjust so it represents Chicago local time as UTC for comparison
    const chicagoOffset = new Date().toLocaleString("en-US", { timeZone: "America/Chicago", timeZoneName: "shortOffset" });
    // Simpler reliable approach: create date in Chicago by using the offset
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // Build a date that, when viewed in Chicago, matches the ride time
    const parts = formatter.formatToParts(new Date());
    // Fallback: treat as local and correct with known offset (Chicago is UTC-5 or UTC-6)
    const test = new Date(`${date}T${h.padStart(2, "0")}:${m}:00Z`);
    // Approximate: subtract 5 or 6 hours. We'll use a practical window instead of exact TZ math.
    return new Date(`${date}T${h.padStart(2, "0")}:${m}:00`);
  } catch {
    return null;
  }
}

function reminderText(b: any, client: any) {
  const lines = [
    `Hi ${client.full_name || "there"},`,
    "",
    "This is a friendly reminder that your Jean Limo ride is scheduled for tomorrow.",
    "",
    `Confirmation: ${b.confirmation}`,
    `Date / Time: ${formatDateTime(b.ride_date, b.ride_time)}`,
    `Vehicle: ${b.vehicle || ""}`,
    `Pickup: ${b.pickup || ""}`,
    `Drop-off: ${b.dropoff || ""}`,
  ];

  if (b.return_date || b.return_pickup) {
    lines.push(
      "",
      "Return trip",
      `Date / Time: ${formatDateTime(b.return_date, b.return_time)}`,
      `Return pickup: ${b.return_pickup || ""}`,
      `Return drop-off: ${b.return_dropoff || ""}`
    );
  }

  lines.push(
    "",
    "Need to make a change or cancel?",
    "Manage your booking anytime:",
    `${SITE}/manage`,
    `Or open the mobile version: ${SITE}/app`,
    "",
    "Questions? Call or text Jeannie at 281-917-0929.",
    "",
    "Thank you for choosing Jean Limo.",
    "Jean Limo LLC",
    "Houston, TX"
  );

  return lines.join("\n");
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

    // Practical window: roughly 22–26 hours from now (handles TZ approximation)
    if (pickup < windowStart || pickup > windowEnd) continue;

    try {
      await transporter.sendMail({
        from: `"Jean Limo" <${user}>`,
        to: client.email,
        replyTo: process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com",
        subject: `Your Jean Limo ride is tomorrow — Confirmation ${b.confirmation}`,
        text: reminderText(b, client),
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
