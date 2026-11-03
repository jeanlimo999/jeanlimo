import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { makeConfirmationNumber } from "@/lib/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

function buildReceiptDescription(data: {
  confirmation: string;
  vehicle?: string;
  type?: string;
  passengerName?: string;
  date?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  flightNumber?: string;
  returnDate?: string;
  returnTime?: string;
  returnPickup?: string;
  returnDropoff?: string;
  returnFlightNumber?: string;
  breakdown?: string;
}) {
  const isRoundTrip = !!(data.returnDate || data.returnPickup);
  const tripType = String(data.type || "").toLowerCase() === "hourly"
    ? "Hourly"
    : isRoundTrip
      ? "Round Trip"
      : "Transfer";

  const vehicle = (data.vehicle || "Vehicle").toUpperCase();
  const lines: string[] = [];

  lines.push(`${vehicle} ${tripType} | Conf: ${data.confirmation}`);
  if (data.passengerName) lines.push(`Passenger: ${data.passengerName}`);

  if (data.date || data.pickup) {
    const outbound = [
      data.date && data.time ? `${data.date} ${data.time}` : data.date || data.time,
      data.pickup && data.dropoff ? `${data.pickup} → ${data.dropoff}` : data.pickup || data.dropoff,
      data.flightNumber ? `(${data.flightNumber})` : null,
    ].filter(Boolean).join(" – ");
    if (outbound) lines.push(`Outbound: ${outbound}`);
  }

  if (isRoundTrip && (data.returnDate || data.returnPickup)) {
    const ret = [
      data.returnDate && data.returnTime ? `${data.returnDate} ${data.returnTime}` : data.returnDate || data.returnTime,
      data.returnPickup && data.returnDropoff ? `${data.returnPickup} → ${data.returnDropoff}` : data.returnPickup || data.returnDropoff,
      data.returnFlightNumber ? `(${data.returnFlightNumber})` : null,
    ].filter(Boolean).join(" – ");
    if (ret) lines.push(`Return: ${ret}`);
  }

  if (data.breakdown) lines.push(data.breakdown);

  return lines.join("\n").slice(0, 1000); // Stripe description limit is 1000 chars
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      price,
      tipAmount = 0,
      tipPercent = 0,
      vehicle,
      type,
      breakdown,
      passengerName,
      passengerPhone,
      passengerEmail,
      date,
      time,
      pickup,
      dropoff,
      flightNumber,
      notes,
      returnNotes,
      returnFlightNumber,
      returnDate,
      returnTime,
      returnPickup,
      returnDropoff,
    } = body;

    if (!price || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmation = makeConfirmationNumber();

    const receiptDescription = buildReceiptDescription({
      confirmation,
      vehicle,
      type,
      passengerName,
      date,
      time,
      pickup,
      dropoff,
      flightNumber,
      returnDate,
      returnTime,
      returnPickup,
      returnDropoff,
      returnFlightNumber,
      breakdown,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Jean Limo – ${vehicle?.toUpperCase() || "Vehicle"} (${
                String(type).toLowerCase() === "hourly"
                  ? "hourly"
                  : (returnDate || returnPickup)
                    ? "round trip"
                    : "transfer"
              })`,
              description: breakdown || "Private chauffeur service",
            },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: 1,
        },
        ...(Number(tipAmount) > 0
          ? [{
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Driver tip",
                  description: `${Number(tipPercent) || 0}% of ride total`,
                },
                unit_amount: Math.round(Number(tipAmount) * 100),
              },
              quantity: 1,
            }]
          : []),
      ],
      customer_email: passengerEmail || undefined,
      client_reference_id: confirmation,
      payment_intent_data: {
        description: receiptDescription,
        receipt_email: passengerEmail || undefined,
      },
      metadata: {
        confirmation,
        status: "confirmed",
        vehicle: vehicle || "",
        type: type || "",
        passengerName: passengerName || "",
        passengerPhone: passengerPhone || "",
        date: date || "",
        time: time || "",
        pickup: pickup || "",
        dropoff: dropoff || "",
        breakdown: breakdown || "",
        flightNumber: String(flightNumber || "").slice(0, 20),
        notes: String(notes || "").slice(0, 400),
        returnNotes: String(returnNotes || "").slice(0, 400),
        returnFlightNumber: String(returnFlightNumber || "").slice(0, 20),
        returnDate: String(returnDate || "").slice(0, 20),
        returnTime: String(returnTime || "").slice(0, 10),
        returnPickup: String(returnPickup || "").slice(0, 400),
        returnDropoff: String(returnDropoff || "").slice(0, 400),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: err.message || "Payment session failed" }, { status: 500 });
  }
}
