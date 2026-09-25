import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const [{ data: drivers, error: dErr }, { data: bookings, error: bErr }] = await Promise.all([
    db.from("drivers").select("id, name, phone, pin, vehicle, photo_url, active, last_lat, last_lng").eq("active", true).order("name"),
    db.from("bookings").select("*, clients(full_name, phone, email)").not("status", "eq", "cancelled").order("ride_date", { ascending: true }),
  ]);
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });
  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 });

  const jobs = (bookings || []).flatMap((row: any) => {
    const guest = row.clients || {};
    const base = {
      bookingId: row.id,
      guestName: guest.full_name || "Guest",
      guestPhone: guest.phone || "",
      vehicle: row.vehicle,
      assignedDriverId: row.assigned_driver_id || "",
      tripStatus: row.trip_status || row.status || "confirmed",
      confirmation: row.confirmation,
    };
    const list = [
      {
        ...base,
        id: row.confirmation,
        when: [row.ride_date, row.ride_time].filter(Boolean).join(" "),
        rideDate: row.ride_date || "",
        pickup: row.pickup,
        dropoff: row.dropoff,
      },
    ];
    if (row.return_date || row.return_pickup) {
      list.push({
        ...base,
        id: row.confirmation + "-R",
        confirmation: row.confirmation + " return",
        when: [row.return_date, row.return_time].filter(Boolean).join(" "),
        rideDate: row.return_date || "",
        pickup: row.return_pickup || row.dropoff,
        dropoff: row.return_dropoff || row.pickup,
      });
    }
    return list;
  });

  return NextResponse.json({ drivers: drivers || [], jobs });
}
