import { NextRequest, NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const bookingId = String(body.bookingId || "");
  const driverId = body.driverId ? String(body.driverId) : null;
  if (!bookingId) return NextResponse.json({ error: "Booking required" }, { status: 400 });
  const { error } = await db
    .from("bookings")
    .update({
      assigned_driver_id: driverId,
      trip_status: driverId ? "assigned" : "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
