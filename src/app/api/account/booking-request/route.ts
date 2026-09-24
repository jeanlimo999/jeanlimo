import { NextRequest, NextResponse } from "next/server";
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
  if (!confirmation) return NextResponse.json({ error: "Confirmation required" }, { status: 400 });

  const { data: booking, error: findErr } = await db
    .from("bookings")
    .select("*")
    .eq("confirmation", confirmation)
    .eq("client_id", session.clientId)
    .maybeSingle();
  if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const patch: Record<string, string> = {
    status: action === "cancel" ? "cancelled" : "change_requested",
    updated_at: new Date().toISOString(),
  };

  if (action === "change") {
    if (body.newDate) patch.ride_date = String(body.newDate).slice(0, 20);
    if (body.newTime) patch.ride_time = String(body.newTime).slice(0, 10);
    if (body.pickup != null) patch.pickup = String(body.pickup).slice(0, 400);
    if (body.dropoff != null) patch.dropoff = String(body.dropoff).slice(0, 400);
    if (body.flightNumber != null) patch.flight_number = String(body.flightNumber).slice(0, 20);
    if (body.returnDate != null) patch.return_date = String(body.returnDate).slice(0, 20);
    if (body.returnTime != null) patch.return_time = String(body.returnTime).slice(0, 10);
    if (body.returnPickup != null) patch.return_pickup = String(body.returnPickup).slice(0, 400);
    if (body.returnDropoff != null) patch.return_dropoff = String(body.returnDropoff).slice(0, 400);
    if (body.returnFlightNumber != null) {
      patch.return_flight_number = String(body.returnFlightNumber).slice(0, 20);
    }
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

  return NextResponse.json({
    ok: true,
    booking: updated,
    message:
      action === "cancel"
        ? "Cancel request saved. We will confirm any refund by phone: 281-917-0929."
        : "Changes saved. Dispatch will confirm by phone if needed.",
  });
}
