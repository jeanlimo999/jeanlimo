import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatDateTime } from "@/lib/booking";
import { saveWebsiteBooking } from "@/lib/portal";

const OWNER_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";

function bookingText(b: any) {
  const lines = [
    `Confirmation: ${b.confirmation || "N/A"}`,
    `Name: ${b.name || ""}`,
    `Phone: ${b.phone || ""}`,
    `Email: ${b.email || ""}`,
    `Vehicle: ${b.vehicle || ""}`,
    `Type: ${b.type || ""}`,
    "",
    `Date / time: ${formatDateTime(b.date, b.time)}`,
    `Flight: ${b.flightNumber || ""}`,
    `Pickup address: ${b.pickup || ""}`,
    `Drop-off address: ${b.dropoff || ""}`,
  ];

  if (b.returnDate || b.returnTime || b.returnPickup || b.returnDropoff) {
    lines.push(
      "",
      "Return trip",
      `Date / time: ${formatDateTime(b.returnDate, b.returnTime)}`,
      `Return flight: ${b.returnFlightNumber || ""}`,
      `Return pickup: ${b.returnPickup || ""}`,
      `Return drop-off: ${b.returnDropoff || ""}`
    );
  }

  lines.push(
    "",
    `Amount paid: ${b.amount != null ? "$" + Number(b.amount).toFixed(2) : ""}`,
    `Notes: ${b.breakdown || ""}`,
    "",
    "Jean Limo LLC",
    "Jeannie 281-917-0929 · Cash 281-917-0085",
    "My trips: https://delicate-nougat-e223ef.netlify.app/account",
    "Manage booking: https://delicate-nougat-e223ef.netlify.app/manage"
  );

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    if (!booking?.confirmation) {
      return NextResponse.json({ error: "Missing booking" }, { status: 400 });
    }

    try {
      await saveWebsiteBooking(booking);
    } catch (err) {
      console.error("Supabase save failed", err);
    }

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

    const text = bookingText(booking);

    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: OWNER_EMAIL,
      replyTo: booking.email || user,
      subject: `New Jean Limo booking ${booking.confirmation}`,
      text,
    });

    let customerSent = false;
    if (booking.email && String(booking.email).includes("@")) {
      await transporter.sendMail({
        from: `"Jean Limo" <${user}>`,
        to: String(booking.email),
        replyTo: OWNER_EMAIL,
        subject: `Your Jean Limo confirmation ${booking.confirmation}`,
        text: `Thank you for booking Jean Limo.\n\n${text}`,
      });
      customerSent = true;
    }

    return NextResponse.json({ ok: true, ownerSent: true, customerSent });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message || "Email failed" }, { status: 500 });
  }
}
