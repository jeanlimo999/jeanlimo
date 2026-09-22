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

const TIME_OPTIONS = Array.from({ length: 144 }, (_, i) => {
  const h24 = Math.floor(i / 6);
  const m = String((i % 6) * 10).padStart(2, "0");
  const value = `${String(h24).padStart(2, "0")}:${m}`;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const ampm = h24 < 12 ? "AM" : "PM";
  return { value, label: `${h12}:${m} ${ampm}` };
});

export default function QuoteWidget() {
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [vehicle, setVehicle] = useState<Vehicle>("sedan");
  const [hours, setHours] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [wantReturn, setWantReturn] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [returnPickup, setReturnPickup] = useState("");
  const [returnDropoff, setReturnDropoff] = useState("");
  const [miles, setMiles] = useState<number | null>(null);
  const [returnMiles, setReturnMiles] = useState<number | null>(null);
  const [quotes, setQuotes] = useState<Record<Vehicle, { price: number; breakdown: string }> | null>(null);

  const [showBooking, setShowBooking] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipPct, setTipPct] = useState(0);
  const [customTip, setCustomTip] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quotes && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [quotes]);

  const selectedQuote = quotes?.[vehicle] || null;
  const customTipAmount = Math.max(0, parseFloat(customTip) || 0);
  const usingCustomTip = customTip.trim() !== "";
  const tipAmount = selectedQuote
    ? (usingCustomTip ? Math.round(customTipAmount * 100) / 100 : Math.round(selectedQuote.price * tipPct) / 100)
    : 0;

  const fetchMiles = async (from: string, to: string) => {
    const res = await fetch("/api/distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickup: from, dropoff: to }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not calculate distance");
    return Number(data.miles);
  };

  const handleQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setQuotes(null);
    setMiles(null);
    setReturnMiles(null);
    setShowBooking(false);

    try {
      if (tripType === "oneway") {
        if (!pickup.trim() || !dropoff.trim()) {
          setError("Please enter pickup and drop-off addresses.");
          return;
        }

        setLoading(true);
        const calculatedMiles = await fetchMiles(pickup, dropoff);
        setMiles(calculatedMiles);

        let backMiles: number | null = null;
        if (wantReturn) {
          const rp = returnPickup.trim() || dropoff;
          const rd = returnDropoff.trim() || pickup;
          backMiles = await fetchMiles(rp, rd);
          setReturnMiles(backMiles);
        }

        const build = (v: Vehicle) => {
          const out = calculateOneWay(v, calculatedMiles);
          if (!wantReturn || backMiles == null) return out;
          const back = calculateOneWay(v, backMiles);
          return {
            price: out.price + back.price,
            breakdown: `Outbound ${calculatedMiles.toFixed(1)} mi $${out.price} + return ${backMiles.toFixed(1)} mi $${back.price}`,
          };
        };

        setQuotes({
          sedan: build("sedan"),
          suv: build("suv"),
          sprinter: build("sprinter"),
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
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Name, phone, and email are required.");
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
          tipAmount,
          tipPercent: usingCustomTip ? 0 : tipPct,
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
          flightNumber,
          returnFlightNumber: wantReturn ? returnFlightNumber : "",
          returnDate: wantReturn ? returnDate : "",
          returnTime: wantReturn ? returnTime : "",
          returnPickup: wantReturn ? returnPickup || dropoff : "",
          returnDropoff: wantReturn ? returnDropoff || pickup : "",
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

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Flight number</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            placeholder="e.g. UA887"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const next = !wantReturn;
            setWantReturn(next);
            if (next) {
              if (!returnPickup.trim()) setReturnPickup(dropoff);
              if (!returnDropoff.trim()) setReturnDropoff(pickup);
            }
          }}
          className="w-full py-2.5 border border-yellow-500/40 text-yellow-400 font-semibold rounded-lg"
        >
          {wantReturn ? "− Remove return trip" : "+ Return trip"}
        </button>

        {wantReturn && (
          <div className="p-3 bg-zinc-800/70 border border-yellow-600/20 rounded-xl space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Return pickup</label>
              <AddressInput
                id="return-pickup"
                value={returnPickup}
                onChange={setReturnPickup}
                placeholder="Return pickup address"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Return drop-off</label>
              <AddressInput
                id="return-dropoff"
                value={returnDropoff}
                onChange={setReturnDropoff}
                placeholder="Return drop-off address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Return date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Return time</label>
              <select
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
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
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wider">Return flight number</label>
              <input
                type="text"
                value={returnFlightNumber}
                onChange={(e) => setReturnFlightNumber(e.target.value.toUpperCase())}
                placeholder="e.g. UA888"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-zinc-900 font-semibold rounded-lg transition mt-2"
        >
          {loading ? "Calculating…" : "See prices & vehicles"}
        </button>
        <p className="text-xs text-zinc-500 text-center mt-3 leading-relaxed">
          Instant quote · No surge pricing · No charge when a standard ride is cancelled 2+ hours before pickup
        </p>
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {quotes && !showBooking && (
        <div ref={resultsRef} className="mt-6 space-y-3 scroll-mt-24">
          <div className="pt-2">
            <h3 className="font-serif text-xl text-yellow-500">Choose your vehicle</h3>
            {miles !== null && (
              <p className="text-base text-zinc-200 mt-1">
                {miles} mi outbound
                {wantReturn && returnMiles != null ? ` + ${returnMiles} mi return` : ""}
                {" "}· tap a car to select it
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
        <div className="mt-5 p-4 bg-zinc-800/80 border border-yellow-600/30 rounded-xl space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-zinc-300">
                {VEHICLES.find((v) => v.id === vehicle)?.name}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">{selectedQuote.breakdown}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs uppercase tracking-wider text-zinc-400">Total due</div>
              <div className="text-2xl font-serif text-yellow-500 leading-tight">
                ${(selectedQuote.price + tipAmount).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Phone *</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-400 mb-1.5">Add a tip</p>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 15, 20, 25].map((pct) => {
                const amt = Math.round(selectedQuote.price * pct) / 100;
                const active = !usingCustomTip && tipPct === pct;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => { setCustomTip(""); setTipPct(pct); }}
                    className={`rounded-lg border px-1 py-2 text-center ${
                      active
                        ? "bg-yellow-500 text-zinc-900 border-yellow-500"
                        : "border-yellow-600/40 text-zinc-200"
                    }`}
                  >
                    <div className="text-xs font-semibold leading-tight">{pct === 0 ? "No tip" : `${pct}%`}</div>
                    <div className="text-[11px] leading-tight mt-0.5">${amt.toFixed(0)}</div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setTipPct(-1)}
                className={`rounded-lg border px-1 py-2 text-center ${
                  usingCustomTip || tipPct === -1
                    ? "bg-yellow-500 text-zinc-900 border-yellow-500"
                    : "border-yellow-600/40 text-zinc-200"
                }`}
              >
                <div className="text-xs font-semibold leading-tight">Custom</div>
                <div className="text-[11px] leading-tight mt-0.5">$</div>
              </button>
            </div>
            {(usingCustomTip || tipPct === -1) && (
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  placeholder="Enter tip"
                  value={customTip}
                  onChange={(e) => { setCustomTip(e.target.value); setTipPct(-1); }}
                  className="w-full bg-zinc-700 border border-yellow-500 rounded-lg pl-7 pr-3 py-2.5 text-sm"
                  autoFocus
                />
              </div>
            )}
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-zinc-900 font-semibold rounded-lg transition"
          >
            {loading ? "Redirecting to Stripe…" : "Pay Securely with Stripe"}
          </button>
          <button onClick={() => setShowBooking(false)} className="w-full py-1.5 text-sm text-zinc-400 hover:text-white">
            ← Back to vehicles
          </button>
        </div>
      )}
    </div>
  );
}
