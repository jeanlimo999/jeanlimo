"use client";

import { useState } from "react";

export default function ManagePage() {
  const [confirmation, setConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBooking(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/booking?confirmation=${encodeURIComponent(confirmation)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking not found");
      setBooking(data.booking);
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
        body: JSON.stringify({ confirmation, phone, action, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessage(data.message);
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

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}

        {booking && (
          <div className="mt-6 p-4 bg-zinc-800 rounded-xl space-y-2 text-sm">
            <div className="font-mono text-yellow-400 text-lg">{booking.confirmation}</div>
            <div>Status: {booking.status}</div>
            <div>{booking.name} · {booking.vehicle}</div>
            <div>{booking.date} {booking.time}</div>
            <div className="text-zinc-400">{booking.pickup}</div>
            {booking.dropoff && <div className="text-zinc-400">→ {booking.dropoff}</div>}
            {booking.amount != null && <div>${booking.amount.toFixed(2)} paid</div>}

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you want to change? New time, address, vehicle..."
              className="w-full mt-3 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm min-h-24"
            />

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
