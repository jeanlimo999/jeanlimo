import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

const LIVE = new Set(["on_the_way", "on_location", "onboard"]);

export async function GET(req: NextRequest) {
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const confirmation = req.nextUrl.searchParams.get("confirmation") || "";
  if (!confirmation) return NextResponse.json({ error: "Missing confirmation" }, { status: 400 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data: booking, error } = await db
    .from("bookings")
    .select("id, confirmation, trip_status, status, last_lat, last_lng, last_gps_at, assigned_driver_id")
    .eq("confirmation", confirmation)
    .eq("client_id", session.clientId)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const tripStatus = String(booking.trip_status || booking.status || "");
  if (!LIVE.has(tripStatus)) {
    return NextResponse.json({ live: false, tripStatus });
  }

  let lat = booking.last_lat;
  let lng = booking.last_lng;
  let at = booking.last_gps_at;

  if ((lat == null || lng == null) && booking.assigned_driver_id) {
    const { data: driver } = await db
      .from("drivers")
      .select("last_lat, last_lng, last_gps_at, name")
      .eq("id", booking.assigned_driver_id)
      .maybeSingle();
    if (driver) {
      lat = driver.last_lat;
      lng = driver.last_lng;
      at = driver.last_gps_at;
    }
  }

  return NextResponse.json({
    live: true,
    tripStatus,
    lat: lat ?? null,
    lng: lng ?? null,
    at: at ?? null,
  });
}
