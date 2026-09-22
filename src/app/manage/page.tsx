"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";
import { formatDateTime } from "@/lib/booking";

const TIME_OPTIONS = Array.from({ length: 144 }, (_, i) => {
  const h24 = Math.floor(i / 6);
  const m = String((i % 6) * 10).padStart(2, "0");
  const value = `${String(h24).padStart(2, "0")}:${m}`;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  return { value, label: `${h12}:${m} ${ampm}` };
});

export default function ManagePage() {
  const [confirmation, setConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnPickup, setReturnPickup] = useState("");
  const [returnDropoff, setReturnDropoff] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [editing, setEditing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"change" | "cancel" | null>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBooking(null);
    setDone(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/booking?confirmation=${encodeURIComponent(confirmation)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking not found");
      const b = data.booking;
      setBooking(b);
      setNewDate(b.date || "");
      setNewTime(b.time || "");
      setPickup(b.pickup || "");
      setDropoff(b.dropoff || "");
      setFlightNumber(b.flightNumber || "");
      setReturnDate(b.returnDate || "");
      setReturnTime(b.returnTime || "");
      setReturnPickup(b.returnPickup || "");
      setReturnDropoff(b.returnDropoff || "");
      setReturnFlightNumber(b.returnFlightNumber || "");
      setEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const request = async (action: "change" | "cancel") => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation,
          phone,
          action,
          notes,
          newDate,
          newTime,
          pickup,
          dropoff,
          flightNumber,
          returnDate,
          returnTime,
          returnPickup,
          returnDropoff,
          returnFlightNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setDone(action);
      setBooking(null);
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-16">
      <div className="max-w-md mx-auto bg-zinc-900 border border-yellow-600/20 rounded-2xl p-8">
        <a href="/" className="text-xs text-zinc-400 hover:text-yellow-400">← Home</a>
        <h1 className="font-serif text-3xl text-yellow-500 mt-4 mb-2">Manage Booking</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Enter your confirmation number and the last 4 digits of the phone used at checkout.
        </p>

        {!done && (
        <form onSubmit={lookup} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider">Confirmation number</label>
            <input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
              placeholder="JL-260920-AB12"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider">Phone last 4 digits</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0929"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-yellow-500 text-zinc-900 font-semibold rounded-lg">
            {loading ? "Looking up…" : "Find booking"}
          </button>
        </form>
        )}

        {error && !done && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {done && (
          <div className="mt-6 p-6 bg-zinc-800 border border-yellow-600/30 rounded-xl text-center space-y-4">
            <div className="text-4xl text-yellow-500">✓</div>
            <p className="text-lg text-white">
              {done === "cancel"
                ? "Your cancel request has been received."
                : "Your changes have been updated."}
            </p>
            <p className="text-zinc-300">
              We will follow up with an email confirmation shortly.
            </p>
            <p className="text-zinc-400">Thank you for choosing Jean Limo LLC.</p>
            <a href="/" className="inline-block mt-2 px-6 py-3 bg-yellow-500 text-zinc-900 font-semibold rounded-lg">
              Back to Home
            </a>
          </div>
        )}

        {booking && !done && (
          <div className="mt-6 p-4 bg-zinc-800 rounded-xl space-y-2 text-sm">
            <div className="font-mono text-yellow-400 text-lg">{booking.confirmation}</div>
            <div>Status: {booking.status}</div>
            <div>{booking.name} · {booking.vehicle}</div>
            {booking.amount != null && <div>${booking.amount.toFixed(2)} paid</div>}

            {!editing ? (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="text-yellow-500 text-xs uppercase tracking-wider">Outbound</div>
                  <div>{formatDateTime(booking.date, booking.time)}</div>
                  {booking.flightNumber && <div>Flight: {booking.flightNumber}</div>}
                  <div className="text-zinc-400">Pickup: {booking.pickup}</div>
                  <div className="text-zinc-400">Drop-off: {booking.dropoff}</div>
                </div>
                {(booking.returnDate || booking.returnTime || booking.returnPickup) && (
                  <div>
                    <div className="text-yellow-500 text-xs uppercase tracking-wider">Return trip</div>
                    <div>{formatDateTime(booking.returnDate, booking.returnTime)}</div>
                    {booking.returnFlightNumber && <div>Return flight: {booking.returnFlightNumber}</div>}
                    <div className="text-zinc-400">Pickup: {booking.returnPickup}</div>
                    <div className="text-zinc-400">Drop-off: {booking.returnDropoff}</div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="w-full py-2.5 border border-yellow-500/50 text-yellow-400 rounded-lg"
                >
                  Make changes
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="text-yellow-500 text-xs uppercase tracking-wider">Outbound</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Date</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Time</label>
                    <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm">
                      <option value="">Select time</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Flight number</label>
                  <input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value.toUpperCase())} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Pickup address</label>
                  <AddressInput id="manage-pickup" value={pickup} onChange={setPickup} placeholder="Pickup address" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Drop-off address</label>
                  <AddressInput id="manage-dropoff" value={dropoff} onChange={setDropoff} placeholder="Drop-off address" />
                </div>

                <div className="text-yellow-500 text-xs uppercase tracking-wider pt-2">Return trip</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Return date</label>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Return time</label>
                    <select value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm">
                      <option value="">Select time</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Return flight</label>
                  <input value={returnFlightNumber} onChange={(e) => setReturnFlightNumber(e.target.value.toUpperCase())} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Return pickup</label>
                  <AddressInput id="manage-return-pickup" value={returnPickup} onChange={setReturnPickup} placeholder="Return pickup" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Return drop-off</label>
                  <AddressInput id="manage-return-dropoff" value={returnDropoff} onChange={setReturnDropoff} placeholder="Return drop-off" />
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else?"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm min-h-16"
                />
              </div>
            )}

            <button
              onClick={() => request("change")}
              disabled={loading}
              className="w-full py-2.5 mt-2 border border-yellow-500/50 text-yellow-400 rounded-lg"
            >
              Request change
            </button>
            <button
              onClick={() => request("cancel")}
              disabled={loading}
              className="w-full py-2.5 border border-red-500/40 text-red-300 rounded-lg"
            >
              Request cancel
            </button>
            <p className="text-xs text-zinc-500">
              Requests go to dispatch. Refunds and time changes are confirmed by phone:{" "}
              <a href="tel:+12819170929" className="text-yellow-500">281-917-0929</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
