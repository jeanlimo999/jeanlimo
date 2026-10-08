import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const OWNER_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const company = String(body.company || "").trim();
    const contact = String(body.contact || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const city = String(body.city || "").trim();
    const airports = String(body.airports || "").trim();
    const vehicles = String(body.vehicles || "").trim();
    const insurance = String(body.insurance || "").trim();
    const notes = String(body.notes || "").trim();

    if (!company || !contact || !phone || !email || !city) {
      return NextResponse.json({ error: "Company, contact, phone, email, and city are required." }, { status: 400 });
    }

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
    }

    const text = [
      "New Jean Limo partner application",
      "",
      `Company: ${company}`,
      `Contact: ${contact}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `City: ${city}`,
      `Airports: ${airports || "—"}`,
      `Vehicles: ${vehicles || "—"}`,
      `Insurance: ${insurance || "—"}`,
      `Notes: ${notes || "—"}`,
      "",
      "Not approved until you reply. Do not assign jobs until insurance is checked.",
    ].join("\n");

    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Partner application: ${company} · ${city}`,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Could not send application" }, { status: 500 });
  }
}
