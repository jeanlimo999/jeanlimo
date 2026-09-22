const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = JSON.parse(event.body || "{}");
  const rideCents = Math.max(0, Math.round(Number(body.rideCents) || 0));
  const tipCents = Math.max(0, Math.round(Number(body.tipCents) || 0));
  const tipPercent = Number(body.tipPercent) || 0;
  const email = body.email;
  const name = body.name || "";

  if (rideCents < 50) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid ride total" }),
    };
  }

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

  const origin = event.headers.origin || event.headers.referer || "";
  const success =
    process.env.SUCCESS_URL || `${origin.replace(/\/$/, "")}/success.html`;
  const cancel = process.env.CANCEL_URL || origin || "https://example.com";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items,
      success_url: success,
      cancel_url: cancel,
      metadata: {
        passenger: name,
        phone: body.phone || "",
        tip_percent: String(tipPercent),
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url, id: session.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
