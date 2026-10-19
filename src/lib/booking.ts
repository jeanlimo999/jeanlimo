export function formatDateDisplay(value?: string) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[2]}/${m[3]}/${m[1]}`;
  return value;
}

export function formatTimeDisplay(value?: string) {
  if (!value) return "";
  const m = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return value;
  let hour = parseInt(m[1], 10);
  const min = m[2];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour}:${min} ${ampm}`;
}

export function formatDateTime(date?: string, time?: string) {
  return [formatDateDisplay(date), formatTimeDisplay(time)].filter(Boolean).join("  ");
}

/** Blacklane-style date: "Sun 01 Nov 2026" */
export function blacklaneDate(date?: string): string {
  if (!date) return "";
  const m = String(date).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return date;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} ${m[3]} ${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

/** Blacklane-style subject */
export function blacklaneSubject(kind: string, confirmation: string, date?: string): string {
  const d = blacklaneDate(date) || "";
  return `${kind} (Booking number: ${confirmation || ""}${d ? ` Date: ${d}` : ""})`;
}

/** Jean Limo title: "7:00 AM Picking up Cash Lam Driver: John" or "2:30 PM Taking Cash Lam Driver: John" */
export function jeanLimoSubject(opts: {
  time?: string;
  customer?: string;
  driver?: string;
  pickingUp?: boolean;
}): string {
  const time = String(opts.time || "").trim();
  const action = opts.pickingUp === false ? "Taking" : "Picking up";
  const name = String(opts.customer || "Guest").trim();
  const driver = String(opts.driver || "").trim();
  const driverPart = driver ? ` Driver: ${driver}` : "";
  return `${time} ${action} ${name}${driverPart}`.replace(/\s+/g, " ").trim();
}

function esc(s: any) {
  return String(s ?? "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

/** HTML ride details: bold From/To, highlighted flight number */
export function rideDetailsHtml(opts: {
  confirmation?: string;
  dateLabel?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  vehicle?: string;
  type?: string;
  name?: string;
  phone?: string;
  email?: string;
  flight?: string;
  notes?: string;
  amount?: string;
  extra?: string;
}): string {
  const flight = String(opts.flight || "").trim();
  const flightHtml = flight
    ? `<div style="margin:8px 0;"><span style="background:#fff3cd;color:#856404;padding:4px 8px;border-radius:4px;font-weight:700;">Flight: ${esc(flight)}</span></div>`
    : "";

  return `
<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.45;color:#0f1319;">
  <div style="font-weight:700;font-size:16px;margin-bottom:8px;">Ride details</div>
  <div>Booking no: <strong>${esc(opts.confirmation || "")}</strong></div>
  <div style="margin:6px 0;">${esc(opts.dateLabel || "")} ${esc(opts.time || "")}</div>
  <div style="margin:10px 0;"><strong>From</strong> ${esc(opts.pickup || "")}</div>
  <div style="margin:4px 0;"><strong>To</strong> ${esc(opts.dropoff || "")}</div>
  ${flightHtml}
  ${opts.vehicle ? `<div>Vehicle: ${esc(opts.vehicle)}</div>` : ""}
  ${opts.type ? `<div>Type: ${esc(opts.type)}</div>` : ""}
  ${opts.name ? `<div>Name: ${esc(opts.name)}</div>` : ""}
  ${opts.phone ? `<div>Phone: ${esc(opts.phone)}</div>` : ""}
  ${opts.email ? `<div>Email: ${esc(opts.email)}</div>` : ""}
  ${opts.notes ? `<div style="margin-top:8px;">Note: ${esc(opts.notes)}</div>` : ""}
  ${opts.amount ? `<div style="margin-top:8px;font-weight:700;">${esc(opts.amount)}</div>` : ""}
  ${opts.extra || ""}
</div>`.trim();
}

export function makeConfirmationNumber() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JL-${y}${m}${day}-${rand}`;
}

export function bookingFromSession(session: any) {
  const meta = session?.metadata || {};
  return {
    confirmation: meta.confirmation || "",
    status: session?.payment_status === "paid" ? meta.status || "confirmed" : session?.payment_status,
    name: meta.passengerName || "",
    phone: meta.passengerPhone || "",
    email: session?.customer_details?.email || session?.customer_email || "",
    vehicle: meta.vehicle || "",
    type: meta.type || "",
    date: meta.requestedDate || meta.date || "",
    time: meta.requestedTime || meta.time || "",
    originalDate: meta.originalDate || "",
    originalTime: meta.originalTime || "",
    requestedDate: meta.requestedDate || "",
    requestedTime: meta.requestedTime || "",
    pickup: meta.pickup || "",
    dropoff: meta.dropoff || "",
    flightNumber: meta.flightNumber || "",
    notes: meta.notes || "",
    returnNotes: meta.returnNotes || "",
    returnFlightNumber: meta.returnFlightNumber || "",
    returnDate: meta.returnDate || "",
    returnTime: meta.returnTime || "",
    returnPickup: meta.returnPickup || "",
    returnDropoff: meta.returnDropoff || "",
    breakdown: meta.breakdown || "",
    amount: session?.amount_total ? session.amount_total / 100 : null,
    changeRequest: meta.changeRequest || "",
    changeNotes: meta.changeNotes || "",
  };
}
