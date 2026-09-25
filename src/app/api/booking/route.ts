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
