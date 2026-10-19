"use client";

import { useEffect, useState } from "react";
import AddressInput from "@/components/AddressInput";

function money(cents: number) {
  return "$" + (Number(cents || 0) / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function ymdToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(ymd?: string) {
  const s = String(ymd || "").slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s || "—";
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function formatTime(when?: string) {
  const t = String(when || "").split(/[ T]/)[1] || "";
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  if (Number.isNaN(h)) return t;
  const am = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(mStr || "00").slice(0, 2).padStart(2, "0")} ${am}`;
}

function shrinkPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No canvas"));
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read photo"));
    };
    img.src = url;
  });
}

function isDone(j: any, today: string) {
  const s = String(j.tripStatus || "").toLowerCase();
  if (s === "dropped_off" || s === "completed" || s === "done") return true;
  const day = String(j.rideDate || "").slice(0, 10);
  return !!day && day < today;
}
function statusLabel(status?: string) {
  const s = String(status || "").toLowerCase();
  if (s === "on_the_way") return "On the way";
  if (s === "on_location") return "At location";
  if (s === "onboard") return "Onboard";
  if (s === "dropped_off") return "Dropped off";
  if (s === "auction") return "Auction";
  if (s === "confirmed" || s === "assigned") return "";
  return s.replace(/_/g, " ") || "";
}



const inputCls = "w-full rounded-2xl border border-white/10 bg-[#1C1C20] px-4 py-4 outline-none";

export default function DispatchPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [who, setWho] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [revenue, setRevenue] = useState({ week: 0, month: 0, year: 0, lifetime: 0 });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [rosterOpen, setRosterOpen] = useState(false);
  const [tab, setTab] = useState<"open" | "done" | "partners">("open");
  const [partnerTab, setPartnerTab] = useState<"open" | "done">("open");
  const [sent, setSent] = useState<any[]>([]);
  const [form, setForm] = useState({ id: "", name: "", phone: "", pin: "", email: "", vehicle: "sedan" });
  const [owner, setOwner] = useState({ name: "", email: "", password: "" });
  const [manualOpen, setManualOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [trip, setTrip] = useState({ name: "", phone: "", date: "", time: "", pickup: "", dropoff: "", flight: "", passengers: "", notes: "", vehicle: "sedan", amount: "" });

  async function check() {
    const res = await fetch("/api/dispatch/me");
    const data = await res.json().catch(() => ({}));
    setNeedsSetup(!!data.needsSetup);
    setAuthed(res.ok);
    if (res.ok) {
      setWho(data.name || data.email || "");
      await load();
    }
  }

  async function load() {
    const res = await fetch("/api/dispatch/board");
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) setAuthed(false);
      setErr(data.error || "Could not load board");
      return;
    }
    setDrivers(data.drivers || []);
    setJobs(data.jobs || []);
    setRevenue(data.revenue || { week: 0, month: 0, year: 0, lifetime: 0 });
    const sentRes = await fetch("/api/dispatch/sent");
    const sentData = await sentRes.json().catch(() => ({}));
    setSent(sentData.jobs || []);
    setErr("");
  }

  useEffect(() => {
    check().catch(() => setAuthed(false));
  }, []);

  const today = ymdToday();
  const sentKeys = new Set(sent.map((s) => String(s.confirmation || "").trim().toLowerCase()));
  const isSent = (j: any) => sentKeys.has(String(j.confirmation || "").trim().toLowerCase());
  const openJobs = jobs.filter((j) => !isDone(j, today) && !isSent(j));
  const doneJobs = jobs.filter((j) => isDone(j, today) && !isSent(j)).slice().sort((a, b) => String(b.when).localeCompare(String(a.when)));
  const sentDone = (s: any) => ["dropped_off", "completed", "done"].includes(String(s.status || "").toLowerCase());
  const sentOpen = sent.filter((s) => !sentDone(s));
  const sentClosed = sent.filter(sentDone);
  const nToday = openJobs.filter((j) => (j.rideDate || "").slice(0, 10) === today).length;
  const nUp = openJobs.filter((j) => (j.rideDate || "") > today).length;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/dispatch/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Wrong email or password");
      return;
    }
    setPassword("");
    setWho(data.name || data.email || "");
    setAuthed(true);
    await load();
  }

  async function setup(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/dispatch/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Could not create owner");
      return;
    }
    setNeedsSetup(false);
    setPassword("");
    setWho(data.name || data.email || "");
    setAuthed(true);
    await load();
  }


  async function addTrip(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/dispatch/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not add trip");
    else {
      setMsg("Manual trip added " + data.confirmation);
      setTrip({ name: "", phone: "", date: "", time: "", pickup: "", dropoff: "", flight: "", passengers: "", notes: "", vehicle: "sedan", amount: "" });
      setManualOpen(false);
      await load();
    }
  }

  async function updateTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!editingJob) return;
    setErr("");
    const res = await fetch("/api/dispatch/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: editingJob.bookingId, ...trip }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not update trip");
    else {
      setMsg("Trip updated");
      setEditingJob(null);
      setTrip({ name: "", phone: "", date: "", time: "", pickup: "", dropoff: "", flight: "", passengers: "", notes: "", vehicle: "sedan", amount: "" });
      await load();
    }
  }

  function startEdit(j: any) {
    setEditingJob(j);
    setTrip({
      name: j.guestName || "",
      phone: j.guestPhone || "",
      date: (j.rideDate || "").slice(0, 10),
      time: (j.rideTime || j.when || "").slice(0, 5),
      pickup: j.pickup || "",
      dropoff: j.dropoff || "",
      flight: j.flight || "",
      passengers: String(j.passengers || ""),
      notes: (j.notes || "").replace(/ \| In-house manual trip$/, "").trim(),
      vehicle: j.vehicle || "sedan",
      amount: j.amountCents ? String((j.amountCents / 100).toFixed(2)) : "",
    });
    setManualOpen(false);
    setErr("");
    setMsg("Editing trip " + (j.confirmation || ""));
  }

  async function addOwner(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dispatch/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(owner),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not add owner");
    else {
      setMsg("Owner added: " + (data.user?.email || owner.email));
      setOwner({ name: "", email: "", password: "" });
    }
  }

  async function removeTrip(job: any) {
    if (!confirm("Delete this trip?")) return;
    const res = await fetch("/api/dispatch/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: job.bookingId, leg: job.leg }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not delete");
    else { setMsg(data.emailed ? "Deleted and driver emailed" : "Trip deleted"); await load(); }
  }

  async function removePartner(job: any) {
    if (!confirm("Delete this partner trip?")) return;
    const res = await fetch("/api/dispatch/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "partner", id: job.id }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not delete");
    else { setMsg("Partner trip deleted"); await load(); }
  }

  async function auction(job: any) {
    const res = await fetch("/api/dispatch/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: job.bookingId, auction: true, leg: job.leg }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not send to auction");
    else { setMsg("Sent to auction"); await load(); }
  }

  async function assign(job: any, driverId: string) {
    const res = await fetch("/api/dispatch/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: job.bookingId, driverId, leg: job.leg }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Assign failed");
    else {
      setMsg(driverId ? "Driver assigned" : "Unassigned");
      await load();
    }
  }

  function editDriver(d: any) {
    setForm({ id: d.id, name: d.name || "", phone: d.phone || "", pin: d.pin || "", email: d.email || "", vehicle: d.vehicle || "sedan" });
    setMsg("Editing " + (d.name || "driver"));
    setErr("");
  }

  async function addDriver(e: React.FormEvent) {
    e.preventDefault();
    const editing = Boolean(form.id);
    const res = await fetch("/api/dispatch/drivers", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      const raw = data.error || "Could not save driver";
      setErr(/email/i.test(raw) ? "Add an email column in Supabase first: alter table drivers add column if not exists email text;" : /drivers_pin_idx|duplicate key/i.test(raw) ? "That PIN is already used. Give this driver a different PIN." : raw);
    } else {
      setForm({ id: "", name: "", phone: "", pin: "", email: "", vehicle: "sedan" });
      setMsg((data.driver?.name || "Driver") + (editing ? " updated" : " added"));
      await load();
    }
  }

  async function savePhoto(id: string, file?: File) {
    if (!file) return;
    const photo_url = await shrinkPhoto(file);
    const res = await fetch("/api/dispatch/drivers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, photo_url }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not save photo");
    else {
      setMsg("Photo saved");
      await load();
    }
  }

  function jobCard(j: any, completed: boolean) {
    const d = drivers.find((x) => x.id === j.assignedDriverId);
    return (
      <div key={j.id} className="rounded-2xl border border-white/10 bg-[#141416] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm text-[#C4A574]">{formatDate(j.rideDate)}{formatTime(j.when) ? ` · ${formatTime(j.when)}` : ""}</div>
          <div className="text-[10px] tracking-widest text-[#C4A574]">{j.confirmation}</div>
        </div>
        <div className="mt-2 text-lg font-medium">{j.guestName || "Customer"}</div>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-[#9A9388]">Pickup</div>
        <div className="text-sm leading-5">{j.pickup || "—"}</div>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-[#9A9388]">Drop off</div>
        <div className="text-sm leading-5">{j.dropoff || "—"}</div>
        {String(j.flight || "").trim() && (
          <>
            <div className="mt-3 text-[11px] uppercase tracking-widest text-[#9A9388]">Flight number</div>
            <div className="text-sm leading-5">{j.flight}</div>
          </>
        )}
        {String(j.passengers || "").trim() && (
          <>
            <div className="mt-3 text-[11px] uppercase tracking-widest text-[#9A9388]">Passengers</div>
            <div className="text-sm leading-5">{j.passengers}</div>
          </>
        )}
        {String(j.notes || "").trim() && (
          <>
            <div className="mt-3 text-[11px] uppercase tracking-widest text-[#9A9388]">Additional note</div>
            <div className="text-sm leading-5 whitespace-pre-wrap">{j.notes}</div>
          </>
        )}
        <div className="mt-3 text-xs text-[#E8D3B0]">
          {j.tripStatus === "auction" ? "Auction" : d ? `Driver ${d.name}${statusLabel(j.tripStatus) ? ` · ${statusLabel(j.tripStatus)}` : ""}` : completed ? "" : "Unassigned"}
          {j.driverPayCents ? ` · ${money(j.driverPayCents)}` : ""}
        </div>
        {!completed && j.tripStatus !== "auction" && (
          <button onClick={() => auction(j)} className="mt-3 w-full rounded-xl border border-[#C4A574]/50 py-2 text-sm text-[#E8D3B0]">Send to auction</button>
        )}
        {!completed && (
          <button onClick={() => startEdit(j)} className="mt-3 w-full rounded-xl border border-[#C4A574]/50 py-2 text-sm text-[#E8D3B0]">Edit trip</button>
        )}
        {!completed && (
          <button onClick={() => removeTrip(j)} className="mt-3 w-full rounded-xl border border-red-500/40 py-2 text-sm text-red-300">Delete trip</button>
        )}
        {!completed && (
          <select className="mt-3 w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" value={j.assignedDriverId || ""} onChange={(e) => assign(j, e.target.value)}>
            <option value="">Unassigned</option>
            {drivers.map((dr) => (
              <option key={dr.id} value={dr.id}>{dr.name}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  if (authed === null) {
    return <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8] p-8">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8]">
        <div className="mx-auto max-w-md px-5 pt-16">
          <div className="text-[13px] tracking-[0.16em] text-[#E8D3B0]">JEAN LIMO DISPATCH</div>
          <h1 className="mt-6 text-3xl font-semibold">{needsSetup ? "Create owner login" : "Owner login"}</h1>
          <p className="mt-2 text-sm text-[#9A9388]">
            {needsSetup
              ? "First time only. Password is stored hashed on the server, not in the page."
              : "Email and password are checked on the server."}
          </p>
          <form onSubmit={needsSetup ? setup : login} className="mt-8 space-y-3">
            {needsSetup && (
              <input className={inputCls} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={inputCls} type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button className="w-full rounded-2xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-4 font-semibold text-[#16110a]">
              {needsSetup ? "Create login" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8]">
      <div className="mx-auto max-w-xl px-4 pb-16 pt-5">
        <div className="flex items-center justify-between">
          <div className="text-[13px] tracking-[0.16em] text-[#E8D3B0]">JEAN LIMO DISPATCH</div>
          <div className="flex gap-2">
            <button onClick={() => setManualOpen(!manualOpen)} className="rounded-full border border-[#C4A574]/40 px-3 py-1 text-xs text-[#E8D3B0]">Add trip</button>
            <button onClick={() => load()} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A9388]">Refresh</button>
            <button onClick={() => setRosterOpen(!rosterOpen)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A9388]">Drivers</button>
            <button
              onClick={async () => {
                await fetch("/api/dispatch/logout", { method: "POST" });
                setAuthed(false);
              }}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A9388]"
            >
              Sign out
            </button>
          </div>
        </div>
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[#C4A574]">Live board{who ? ` · ${who}` : ""}</p>
        <h1 className="text-3xl font-semibold">Assign jobs</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#9A9388]">Year</div>
            <div className="mt-1 text-2xl font-semibold">{money(revenue.year)}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#9A9388]">Lifetime</div>
            <div className="mt-1 text-2xl font-semibold">{money(revenue.lifetime)}</div>
          </div>
        </div>
        {manualOpen && (
          <form onSubmit={addTrip} className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">In-house trip</div>
            <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Passenger name" value={trip.name} onChange={(e) => setTrip({ ...trip, name: e.target.value })} />
            <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Phone" value={trip.phone} onChange={(e) => setTrip({ ...trip, phone: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-[#9A9388]">Date</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" type="date" value={trip.date} onChange={(e) => setTrip({ ...trip, date: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-[#9A9388]">Time</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" type="time" value={trip.time} onChange={(e) => setTrip({ ...trip, time: e.target.value })} />
              </label>
            </div>
            <AddressInput id="manual-pickup" value={trip.pickup} onChange={(v) => setTrip({ ...trip, pickup: v })} placeholder="Pickup" className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" />
            <AddressInput id="manual-dropoff" value={trip.dropoff} onChange={(v) => setTrip({ ...trip, dropoff: v })} placeholder="Drop-off" className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Flight" value={trip.flight} onChange={(e) => setTrip({ ...trip, flight: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Passengers" value={trip.passengers} onChange={(e) => setTrip({ ...trip, passengers: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" value={trip.vehicle} onChange={(e) => setTrip({ ...trip, vehicle: e.target.value })}>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sprinter">Sprinter</option>
              </select>
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Fare $" value={trip.amount} onChange={(e) => setTrip({ ...trip, amount: e.target.value })} />
            </div>
            <textarea className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Notes, gate code, who to bill" value={trip.notes} onChange={(e) => setTrip({ ...trip, notes: e.target.value })} />
            <button className="w-full rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Save trip</button>
          </form>
        )}

        {editingJob && (
          <form onSubmit={updateTrip} className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">Edit trip</div>
            <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Passenger name" value={trip.name} onChange={(e) => setTrip({ ...trip, name: e.target.value })} />
            <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Phone" value={trip.phone} onChange={(e) => setTrip({ ...trip, phone: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-[#9A9388]">Date</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" type="date" value={trip.date} onChange={(e) => setTrip({ ...trip, date: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] uppercase tracking-widest text-[#9A9388]">Time</span>
                <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" type="time" value={trip.time} onChange={(e) => setTrip({ ...trip, time: e.target.value })} />
              </label>
            </div>
            <AddressInput id="edit-pickup" value={trip.pickup} onChange={(v) => setTrip({ ...trip, pickup: v })} placeholder="Pickup" className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" />
            <AddressInput id="edit-dropoff" value={trip.dropoff} onChange={(v) => setTrip({ ...trip, dropoff: v })} placeholder="Drop-off" className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" />
            <div className="grid grid-cols-2 gap-2">
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Flight" value={trip.flight} onChange={(e) => setTrip({ ...trip, flight: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Passengers" value={trip.passengers} onChange={(e) => setTrip({ ...trip, passengers: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" value={trip.vehicle} onChange={(e) => setTrip({ ...trip, vehicle: e.target.value })}>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sprinter">Sprinter</option>
              </select>
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Fare $ (e.g. 150)" value={trip.amount} onChange={(e) => setTrip({ ...trip, amount: e.target.value })} />
            </div>
            <textarea className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Notes, gate code, who to bill" value={trip.notes} onChange={(e) => setTrip({ ...trip, notes: e.target.value })} />
            <div className="flex gap-2">
              <button className="flex-1 rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Update trip</button>
              <button type="button" onClick={() => { setEditingJob(null); setTrip({ name: "", phone: "", date: "", time: "", pickup: "", dropoff: "", flight: "", passengers: "", notes: "", vehicle: "sedan", amount: "" }); }} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-[#9A9388]">Cancel</button>
            </div>
          </form>
        )}


        {rosterOpen && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">Roster</div>
            {drivers.map((d) => (
              <div key={d.id} onClick={() => editDriver(d)} className="mt-3 flex cursor-pointer items-center gap-3 border-t border-white/10 pt-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#1C1C20]">
                  {d.photo_url ? <img src={d.photo_url} alt="" className="h-full w-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{d.name}</div>
                  <div className="truncate text-xs text-[#9A9388]">{d.phone} · PIN {d.pin}</div>
                </div>
                <label className="text-xs text-[#C4A574]">
                  Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => savePhoto(d.id, e.target.files?.[0])} />
                </label>
              </div>
            ))}
            <form onSubmit={addDriver} className="mt-4 space-y-2 border-t border-white/10 pt-4">
              <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Driver name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="PIN" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} />
              <input className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select className="w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sprinter">Sprinter</option>
              </select>
              <button className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">{form.id ? "Update driver" : "Add driver"}</button>
              {form.id && <button type="button" onClick={() => setForm({ id: "", name: "", phone: "", pin: "", email: "", vehicle: "sedan" })} className="text-sm text-[#9A9388]">Cancel edit</button>}
            </form>
          </div>
        )}


        <div className="mt-4 flex gap-2">
          <button onClick={() => setTab("open")} className={`rounded-full px-4 py-2 text-sm ${tab === "open" ? "bg-[#E8D3B0] text-[#16110a]" : "border border-white/10 text-[#9A9388]"}`}>Open ({openJobs.length})</button>
          <button onClick={() => setTab("done")} className={`rounded-full px-4 py-2 text-sm ${tab === "done" ? "bg-[#E8D3B0] text-[#16110a]" : "border border-white/10 text-[#9A9388]"}`}>Completed ({doneJobs.length})</button>
          <button onClick={() => setTab("partners")} className={`rounded-full px-4 py-2 text-sm ${tab === "partners" ? "bg-[#E8D3B0] text-[#16110a]" : "border border-white/10 text-[#9A9388]"}`}>Partners ({sent.length})</button>
        </div>
        {msg && <p className="mt-4 text-sm text-[#7DCFB6]">{msg}</p>}
        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        <div className="mt-4 space-y-3">
          {tab === "open" && openJobs.map((j) => jobCard(j, false))}
          {tab === "done" && doneJobs.map((j) => jobCard(j, true))}
          {tab === "partners" && (
            <>
              <div className="flex gap-2">
                <button onClick={() => setPartnerTab("open")} className={`rounded-full px-3 py-1 text-xs ${partnerTab === "open" ? "bg-[#E8D3B0] text-[#16110a]" : "border border-white/10"}`}>Open ({sentOpen.length})</button>
                <button onClick={() => setPartnerTab("done")} className={`rounded-full px-3 py-1 text-xs ${partnerTab === "done" ? "bg-[#E8D3B0] text-[#16110a]" : "border border-white/10"}`}>Done ({sentClosed.length})</button>
              </div>
              {(partnerTab === "open" ? sentOpen : sentClosed).map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-[#141416] p-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-[#C4A574]">{formatDate(s.date)} · {s.time}</div>
                    <div className="text-[10px] tracking-widest text-[#C4A574]">{s.confirmation}</div>
                  </div>
                  <div className="mt-2 text-lg">{s.guest || "Partner trip"}</div>
                  <div className="mt-2 text-sm">{s.pickup}</div>
                  <div className="text-sm">{s.dropoff}</div>
                  <div className="mt-2 text-xs text-[#E8D3B0]">To {s.partner} · {s.status}</div>
                  <button onClick={() => removePartner(s)} className="mt-3 w-full rounded-xl border border-red-500/40 py-2 text-sm text-red-300">Delete</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

