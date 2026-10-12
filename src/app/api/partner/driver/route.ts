import { NextRequest, NextResponse } from "next/server";
import { normEmail, supabaseAdmin } from "@/lib/supabase";

const allowed = ["on_the_way", "onboard", "dropped_off"];

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const email = normEmail(body.email || "");
  const last4 = String(body.last4 || body.phone || "").replace(/\D/g, "").slice(-4);
  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!email.includes("@") || last4.length !== 4) {
    return NextResponse.json({ error: "Your email and the last 4 of your phone are required" }, { status: 400 });
  }

  const { data, error } = await db.from("farm_outs").select("*").eq("driver_email", email).order("created_at", { ascending: false }).limit(40);
  if (error) return NextResponse.json({ error: "Run the driver email script in Supabase. " + error.message }, { status: 500 });
  const jobs = (data || []).filter((row: any) => String(row.driver_phone || "").replace(/\D/g, "").endsWith(last4));
  if (!jobs.length) return NextResponse.json({ error: "No job for that email and last 4" }, { status: 401 });

  if (!id) {
    const ids = jobs.map((row: any) => row.booking_id).filter(Boolean);
    const confirmations = jobs.map((row: any) => row.confirmation).filter(Boolean);
    const [{ data: byIds }, { data: byConf }] = await Promise.all([
      ids.length
        ? db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_count, passenger_notes, notes, clients(full_name, phone)").in("id", ids)
        : Promise.resolve({ data: [] }),
      confirmations.length
        ? db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, flight_number, passengers, passenger_count, passenger_notes, notes, clients(full_name, phone)").in("confirmation", confirmations)
        : Promise.resolve({ data: [] }),
    ]);
    const byId = new Map((byIds || []).map((b: any) => [b.id, b]));
    const byConfirmation = new Map((byConf || []).map((b: any) => [b.confirmation, b]));
    return NextResponse.json({
      jobs: jobs.map((row: any) => {
        const booking: any = byId.get(row.booking_id) || byConfirmation.get(row.confirmation) || {};
        const pax = booking.passengers || booking.passenger_count || row.passengers || "";
        return {
          id: row.id,
          status: row.status,
          driver: row.driver_name,
          confirmation: booking.confirmation || row.confirmation,
          date: booking.ride_date || row.ride_date || "",
          time: booking.ride_time || row.ride_time || "",
          pickup: booking.pickup || row.pickup || "",
          dropoff: booking.dropoff || row.dropoff || "",
          flight: booking.flight_number || row.flight || "",
          passengers: pax === 0 || pax ? String(pax) : "",
          notes: booking.passenger_notes || booking.notes || row.notes || "",
          guest: booking.clients?.full_name || row.guest_name || "Guest",
          phone: booking.clients?.phone || row.guest_phone || "",
        };
      }),
    });
  }

  if (!allowed.includes(status)) return NextResponse.json({ error: "Bad status" }, { status: 400 });
  const job = jobs.find((row: any) => row.id === id);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  await db.from("farm_outs").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (job.booking_id) await db.from("bookings").update({ trip_status: status }).eq("id", job.booking_id);
  return NextResponse.json({ ok: true, status });
}
