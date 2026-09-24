import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatDateTime } from "@/lib/booking";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const body = await req.json();
  const confirmation = String(body.confirmation || "").trim().toUpperCase();
  const action = body.action === "cancel" ? "cancel" : "change";
  const notes = String(body.notes || "").slice(0, 500);
  if (!confirmation) return NextResponse.json({ error: "Confirmation required" }, { status: 400 });

  const { data: booking, error: findErr } = await db
    .from("bookings")
    .select("*")
    .eq("confirmation", confirmation)
    .eq("client_id", session.clientId)
    .maybeSingle();
  if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const { data: client } = await db.from("clients").select("*").eq("id", session.clientId).maybeSingle();

  const newDate = String(body.newDate || booking.ride_date || "").slice(0, 20);
  const newTime = String(body.newTime || booking.ride_time || "").slice(0, 10);
  const pickup = String(body.pickup ?? booking.pickup ?? "").slice(0, 400);
  const dropoff = String(body.dropoff ?? booking.dropoff ?? "").slice(0, 400);
  const flightNumber = String(body.flightNumber ?? booking.flight_number ?? "").slice(0, 20);
  const returnDate = String(body.returnDate ?? booking.return_date ?? "").slice(0, 20);
  const returnTime = String(body.returnTime ?? booking.return_time ?? "").slice(0, 10);
  const returnPickup = String(body.returnPickup ?? booking.return_pickup ?? "").slice(0, 400);
  const returnDropoff = String(body.returnDropoff ?? booking.return_dropoff ?? "").slice(0, 400);
  const returnFlightNumber = String(body.returnFlightNumber ?? booking.return_flight_number ?? "").slice(0, 20);

  const patch: Record<string, string> = {
    status: action === "cancel" ? "cancelled" : "change_requested",
    updated_at: new Date().toISOString(),
  };

  if (action === "change") {
    patch.ride_date = newDate;
    patch.ride_time = newTime;
    patch.pickup = pickup;
    patch.dropoff = dropoff;
    patch.flight_number = flightNumber;
    patch.return_date = returnDate;
    patch.return_time = returnTime;
    patch.return_pickup = returnPickup;
    patch.return_dropoff = returnDropoff;
    patch.return_flight_number = returnFlightNumber;
  }

  const { data: updated, error: updErr } = await db
    .from("bookings")
    .update(patch)
    .eq("id", booking.id)
    .select("*")
    .single();
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  await db.from("booking_requests").insert({
    booking_id: booking.id,
    kind: action,
    payload: body,
    status: "open",
  });

  const owner = process.env.BOOKING_NOTIFY_EMAIL || "cashtienlam@gmail.com";
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const customerEmail = client?.email || "";

  if (gmailUser && gmailPass) {
    const originalWhen = formatDateTime(booking.ride_date, booking.ride_time) || "n/a";
    const newWhen = formatDateTime(newDate, newTime) || originalWhen;
    const returnWhen = formatDateTime(returnDate, returnTime);
    const text = [
      action === "cancel" ? "CANCEL REQUEST" : "DATE / TIME CHANGE REQUEST",
      "",
      `Confirmation: ${booking.confirmation}`,
      `Name: ${client?.full_name || ""}`,
      `Phone: ${client?.phone || ""}`,
      `Email: ${customerEmail}`,
      `Vehicle: ${booking.vehicle || ""}`,
      "",
      "ORIGINAL TRIP",
      `Date / time: ${originalWhen}`,
      `Pickup: ${booking.pickup || ""}`,
      `Drop-off: ${booking.dropoff || ""}`,
      "",
      action === "change" ? "REQUESTED CHANGE" : "",
      action === "change" ? `New date / time: ${newWhen}` : "",
      action === "change" ? `Pickup: ${pickup}` : "",
      action === "change" ? `Drop-off: ${dropoff}` : "",
      action === "change" ? `Flight: ${flightNumber}` : "",
      returnWhen ? "" : "",
      returnWhen ? "RETURN TRIP" : "",
      returnWhen ? `Date / time: ${returnWhen}` : "",
      returnWhen ? `Pickup: ${returnPickup}` : "",
      returnWhen ? `Drop-off: ${returnDropoff}` : "",
      "",
      `Notes: ${notes || "none"}`,
      "",
      "Jean Limo LLC",
      "Jeannie 281-917-0929",
      "Cash 281-917-0085",
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const subject =
      action === "cancel"
        ? `Cancel request ${booking.confirmation}`
        : `Change request ${booking.confirmation}`;

    await transporter.sendMail({
      from: `"Jean Limo" <${gmailUser}>`,
      to: owner,
      replyTo: customerEmail || gmailUser,
      subject,
      text,
    });

    if (customerEmail.includes("@")) {
      await transporter.sendMail({
        from: `"Jean Limo" <${gmailUser}>`,
        to: customerEmail,
        replyTo: owner,
        subject:
          action === "cancel"
            ? `Your Jean Limo cancel request ${booking.confirmation}`
            : `Your Jean Limo time change request ${booking.confirmation}`,
        text: `We received your request. Dispatch will confirm by phone or email.\n\n${text}`,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    booking: updated,
    message:
      action === "cancel"
        ? "Cancel request saved and emailed. We will confirm any refund by phone: 281-917-0929."
        : "Changes saved and emailed. Dispatch will confirm by phone if needed.",
  });
}
