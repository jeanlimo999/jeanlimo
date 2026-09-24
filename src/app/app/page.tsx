"use client";

import { useState } from "react";

type Booking = {
  confirmation?: string;
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  date?: string;
  time?: string;
  pickup?: string;
  dropoff?: string;
  flightNumber?: string;
};

export default function CustomerApp() {
  const [tab, setTab] = useState<"home" | "book" | "trips" | "account">("home");

  const [confirmation, setConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function lookupBooking() {
    setLoading(true);
    setMessage("");
    setBooking(null);

    try {
      const res = await fetch(
        `/api/booking?confirmation=${encodeURIComponent(
          confirmation
        )}&phone=${encodeURIComponent(phone)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Booking not found.");
        return;
      }

      setBooking(data.booking);
    } catch {
      setMessage("Unable to load booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto min-h-screen max-w-md bg-[#0d0d0f]">
        <header className="border-b border-white/10 px-5 py-5">
          <div className="text-2xl font-semibold tracking-[0.18em] text-[#d4af63]">
            JEAN LIMO
          </div>
          <div className="mt-1 text-xs tracking-[0.25em] text-zinc-400">
            HOUSTON
          </div>
        </header>

        <div className="px-4 pb-24 pt-5">
          {tab === "home" && (
            <>
              <section className="rounded-3xl border border-[#d4af63]/30 bg-gradient-to-b from-zinc-900 to-black p-6">
                <div className="text-sm uppercase tracking-[0.18em] text-[#d4af63]">
                  Premium Chauffeur Service
                </div>

                <h1 className="mt-3 text-4xl font-semibold leading-tight">
                  More Than a Ride.
                </h1>

                <p className="mt-3 text-zinc-400">
                  Airport transfers, hourly chauffeur service, Galveston cruise
                  transportation, and private rides across Greater Houston.
                </p>

                <button
                  onClick={() => setTab("book")}
                  className="mt-6 w-full rounded-2xl bg-[#d4af63] px-4 py-4 font-semibold text-black"
                >
                  Book a Ride
                </button>
              </section>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <ServiceCard icon="✈️" label="Airport Transfer" />
                <ServiceCard icon="🕒" label="Hourly Service" />
                <ServiceCard icon="🚢" label="Cruise Transfer" />
              </div>

              <button
                onClick={() => setTab("trips")}
                className="mt-5 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-left"
              >
                <div className="font-semibold">My Reservations</div>
                <div className="mt-1 text-sm text-zinc-400">
                  View, change, or cancel a booking
                </div>
              </button>
            </>
          )}

          {tab === "book" && (
            <>
              <h2 className="text-2xl font-semibold">Book a Ride</h2>

              <p className="mt-2 text-sm text-zinc-400">
                Use your existing Jean Limo booking and pricing system.
              </p>

              <a
                href="/"
                className="mt-6 block w-full rounded-2xl bg-[#d4af63] px-4 py-4 text-center font-semibold text-black"
              >
                Get Instant Quote
              </a>
            </>
          )}

          {tab === "trips" && (
            <>
              <h2 className="text-2xl font-semibold">My Reservations</h2>

              <p className="mt-2 text-sm text-zinc-400">
                Enter your confirmation number and phone number.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="Confirmation number"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  type="tel"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 outline-none"
                />

                <button
                  onClick={lookupBooking}
                  disabled={loading || !confirmation}
                  className="w-full rounded-2xl bg-[#d4af63] px-4 py-4 font-semibold text-black disabled:opacity-50"
                >
                  {loading ? "Looking up..." : "Find Reservation"}
                </button>
              </div>

              {message && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {message}
                </div>
              )}

              {booking && (
                <div className="mt-5 rounded-3xl border border-[#d4af63]/30 bg-zinc-900 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Confirmed Ride</div>

                    <div className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
                      CONFIRMED
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <Detail label="Confirmation" value={booking.confirmation} />
                    <Detail label="Passenger" value={booking.name} />
                    <Detail label="Vehicle" value={booking.vehicle} />
                    <Detail label="Date" value={booking.date} />
                    <Detail label="Time" value={booking.time} />
                    <Detail label="Pickup" value={booking.pickup} />
                    <Detail label="Drop-off" value={booking.dropoff} />
                    <Detail label="Flight" value={booking.flightNumber} />
                  </div>

                  <a
                    href={`/manage?confirmation=${encodeURIComponent(
                      booking.confirmation || confirmation
                    )}`}
                    className="mt-5 block w-full rounded-2xl border border-[#d4af63] px-4 py-4 text-center font-semibold text-[#d4af63]"
                  >
                    Request Change or Cancel
                  </a>
                </div>
              )}
            </>
          )}

          {tab === "account" && (
            <>
              <h2 className="text-2xl font-semibold">My Account</h2>

              <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-900 p-5">
                <div className="text-lg font-semibold">
                  Jean Limo Customer Account
                </div>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Customer login and saved passenger information can be added
                  here next.
                </p>
              </div>

              <a
                href="/account"
                className="mt-4 block w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-4 text-center"
              >
                Open Existing Account Page
              </a>
            </>
          )}
        </div>

        <nav className="fixed bottom-0 left-1/2 grid w-full max-w-md -translate-x-1/2 grid-cols-4 border-t border-white/10 bg-black/95 px-2 py-2 backdrop-blur">
          <NavButton
            active={tab === "home"}
            icon="⌂"
            label="Home"
            onClick={() => setTab("home")}
          />

          <NavButton
            active={tab === "book"}
            icon="🚘"
            label="Book"
            onClick={() => setTab("book")}
          />

          <NavButton
            active={tab === "trips"}
            icon="▣"
            label="Trips"
            onClick={() => setTab("trips")}
          />

          <NavButton
            active={tab === "account"}
            icon="◉"
            label="Account"
            onClick={() => setTab("account")}
          />
        </nav>
      </div>
    </main>
  );
}

function ServiceCard({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-xs text-zinc-300">{label}</div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-white">{value}</div>
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-2 py-2 text-xs ${
        active ? "text-[#d4af63]" : "text-zinc-500"
      }`}
    >
      <div className="text-lg">{icon}</div>
      <div className="mt-1">{label}</div>
    </button>
  );
}
