import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatDateTime, blacklaneSubject, blacklaneDate } from "@/lib/booking";
import { saveWebsiteBooking } from "@/lib/portal";

const OWNER_EMAIL = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
const SITE = "https://jeanlimo.com";

function bookingText(b: any) {
  const dateLabel = blacklaneDate(b.date);
  const lines = [
    "Ride details",
    `Booking no: ${b.confirmation || "N/A"}`,
    "",
    dateLabel ? `${dateLabel} ${formatDateTime("", b.time) || b.time || ""}`.trim() : formatDateTime(b.date, b.time),
    "",
    `From ${b.pickup || ""}`,
    `To ${b.dropoff || ""}`,
    "",
    `Vehicle: ${b.vehicle || ""}`,
    `Type: ${
      String(b.type || "").toLowerCase() === "hourly"
        ? "hourly"
        : b.returnDate || b.returnPickup || b.returnDropoff
          ? "round trip"
          : "transfer"
    }`,
    `Name: ${b.name || ""}`,
    `Phone: ${b.phone || ""}`,
    `Email: ${b.email || ""}`,
    `Flight: ${b.flightNumber || ""}`,
    `Additional note: ${b.notes || ""}`,
  ];

  if (b.returnDate || b.returnTime || b.returnPickup || b.returnDropoff) {
    lines.push(
      "",
      "Return trip",
      `Date / time: ${formatDateTime(b.returnDate, b.returnTime)}`,
      `Return flight: ${b.returnFlightNumber || ""}`,
      `Return pickup: ${b.returnPickup || ""}`,
      `Return drop-off: ${b.returnDropoff || ""}`,
      `Return note: ${b.returnNotes || ""}`
    );
  }

  lines.push(
    "",
    `Amount paid: ${b.amount != null ? "$" + Number(b.amount).toFixed(2) : ""}`,
    `Notes: ${b.breakdown || ""}`,
    "",
    "Jean Limo LLC",
    "Jeannie 281-917-0929 · Cash 281-917-0085",
    `My trips: ${SITE}/account`,
    `Manage booking: ${SITE}/manage`
  );

  return lines.join("\n");
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

    const text = bookingText(booking);
    const ownerText = saved.saved
      ? text
      : `THIS BOOKING IS NOT ON THE DISPATCH BOARD.\nReason: ${saved.error}\nAdd it with Add trip.\n\n${text}`;

    const subject = blacklaneSubject("Ride confirmation", booking.confirmation, booking.date);

    await transporter.sendMail({
      from: `"Jean Limo" <${user}>`,
      to: OWNER_EMAIL,
      replyTo: booking.email || user,
      subject: saved.saved ? subject : `NOT ON BOARD ${booking.confirmation}`,
      text: ownerText,
    });

    let customerSent = false;
    if (booking.email && String(booking.email).includes("@")) {
      await transporter.sendMail({
        from: `"Jean Limo" <${user}>`,
        to: String(booking.email),
        replyTo: OWNER_EMAIL,
        subject,
        text: `Thank you for booking Jean Limo.\n\n${text}`,
      });
      customerSent = true;
    }

    return NextResponse.json({ ok: true, saved: saved.saved, ownerSent: true, customerSent });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message || "Email failed" }, { status: 500 });
  }
}
