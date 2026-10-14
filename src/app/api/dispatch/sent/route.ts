import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 500 });
  const { data, error } = await db.from("farm_outs").select("*").neq("status", "returned").neq("status", "cancelled").order("created_at", { ascending: false }).limit(200);
  if (error) return NextResponse.json({ error: error.message, jobs: [] });
  const jobs = (data || []).map((row: any) => ({
    id: row.id,
    status: row.status,
    partner: row.partner_name || "Partner",
    pay: Math.round((row.pay_cents || 0) / 100),
    confirmation: row.confirmation || "",
    date: row.ride_date || "",
    time: row.ride_time || "",
    pickup: row.pickup || "",
    dropoff: row.dropoff || "",
    guest: row.guest_name || "Guest",
    driver: row.driver_name || "",
  }));
  return NextResponse.json({ jobs });
}
