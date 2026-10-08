"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function PartnersPage() {
  const [form, setForm] = useState({
    company: "",
    contact: "",
    phone: "",
    email: "",
    city: "",
    airports: "",
    vehicles: "Sedan, SUV",
    insurance: "",
    notes: "",
  });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not send. Call 281-917-0085.");
      return;
    }
    setSent(true);
  }

  const field = "w-full rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-3 text-sm outline-none";

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 pb-20 pt-28 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#C4A574]">Affiliate network</p>
        <h1 className="mt-3 text-4xl font-semibold">Join Jean Limo</h1>
        <p className="mt-3 text-sm leading-6 text-[#9A9388]">
          For licensed black car and chauffeur companies in New York, New Jersey, Houston, or any city.
          You run the trip. Jean Limo keeps the booking and pays your farm-out rate after the job.
          Applying does not approve you.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-[#E8D3B0]">
          <li>Commercial insurance, usually $1 million</li>
          <li>Local license for your city</li>
          <li>Sedan, SUV, or Sprinter</li>
          <li>A phone that is answered for the trip</li>
        </ul>

        {sent ? (
          <p className="mt-8 rounded-2xl border border-[#C4A574]/40 bg-[#141416] p-5 text-sm">
            Application sent. Jean Limo will review it and reply by email or phone. You are not approved until you hear back.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-[#141416] p-4">
            <input className={field} placeholder="Company name" value={form.company} onChange={(e) => set("company", e.target.value)} required />
            <input className={field} placeholder="Your name" value={form.contact} onChange={(e) => set("contact", e.target.value)} required />
            <input className={field} placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            <input className={field} type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            <input className={field} placeholder="City, for example New York" value={form.city} onChange={(e) => set("city", e.target.value)} required />
            <input className={field} placeholder="Airports you cover, JFK, LGA, EWR" value={form.airports} onChange={(e) => set("airports", e.target.value)} />
            <input className={field} placeholder="Vehicles" value={form.vehicles} onChange={(e) => set("vehicles", e.target.value)} />
            <input className={field} placeholder="Insurance company and policy number" value={form.insurance} onChange={(e) => set("insurance", e.target.value)} />
            <textarea className={field} rows={4} placeholder="Anything else: fleet size, hours, languages" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button disabled={busy} className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-3 font-semibold text-[#16110a]">
              {busy ? "Sending…" : "Apply"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
