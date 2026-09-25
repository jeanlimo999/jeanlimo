"use client";

import { useEffect, useState } from "react";
import RideCard from "@/app/app/RideCard";

type Client = {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  company: string;
};

type Address = { id: string; label: string; address: string };

const fieldCls = "mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [client, setClient] = useState<Client | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past" | "profile">("upcoming");
  const [edit, setEdit] = useState<any>(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
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

  const requestChange = async (action: "change" | "cancel") => {
    if (!edit) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/account/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation: edit.confirmation,
          action,
          newDate: edit.ride_date,
          newTime: edit.ride_time,
          pickup: edit.pickup,
          dropoff: edit.dropoff,
          flightNumber: edit.flight_number,
          returnDate: edit.return_date,
          returnTime: edit.return_time,
          returnPickup: edit.return_pickup,
          returnDropoff: edit.return_dropoff,
          returnFlightNumber: edit.return_flight_number,
          notes: edit.notes || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg(data.message || "Request sent");
      setEdit(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const rebook = (b: any) => {
    const q = new URLSearchParams();
    q.set("rebook", b.confirmation || "");
    if (b.vehicle) q.set("vehicle", b.vehicle);
    if (b.trip_type) q.set("type", b.trip_type);
    if (b.pickup) q.set("pickup", b.pickup);
    if (b.dropoff) q.set("dropoff", b.dropoff);
    if (b.flight_number) q.set("flight", b.flight_number);
    window.location.href = `/?${q.toString()}#quote`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen max-w-md bg-[#070707] pb-10">
        <header className="flex items-center justify-between px-5 pb-2 pt-6">
          <a href="/" className="text-[#d8b56b]">
            ← Back
          </a>
          {client && (
            <button onClick={signOut} className="text-sm text-[#d8b56b]">
              Sign out
            </button>
          )}
        </header>

        {!client ? (
          <form onSubmit={signIn} className="px-5 pt-4">
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            <p className="mt-2 text-sm text-zinc-400">Sign in with checkout email and last 4 of that phone.</p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Booking email"
              className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none"
            />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Last 4 of phone"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none"
            />
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button disabled={loading} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : edit ? (
          <div className="px-5 pt-2">
            <button onClick={() => setEdit(null)} className="mb-3 text-sm text-[#d8b56b]">
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">{edit._cancel ? "Cancel ride" : "Request change"}</h1>
            <p className="mt-1 text-sm text-zinc-400">{edit.confirmation}</p>
            {!edit._cancel && (
              <>
                <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Date
                  <input type="date" className={fieldCls} value={edit.ride_date || ""} onChange={(e) => setEdit({ ...edit, ride_date: e.target.value })} />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Time
                  <input type="time" className={fieldCls} value={edit.ride_time || ""} onChange={(e) => setEdit({ ...edit, ride_time: e.target.value })} />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Pickup
                  <input className={fieldCls} value={edit.pickup || ""} onChange={(e) => setEdit({ ...edit, pickup: e.target.value })} />
                </label>
                <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Drop-off
                  <input className={fieldCls} value={edit.dropoff || ""} onChange={(e) => setEdit({ ...edit, dropoff: e.target.value })} />
                </label>
              </>
            )}
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            {edit._cancel ? (
              <button onClick={() => requestChange("cancel")} className="mt-6 w-full rounded-2xl border border-red-500/40 py-4 text-red-300">
                {loading ? "Sending…" : "Request cancel"}
              </button>
            ) : (
              <button onClick={() => requestChange("change")} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">
                {loading ? "Sending…" : "Save change request"}
              </button>
            )}
          </div>
        ) : (
          <div className="px-5 pt-2">
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            <div className="mt-2 flex justify-between text-sm text-zinc-400">
              <span>{client.full_name || client.email}</span>
              <button onClick={() => setTab("profile")} className="text-[#d8b56b]">
                Profile
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#141414] p-1">
              <button
                onClick={() => setTab("upcoming")}
                className={`rounded-xl py-3 text-sm ${tab === "upcoming" ? "bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black" : "text-zinc-300"}`}
              >
                Upcoming ({upcoming.length})
              </button>
              <button
                onClick={() => setTab("past")}
                className={`rounded-xl py-3 text-sm ${tab === "past" ? "bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black" : "text-zinc-300"}`}
              >
                Past Rides ({history.length})
              </button>
            </div>

            {msg && <p className="mt-3 text-sm text-[#7DCFB6]">{msg}</p>}
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            {tab === "profile" ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-4">
                  <label className="block text-xs uppercase tracking-[0.14em] text-zinc-500">Full name</label>
                  <input className={fieldCls} value={client.full_name || ""} onChange={(e) => setClient({ ...client, full_name: e.target.value })} />
                  <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-zinc-500">Phone</label>
                  <input className={fieldCls} value={client.phone || ""} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
                  <label className="mt-3 block text-xs uppercase tracking-[0.14em] text-zinc-500">Company</label>
                  <input className={fieldCls} value={client.company || ""} onChange={(e) => setClient({ ...client, company: e.target.value })} />
                  <button onClick={saveProfile} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-3 font-semibold text-black">
                    Save profile
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#d8b56b]">Saved places</p>
                  {addresses.map((a) => (
                    <div key={a.id} className="mt-3 border-t border-white/10 pt-3">
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="text-sm text-zinc-400">{a.address}</div>
                    </div>
                  ))}
                  <input className={fieldCls + " mt-3"} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label — Home, Office, IAH" />
                  <input className={fieldCls} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" />
                  <button onClick={addPlace} className="mt-3 w-full rounded-2xl border border-[#d8b56b]/40 py-3 text-sm text-[#e8d3b0]">
                    Save place
                  </button>
                </div>
              </div>
            ) : (
              (tab === "upcoming" ? upcoming : history).map((b) => (
                <RideCard
                  key={b.id || b.confirmation}
                  b={b}
                  past={tab === "past"}
                  onChange={() => setEdit({ ...b })}
                  onCancel={() => setEdit({ ...b, _cancel: true })}
                  onAgain={() => rebook(b)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
