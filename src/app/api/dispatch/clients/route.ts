import { NextResponse } from "next/server";
import { readDispatchSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const session = readDispatchSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ clients: [] });

  const { data: clients, error } = await db
    .from("clients")
    .select("id, full_name, phone, email, company")
    .or(`full_name.ilike.%${q}%,phone.ilike.%${q}%`)
    .order("full_name")
    .limit(15);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach recent unique addresses from their bookings
  const enriched = await Promise.all(
    (clients || []).map(async (c: any) => {
      const { data: bookings } = await db
        .from("bookings")
        .select("pickup, dropoff, ride_date")
        .eq("client_id", c.id)
        .order("ride_date", { ascending: false })
        .limit(20);

      const pickups = new Set<string>();
      const dropoffs = new Set<string>();
      (bookings || []).forEach((b: any) => {
        if (b.pickup && b.pickup.trim()) pickups.add(b.pickup.trim());
        if (b.dropoff && b.dropoff.trim()) dropoffs.add(b.dropoff.trim());
      });

      return {
        ...c,
        recentPickups: Array.from(pickups).slice(0, 5),
        recentDropoffs: Array.from(dropoffs).slice(0, 5),
      };
    })
  );

  return NextResponse.json({ clients: enriched });
}
