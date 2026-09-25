"use client";

import { useState } from "react";

type Screen = "home" | "book" | "trips" | "account";

const vehicles = [
  { id: "sedan", name: "Business Sedan", detail: "1–3 passengers · 2 luggage", img: "/fleet/sedan.jpg" },
  { id: "suv", name: "SUV", detail: "1–6 passengers · 6 luggage", img: "/fleet/suv.jpg" },
  { id: "sprinter", name: "Sprinter Van", detail: "1–14 passengers · 12 luggage", img: "/fleet/sprinter.jpg" },
];

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
  const [conf, setConf] = useState("");
  const [phone, setPhone] = useState("");

  function goPay() {
    const q = new URLSearchParams({
      pickup, dropoff, date, time, vehicle, pax, bags, kind,
    });
    window.location.href = "/?" + q.toString();
  }

  function findTrip() {
    const q = new URLSearchParams({
      confirmation: conf.trim().toUpperCase(),
      phone: phone.replace(/\D/g, "").slice(-4),
    });
    window.location.href = "/manage?" + q.toString();
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
              <div
                className="relative min-h-[420px] bg-cover bg-center"
                style={{ backgroundImage: "url('/fleet/sedan.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/85" />
                <div className="absolute left-6 top-8 z-10">
                  <div className="font-serif text-[22px] leading-tight tracking-[0.12em] text-[#d8bc78]">
                    MORE THAN<br />A RIDE.
                  </div>
                  <div className="mt-3 font-serif text-[30px] leading-tight text-white">
                    A HIGHER<br />STANDARD.
                  </div>
                  <div className="mt-4 text-[11px] tracking-[0.16em] text-zinc-300">
                    PROFESSIONAL CHAUFFEURS<br />EXCEPTIONAL EXPERIENCES
                  </div>
                </div>
                <div className="absolute bottom-5 left-4 right-4 z-10">
                  <button
                    onClick={() => setScreen("book")}
                    className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f0cd83] to-[#c99a49] px-6 py-4 font-semibold text-black"
                  >
                    <span>Book a Ride</span>
                    <span>›</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="space-y-3 px-4 pt-4">
              <Row icon="☷" label="My Reservations" onClick={() => setScreen("trips")} />
              <Row icon="↻" label="Book Again" onClick={() => setScreen("book")} />
              <a href="tel:+12819170085" className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5">
                <span className="text-[18px]">Contact Us</span>
                <span className="text-3xl text-zinc-400">›</span>
              </a>
            </section>

            <section className="grid grid-cols-3 gap-3 px-4 pt-4">
              <Tile label="Airport Transfer" onClick={() => { setKind("transfer"); setPickup("IAH - George Bush Intercontinental Airport"); setScreen("book"); }} />
              <Tile label="Hourly Service" onClick={() => { setKind("hourly"); setScreen("book"); }} />
              <Tile label="Galveston Cruise" onClick={() => { setKind("transfer"); setDropoff("Port of Galveston"); setScreen("book"); }} />
            </section>
            <footer className="px-4 pb-6 pt-5 text-center text-[10px] tracking-[0.28em] text-[#9b8354]">
              HOUSTON | AIRPORTS | CORPORATE | SPECIAL EVENTS
            </footer>
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
            <Field label="Pickup Location" value={pickup} onChange={setPickup} placeholder="Address or airport" />
            <Field label="Dropoff Location" value={dropoff} onChange={setDropoff} placeholder="Address" />
            <Field label="Date" value={date} onChange={setDate} type="date" />
            <Field label="Time" value={time} onChange={setTime} type="time" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Passengers" value={pax} onChange={setPax} />
              <Field label="Luggage" value={bags} onChange={setBags} />
            </div>
            <p className="mt-5 text-sm text-zinc-400">Select Vehicle</p>
            <div className="mt-2 space-y-2">
              {vehicles.map((v) => (
                <button key={v.id} onClick={() => setVehicle(v.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${vehicle===v.id?"border-[#d8b56b]":"border-white/10"}`}>
                  <img src={v.img} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-zinc-400">{v.detail}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={goPay} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">
              Continue to Payment →
            </button>
          </div>
        )}

        {screen === "trips" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            <p className="mt-2 text-sm text-zinc-400">Enter your confirmation and the last 4 digits of the phone used at checkout.</p>
            <input value={conf} onChange={(e)=>setConf(e.target.value)} placeholder="JL-260921-XXXX" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Last 4 of phone" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
            <button onClick={findTrip} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">Find Reservation</button>
            <a href="tel:+12819170085" className="mt-4 block text-center text-sm text-[#d8b56b]">Or call dispatch 281-917-0085</a>
          </div>
        )}

        {screen === "account" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">My Account</h1>
            <div className="mt-6 rounded-2xl border border-[#d8b56b]/30 bg-[#16120c] p-4 text-sm text-[#e8d3b0]">Preferred Customer — thank you for riding with Jean Limo.</div>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#141414]">
              <LinkRow href="/account" label="Passenger Information" />
              <LinkRow href="/account" label="Payment Methods" />
              <LinkRow href="/manage" label="My Reservations" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-zinc-500">Support &amp; Contact</p>
            <div className="mt-2 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#141414]">
              <LinkRow href="tel:+12819170085" label="Call Us" extra="281-917-0085" />
              <LinkRow href="sms:+12819170085" label="Text Us" extra="281-917-0085" />
              <LinkRow href="mailto:info@jeanlimo.com" label="Email Us" extra="info@jeanlimo.com" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="mb-5 text-[#d8b56b]">← Back</button>;
}
function Row({ label, onClick }: { icon?: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5">
      <span className="text-[18px]">{label}</span>
      <span className="text-3xl text-zinc-400">›</span>
    </button>
  );
}
function Tile({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-[18px] border border-white/5 bg-[#171717] px-2 py-5 text-center text-sm leading-5">
      {label}
    </button>
  );
}
function Field({ label, value, onChange, placeholder, type="text" }: { label: string; value: string; onChange: (v: string)=>void; placeholder?: string; type?: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none" />
    </label>
  );
}
function LinkRow({ href, label, extra }: { href: string; label: string; extra?: string }) {
  return (
    <a href={href} className="flex items-center justify-between px-4 py-4 text-sm">
      <span>{label}</span>
      <span className="text-zinc-500">{extra || "›"}</span>
    </a>
  );
}
