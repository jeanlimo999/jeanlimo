import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { bookingFromSession } from "@/lib/booking";
import { findClientByEmailPhone, saveWebsiteBooking, last4, normEmail } from "@/lib/portal";
import { supabaseAdmin } from "@/lib/supabase";
import { COOKIE, makeSessionToken, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = normEmail(body.email);
    const phone = String(body.phone || "");
    if (!email.includes("@") || last4(phone).length !== 4) {
      return NextResponse.json({ error: "Enter the email and phone from your booking." }, { status: 400 });
    }

    if (!supabaseAdmin()) {
      return NextResponse.json(
        { error: "Account portal is not configured. Add Supabase keys in Netlify." },
        { status: 500 }
      );
    }

    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
      const list = await stripe.checkout.sessions.list({ limit: 100 });
      for (const session of list.data) {
        if (session.payment_status !== "paid") continue;
        const b = bookingFromSession(session);
        const sameEmail = normEmail(b.email) === email;
        const samePhone = last4(b.phone) === last4(phone);
        if (sameEmail && samePhone) {
          try {
            await saveWebsiteBooking({ ...b, stripe_session_id: session.id });
          } catch (err) {
            console.error("Import booking failed", b.confirmation, err);
          }
        }
      }
    }

    let client = await findClientByEmailPhone(email, phone);
    if (!client) {
      return NextResponse.json(
        {
          error:
            "No Jean Limo website bookings found for that email and last 4 digits. Book online first, or use Manage booking with your confirmation number.",
        },
        { status: 404 }
      );
    }

    const token = makeSessionToken(client.id, client.email);
    const res = NextResponse.json({
      ok: true,
      client: {
        id: client.id,
        email: client.email,
        phone: client.phone,
        full_name: client.full_name,
        company: client.company,
      },
    });
    res.cookies.set(COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}
