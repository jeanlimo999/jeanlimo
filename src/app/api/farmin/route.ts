import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const passenger = String(body.passenger || "").trim();
  const phone = String(body.phone || "").trim();
  const date = String(body.date || "").slice(0, 10);
  const time = String(body.time || "").slice(0, 8);
  const pickup = String(body.pickup || "").trim();
  const dropoff = String(body.dropoff || "").trim();
  const pay = Number(body.pay || 0);
  if (!email || !passenger || !date || !time || !pickup || !dropoff || !pay) {
    return NextResponse.json({ error: "Email, passenger, date, time, pickup, drop-off, and your pay to Jean Limo are required." }, { status: 400 });
  }
  const { data: partner } = await db.from("partners").select("id, company, email, city").ilike("email", email).eq("active", true).maybeSingle();
  if (!partner) return NextResponse.json({ error: "That email is not an approved partner. Apply at jeanlimo.com/partners first." }, { status: 403 });

  const row = {
    partner_id: partner.id,
    partner_name: partner.company,
    partner_email: email,
    passenger,
    phone,
    ride_date: date,
    ride_time: time,
    pickup,
    dropoff,
    flight: String(body.flight || "").slice(0, 20),
    passengers: Number(body.passengers || 0) || null,
    vehicle: String(body.vehicle || "sedan"),
    pay_cents: Math.round(pay * 100),
    notes: String(body.notes || "").slice(0, 500),
    status: "pending",
  };
  const { data, error } = await db.from("farm_ins").insert(row).select("id").single();
  if (error) return NextResponse.json({ error: "Farm-in table is missing. Run the farm-in SQL in Supabase. " + error.message }, { status: 500 });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const owner = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
  if (user && pass) {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: owner,
      replyTo: email,
      subject: `Farm-in offer from ${partner.company} · $${pay}`,
      text: [`${partner.company} wants to farm a job into Houston.`, `They pay Jean Limo $${pay}. Do not charge the passenger.`, `Passenger: ${passenger} ${phone}`, `${date} ${time}`, `Pickup: ${pickup}`, `Drop-off: ${dropoff}`, `Flight: ${body.flight || ""}`, `Notes: ${body.notes || ""}`, "", "Accept or decline: https://jeanlimo.com/dispatch/inbox"].join("\n"),
    });
  }
  return NextResponse.json({ ok: true, id: data.id });
}
