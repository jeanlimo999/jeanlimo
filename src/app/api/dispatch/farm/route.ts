import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function token() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const partnerId = String(body.partnerId || "");
  const bookingId = String(body.bookingId || "");
  const pay = Math.round(Number(body.pay || 0) * 100);
  if (!partnerId || !bookingId) return NextResponse.json({ error: "Pick a partner and a job" }, { status: 400 });

  const { data: partner, error: pErr } = await db.from("partners").select("*").eq("id", partnerId).maybeSingle();
  if (pErr || !partner) return NextResponse.json({ error: pErr?.message || "Partner not found. Add them on the dispatch board first." }, { status: 400 });

  const { data: booking } = await db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_notes").eq("id", bookingId).maybeSingle();
  const linkToken = token();
  const { error } = await db.from("farm_outs").insert({
    token: linkToken,
    booking_id: bookingId,
    confirmation: booking?.confirmation || body.confirmation || "",
    partner_id: partner.id,
    partner_name: partner.company,
    partner_phone: partner.phone || "",
    partner_email: partner.email || "",
    pay_cents: pay,
    status: "offered",
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: "Run supabase/partners.sql in Supabase first. " + error.message }, { status: 500 });

  const link = "https://jeanlimo.com/farm.html?t=" + linkToken;
  const text = [
    "Jean Limo farm-out",
    partner.company,
    "",
    "Confirmation: " + (booking?.confirmation || ""),
    "When: " + [booking?.ride_date, booking?.ride_time].filter(Boolean).join(" "),
    "Pickup: " + (booking?.pickup || ""),
    "Drop-off: " + (booking?.dropoff || ""),
    "Flight: " + (booking?.flight_number || ""),
    "Passengers: " + (booking?.passengers || ""),
    "Your pay: $" + (pay / 100).toFixed(0),
    "",
    "Open this private link to accept and update status:",
    link,
    "",
    "Do not charge the customer. Jean Limo pays you after the trip.",
  ].join("\n");

  let emailed = false;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (partner.email && user && pass) {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: partner.email,
      replyTo: process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com",
      subject: "Jean Limo job " + (booking?.confirmation || ""),
      text,
    });
    emailed = true;
  }

  const sms = partner.phone
    ? "sms:" + String(partner.phone).replace(/[^\d+]/g, "") + "?body=" + encodeURIComponent("Jean Limo job " + (booking?.confirmation || "") + ". Accept here: " + link)
    : "";
  return NextResponse.json({ ok: true, link, sms, emailed, partner: partner.company });
}
