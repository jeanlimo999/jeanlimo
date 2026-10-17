import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function parseAmount(raw: unknown) {
  const cleaned = String(raw ?? "").replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: Request) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "").trim();
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  const updates: Record<string, any> = { updated_at: new Date().toISOString() };

  if (body.name != null || body.phone != null) {
    // Update client name/phone if provided
    const { data: booking } = await db.from("bookings").select("client_id").eq("id", bookingId).maybeSingle();
    if (booking?.client_id) {
      const clientUp: Record<string, any> = {};
      if (body.name != null) clientUp.full_name = String(body.name).trim();
      if (body.phone != null) clientUp.phone = String(body.phone).trim();
      if (Object.keys(clientUp).length) {
        await db.from("clients").update(clientUp).eq("id", booking.client_id);
      }
    }
  }

  if (body.date != null) updates.ride_date = String(body.date).slice(0, 10);
  if (body.time != null) updates.ride_time = String(body.time).slice(0, 8);
  if (body.pickup != null) updates.pickup = String(body.pickup).trim();
  if (body.dropoff != null) updates.dropoff = String(body.dropoff).trim();
  if (body.flight != null) updates.flight_number = String(body.flight).slice(0, 20);
  if (body.passengers != null) updates.passengers = Number(body.passengers) || null;
  if (body.vehicle != null) updates.vehicle = String(body.vehicle);
  if (body.notes != null) {
    const notes = String(body.notes).trim();
    updates.passenger_notes = notes ? (notes.includes("In-house manual trip") ? notes : notes + " | In-house manual trip") : "In-house manual trip";
  }
  if (body.amount != null) {
    const amount = parseAmount(body.amount);
    updates.amount_cents = Math.round(amount * 100);
  }

  const { error } = await db.from("bookings").update(updates).eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
