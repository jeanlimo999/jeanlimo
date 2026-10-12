"use client";

import { useEffect, useState } from "react";

export default function PartnerPortal() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [company, setCompany] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState<Record<string, any>>({});

  async function load() {
    const res = await fetch("/api/partner/jobs");
    const data = await res.json();
    if (!res.ok) return;
    setSignedIn(true);
    setCompany(data.company || "");
    setJobs(data.jobs || []);
    setDrivers(data.drivers || []);
  }

  useEffect(() => { load(); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/partner/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || "Could not sign in"); return; }
    setErr("");
    load();
  }

  async function assign(id: string, driver: any) {
    if (!driver?.name || !driver?.phone || !driver?.email) {
      setErr("Enter name, phone, and email");
      return;
    }
    const res = await fetch("/api/partner/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, driver: driver.name, driverPhone: driver.phone, driverEmail: driver.email }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || "Could not save"); return; }
    setErr("");
    setMsg("Driver saved. " + driver.name + " is assigned.");
    setAdding((v) => ({ ...v, [id]: false }));
    load();
  }

  const input = "w-full mt-2 rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3";

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 py-8 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <div className="text-xs uppercase tracking-[0.16em] text-[#C4A574]">Partner portal</div>
        <h1 className="mt-2 text-3xl font-semibold">Your Jean Limo jobs</h1>
        <p className="mt-2 text-sm text-[#9A9388]">Pick a saved driver. Add a new one once. They sign in at jeanlimo.com/pdriver.html with their email and the last 4 of their phone.</p>
        {!signedIn && (
          <form onSubmit={login} className="mt-4">
            <input className={input} type="email" placeholder="Company email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={input} placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} required />
            <button className="mt-2 w-full rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Sign in</button>
          </form>
        )}
        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        {msg && <div className="mt-3 rounded-xl border border-[#C4A574] bg-[#1C1C20] px-3 py-3 text-[#E8D3B0]">{msg}</div>}
        {signedIn && <p className="mt-4 text-sm text-[#9A9388]">{company}</p>}
        {jobs.map((job) => (
          <div key={job.id} className="mt-3 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <div className="text-xs uppercase tracking-widest text-[#C4A574]">{job.date} {job.time} · ${job.pay} · {job.status}</div>
            <div className="mt-2 text-xl">{job.guest}</div>
            <div className="text-sm text-[#9A9388]">{job.phone}</div>
            <div className="mt-2">{job.pickup}</div>
            <div>{job.dropoff}</div>
            <select
              className={input}
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value;
                if (value === "new") { setAdding((v) => ({ ...v, [job.id]: true })); return; }
                setAdding((v) => ({ ...v, [job.id]: false }));
                if (value === "") return;
                assign(job.id, drivers[Number(value)]);
              }}
            >
              <option value="">Select driver</option>
              {drivers.map((d, i) => <option key={d.email} value={i}>{d.name}</option>)}
              <option value="new">Add new driver</option>
            </select>
            {adding[job.id] && (
              <div>
                <input className={input} placeholder="Driver name" value={draft[job.id]?.name || ""} onChange={(e) => setDraft({ ...draft, [job.id]: { ...draft[job.id], name: e.target.value } })} />
                <input className={input} placeholder="Driver phone" value={draft[job.id]?.phone || ""} onChange={(e) => setDraft({ ...draft, [job.id]: { ...draft[job.id], phone: e.target.value } })} />
                <input className={input} type="email" placeholder="Driver email" value={draft[job.id]?.email || ""} onChange={(e) => setDraft({ ...draft, [job.id]: { ...draft[job.id], email: e.target.value } })} />
                <button onClick={() => assign(job.id, draft[job.id])} className="mt-2 w-full rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Save driver</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
