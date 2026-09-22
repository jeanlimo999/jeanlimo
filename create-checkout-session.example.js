/**
 * Example Netlify Function / Node handler
 * POST JSON: { email, rideCents, tipCents, tipPercent }
 * Returns: { url }  → redirect the browser to Stripe Checkout
 *
 * Env: STRIPE_SECRET_KEY, SUCCESS_URL, CANCEL_URL
 */

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const body = JSON.parse(event.body || "{}");
  const rideCents = Number(body.rideCents) || 28000;
  const tipCents = Number(body.tipCents) || 0;
  const tipPercent = Number(body.tipPercent) || 0;
  const email = body.email;

  const line_items = [
    {
      price_data: {
        currency: "usd",
        unit_amount: rideCents,
        product_data: {
          name: "Jean Limo – SEDAN (oneway)",
          description: "Outbound 28.8 mi $130 + return 27.0 mi $130",
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
          description: `${tipPercent}% gratuity`,
        },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email || undefined,
    line_items,
    success_url: process.env.SUCCESS_URL || "https://example.com/success",
    cancel_url: process.env.CANCEL_URL || "https://example.com/cancel",
    metadata: {
      confirmation: "JL-260921-751Q",
      tip_percent: String(tipPercent),
    },
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: session.url, id: session.id }),
  };
};
