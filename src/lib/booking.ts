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
