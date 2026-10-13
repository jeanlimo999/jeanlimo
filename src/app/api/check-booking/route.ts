import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "no db" }, { status: 500 });
  const { data, error } = await db
    .from("bookings")
    .select("confirmation, trip_type, ride_date, ride_time, pickup, dropoff, return_date, return_time, return_pickup, return_dropoff, return_flight_number, flight_number")
    .eq("confirmation", "JL-261013-OTP4")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ booking: data });
}
