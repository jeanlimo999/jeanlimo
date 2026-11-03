import { NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function toJob(row: any, driverId: string) {
  const guest = row.clients || {};
  const mine = row.assigned_driver_id === driverId;
  const auction = row.trip_status === "auction" && !row.assigned_driver_id;
  if (!mine && !auction) return null;
  const pax = row.passengers || row.passenger_count || row.pax || "";
  const total = Number(row.amount_cents || 0);
  const driverPay = Math.round(total * 0.80) / 100;
  return {
    bookingId: row.id,
    id: row.confirmation,
    live_leg: row.is_return ? "return" : "outbound",
    driverPay,
    guestName: guest.full_name || "Guest",
    guestPhone: guest.phone || "",
    vehicle: row.vehicle,
    assignedDriverId: row.assigned_driver_id || "",
    tripStatus: row.trip_status || row.status || "confirmed",
    confirmation: row.confirmation,
    last_lat: row.last_lat,
    last_lng: row.last_lng,
    passengers: pax === 0 || pax ? String(pax) : "",
    when: [row.ride_date, row.ride_time].filter(Boolean).join(" "),
    rideDate: row.ride_date || "",
    rideTime: row.ride_time || "",
    pickup: row.pickup,
    dropoff: row.dropoff,
    flight: row.flight_number || "",
    notes: row.passenger_notes || row.notes || "",
    available: auction,
  };
}

export async function GET() {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const [{ data, error }, { data: open, error: openErr }] = await Promise.all([
    db.from("bookings").select("*, clients(full_name, phone, email)").eq("assigned_driver_id", session.driverId).not("status", "eq", "cancelled").order("ride_date", { ascending: true }),
    db.from("bookings").select("*, clients(full_name, phone, email)").eq("trip_status", "auction").is("assigned_driver_id", null).not("status", "eq", "cancelled").order("ride_date", { ascending: true }),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (openErr) return NextResponse.json({ error: openErr.message }, { status: 500 });

  const jobs = (data || []).map((row) => toJob(row, session.driverId)).filter(Boolean);
  const available = (open || []).map((row) => toJob(row, session.driverId)).filter(Boolean).map((job) => ({ ...job, available: true }));
  return NextResponse.json({
    driver: { id: session.driverId, name: session.name, phone: session.phone },
    jobs,
    available,
  });
}
