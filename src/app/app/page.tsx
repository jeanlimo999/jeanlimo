"use client";

import { useState } from "react";
import AddressInput from "@/components/AddressInput";

type Screen = "home" | "book" | "trips" | "account";

const vehicles = [
  { id: "sedan", name: "Business Sedan", detail: "1–3 passengers · 2 luggage", img: "/fleet/sedan.jpg" },
  { id: "suv", name: "SUV", detail: "1–6 passengers · 6 luggage", img: "/fleet/suv.jpg" },
  { id: "sprinter", name: "Sprinter Van", detail: "1–14 passengers · 12 luggage", img: "/fleet/sprinter.jpg" },
];

const fieldClass =
  "mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm";

export default function ClientApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [kind, setKind] = useState<"transfer" | "hourly">("transfer");
  const [vehicle, setVehicle] = useState("sedan");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pax, setPax] = useState("2");
  const [bags, setBags] = useState("2");
  const [flight, setFlight] = useState("");
  const [conf, setConf] = useState("");
  const [phone, setPhone] = useState("");
  const [found, setFound] = useState<any>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function goPay() {
    const q = new URLSearchParams({ pickup, dropoff, date, time, vehicle, pax, bags, kind, flight });
    window.location.href = "/?" + q.toString();
  }

  async function findTrip() {
    setErr("");
    setFound(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({
        confirmation: conf.trim().toUpperCase(),
        phone: phone.replace(/\D/g, "").slice(-4),
      });
      const res = await fetch("/api/booking?" + q.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setFound(data.booking);
    } catch (e: any) {
      setErr(e.message || "Not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen max-w-md bg-[#070707] pb-10">
        {screen === "home" && (
          <>
            <header className="flex items-center justify-between px-6 pb-4 pt-6">
              <button onClick={() => setScreen("account")} className="text-2xl text-zinc-300">☰</button>
              <div className="text-center">
                <div className="font-serif text-[26px] tracking-[0.16em] text-[#e5c883]">JEAN LIMO</div>
                <div className="mt-1 text-[10px] tracking-[0.46em] text-[#d4bb7d]">HOUSTON</div>
              </div>
              <button onClick={() => setScreen("trips")} className="text-xl text-zinc-300">☳</button>
            </header>
            <section className="relative mx-4 overflow-hidden rounded-[26px]">
              <div className="relative min-h-[420px] bg-cover bg-center" style={{ backgroundImage: "url('/fleet/sedan.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/85" />
                <div className="absolute bottom-5 left-4 right-4 z-10">
                  <button onClick={() => setScreen("book")} className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f0cd83] to-[#c99a49] px-6 py-4 font-semibold text-black">
                    <span>Book a Ride</span><span>›</span>
                  </button>
                </div>
              </div>
            </section>
            <section className="space-y-3 px-4 pt-4">
              <Row label="My Reservations" onClick={() => setScreen("trips")} />
              <Row label="Book Again" onClick={() => setScreen("book")} />
              <a href="tel:+12819170085" className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5">
                <span className="text-[18px]">Contact Us</span><span className="text-3xl text-zinc-400">›</span>
              </a>
            </section>
            <section className="grid grid-cols-3 gap-3 px-4 pt-4">
              <Tile label="Airport Transfer" onClick={() => { setKind("transfer"); setPickup("IAH - George Bush Intercontinental Airport (IAH)"); setScreen("book"); }} />
              <Tile label="Hourly Service" onClick={() => { setKind("hourly"); setScreen("book"); }} />
              <Tile label="Galveston Cruise" onClick={() => { setKind("transfer"); setDropoff("Port of Galveston"); setScreen("book"); }} />
            </section>
          </>
        )}

        {screen === "book" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">Book a Ride</h1>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#141414] p-1">
              <button onClick={() => setKind("transfer")} className={`rounded-xl py-3 text-sm ${kind==="transfer"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Transfer</button>
              <button onClick={() => setKind("hourly")} className={`rounded-xl py-3 text-sm ${kind==="hourly"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Hourly</button>
            </div>

            <label className="mt-4 block">
              <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pickup Location</span>
              <AddressInput id="app-pickup" value={pickup} onChange={setPickup} placeholder="Address or airport" className={fieldClass} />
            </label>
            <label className="mt-3 block">
              <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Dropoff Location</span>
              <AddressInput id="app-dropoff" value={dropoff} onChange={setDropoff} placeholder="Address" className={fieldClass} />
            </label>
            <Field label="Date" value={date} onChange={setDate} type="date" />
            <Field label="Time" value={time} onChange={setTime} type="time" />
            <Field label="Flight" value={flight} onChange={(v)=>setFlight(v.toUpperCase())} placeholder="UA1234" />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pax</span>
                <select value={pax} onChange={(e)=>setPax(e.target.value)} className={fieldClass + " py-2"}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Bags</span>
                <select value={bags} onChange={(e)=>setBags(e.target.value)} className={fieldClass + " py-2"}>
                  {[0,1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>

            <p className="mt-5 text-sm text-zinc-400">Select Vehicle</p>
            <div className="mt-2 space-y-2">
              {vehicles.map((v) => (
                <button key={v.id} onClick={() => setVehicle(v.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${vehicle===v.id?"border-[#d8b56b]":"border-white/10"}`}>
                  <img src={v.img} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div><div className="font-medium">{v.name}</div><div className="text-xs text-zinc-400">{v.detail}</div></div>
                </button>
              ))}
            </div>
            <button onClick={goPay} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">Continue to Payment →</button>
          </div>
        )}

        {screen === "trips" && (
          <div className="px-5 pt-6">
            <Back onClick={() => { setFound(null); setScreen("home"); }} />
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            {!found && (
              <>
                <input value={conf} onChange={(e)=>setConf(e.target.value)} placeholder="JL-260921-XXXX" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Last 4 of phone" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <button onClick={findTrip} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Looking up…" : "Find Reservation"}</button>
                {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
              </>
            )}
            {found && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#141414] p-4">
                <div className="text-xs tracking-[0.16em] text-[#d8b56b]">{found.confirmation}</div>
                <div className="mt-1 text-lg font-medium">{found.name}</div>
                <div className="mt-3 text-sm text-zinc-300">{found.date} {found.time}</div>
                <div className="mt-1 text-sm text-zinc-400">{found.pickup}</div>
                <div className="text-sm text-zinc-400">→ {found.dropoff}</div>
                <div className="mt-4 rounded-2xl border border-[#d8b56b]/30 bg-[#16120c] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#d8b56b]">Your chauffeur</div>
                  {found.driverName ? (
                    <div className="mt-2 text-xl">{found.driverName}</div>
                  ) : (
                    <div className="mt-2 text-sm text-zinc-300">Driver will be assigned by dispatch.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {screen === "account" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">My Account</h1>
            <a href="tel:+12819170085" className="mt-6 block text-[#d8b56b]">Call 281-917-0085</a>
          </div>
        )}
      </div>
    </main>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="mb-5 text-[#d8b56b]">← Back</button>;
}
function Row({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5">
      <span className="text-[18px]">{label}</span><span className="text-3xl text-zinc-400">›</span>
    </button>
  );
}
function Tile({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-[18px] border border-white/5 bg-[#171717] px-2 py-5 text-center text-sm leading-5">{label}</button>;
}
function Field({ label, value, onChange, placeholder, type="text" }: { label: string; value: string; onChange: (v: string)=>void; placeholder?: string; type?: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm" />
    </label>
  );
}
