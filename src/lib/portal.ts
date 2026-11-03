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
  passenger_notes?: string;
  stripe_session_id?: string | null;
  city?: string;
  is_return?: boolean;
  parent_booking_id?: string | null;
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
  notes?: string;
  returnNotes?: string;
  stripe_session_id?: string;
  status?: string;
  city?: string;
}) {
  const db = supabaseAdmin();
  if (!db) throw new Error("Supabase is not configured");
  const email = normEmail(booking.email);
  if (!booking.confirmation) throw new Error("Missing confirmation");
  if (!email) throw new Error("Customer email is required to save the booking");

  const client = await upsertClient({
    email,
    phone: booking.phone || "",
    full_name: booking.name || "",
  });

  const hasReturn = Boolean(booking.returnDate || booking.returnPickup || booking.returnDropoff);
  const totalCents = Math.round(Number(booking.amount || 0) * 100);
  const legCents = hasReturn ? Math.round(totalCents / 2) : totalCents;

  const outbound = {
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
    amount_cents: legCents,
    breakdown: booking.breakdown || "",
    passenger_notes: booking.notes || "",
    stripe_session_id: booking.stripe_session_id || null,
    city: booking.city || "Houston",
    is_return: false,
    parent_booking_id: null,
    updated_at: new Date().toISOString(),
  };

  let { data: outboundRow, error } = await db.from("bookings").upsert(outbound, { onConflict: "confirmation" }).select("id").single();
  if (error && /column|schema/i.test(error.message || "")) {
    const slim = { ...outbound };
    delete (slim as any).passenger_notes;
    delete (slim as any).city;
    delete (slim as any).stripe_session_id;
    delete (slim as any).is_return;
    delete (slim as any).parent_booking_id;
    ({ data: outboundRow, error } = await db.from("bookings").upsert(slim, { onConflict: "confirmation" }).select("id").single());
  }
  if (error) throw error;

  if (hasReturn && outboundRow?.id) {
    const returnRow = {
      confirmation: String(booking.confirmation).toUpperCase() + " return",
      client_id: client.id,
      status: booking.status || "confirmed",
      vehicle: booking.vehicle || "sedan",
      trip_type: booking.type || "oneway",
      ride_date: booking.returnDate || booking.date || "",
      ride_time: booking.returnTime || "",
      pickup: booking.returnPickup || booking.dropoff || "",
      dropoff: booking.returnDropoff || booking.pickup || "",
      flight_number: booking.returnFlightNumber || "",
      amount_cents: legCents,
      breakdown: booking.breakdown || "",
      passenger_notes: booking.returnNotes || booking.notes || "",
      stripe_session_id: booking.stripe_session_id || null,
      city: booking.city || "Houston",
      is_return: true,
      parent_booking_id: outboundRow.id,
      updated_at: new Date().toISOString(),
    };

    let { error: rErr } = await db.from("bookings").upsert(returnRow, { onConflict: "confirmation" });
    if (rErr && /column|schema/i.test(rErr.message || "")) {
      const slim = { ...returnRow };
      delete (slim as any).passenger_notes;
      delete (slim as any).city;
      delete (slim as any).stripe_session_id;
      delete (slim as any).is_return;
      delete (slim as any).parent_booking_id;
      ({ error: rErr } = await db.from("bookings").upsert(slim, { onConflict: "confirmation" }));
    }
    if (rErr) throw rErr;
  }

  return { saved: true, clientId: client.id };
}

/** Map booking city / rate city to an IANA timezone. */
function timezoneForCity(city?: string): string {
  const c = String(city || "").toLowerCase();
  if (c.includes("los angeles") || c.includes("la") || c.includes("california") || c.includes("pacific")) {
    return "America/Los_Angeles";
  }
  if (c.includes("new york") || c.includes("new jersey") || c.includes("nyc") || c.includes("eastern")) {
    return "America/New_York";
  }
  // Houston, Dallas, and everything else default to Central
  return "America/Chicago";
}

/** Convert a ride date+time stored in the given IANA timezone to a UTC timestamp. */
function zonedToUtcMs(date: string, time: string, timeZone: string): number {
  const t = time && /^\d{1,2}:\d{2}/.test(time) ? time.slice(0, 5) : "23:59";
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = t.split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return NaN;

  const probe = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour12: false,
  });
  const parts = fmt.formatToParts(probe);
  const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT-6";
  const match = tzPart.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
  const offsetHours = match ? Number(match[1]) : -6;
  const offsetMins = match && match[2] ? Number(match[2]) : 0;
  const offsetMs = (offsetHours * 60 + (offsetHours < 0 ? -offsetMins : offsetMins)) * 60 * 1000;

  return Date.UTC(y, m - 1, d, hh, mm) - offsetMs;
}

export function bookingIsUpcoming(b: {
  status?: string;
  trip_status?: string;
  ride_date?: string;
  ride_time?: string;
  city?: string;
}) {
  const s = String(b.status || b.trip_status || "").toLowerCase().replace(/_/g, " ");
  if (["cancelled", "canceled", "completed", "done"].some((x) => s.includes(x))) return false;
  if (!b.ride_date) return true;

  const tz = timezoneForCity(b.city);
  const stampMs = zonedToUtcMs(b.ride_date, b.ride_time || "", tz);
  if (Number.isNaN(stampMs)) return true;

  // Keep the same 2-hour grace window after pickup
  return stampMs >= Date.now() - 2 * 60 * 60 * 1000;
}

export { digits, last4, normEmail };
