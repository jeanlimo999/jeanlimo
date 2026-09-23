import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { bookingIsUpcoming } from "@/lib/portal";

export async function GET() {
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .eq("client_id", session.clientId)
    .order("ride_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const when = (b: { ride_date?: string; ride_time?: string }) => {
    const t = b.ride_time && /^\d{1,2}:\d{2}/.test(b.ride_time) ? b.ride_time.slice(0, 5) : "00:00";
    const stamp = Date.parse(`${b.ride_date || "1970-01-01"}T${t}:00`);
    return Number.isNaN(stamp) ? 0 : stamp;
  };

  const rows = data || [];
  const upcoming = rows.filter((b) => bookingIsUpcoming(b)).sort((a, b) => when(a) - when(b));
  const history = rows.filter((b) => !bookingIsUpcoming(b)).sort((a, b) => when(b) - when(a));
  return NextResponse.json({ upcoming, history });
}
