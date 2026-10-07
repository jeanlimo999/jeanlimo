import { NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

function toJobs(row: any, driverId: string) {
  const guest = row.clients || {};
  const assigned = row.assigned_driver_id === driverId;
  if (!assigned) return [];
  const pax = row.passengers || row.passenger_count || row.pax || "";
  const rawNotes = String(row.passenger_notes || row.notes || "");
  const split = rawNotes.indexOf("Return:");
  const outboundNotes = (split >= 0 ? rawNotes.slice(0, split) : rawNotes).replace(/\s*\|\s*$/, "").trim();
  const returnNotes = split >= 0 ? rawNotes.slice(split + 7).trim() : "";
  const base = {
    bookingId: row.id,
    guestName: guest.full_name || "Guest",
    guestPhone: guest.phone || "",
    vehicle: row.vehicle,
    assignedDriverId: row.assigned_driver_id || "",
    tripStatus: row.trip_status || row.status || "confirmed",
    confirmation: row.confirmation,
    last_lat: row.last_lat,
    last_lng: row.last_lng,
    passengers: pax === 0 || pax ? String(pax) : "",
  };
  const jobs = [
    {
      ...base,
      id: row.confirmation,
      live_leg: "outbound",
      when: [row.ride_date, row.ride_time].filter(Boolean).join(" "),
      rideDate: row.ride_date || "",
      rideTime: row.ride_time || "",
      pickup: row.pickup,
      dropoff: row.dropoff,
      flight: row.flight_number || "",
      notes: outboundNotes,
    },
  ];
  if (row.return_date || row.return_pickup) {
    jobs.push({
      ...base,
      id: row.confirmation + "-R",
      confirmation: row.confirmation + " return",
      live_leg: "return",
      when: [row.return_date, row.return_time].filter(Boolean).join(" "),
      rideDate: row.return_date || "",
      rideTime: row.return_time || "",
      pickup: row.return_pickup || row.dropoff,
      dropoff: row.return_dropoff || row.pickup,
      flight: row.return_flight_number || "",
      notes: returnNotes,
    });
  }
  return jobs;
}

export async function GET() {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data, error } = await db
    .from("bookings")
    .select("*, clients(full_name, phone, email)")
    .eq("assigned_driver_id", session.driverId)
    .not("status", "eq", "cancelled")
    .order("ride_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const jobs = (data || []).flatMap((row) => toJobs(row, session.driverId));
  return NextResponse.json({
    driver: { id: session.driverId, name: session.name, phone: session.phone },
    jobs,
  });
}
