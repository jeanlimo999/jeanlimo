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

/** Blacklane-style subject: "Ride assignment (Booking number: JL-... Date: Sun 01 Nov 2026)" */
export function blacklaneSubject(kind: string, confirmation: string, date?: string): string {
  const d = blacklaneDate(date) || "";
  return `${kind} (Booking number: ${confirmation || ""}${d ? ` Date: ${d}` : ""})`;
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
