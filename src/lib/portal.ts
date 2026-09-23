import { supabaseAdmin, last4, normEmail, digits } from "@/lib/supabase";

export type BookingRow = {
  confirmation: string;
  status: string;
  vehicle: string;
  trip_type: string;
  ride_date: string;
  ride_time: string;
  pickup: string;
  dropoff: string;
  flight_number: string;
  return_date: string;
  return_time: string;
  return_pickup: string;
  return_dropoff: string;
  return_flight_number: string;
  amount_cents: number;
  breakdown: string;
  stripe_session_id?: string | null;
};

export async function upsertClient(input: {
  email: string;
  phone: string;
  full_name?: string;
  company?: string;
}) {
  const db = supabaseAdmin();
  if (!db) throw new Error("Supabase is not configured");
  const email = normEmail(input.email);
  const phone = String(input.phone || "").trim();
  if (!email || !email.includes("@")) throw new Error("Email required");

  const { data: existing } = await db.from("clients").select("*").eq("email", email).maybeSingle();
  if (existing) {
    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    if (phone) patch.phone = phone;
    if (input.full_name) patch.full_name = input.full_name;
    if (input.company) patch.company = input.company;
    const { data, error } = await db.from("clients").update(patch).eq("id", existing.id).select("*").single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await db
    .from("clients")
    .insert({
      email,
      phone,
      full_name: input.full_name || "",
      company: input.company || "",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function findClientByEmailPhone(email: string, phone: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const em = normEmail(email);
  const want = last4(phone);
  if (!em || want.length !== 4) return null;
  const { data } = await db.from("clients").select("*").eq("email", em).maybeSingle();
  if (!data) return null;
  if (last4(data.phone) !== want) return null;
  return data;
}

export async function saveWebsiteBooking(booking: {
  confirmation: string;
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  type?: string;
  date?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  flightNumber?: string;
  returnDate?: string;
  returnTime?: string;
  returnPickup?: string;
  returnDropoff?: string;
  returnFlightNumber?: string;
  amount?: number | null;
  breakdown?: string;
  stripe_session_id?: string;
  status?: string;
}) {
  const db = supabaseAdmin();
  if (!db) return { saved: false, reason: "supabase_missing" };
  const email = normEmail(booking.email);
  if (!email || !booking.confirmation) return { saved: false, reason: "missing_fields" };

  const client = await upsertClient({
    email,
    phone: booking.phone || "",
    full_name: booking.name || "",
  });

  const row = {
    confirmation: String(booking.confirmation).toUpperCase(),
    client_id: client.id,
    status: booking.status || "confirmed",
    vehicle: booking.vehicle || "sedan",
    trip_type: booking.type || "oneway",
    ride_date: booking.date || "",
    ride_time: booking.time || "",
    pickup: booking.pickup || "",
    dropoff: booking.dropoff || "",
    flight_number: booking.flightNumber || "",
    return_date: booking.returnDate || "",
    return_time: booking.returnTime || "",
    return_pickup: booking.returnPickup || "",
    return_dropoff: booking.returnDropoff || "",
    return_flight_number: booking.returnFlightNumber || "",
    amount_cents: Math.round(Number(booking.amount || 0) * 100),
    breakdown: booking.breakdown || "",
    stripe_session_id: booking.stripe_session_id || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await db.from("bookings").upsert(row, { onConflict: "confirmation" });
  if (error) throw error;
  return { saved: true, clientId: client.id };
}

export function bookingIsUpcoming(b: { status: string; ride_date: string; ride_time: string }) {
  if (["cancelled", "completed"].includes(String(b.status || "").toLowerCase())) return false;
  if (!b.ride_date) return true;
  const t = b.ride_time && /^\d{1,2}:\d{2}/.test(b.ride_time) ? b.ride_time.slice(0, 5) : "23:59";
  const stamp = new Date(`${b.ride_date}T${t}:00`);
  if (Number.isNaN(stamp.getTime())) return true;
  return stamp.getTime() >= Date.now() - 2 * 60 * 60 * 1000;
}

export { digits, last4, normEmail };
