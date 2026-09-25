import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { bookingIsUpcoming } from "@/lib/portal";

type DriverRow = { id: string; name?: string; phone?: string; vehicle?: string };

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

  const rows = data || [];
  const ids = Array.from(
    new Set(
      rows
        .map((b: any) => b.assigned_driver_id)
        .filter((id: unknown) => typeof id === "string" && id.length > 0)
    )
  ) as string[];

  const driversById: Record<string, DriverRow> = {};
  if (ids.length) {
    const { data: drivers } = await db.from("drivers").select("id, name, phone, vehicle").in("id", ids);
    for (const d of drivers || []) driversById[d.id] = d as DriverRow;
  } else {
    // Fallback if assigned_driver_id is missing but trip is assigned in dispatch local state.
    const { data: drivers } = await db.from("drivers").select("id, name, phone, vehicle").eq("active", true);
    for (const d of drivers || []) driversById[d.id] = d as DriverRow;
  }

  const when = (b: { ride_date?: string; ride_time?: string }) => {
    const t = b.ride_time && /^\d{1,2}:\d{2}/.test(b.ride_time) ? b.ride_time.slice(0, 5) : "00:00";
    const stamp = Date.parse(`${b.ride_date || "1970-01-01"}T${t}:00`);
    return Number.isNaN(stamp) ? 0 : stamp;
  };

  const mapped = rows.map((b: any) => {
    const d =
      driversById[b.assigned_driver_id] ||
      (b.driver_name ? { name: b.driver_name, phone: b.driver_phone } : null);
    return {
      ...b,
      driverName: d?.name || b.driverName || "",
      driverPhone: d?.phone || b.driverPhone || "",
      driverVehicle: d?.vehicle || "",
    };
  });

  const upcoming = mapped.filter((b) => bookingIsUpcoming(b)).sort((a, b) => when(a) - when(b));
  const history = mapped.filter((b) => !bookingIsUpcoming(b)).sort((a, b) => when(b) - when(a));
  return NextResponse.json({ upcoming, history });
}
