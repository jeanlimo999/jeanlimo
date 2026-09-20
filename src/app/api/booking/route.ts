import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { bookingFromSession } from "@/lib/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

async function findSession(confirmation: string, sessionId?: string) {
  if (sessionId) {
    return stripe.checkout.sessions.retrieve(sessionId);
  }

  const code = confirmation.trim().toUpperCase();
  const list = await stripe.checkout.sessions.list({ limit: 100 });
  const match = list.data.find((s) => (s.metadata?.confirmation || "").toUpperCase() === code);
  return match || null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id") || "";
    const confirmation = searchParams.get("confirmation") || "";
    const phone = (searchParams.get("phone") || "").replace(/\D/g, "");

    if (!sessionId && !confirmation) {
      return NextResponse.json({ error: "Enter a confirmation number" }, { status: 400 });
    }

    const session = await findSession(confirmation, sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingFromSession(session);
    if (phone && booking.phone.replace(/\D/g, "").slice(-4) !== phone.slice(-4)) {
      return NextResponse.json({ error: "Phone does not match this booking" }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lookup failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const confirmation = String(body.confirmation || "").trim().toUpperCase();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const action = body.action === "cancel" ? "cancel" : "change";
    const notes = String(body.notes || "").slice(0, 500);

    if (!confirmation) {
      return NextResponse.json({ error: "Confirmation number required" }, { status: 400 });
    }

    const session = await findSession(confirmation);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingFromSession(session);
    if (phone && booking.phone.replace(/\D/g, "").slice(-4) !== phone.slice(-4)) {
      return NextResponse.json({ error: "Phone does not match this booking" }, { status: 403 });
    }

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...session.metadata,
        status: action === "cancel" ? "cancel_requested" : "change_requested",
        changeRequest: action,
        changeNotes: notes,
        changeRequestedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        action === "cancel"
          ? "Cancel request received. Jeannie will confirm and handle any refund."
          : "Change request received. Jeannie will contact you to confirm.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Request failed" }, { status: 500 });
  }
}
