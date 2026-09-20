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
    } = body;

    if (!price || price <= 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const confirmation = makeConfirmationNumber();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Jean Limo – ${vehicle?.toUpperCase() || "Vehicle"} (${type || "oneway"})`,
              description: breakdown || "Private chauffeur service",
            },
            unit_amount: Math.round(Number(price) * 100), // cents
          },
          quantity: 1,
        },
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
