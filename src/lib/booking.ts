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
    date: meta.date || "",
    time: meta.time || "",
    pickup: meta.pickup || "",
    dropoff: meta.dropoff || "",
    breakdown: meta.breakdown || "",
    amount: session?.amount_total ? session.amount_total / 100 : null,
    changeRequest: meta.changeRequest || "",
    changeNotes: meta.changeNotes || "",
  };
}
