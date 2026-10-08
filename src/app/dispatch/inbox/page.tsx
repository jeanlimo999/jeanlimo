"use client";

import { useEffect, useState } from "react";

export default function InboxPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch("/api/dispatch/farmin");
    const data = await res.json();
    if (res.status === 401) { window.location.href = "/dispatch"; return; }
    setOffers(data.offers || []);
    setErr(data.error || "");
  }

  useEffect(() => { load(); }, []);

  async function act(id: string, action: "accept" | "decline") {
    const res = await fetch("/api/dispatch/farmin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "Could not update");
    else setErr(action === "accept" ? "Accepted " + (data.confirmation || "") : "Declined");
    await load();
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-4 py-8 text-[#F6F1E8]">
      <div className="mx-auto max-w-xl">
        <a href="/dispatch" className="text-sm text-[#C4A574]">Back to dispatch</a>
        <h1 className="mt-3 text-3xl font-semibold">Farm-in offers</h1>
        <p className="mt-2 text-sm text-[#9A9388]">The price is what the partner pays Jean Limo. The passenger does not pay.</p>
        {err && <p className="mt-3 text-sm text-[#E8D3B0]">{err}</p>}
        <div className="mt-4 space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-[#141416] p-4">
              <div className="text-sm text-[#C4A574]">{o.partner_name} · pays ${Math.round((o.pay_cents || 0) / 100)} · {o.status}</div>
              <div className="mt-2 text-lg">{o.passenger}</div>
              <div className="mt-1 text-sm text-[#9A9388]">{o.ride_date} {o.ride_time}</div>
              <div className="mt-2 text-sm">{o.pickup}</div>
              <div className="text-sm">{o.dropoff}</div>
              {o.status === "pending" && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => act(o.id, "accept")} className="rounded-xl bg-gradient-to-b from-[#E8D3B0] to-[#C4A574] py-2 font-semibold text-[#16110a]">Accept</button>
                  <button onClick={() => act(o.id, "decline")} className="rounded-xl border border-white/10 py-2 text-[#9A9388]">Decline</button>
                </div>
              )}
            </div>
          ))}
          {!offers.length && <p className="text-sm text-[#9A9388]">No offers yet.</p>}
        </div>
      </div>
    </main>
  );
}
