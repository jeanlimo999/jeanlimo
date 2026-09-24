"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/booking";

type Client = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  company: string;
};

type Address = { id: string; label: string; address: string };

type Booking = {
  confirmation: string;
  status: string;
  vehicle: string;
  trip_type: string;
  ride_date: string;
  ride_time: string;
  pickup: string;
  dropoff: string;
  flight_number: string;
  return_date: string;
  return_time: string;
  return_pickup: string;
  return_dropoff: string;
  return_flight_number: string;
  amount_cents: number;
};

const vehicleLabel: Record<string, string> = {
  sedan: "Business Sedan",
  suv: "Business SUV",
  sprinter: "Sprinter Van",
};

function money(cents: number) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function rebookHref(b: Booking) {
  const q = new URLSearchParams();
  q.set("rebook", b.confirmation);
  if (b.vehicle) q.set("vehicle", b.vehicle);
  if (b.trip_type) q.set("type", b.trip_type);
  if (b.pickup) q.set("pickup", b.pickup);
  if (b.dropoff) q.set("dropoff", b.dropoff);
  if (b.flight_number) q.set("flight", b.flight_number);
  if (b.return_date || b.return_pickup || b.return_dropoff) q.set("return", "1");
  if (b.return_pickup) q.set("returnPickup", b.return_pickup);
  if (b.return_dropoff) q.set("returnDropoff", b.return_dropoff);
  if (b.return_flight_number) q.set("returnFlight", b.return_flight_number);
  return `/?${q.toString()}#quote`;
}

const fieldCls = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm";

function TripCard({
  b,
  canEdit,
  onChanged,
}: {
  b: Booking;
  canEdit: boolean;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    newDate: b.ride_date || "",
    newTime: b.ride_time || "",
    pickup: b.pickup || "",
    dropoff: b.dropoff || "",
    flightNumber: b.flight_number || "",
    returnDate: b.return_date || "",
    returnTime: b.return_time || "",
    returnPickup: b.return_pickup || "",
    returnDropoff: b.return_dropoff || "",
    returnFlightNumber: b.return_flight_number || "",
    notes: "",
  });

  const send = async (action: "change" | "cancel") => {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/account/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: b.confirmation, action, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg(data.message || "Saved");
      setOpen(false);
      onChanged();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="bg-zinc-900 border border-yellow-600/20 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] tracking-[0.14em] uppercase text-yellow-500">{b.confirmation}</div>
          <div className="mt-1 font-medium">{formatDateTime(b.ride_date, b.ride_time) || "Date TBD"}</div>
          <p className="text-sm text-zinc-400 mt-2">{b.pickup || "—"}</p>
          <p className="text-sm text-zinc-400">→ {b.dropoff || "—"}</p>
          <p className="text-xs text-zinc-500 mt-2">
            {vehicleLabel[b.vehicle] || b.vehicle} · {b.trip_type} · {money(b.amount_cents)}
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-wide border border-zinc-700 text-zinc-300 rounded-full px-2 py-1">
          {b.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <a href={rebookHref(b)} className="px-3 py-2 rounded-lg bg-yellow-500 text-zinc-900 text-sm font-semibold">
          Rebook
        </a>
        {canEdit && (
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-2 rounded-lg border border-yellow-600/30 text-yellow-400 text-sm"
          >
            {open ? "Close" : "Change / cancel"}
          </button>
        )}
      </div>
      {msg && <p className="text-sm text-green-400 mt-3">{msg}</p>}
      {err && <p className="text-sm text-red-400 mt-3">{err}</p>}
      {open && canEdit && (
        <div className="mt-4 grid gap-2">
          <label className="text-xs text-zinc-400">Date</label>
          <input type="date" className={fieldCls} value={form.newDate} onChange={(e) => setForm({ ...form, newDate: e.target.value })} />
          <label className="text-xs text-zinc-400">Time (HH:MM)</label>
          <input className={fieldCls} value={form.newTime} onChange={(e) => setForm({ ...form, newTime: e.target.value })} placeholder="22:00" />
          <label className="text-xs text-zinc-400">Pickup</label>
          <input className={fieldCls} value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} />
          <label className="text-xs text-zinc-400">Drop-off</label>
          <input className={fieldCls} value={form.dropoff} onChange={(e) => setForm({ ...form, dropoff: e.target.value })} />
          <label className="text-xs text-zinc-400">Flight</label>
          <input className={fieldCls} value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value })} />
          <label className="text-xs text-zinc-400">Return date</label>
          <input type="date" className={fieldCls} value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} />
          <label className="text-xs text-zinc-400">Return time</label>
          <input className={fieldCls} value={form.returnTime} onChange={(e) => setForm({ ...form, returnTime: e.target.value })} />
          <label className="text-xs text-zinc-400">Notes for dispatch</label>
          <input className={fieldCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <p className="text-xs text-zinc-500">Refunds and time changes may still be confirmed by phone: 281-917-0929</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <button disabled={busy} onClick={() => send("change")} className="px-3 py-2 rounded-lg bg-yellow-500 text-zinc-900 text-sm font-semibold">
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button disabled={busy} onClick={() => send("cancel")} className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-sm">
              Request cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [history, setHistory] = useState<Booking[]>([]);
  const [tab, setTab] = useState<"trips" | "profile">("trips");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");

  const load = async () => {
    const me = await fetch("/api/account/me");
    if (!me.ok) {
      setClient(null);
      return;
    }
    const data = await me.json();
    setClient(data.client);
    setAddresses(data.addresses || []);
    const trips = await fetch("/api/account/bookings");
    if (trips.ok) {
      const t = await trips.json();
      setUpcoming(t.upcoming || []);
      setHistory(t.history || []);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign in");
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setError("");
    const res = await fetch("/api/account/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Could not save");
    else setClient(data.client);
  };

  const addPlace = async () => {
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, address }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not save place");
    setAddresses((prev) => [...prev, data.address]);
    setLabel("");
    setAddress("");
  };

  const signOut = async () => {
    await fetch("/api/account/logout", { method: "POST" });
    setClient(null);
    setUpcoming([]);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-yellow-600/20">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="font-serif tracking-wide text-yellow-400">
            JEAN LIMO
          </a>
          <div className="flex items-center gap-3 text-sm">
            <a href="/#quote" className="text-zinc-300 hover:text-yellow-400">
              Book
            </a>
            {client && (
              <button onClick={signOut} className="text-zinc-400 hover:text-yellow-400">
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {!client ? (
          <form onSubmit={signIn} className="max-w-md bg-zinc-900 border border-yellow-600/20 rounded-2xl p-6">
            <p className="text-[11px] tracking-[0.16em] uppercase text-yellow-500 mb-2">My trips</p>
            <h1 className="font-serif text-3xl mb-2">Sign in</h1>
            <p className="text-sm text-zinc-400 mb-6">
              Use the email and phone from your Jean Limo website booking.
            </p>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
            />
            <label className="block text-xs text-zinc-400 mb-1">Phone (last 4 digits is enough)</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
              placeholder="281-917-0085"
            />
            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
            <button
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg"
            >
              {loading ? "Looking up…" : "Open my trips"}
            </button>
          </form>
        ) : (
          <>
            <h1 className="font-serif text-3xl">Hi {client.full_name?.split(" ")[0] || "there"}</h1>
            <p className="text-zinc-400 mt-1 mb-6">{client.email}</p>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setTab("trips")}
                className={`px-4 py-2 rounded-full text-sm ${tab === "trips" ? "bg-yellow-500 text-zinc-900" : "border border-zinc-700 text-zinc-300"}`}
              >
                Trips
              </button>
              <button
                onClick={() => setTab("profile")}
                className={`px-4 py-2 rounded-full text-sm ${tab === "profile" ? "bg-yellow-500 text-zinc-900" : "border border-zinc-700 text-zinc-300"}`}
              >
                Profile
              </button>
            </div>

            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

            {tab === "trips" && (
              <>
                <p className="text-[11px] tracking-[0.14em] uppercase text-yellow-500 mb-3">Upcoming</p>
                <div className="grid gap-3 mb-8">
                  {upcoming.length ? (
                    upcoming.map((b) => <TripCard key={b.confirmation} b={b} canEdit onChanged={load} />)
                  ) : (
                    <p className="text-zinc-500 text-sm">No upcoming Jean Limo trips.</p>
                  )}
                </div>
                <p className="text-[11px] tracking-[0.14em] uppercase text-yellow-500 mb-3">Previous</p>
                <div className="grid gap-3">
                  {history.length ? (
                    history.map((b) => <TripCard key={b.confirmation} b={b} canEdit={false} onChanged={load} />)
                  ) : (
                    <p className="text-zinc-500 text-sm">No past trips yet.</p>
                  )}
                </div>
              </>
            )}

            {tab === "profile" && (
              <div className="grid gap-4">
                <div className="bg-zinc-900 border border-yellow-600/20 rounded-2xl p-5">
                  <label className="block text-xs text-zinc-400 mb-1">Full name</label>
                  <input
                    value={client.full_name || ""}
                    onChange={(e) => setClient({ ...client, full_name: e.target.value })}
                    className="w-full mb-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
                  />
                  <label className="block text-xs text-zinc-400 mb-1">Phone</label>
                  <input
                    value={client.phone || ""}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                    className="w-full mb-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
                  />
                  <label className="block text-xs text-zinc-400 mb-1">Company</label>
                  <input
                    value={client.company || ""}
                    onChange={(e) => setClient({ ...client, company: e.target.value })}
                    className="w-full mb-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
                  />
                  <button onClick={saveProfile} className="px-4 py-2 bg-yellow-500 text-zinc-900 font-semibold rounded-lg text-sm">
                    Save profile
                  </button>
                </div>
                <div className="bg-zinc-900 border border-yellow-600/20 rounded-2xl p-5">
                  <p className="text-[11px] tracking-[0.14em] uppercase text-yellow-500 mb-3">Saved places</p>
                  {addresses.map((a) => (
                    <div key={a.id} className="py-2 border-t border-zinc-800 first:border-0">
                      <div className="font-medium text-sm">{a.label}</div>
                      <div className="text-sm text-zinc-400">{a.address}</div>
                    </div>
                  ))}
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label — Home, Office, IAH"
                    className="w-full mt-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
                  />
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full address"
                    className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
                  />
                  <button onClick={addPlace} className="mt-3 px-4 py-2 border border-yellow-600/30 text-yellow-400 rounded-lg text-sm">
                    Save place
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
