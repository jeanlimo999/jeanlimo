import { NextRequest, NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "");
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });

  const { data: booking } = await db
    .from("bookings")
    .select("id, assigned_driver_id, trip_status")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking || booking.trip_status !== "auction" || booking.assigned_driver_id) {
    return NextResponse.json({ error: "That job is no longer available" }, { status: 409 });
  }

  const { error } = await db
    .from("bookings")
    .update({
      assigned_driver_id: session.driverId,
      trip_status: "assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .eq("trip_status", "auction");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
