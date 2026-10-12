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
  const [company, setCompany] = useState({ company: "", contact: "", phone: "", email: "", city: "", airports: "", vehicles: "", pin: "", password: "" });

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

  async function approve(e: React.FormEvent) {
    e.preventDefault();
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
    if (company.pin) {
      await fetch("/api/dispatch/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: createdData.partner.id, pin: company.pin }),
      });
    }
    let login = "";
    if (company.password) {
      const user = await fetch("/api/dispatch/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: company.email, password: company.password, name: company.company }),
      });
      const userData = await user.json();
      login = user.ok
        ? " Dispatch login is ready at jeanlimo.com/dispatch."
        : " Partner saved, but dispatch login failed: " + (userData.error || "password must be 8+ characters");
    }
    setMsg(createdData.partner.company + " is approved." + login);
    setCompany({ company: "", contact: "", phone: "", email: "", city: "", airports: "", vehicles: "", pin: "", password: "" });
    loadPartners();
  }

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

  const input = "rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3";

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 py-8 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <a href="/dispatch" className="text-sm text-[#C4A574]">Back to dispatch</a>
        <h1 className="mt-3 text-3xl font-semibold">Approve a company</h1>
        <p className="mt-2 text-sm text-[#9A9388]">The application email does not approve them. Fill this in after you check insurance. Password makes their dispatch login.</p>
        <form onSubmit={approve} className="mt-4 grid gap-2">
          <input className={input} placeholder="Company name" value={company.company} onChange={(e) => setCompany({ ...company, company: e.target.value })} required />
          <input className={input} placeholder="Contact name" value={company.contact} onChange={(e) => setCompany({ ...company, contact: e.target.value })} />
          <input className={input} placeholder="Phone" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
          <input className={input} type="email" placeholder="Email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required />
          <input className={input} placeholder="City" value={company.city} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
          <input className={input} placeholder="Airports" value={company.airports} onChange={(e) => setCompany({ ...company, airports: e.target.value })} />
          <input className={input} placeholder="Vehicles" value={company.vehicles} onChange={(e) => setCompany({ ...company, vehicles: e.target.value })} />
          <input className={input} placeholder="Partner PIN, 4 digits" value={company.pin} onChange={(e) => setCompany({ ...company, pin: e.target.value })} />
          <input className={input} type="password" placeholder="Dispatch password, 8+ characters" value={company.password} onChange={(e) => setCompany({ ...company, password: e.target.value })} />
          <button className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">Approve and create login</button>
        </form>

        <h2 className="mt-10 text-2xl font-semibold">Send a job</h2>
        <form onSubmit={send} className="mt-4 grid gap-2">
          <select className={input} value={job} onChange={(e) => setJob(e.target.value)} required>
            <option value="">Choose job</option>
            {jobs.map((j) => <option key={j.bookingId || j.id} value={j.bookingId || j.id}>{j.confirmation} · {j.guestName} · {j.pickup}</option>)}
          </select>
          <select className={input} value={partner} onChange={(e) => setPartner(e.target.value)} required>
            <option value="">Choose partner</option>
            {partners.map((p) => <option key={p.id} value={p.id}>{p.company} · {p.city || ""}</option>)}
          </select>
          <input className={input} placeholder="What you pay them $" value={pay} onChange={(e) => setPay(e.target.value)} required />
          <button className="rounded-xl border border-[#C4A574]/40 py-3 text-[#E8D3B0]">Send job</button>
        </form>
        <form onSubmit={savePin} className="mt-6 grid gap-2">
          <div className="text-xs uppercase tracking-widest text-[#C4A574]">Change their PIN</div>
          <input className={input} placeholder="PIN for the selected partner" value={pin} onChange={(e) => setPin(e.target.value)} />
          <button className="rounded-xl border border-white/10 py-3 text-[#E8D3B0]">Save PIN</button>
        </form>
        {msg && <p className="mt-3 text-sm text-[#E8D3B0]">{msg}</p>}
      </div>
    </main>
  );
}
