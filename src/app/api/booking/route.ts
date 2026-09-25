import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { bookingFromSession, formatDateTime } from "@/lib/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

async function assignedDriver(confirmation: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key || !confirmation) return { driverName: "", driverPhone: "", tripStatus: "" };
  try {
    const sb = createClient(url, key);
    const { data } = await sb
      .from("bookings")
      .select("trip_status, assigned_driver_id, drivers(name, phone)")
      .eq("confirmation", confirmation)
      .maybeSingle();
    const drv = (data as any)?.drivers;
    const one = Array.isArray(drv) ? drv[0] : drv;
    return {
      driverName: one?.name || "",
      driverPhone: one?.phone || "",
      tripStatus: (data as any)?.trip_status || "",
    };
  } catch {
    return { driverName: "", driverPhone: "", tripStatus: "" };
  }
}

async function findSession(confirmation: string, sessionId?: string) {
  if (sessionId) {
    return stripe.checkout.sessions.retrieve(sessionId);
  }
  const code = confirmation.trim().toUpperCase();
  const list = await stripe.checkout.sessions.list({ limit: 100 });
  const match = list.data.find((s) => (s.metadata?.confirmation || "").toUpperCase() === code);
  return match || null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id") || "";
    const confirmation = searchParams.get("confirmation") || "";
    const phone = (searchParams.get("phone") || "").replace(/\D/g, "");
    if (!sessionId && !confirmation) {
      return NextResponse.json({ error: "Enter a confirmation number" }, { status: 400 });
    }
    const session = await findSession(confirmation, sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = bookingFromSession(session);
    if (phone && booking.phone.replace(/\D/g, "").slice(-4) !== phone.slice(-4)) {
      return NextResponse.json({ error: "Phone does not match this booking" }, { status: 403 });
    }
    const driver = await assignedDriver(booking.confirmation);
    return NextResponse.json({ booking: { ...booking, ...driver } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lookup failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const confirmation = String(body.confirmation || "").trim().toUpperCase();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const action = body.action === "cancel" ? "cancel" : "change";
    const notes = String(body.notes || "").slice(0, 500);
    const newDate = String(body.newDate || "").slice(0, 20);
    const newTime = String(body.newTime || "").slice(0, 10);
    const pickup = String(body.pickup || "").slice(0, 400);
    const dropoff = String(body.dropoff || "").slice(0, 400);
    const flightNumber = String(body.flightNumber || "").slice(0, 20);
    const returnDate = String(body.returnDate || "").slice(0, 20);
    const returnTime = String(body.returnTime || "").slice(0, 10);
    const returnPickup = String(body.returnPickup || "").slice(0, 400);
    const returnDropoff = String(body.returnDropoff || "").slice(0, 400);
    const returnFlightNumber = String(body.returnFlightNumber || "").slice(0, 20);
    if (!confirmation) {
      return NextResponse.json({ error: "Confirmation number required" }, { status: 400 });
    }
    const session = await findSession(confirmation);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const booking = bookingFromSession(session);
    if (phone && booking.phone.replace(/\D/g, "").slice(-4) !== phone.slice(-4)) {
      return NextResponse.json({ error: "Phone does not match this booking" }, { status: 403 });
    }
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        status: action === "cancel" ? "cancel_requested" : "change_requested",
        changeRequest: action,
        changeNotes: notes,
        originalDate: session.metadata?.originalDate || booking.date,
        originalTime: session.metadata?.originalTime || booking.time,
        requestedDate: newDate || booking.date,
        requestedTime: newTime || booking.time,
        date: action === "change" && newDate ? newDate : booking.date,
        time: action === "change" && newTime ? newTime : booking.time,
        pickup: action === "change" && pickup ? pickup : booking.pickup,
        dropoff: action === "change" && dropoff ? dropoff : booking.dropoff,
        flightNumber: action === "change" ? flightNumber : booking.flightNumber,
        returnDate: action === "change" ? returnDate || booking.returnDate : booking.returnDate,
        returnTime: action === "change" ? returnTime || booking.returnTime : booking.returnTime,
        returnPickup: action === "change" ? returnPickup || booking.returnPickup : booking.returnPickup,
        returnDropoff: action === "change" ? returnDropoff || booking.returnDropoff : booking.returnDropoff,
        returnFlightNumber: action === "change" ? returnFlightNumber : booking.returnFlightNumber,
        changeRequestedAt: new Date().toISOString(),
      },
    });
    const owner = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      const subject =
        action === "cancel"
          ? `Cancel request ${booking.confirmation}`
          : `Change request ${booking.confirmation}`;
      const originalWhen = formatDateTime(booking.date, booking.time) || "n/a";
      const newWhen = formatDateTime(newDate || booking.date, newTime || booking.time) || originalWhen;
      await transporter.sendMail({
        from: `"Jean Limo" <${gmailUser}>`,
        to: owner,
        replyTo: booking.email || gmailUser,
        subject,
        text: `${action} ${booking.confirmation} ${booking.name} ${newWhen} ${notes}`,
      });
    }
    return NextResponse.json({
      success: true,
      message: action === "cancel" ? "Cancel request received." : "Change request received.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Request failed" }, { status: 500 });
  }
}
