"use client";

import { useEffect, useState } from "react";

export default function SendPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [openId, setOpenId] = useState("");
  const [adding, setAdding] = useState(false);
  const [sending, setSending] = useState(false);
  const [job, setJob] = useState("");
  const [partner, setPartner] = useState("");
  const [pay, setPay] = useState("");
  const [msg, setMsg] = useState("");
  const [company, setCompany] = useState({ company: "", contact: "", phone: "", email: "", city: "", airports: "", vehicles: "", pin: "" });

  function loadPartners() {
    fetch("/api/dispatch/partners").then(async (res) => {
      const data = await res.json();
      setPartners(data.partners || []);
    });
  }

  useEffect(() => {
    fetch("/api/dispatch/board").then(async (res) => {
      if (res.status === 401) window.location.href = "/dispatch";
      const data = await res.json();
      setJobs(data.jobs || []);
    });
    loadPartners();
  }, []);

  function edit(id: string, field: string, value: string) {
    setPartners(partners.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function savePartner(p: any) {
    const res = await fetch("/api/dispatch/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const data = await res.json();
    setMsg(res.ok ? p.company + " saved" : data.error || "Could not save");
    if (res.ok) setOpenId("");
  }

  async function removePartner(p: any) {
    if (!confirm("Delete " + p.company + "?")) return;
    const res = await fetch("/api/dispatch/partners?id=" + p.id, { method: "DELETE" });
    const data = await res.json();
    setMsg(res.ok ? p.company + " deleted" : data.error || "Could not delete");
    setOpenId("");
    loadPartners();
  }

  async function approve(e: React.FormEvent) {
    e.preventDefault();
    if (company.pin.length < 4) {
      setMsg("PIN needs at least 4 digits");
      return;
    }
    const created = await fetch("/api/dispatch/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });
    const createdData = await created.json();
    if (!created.ok) {
      setMsg(createdData.error || "Could not approve company");
      return;
    }
    await fetch("/api/dispatch/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: createdData.partner.id, pin: company.pin }),
    });
    setMsg(createdData.partner.company + " is approved. They sign in at jeanlimo.com/partner.html and only see jobs you send them.");
    setCompany({ company: "", contact: "", phone: "", email: "", city: "", airports: "", vehicles: "", pin: "" });
    setAdding(false);
    loadPartners();
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
    if (res.ok) setSending(false);
  }

  const input = "rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3";

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 py-8 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <a href="/dispatch" className="text-sm text-[#C4A574]">Back to dispatch</a>
        <h1 className="mt-3 text-3xl font-semibold">Partners</h1>
        <p className="mt-2 text-sm text-[#9A9388]">Tap a company to edit. They use jeanlimo.com/partner.html and only see jobs you send.</p>
        <div className="mt-4 grid gap-2">
          {partners.map((p) => (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-[#141416]">
              <button type="button" onClick={() => setOpenId(openId === p.id ? "" : p.id)} className="flex w-full items-center justify-between px-4 py-4 text-left">
                <span>
                  <span className="block text-lg">{p.company}</span>
                  <span className="block text-sm text-[#9A9388]">{p.city || "No city"}</span>
                </span>
                <span className="text-[#C4A574]">{openId === p.id ? "Close" : "Edit"}</span>
              </button>
              {openId === p.id && (
                <div className="grid gap-2 px-3 pb-3">
                  <input className={input} value={p.company || ""} onChange={(e) => edit(p.id, "company", e.target.value)} />
                  <input className={input} placeholder="Email" value={p.email || ""} onChange={(e) => edit(p.id, "email", e.target.value)} />
                  <input className={input} placeholder="Phone" value={p.phone || ""} onChange={(e) => edit(p.id, "phone", e.target.value)} />
                  <input className={input} placeholder="City" value={p.city || ""} onChange={(e) => edit(p.id, "city", e.target.value)} />
                  <input className={input} placeholder="PIN" value={p.pin || ""} onChange={(e) => edit(p.id, "pin", e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => savePartner(p)} className="rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">Save</button>
                    <button type="button" onClick={() => removePartner(p)} className="rounded-xl border border-red-400/40 py-3 text-red-200">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setAdding(!adding)} className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">
          {adding ? "Close" : "Add a company"}
        </button>
        {adding && (
          <form onSubmit={approve} className="mt-4 grid gap-2">
            <input className={input} placeholder="Company name" value={company.company} onChange={(e) => setCompany({ ...company, company: e.target.value })} required />
            <input className={input} placeholder="Contact name" value={company.contact} onChange={(e) => setCompany({ ...company, contact: e.target.value })} />
            <input className={input} placeholder="Phone" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            <input className={input} placeholder="Email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required />
            <input className={input} placeholder="City" value={company.city} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
            <input className={input} placeholder="Airports" value={company.airports} onChange={(e) => setCompany({ ...company, airports: e.target.value })} />
            <input className={input} placeholder="Vehicles" value={company.vehicles} onChange={(e) => setCompany({ ...company, vehicles: e.target.value })} />
            <input className={input} placeholder="Partner PIN, 4 digits" value={company.pin} onChange={(e) => setCompany({ ...company, pin: e.target.value })} required />
            <button className="rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">Approve partner</button>
          </form>
        )}

        <button type="button" onClick={() => setSending(!sending)} className="mt-4 w-full rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">
          {sending ? "Close" : "Send a job"}
        </button>
        {sending && (
          <form onSubmit={send} className="mt-4 grid gap-2">
            <select className={input} value={job} onChange={(e) => setJob(e.target.value)} required>
              <option value="">Choose job</option>
              {jobs.map((j) => <option key={j.id || j.bookingId} value={j.bookingId || j.id}>{j.when || "No time"} · {j.confirmation} · {j.guestName} · {j.pickup}</option>)}
            </select>
            <select className={input} value={partner} onChange={(e) => setPartner(e.target.value)} required>
              <option value="">Choose partner</option>
              {partners.map((p) => <option key={p.id} value={p.id}>{p.company} · {p.city || ""}</option>)}
            </select>
            <input className={input} placeholder="What you pay them $" value={pay} onChange={(e) => setPay(e.target.value)} required />
            <button className="rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">Send job</button>
          </form>
        )}
        {msg && <p className="mt-3 text-sm text-[#E8D3B0]">{msg}</p>}
      </div>
    </main>
  );
}
