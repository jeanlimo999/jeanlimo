import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatDateTime, blacklaneSubject, blacklaneDate, rideDetailsHtml } from "@/lib/booking";
import { saveWebsiteBooking } from "@/lib/portal";

const OWNER_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
const SITE = "https://jeanlimo.com";

function bookingHtml(b: any) {
  const dateLabel = blacklaneDate(b.date);
  const time = formatDateTime("", b.time) || b.time || "";
  const type =
    String(b.type || "").toLowerCase() === "hourly"
      ? "hourly"
      : b.returnDate || b.returnPickup || b.returnDropoff
        ? "round trip"
        : "transfer";

  let extra = "";
  if (b.returnDate || b.returnTime || b.returnPickup || b.returnDropoff) {
    extra += `
      <div style="margin-top:16px;font-weight:700;">Return trip</div>
      <div>${formatDateTime(b.returnDate, b.returnTime)}</div>
      <div style="margin:6px 0;"><strong>From</strong> ${String(b.returnPickup || "").replace(/</g, "<")}</div>
      <div><strong>To</strong> ${String(b.returnDropoff || "").replace(/</g, "<")}</div>
      ${b.returnFlightNumber ? `<div style="margin:8px 0;"><span style="background:#fff3cd;color:#856404;padding:4px 8px;border-radius:4px;font-weight:700;">Flight: ${String(b.returnFlightNumber).replace(/</g, "<")}</span></div>` : ""}
      ${b.returnNotes ? `<div>Note: ${String(b.returnNotes).replace(/</g, "<")}</div>` : ""}
    `;
  }

  extra += `
    <div style="margin-top:16px;">
      Jean Limo LLC<br/>
      Jeannie 281-917-0929 · Cash 281-917-0085<br/>
      <a href="${SITE}/account">My trips</a> · <a href="${SITE}/manage">Manage booking</a>
    </div>
  `;

  return rideDetailsHtml({
    confirmation: b.confirmation,
    dateLabel,
    time,
    pickup: b.pickup,
    dropoff: b.dropoff,
    vehicle: b.vehicle,
    type,
    name: b.name,
    phone: b.phone,
    email: b.email,
    flight: b.flightNumber,
    notes: b.notes,
    amount: b.amount != null ? `Amount paid: $${Number(b.amount).toFixed(2)}` : "",
    extra,
  });
}

async function saveWithRetry(booking: any) {
  let last = "";
  for (let i = 0; i < 2; i += 1) {
    try {
      const result = await saveWebsiteBooking(booking);
      if (result?.saved) return { saved: true, error: "" };
      last = "Save returned no result";
    } catch (err: any) {
      last = err?.message || "Save failed";
    }
  }
  return { saved: false, error: last };
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    if (!booking?.confirmation) {
      return NextResponse.json({ error: "Missing booking" }, { status: 400 });
    }

    const saved = await saveWithRetry(booking);

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) {
      return NextResponse.json(
        { error: "Email is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD in Netlify." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const html = bookingHtml(booking);
    const ownerHtml = saved.saved
      ? html
      : `<p style="color:#c00;font-weight:700;">THIS BOOKING IS NOT ON THE DISPATCH BOARD.<br/>Reason: ${saved.error}<br/>Add it with Add trip.</p>${html}`;

    const subject = blacklaneSubject("Ride confirmation", booking.confirmation, booking.date);

    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: OWNER_EMAIL,
      replyTo: booking.email || user,
      subject: saved.saved ? subject : `NOT ON BOARD ${booking.confirmation}`,
      html: ownerHtml,
    });

    let customerSent = false;
    if (booking.email && String(booking.email).includes("@")) {
      await transporter.sendMail({
        from: `"Jean Limo" <${user}>`,
        to: String(booking.email),
        replyTo: OWNER_EMAIL,
        subject,
        html: `<p>Thank you for booking Jean Limo.</p>${html}`,
      });
      customerSent = true;
    }

    return NextResponse.json({ ok: true, saved: saved.saved, ownerSent: true, customerSent });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message || "Email failed" }, { status: 500 });
  }
}
