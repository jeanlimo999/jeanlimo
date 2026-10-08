"use client";

import { useEffect, useState } from "react";

export default function SendPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [job, setJob] = useState("");
  const [partner, setPartner] = useState("");
  const [pay, setPay] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/dispatch/board").then(async (res) => {
      if (res.status === 401) window.location.href = "/dispatch";
      const data = await res.json();
      setJobs(data.jobs || []);
    });
    fetch("/api/dispatch/partners").then(async (res) => {
      const data = await res.json();
      setPartners(data.partners || []);
    });
  }, []);

  async function savePin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dispatch/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: partner, pin }),
    });
    const data = await res.json();
    setMsg(res.ok ? "PIN saved. They sign in at jeanlimo.com/partner.html" : data.error || "Could not save PIN");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/dispatch/farm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: job, partnerId: partner, pay }),
    });
    const data = await res.json();
    setMsg(res.ok ? "Sent to " + data.partner + ". They assign their driver at jeanlimo.com/partner.html" : data.error || "Could not send");
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 py-8 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <a href="/dispatch" className="text-sm text-[#C4A574]">Back to dispatch</a>
        <h1 className="mt-3 text-3xl font-semibold">Send job to partner</h1>
        <p className="mt-2 text-sm text-[#9A9388]">Approved partners only. They pay no customer. They assign their own driver.</p>
        <form onSubmit={send} className="mt-4 grid gap-2">
          <select className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3" value={job} onChange={(e) => setJob(e.target.value)} required>
            <option value="">Choose job</option>
            {jobs.map((j) => <option key={j.bookingId || j.id} value={j.bookingId || j.id}>{j.confirmation} · {j.guestName} · {j.pickup}</option>)}
          </select>
          <select className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3" value={partner} onChange={(e) => setPartner(e.target.value)} required>
            <option value="">Choose partner</option>
            {partners.map((p) => <option key={p.id} value={p.id}>{p.company} · {p.city || ""}</option>)}
          </select>
          <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3" placeholder="What you pay them $" value={pay} onChange={(e) => setPay(e.target.value)} required />
          <button className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Send job</button>
        </form>
        <form onSubmit={savePin} className="mt-6 grid gap-2">
          <div className="text-xs uppercase tracking-widest text-[#C4A574]">Set their login PIN</div>
          <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3" placeholder="PIN for the selected partner" value={pin} onChange={(e) => setPin(e.target.value)} />
          <button className="rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">Save PIN</button>
        </form>
        {msg && <p className="mt-3 text-sm text-[#E8D3B0]">{msg}</p>}
      </div>
    </main>
  );
}
