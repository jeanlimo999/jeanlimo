import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { makeConfirmationNumber } from "@/lib/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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
      price,          // dollars
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
            unit_amount: Math.round(Number(price) * 100), // cents
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
