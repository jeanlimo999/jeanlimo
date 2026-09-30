import { NextRequest, NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

const ALLOWED = new Set(["on_the_way", "on_location", "onboard", "dropped_off"]);

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "");
  const status = String(body.status || "");
  const live_leg = String(body.live_leg || "outbound");
  if (!bookingId || !ALLOWED.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: booking } = await db
    .from("bookings")
    .select("id, assigned_driver_id")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking || booking.assigned_driver_id !== session.driverId) {
    return NextResponse.json({ error: "Job not assigned to you" }, { status: 403 });
  }

  const { error } = await db
    .from("bookings")
    .update({ trip_status: status, live_leg, updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, tripStatus: status });
}
