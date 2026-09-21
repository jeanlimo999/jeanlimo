import { NextRequest, NextResponse } from "next/server";

const OWNER_EMAIL = "cashtienlam@gmail.com";

function bookingText(b: any) {
  return [
    `Confirmation: ${b.confirmation || "N/A"}`,
    `Name: ${b.name || ""}`,
    `Phone: ${b.phone || ""}`,
    `Email: ${b.email || ""}`,
    `Vehicle: ${b.vehicle || ""}`,
    `Type: ${b.type || ""}`,
    `Date: ${b.date || ""}`,
    `Time: ${b.time || ""}`,
    `Pickup: ${b.pickup || ""}`,
    `Drop-off: ${b.dropoff || ""}`,
    `Amount paid: ${b.amount != null ? "$" + Number(b.amount).toFixed(2) : ""}`,
    `Notes: ${b.breakdown || ""}`,
    "",
    "Jean Limo LLC",
    "Jeannie 281-917-0929 · Cash 281-917-0085",
    "Manage booking: https://delicate-nougat-e223ef.netlify.app/manage",
  ].join("\n");
}

async function sendFormSubmit(to: string, subject: string, text: string, replyTo?: string) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      _captcha: "false",
      name: "Jean Limo Booking",
      email: replyTo || OWNER_EMAIL,
      message: text,
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    if (!booking?.confirmation) {
      return NextResponse.json({ error: "Missing booking" }, { status: 400 });
    }

    const text = bookingText(booking);
    const subjectOwner = `New Jean Limo booking ${booking.confirmation}`;
    const subjectCustomer = `Your Jean Limo confirmation ${booking.confirmation}`;

    const ownerSent = await sendFormSubmit(OWNER_EMAIL, subjectOwner, text, booking.email);
    let customerSent = false;
    if (booking.email && String(booking.email).includes("@")) {
      customerSent = await sendFormSubmit(
        String(booking.email),
        subjectCustomer,
        `Thank you for booking Jean Limo.\n\n${text}`,
        OWNER_EMAIL
      );
    }

    return NextResponse.json({ ok: true, ownerSent, customerSent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Email failed" }, { status: 500 });
  }
}
