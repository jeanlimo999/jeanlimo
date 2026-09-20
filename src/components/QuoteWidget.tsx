"use client";

import { useEffect, useRef, useState } from "react";
import { Vehicle, calculateOneWay, calculateHourly } from "@/lib/pricing";
import AddressInput from "./AddressInput";

type TripType = "oneway" | "hourly";

const VEHICLES: { id: Vehicle; name: string; seats: string }[] = [
  { id: "sedan", name: "Business Sedan", seats: "1–3 passengers" },
  { id: "suv", name: "Business SUV", seats: "4–6 passengers" },
  { id: "sprinter", name: "Sprinter Van", seats: "7–14 passengers" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h24 = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${String(h24).padStart(2, "0")}:${m}`;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  return { value, label: `${h12}:${m} ${ampm}` };
});

export default function QuoteWidget() {
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [vehicle, setVehicle] = useState<Vehicle>("sedan");
  const [hours, setHours] = useState("3");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [miles, setMiles] = useState<number | null>(null);
  const [quotes, setQuotes] = useState<Record<Vehicle, { price: number; breakdown: string }> | null>(null);

  const [showBooking, setShowBooking] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quotes && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [quotes]);

  const selectedQuote = quotes?.[vehicle] || null;

  const handleQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQuotes(null);
    setMiles(null);
    setShowBooking(false);

    try {
      if (tripType === "oneway") {
        if (!pickup.trim() || !dropoff.trim()) {
          setError("Please enter pickup and drop-off addresses.");
          return;
        }

        setLoading(true);
        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pickup, dropoff }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not calculate distance");

        const calculatedMiles = Number(data.miles);
        setMiles(calculatedMiles);
        setQuotes({
          sedan: calculateOneWay("sedan", calculatedMiles),
          suv: calculateOneWay("suv", calculatedMiles),
          sprinter: calculateOneWay("sprinter", calculatedMiles),
        });
      } else {
        const h = parseFloat(hours) || 2;
        setQuotes({
          sedan: calculateHourly("sedan", h),
          suv: calculateHourly("suv", h),
          sprinter: calculateHourly("sprinter", h),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedQuote) return;
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
          price: selectedQuote.price,
          vehicle,
          type: tripType,
          breakdown: selectedQuote.breakdown,
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
      if (!res.ok) throw new Error(data.error || "Could not start payment");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again or call us.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 backdrop-blur border border-yellow-600/20 rounded-2xl p-6 md:p-8 card-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-yellow-500">Get an Instant Quote</h2>
        <span className="text-xs text-zinc-400 uppercase tracking-wider">Houston</span>
      </div>

      <div className="flex bg-zinc-800 rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => { setTripType("oneway"); setQuotes(null); setShowBooking(false); }}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
            tripType === "oneway" ? "bg-yellow-500 text-zinc-900" : "text-zinc-300 hover:text-white"
          }`}
        >
          One-Way
        </button>
        <button
          type="button"
          onClick={() => { setTripType("hourly"); setQuotes(null); setShowBooking(false); }}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
            tripType === "hourly" ? "bg-yellow-500 text-zinc-900" : "text-zinc-300 hover:text-white"
          }`}
        >
          By the Hour
        </button>
      </div>

      <form onSubmit={handleQuote} className="space-y-4">
        {tripType === "oneway" ? (
          <>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Pickup Address</label>
              <AddressInput
                id="pickup"
                value={pickup}
                onChange={setPickup}
                placeholder="Start typing an address, airport, or hotel"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Drop-off Address</label>
              <AddressInput
                id="dropoff"
                value={dropoff}
                onChange={setDropoff}
                placeholder="Start typing destination"
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
              <AddressInput
                id="hourly-pickup"
                value={pickup}
                onChange={setPickup}
                placeholder="Starting address"
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
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
            >
              <option value="">Select time</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-zinc-900 font-semibold rounded-lg transition mt-2"
        >
          {loading ? "Calculating…" : "See prices & vehicles"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {quotes && !showBooking && (
        <div ref={resultsRef} className="mt-6 space-y-3 scroll-mt-24">
          <div className="pt-2">
            <h3 className="font-serif text-xl text-yellow-500">Choose your vehicle</h3>
            {miles !== null && (
              <p className="text-sm text-zinc-300 mt-1">
                {miles} miles · tap a car to select it
              </p>
            )}
          </div>

          {VEHICLES.map((v) => {
            const q = quotes[v.id];
            const selected = vehicle === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVehicle(v.id)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selected
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-zinc-700 bg-zinc-800/80 hover:border-yellow-600/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{v.name}</div>
                    <div className="text-xs text-zinc-400">{v.seats}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-serif text-yellow-500">${q.price.toFixed(0)}</div>
                  </div>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => setShowBooking(true)}
            className="w-full py-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold rounded-lg transition mt-2"
          >
            Book {VEHICLES.find((v) => v.id === vehicle)?.name} · ${selectedQuote?.price.toFixed(0)}
          </button>
          <p className="text-center text-xs text-zinc-500">
            Or call / text Jeannie{" "}
            <a href="tel:+12819170929" className="text-yellow-500">281-917-0929</a>
            {" "}or Cash{" "}
            <a href="tel:+12819170085" className="text-yellow-500">281-917-0085</a>
          </p>
        </div>
      )}

      {quotes && showBooking && selectedQuote && (
        <div className="mt-6 p-5 bg-zinc-800/80 border border-yellow-600/30 rounded-xl space-y-4">
          <div className="text-sm text-zinc-400">
            {VEHICLES.find((v) => v.id === vehicle)?.name} · Total due
          </div>
          <div className="text-2xl font-serif text-yellow-500">${selectedQuote.price.toFixed(2)}</div>
          <div className="text-xs text-zinc-500">{selectedQuote.breakdown}</div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Phone *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-sm" />
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-zinc-900 font-semibold rounded-lg transition"
          >
            {loading ? "Redirecting to Stripe…" : "Pay Securely with Stripe"}
          </button>
          <button onClick={() => setShowBooking(false)} className="w-full py-2 text-sm text-zinc-400 hover:text-white">
            ← Back to vehicles
          </button>
        </div>
      )}
    </div>
  );
}
