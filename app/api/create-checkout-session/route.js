import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY on Netlify" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.json();
  const rideCents = Math.max(0, Math.round(Number(body.rideCents) || 0));
  const tipCents = Math.max(0, Math.round(Number(body.tipCents) || 0));
  const tipPercent = Number(body.tipPercent) || 0;

  if (rideCents < 50) {
    return NextResponse.json({ error: "Invalid ride total" }, { status: 400 });
  }

  const origin = request.headers.get("origin") || "http://localhost:3000";

  const line_items = [
    {
      price_data: {
        currency: "usd",
        unit_amount: rideCents,
        product_data: {
          name: "Jean Limo – SEDAN",
          description: body.description || "Airport sedan transfer",
        },
      },
      quantity: 1,
    },
  ];

  if (tipCents > 0) {
    line_items.push({
      price_data: {
        currency: "usd",
        unit_amount: tipCents,
        product_data: {
          name: "Driver tip",
          description: `${tipPercent}% of ride total`,
        },
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email || undefined,
      line_items,
      success_url: `${origin}/success`,
      cancel_url: `${origin}/`,
      metadata: {
        passenger: body.name || "",
        phone: body.phone || "",
        tip_percent: String(tipPercent),
      },
    });
    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
