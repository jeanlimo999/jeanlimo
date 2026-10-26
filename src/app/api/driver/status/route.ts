import { NextRequest, NextResponse } from "next/server";
import { readDriverSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSms } from "@/lib/sms";

const ALLOWED = new Set(["on_the_way", "on_location", "onboard", "dropped_off"]);
const OWNER_PHONE = "12819170085";

const CUSTOMER_MESSAGES: Record<string, (driver: string) => string> = {
  on_the_way: (driver) => `Your Jean Limo driver ${driver} is on the way. We'll text you when we arrive.`,
  on_location: (driver) => `Your Jean Limo driver ${driver} has arrived at the pickup location.`,
};

const OWNER_MESSAGES: Record<string, (driver: string, customer: string) => string> = {
  on_the_way: (driver, customer) => `Driver ${driver} is on the way for ${customer}`,
  onboard: (driver, customer) => `Passenger onboard with ${driver} — ${customer}`,
  dropped_off: (driver, customer) => `Dropped off — ${driver} finished ${customer}`,
};

export async function POST(req: NextRequest) {
  const session = readDriverSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const bookingId = String(body.bookingId || "");
  const status = String(body.status || "");
  const live_leg = String(body.live_leg || "outbound");
  if (!bookingId || !ALLOWED.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: booking, error: fetchErr } = await db
    .from("bookings")
    .select("id, assigned_driver_id, clients(phone, full_name)")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchErr) console.error("Status fetch error:", fetchErr);
  if (!booking || booking.assigned_driver_id !== session.driverId) {
    return NextResponse.json({ error: "Job not assigned to you" }, { status: 403 });
  }

  const { error } = await db
    .from("bookings")
    .update({ trip_status: status, live_leg, updated_at: new Date().toISOString() })
    .eq("id", bookingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clientRaw = booking.clients;
  const client = Array.isArray(clientRaw) ? clientRaw[0] : clientRaw;
  const customerName = client?.full_name || "Customer";
  const customerPhone = String(client?.phone || "").trim();

  const { data: driver } = await db
    .from("drivers")
    .select("name")
    .eq("id", session.driverId)
    .maybeSingle();
  const driverName = driver?.name || "Driver";

  const smsResults: Record<string, any> = {};

  // Customer texts for on the way / at location
  if ((status === "on_the_way" || status === "on_location") && customerPhone) {
    const text = CUSTOMER_MESSAGES[status]?.(driverName) || `Status update from your Jean Limo driver ${driverName}.`;
    const result = await sendSms(customerPhone, text);
    smsResults.customer = result ? "sent" : "failed";
    if (!result) console.error("Customer SMS failed for", status, customerPhone);
  }

  // Owner texts for on the way, onboard, and dropped off
  if (status === "on_the_way" || status === "onboard" || status === "dropped_off") {
    const text = OWNER_MESSAGES[status]?.(driverName, customerName) || `${status} — ${driverName} / ${customerName}`;
    const result = await sendSms(OWNER_PHONE, text);
    smsResults.owner = result ? "sent" : "failed";
    if (!result) console.error("Owner SMS failed for", status);
  }

  return NextResponse.json({
    ok: true,
    tripStatus: status,
    customerPhone: customerPhone || null,
    sms: smsResults,
  });
}
