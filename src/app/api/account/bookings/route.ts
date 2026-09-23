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
    .order("ride_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data || [];
  const upcoming = rows.filter((b) => bookingIsUpcoming(b));
  const history = rows.filter((b) => !bookingIsUpcoming(b));
  return NextResponse.json({ upcoming, history });
}
