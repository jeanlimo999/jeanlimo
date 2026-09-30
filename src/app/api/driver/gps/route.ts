import { NextRequest, NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  const bookingId = String(body.bookingId || "");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid GPS" }, { status: 400 });
  }
  const now = new Date().toISOString();
  await db.from("drivers").update({ last_lat: lat, last_lng: lng, last_gps_at: now }).eq("id", session.driverId);
  if (bookingId) {
    const { data: booking } = await db
      .from("bookings")
      .select("id, assigned_driver_id, trip_status")
      .eq("id", bookingId)
      .maybeSingle();
    if (booking && booking.assigned_driver_id === session.driverId) {
      const live = ["on_the_way", "on_location", "onboard"].includes(String(booking.trip_status || ""));
      if (live) {
        await db.from("bookings").update({ last_lat: lat, last_lng: lng, last_gps_at: now }).eq("id", bookingId);
        await db.from("gps_pings").insert({ driver_id: session.driverId, booking_id: bookingId, lat, lng });
      }
    }
  }
  return NextResponse.json({ ok: true });
}
