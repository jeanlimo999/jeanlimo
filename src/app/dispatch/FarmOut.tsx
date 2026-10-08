"use client";

import { useEffect, useState } from "react";

export default function FarmOut({ job }: { job: any }) {
  const [open, setOpen] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [partnerId, setPartnerId] = useState("");
  const [pay, setPay] = useState(job?.amountCents ? String(Math.round(job.amountCents / 100 * 0.8)) : "");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/dispatch/partners").then((r) => r.json()).then((d) => setPartners(d.partners || [])).catch(() => setPartners([]));
  }, [open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/dispatch/farm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId, bookingId: job.bookingId, confirmation: job.confirmation, pay }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || "Could not send"); return; }
    setMsg("Sent to " + (data.partner || "partner"));
    if (data.sms) window.location.href = data.sms;
  }

  if (!open) {
    return <button type="button" onClick={() => setOpen(true)} className="mt-3 w-full rounded-xl border border-[#C4A574]/40 py-2 text-sm text-[#E8D3B0]">Farm out</button>;
  }

  return (
    <form onSubmit={send} className="mt-3 grid gap-2">
      <select className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} required>
        <option value="">Approved partner</option>
        {partners.map((p) => <option key={p.id} value={p.id}>{p.company}{p.city ? " \u00b7 " + p.city : ""}</option>)}
      </select>
      <input className="rounded-xl border border-white/10 bg-[#1C1C20] px-3 py-2" placeholder="Their pay $" value={pay} onChange={(e) => setPay(e.target.value)} />
      <button className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-2 text-sm font-semibold text-[#16110a]">Send private link</button>
      {msg && <p className="text-xs text-[#7DCFB6]">{msg}</p>}
      {err && <p className="text-xs text-red-400">{err}</p>}
    </form>
  );
}
