"use client";

import { useState } from "react";
import { Vehicle, calculateOneWay, calculateHourly } from "@/lib/pricing";

type TripType = "oneway" | "hourly";

export default function QuoteWidget() {
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [vehicle, setVehicle] = useState<Vehicle>("sedan");
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("3");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [result, setResult] = useState<{ price: number; breakdown: string } | null>(null);

  // Booking fields
  const [showBooking, setShowBooking] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (tripType === "oneway") {
        const miles = parseFloat(distance);
        if (!miles || miles <= 0) {
          setError("Please enter a valid distance.");
          return;
        }
        setResult(calculateOneWay(vehicle, miles));
      } else {
        const h = parseFloat(hours) || 2;
        setResult(calculateHourly(vehicle, h));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePay = async () => {
    if (!result) return;
    if (!name.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: result.price,
          vehicle,
          type: tripType,
          breakdown: result.breakdown,
          passengerName: name,
          passengerPhone: phone,
          passengerEmail: email,
          date,
          time,
          pickup,
          dropoff,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not start payment");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again or call us.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 backdrop-blur border border-yellow-600/20 rounded-2xl p-6 md:p-8 card-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-yellow-500">Get an Instant Quote</h2>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">All-Inclusive</span>
      </div>

      {/* Toggle */}
      <div className="flex bg-zinc-800 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => { setTripType("oneway"); setResult(null); setShowBooking(false); }}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
            tripType === "oneway" ? "bg-yellow-500 text-zinc-900" : "text-zinc-300 hover:text-white"
          }`}
        >
          One-Way
        </button>
        <button
          type="button"
          onClick={() => { setTripType("hourly"); setResult(null); setShowBooking(false); }}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
            tripType === "hourly" ? "bg-yellow-500 text-zinc-900" : "text-zinc-300 hover:text-white"
          }`}
        >
          By the Hour
        </button>
      </div>

      <form onSubmit={handleQuote} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Vehicle</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value as Vehicle)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
          >
            <option value="sedan">Business Sedan</option>
            <option value="suv">Business SUV</option>
            <option value="sprinter">Sprinter Van</option>
          </select>
        </div>

        {tripType === "oneway" ? (
          <>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Pickup Address</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Address, airport, or landmark"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Drop-off Address</label>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Estimated Distance (miles)</label>
              <input
                type="number"
                min="1"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 23"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Hours Needed</label>
              <input
                type="number"
                min="2"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
              <p className="text-xs text-zinc-500 mt-1">2-hour minimum</p>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Pickup Location</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Starting address"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Pickup Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition mt-2"
        >
          See Price →
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {result && !showBooking && (
        <div className="mt-6 p-5 bg-zinc-800/80 border border-yellow-600/30 rounded-xl">
          <div className="text-sm text-zinc-400 mb-1">Estimated Total (all-inclusive)</div>
          <div className="text-3xl font-serif text-yellow-500 mb-2">${result.price.toFixed(2)}</div>
          <div className="text-xs text-zinc-400 mb-4">{result.breakdown}</div>
          <button
            onClick={() => setShowBooking(true)}
            className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-lg transition"
          >
            Book & Pay with Stripe
          </button>
          <p className="text-center text-xs text-zinc-500 mt-3">
            Or call Jeannie: <a href="tel:+12819170929" className="text-yellow-500">281-917-0929</a>
          </p>
        </div>
      )}

      {result && showBooking && (
        <div className="mt-6 p-5 bg-zinc-800/80 border border-yellow-600/30 rounded-xl space-y-4">
          <div className="text-sm text-zinc-400">Total due</div>
          <div className="text-2xl font-serif text-yellow-500">${result.price.toFixed(2)}</div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              placeholder="281-xxx-xxxx"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm"
              placeholder="you@email.com"
            />
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-zinc-900 font-semibold rounded-lg transition"
          >
            {loading ? "Redirecting to Stripe…" : "Pay Securely with Stripe"}
          </button>
          <button
            onClick={() => setShowBooking(false)}
            className="w-full py-2 text-sm text-zinc-400 hover:text-white"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
