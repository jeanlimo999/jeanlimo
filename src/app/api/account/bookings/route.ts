import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { bookingIsUpcoming } from "@/lib/portal";

type DriverRow = { id: string; name?: string; phone?: string; vehicle?: string; photo_url?: string };

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
  const { data: drivers } = ids.length
    ? await db.from("drivers").select("id, name, phone, vehicle, photo_url").in("id", ids)
    : await db.from("drivers").select("id, name, phone, vehicle, photo_url").eq("active", true);
  for (const d of drivers || []) driversById[d.id] = d as DriverRow;

  const when = (b: { ride_date?: string; ride_time?: string }) => {
    const t = b.ride_time && /^\d{1,2}:\d{2}/.test(b.ride_time) ? b.ride_time.slice(0, 5) : "00:00";
    const stamp = Date.parse(`${b.ride_date || "1970-01-01"}T${t}:00`);
    return Number.isNaN(stamp) ? 0 : stamp;
  };

  const mapped = rows.map((b: any) => {
    const d = driversById[b.assigned_driver_id] || null;
    return {
      ...b,
      driverName: d?.name || "",
      driverPhone: d?.phone || "",
      driverVehicle: d?.vehicle || "",
      driverPhoto: d?.photo_url || "",
    };
  });

  const upcoming = mapped.filter((b) => bookingIsUpcoming(b)).sort((a, b) => when(a) - when(b));
  const history = mapped.filter((b) => !bookingIsUpcoming(b)).sort((a, b) => when(b) - when(a));
  return NextResponse.json({ upcoming, history });
}
