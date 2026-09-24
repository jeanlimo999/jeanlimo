import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { bookingFromSession, formatDateTime } from "@/lib/booking";

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
      const returnWhen = formatDateTime(returnDate || booking.returnDate, returnTime || booking.returnTime);
      const hasReturn = !!(returnWhen || returnFlightNumber || booking.returnFlightNumber || returnPickup || booking.returnPickup);

      const lines = [
        action === "cancel" ? "CANCEL REQUEST" : "DATE / TIME CHANGE REQUEST",
        "",
        `Confirmation: ${booking.confirmation}`,
        `Name: ${booking.name}`,
        `Phone: ${booking.phone}`,
        `Email: ${booking.email}`,
        `Vehicle: ${booking.vehicle || ""}`,
        "",
        "ORIGINAL TRIP",
        `Date / time: ${originalWhen}`,
      ];

      if (action === "change") {
        lines.push(
          "",
          "REQUESTED CHANGE",
          `New date / time: ${newWhen}`
        );
      }

      lines.push(
        `Pickup: ${pickup || booking.pickup || ""}`,
        `Drop-off: ${dropoff || booking.dropoff || ""}`,
        `Flight: ${flightNumber || booking.flightNumber || ""}`
      );

      if (hasReturn) {
        lines.push(
          "",
          "RETURN TRIP",
          `Date / time: ${returnWhen || ""}`,
          `Pickup: ${returnPickup || booking.returnPickup || ""}`,
          `Drop-off: ${returnDropoff || booking.returnDropoff || ""}`,
          `Flight: ${returnFlightNumber || booking.returnFlightNumber || ""}`
        );
      }

      lines.push(
        "",
        `Notes: ${notes || "none"}`,
        `Amount paid: ${booking.amount != null ? "$" + booking.amount.toFixed(2) : ""}`,
        "",
        "Jean Limo LLC",
        "Jeannie 281-917-0929",
        "Cash 281-917-0085"
      );

      const text = lines.join("\n");

      const row = (label: string, value: string) =>
        `<tr><td style="padding:4px 0;color:#666;width:140px;vertical-align:top">${label}</td><td style="padding:4px 0">${value || "—"}</td></tr>`;
      const html = `
        <div style="font-family:Arial,sans-serif;font-size:15px;color:#111;line-height:1.4;max-width:560px">
          <p style="font-size:18px;font-weight:bold;margin:0 0 16px">${action === "cancel" ? "Cancel request" : "Date / time change request"}</p>
          <table style="width:100%;border-collapse:collapse">${row("Confirmation", booking.confirmation)}${row("Name", booking.name || "")}${row("Phone", booking.phone || "")}${row("Email", booking.email || "")}${row("Vehicle", booking.vehicle || "")}</table>
          <p style="margin:18px 0 6px;font-weight:bold;color:#8a6d00">Original trip</p>
          <table style="width:100%;border-collapse:collapse">${row("Date / time", originalWhen)}</table>
          ${action === "change" ? `<p style="margin:18px 0 6px;font-weight:bold;color:#8a6d00">Requested change</p><table style="width:100%;border-collapse:collapse">${row("New date / time", newWhen)}${row("Pickup", pickup || booking.pickup || "")}${row("Drop-off", dropoff || booking.dropoff || "")}${row("Flight", flightNumber || booking.flightNumber || "")}</table>` : ""}
          ${hasReturn ? `<p style="margin:18px 0 6px;font-weight:bold;color:#8a6d00">Return trip</p><table style="width:100%;border-collapse:collapse">${row("Date / time", returnWhen || "")}${row("Pickup", returnPickup || booking.returnPickup || "")}${row("Drop-off", returnDropoff || booking.returnDropoff || "")}${row("Flight", returnFlightNumber || booking.returnFlightNumber || "")}</table>` : ""}
          <p style="margin:18px 0 6px;font-weight:bold;color:#8a6d00">Other</p>
          <table style="width:100%;border-collapse:collapse">${row("Notes", notes || "none")}${row("Amount paid", booking.amount != null ? "$" + booking.amount.toFixed(2) : "")}</table>
          <p style="margin-top:20px;color:#555;font-size:13px">Jean Limo LLC<br>Jeannie 281-917-0929<br>Cash 281-917-0085</p>
        </div>`;

      await transporter.sendMail({
        from: `"Jean Limo" <${gmailUser}>`,
        to: owner,
        replyTo: booking.email || gmailUser,
        subject,
        text,
        html,
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
          text: `We received your request. Dispatch will confirm by phone or email.\n\n${text}`,
          html: `<p>We received your request. Dispatch will confirm by phone or email.</p>${html}`,
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
