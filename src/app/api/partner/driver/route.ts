import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const allowed = ["on_the_way", "onboard", "dropped_off"];

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone || "").replace(/\D/g, "");
  const pin = String(body.pin || "").trim();
  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!phone || !pin) return NextResponse.json({ error: "Phone and PIN are required" }, { status: 400 });

  const { data, error } = await db.from("farm_outs").select("*").eq("driver_pin", pin).order("created_at", { ascending: false }).limit(20);
  if (error) return NextResponse.json({ error: "Run the driver PIN script in Supabase. " + error.message }, { status: 500 });
  const jobs = (data || []).filter((row: any) => String(row.driver_phone || "").replace(/\D/g, "").endsWith(phone.slice(-10)));
  if (!jobs.length) return NextResponse.json({ error: "No job for that phone and PIN" }, { status: 401 });

  if (!id) {
    const ids = jobs.map((row: any) => row.booking_id).filter(Boolean);
    const { data: bookings } = ids.length
      ? await db.from("bookings").select("id, confirmation, pickup, dropoff, ride_date, ride_time, clients(full_name, phone)").in("id", ids)
      : { data: [] };
    const byId = new Map((bookings || []).map((b: any) => [b.id, b]));
    return NextResponse.json({
      jobs: jobs.map((row: any) => {
        const booking: any = byId.get(row.booking_id) || {};
        return {
          id: row.id,
          status: row.status,
          driver: row.driver_name,
          confirmation: booking.confirmation || row.confirmation,
          date: booking.ride_date || "",
          time: booking.ride_time || "",
          pickup: booking.pickup || "",
          dropoff: booking.dropoff || "",
          guest: booking.clients?.full_name || "Guest",
          phone: booking.clients?.phone || "",
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
