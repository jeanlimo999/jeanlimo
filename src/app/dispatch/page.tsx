"use client";

import { useEffect, useState } from "react";

function shortAddr(a?: string) {
  return String(a || "").split(",")[0];
}

function shrinkPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
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

export default function DispatchPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [rosterOpen, setRosterOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", pin: "", vehicle: "sedan" });

  async function check() {
    const res = await fetch("/api/dispatch/me");
    setAuthed(res.ok);
    if (res.ok) await load();
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
    setErr("");
  }

  useEffect(() => {
    check().catch(() => setAuthed(false));
  }, []);

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const openJobs = jobs.filter((j) => j.tripStatus !== "dropped_off");
  const nToday = openJobs.filter((j) => (j.rideDate || "").slice(0, 10) === today).length;
  const nUp = openJobs.filter((j) => (j.rideDate || "") > today).length;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/dispatch/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Wrong PIN");
      return;
    }
    setPin("");
    setAuthed(true);
    await load();
  }

  async function assign(job: any, driverId: string) {
    const res = await fetch("/api/dispatch/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: job.bookingId, driverId }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Assign failed");
    else {
      setMsg(driverId ? "Driver assigned" : "Unassigned");
      await load();
    }
  }

  async function addDriver(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dispatch/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not add driver");
    else {
      setForm({ name: "", phone: "", pin: "", vehicle: "sedan" });
      setMsg((data.driver?.name || "Driver") + " added");
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

  if (authed === null) {
    return <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8] p-8">Loading…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#F6F1E8]">
        <div className="mx-auto max-w-md px-5 pt-16">
          <div className="text-[13px] tracking-[0.16em] text-[#E8D3B0]">JEAN LIMO DISPATCH</div>
          <h1 className="mt-6 text-3xl font-semibold">Owner login</h1>
          <p className="mt-2 text-sm text-[#9A9388]">PIN is checked on the server. It is not in the page source.</p>
          <form onSubmit={login} className="mt-8">
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Dispatch PIN"
              className="w-full rounded-2xl border border-white/10 bg-[#1C1C20] px-4 py-4 outline-none"
            />
            {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            <button className="mt-4 w-full rounded-2xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-4 font-semibold text-[#16110a]">
              Open dispatch
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
            <button onClick={() => load()} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A9388]">
              Refresh
            </button>
            <button onClick={() => setRosterOpen(!rosterOpen)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A9388]">
              Drivers
            </button>
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
        <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#C4A574]">Live board</p>
        <h1 className="text-3xl font-semibold">Assign jobs</h1>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">Today</div>
            <div className="mt-1 text-3xl font-semibold">{nToday}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">Upcoming</div>
            <div className="mt-1 text-3xl font-semibold">{nUp}</div>
          </div>
        </div>
        {msg && <p className="mt-3 text-sm text-[#7DCFB6]">{msg}</p>}
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        {rosterOpen && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-[11px] uppercase tracking-widest text-[#C4A574]">Roster</div>
            {drivers.map((d) => (
              <div key={d.id} className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
                {d.photo_url ? (
                  <img src={d.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2418] text-[#E8D3B0]">
                    {String(d.name || "J").charAt(0)}
                  </div>
                )}
                <div className="flex-1 text-sm">{d.name}</div>
                <input type="file" accept="image/*" onChange={(e) => savePhoto(d.id, e.target.files?.[0])} />
              </div>
            ))}
            <form onSubmit={addDriver} className="mt-4 grid gap-2">
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Driver app PIN" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} />
              <button className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Save driver</button>
            </form>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {jobs.length ? (
            jobs.map((j) => {
              const d = drivers.find((x) => x.id === j.assignedDriverId);
              return (
                <div key={j.id} className="rounded-2xl border border-white/10 bg-[#141416] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-medium">{j.guestName}</div>
                    <div className="text-[10px] tracking-widest text-[#C4A574]">{j.confirmation}</div>
                  </div>
                  <div className="mt-1 text-sm text-[#9A9388]">
                    {j.when} · {shortAddr(j.pickup)}
                  </div>
                  <div className="text-sm text-[#9A9388]">→ {shortAddr(j.dropoff)}</div>
                  <div className="mt-2 text-xs text-[#E8D3B0]">{d ? `Driver ${d.name}` : "Unassigned"}</div>
                  <select
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2"
                    value={j.assignedDriverId || ""}
                    onChange={(e) => assign(j, e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((dr) => (
                      <option key={dr.id} value={dr.id}>
                        {dr.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[#9A9388]">No jobs</p>
          )}
        </div>
      </div>
    </div>
  );
}
