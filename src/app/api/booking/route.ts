import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { bookingFromSession } from "@/lib/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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

    return NextResponse.json({ booking });
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
        originalDate: booking.date,
        originalTime: booking.time,
        requestedDate: newDate,
        requestedTime: newTime,
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
      const text = [
        action === "cancel" ? "CANCEL REQUEST" : "DATE / TIME CHANGE REQUEST",
        `Confirmation: ${booking.confirmation}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email}`,
        `Vehicle: ${booking.vehicle}`,
        "",
        `Original date: ${booking.date || "n/a"}`,
        `Original time: ${booking.time || "n/a"}`,
        `Requested new date: ${newDate || "(not changed)"}`,
        `Requested new time: ${newTime || "(not changed)"}`,
        `Notes: ${notes || "(none)"}`,
        "",
        `Pickup: ${booking.pickup}`,
        `Drop-off: ${booking.dropoff}`,
        `Amount paid: ${booking.amount != null ? "$" + booking.amount.toFixed(2) : ""}`,
        "",
        "Jean Limo LLC · Jeannie 281-917-0929 · Cash 281-917-0085",
      ].join("\n");

      await transporter.sendMail({
        from: `"Jean Limo" <${gmailUser}>`,
        to: owner,
        replyTo: booking.email || gmailUser,
        subject,
        text,
      });
      if (booking.email && booking.email.includes("@")) {
        await transporter.sendMail({
          from: `"Jean Limo" <${gmailUser}>`,
          to: booking.email,
          replyTo: owner,
          subject:
            action === "cancel"
              ? `Your Jean Limo cancel request ${booking.confirmation}`
              : `Your Jean Limo time change request ${booking.confirmation}`,
          text:
            `We received your request. Dispatch will confirm by phone or email.\n\n${text}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message:
        action === "cancel"
          ? "Cancel request emailed to you and to Jean Limo. We will confirm any refund by phone."
          : "Change request emailed to you and to Jean Limo with the original and new date/time.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Request failed" }, { status: 500 });
  }
}
