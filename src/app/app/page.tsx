"use client";

import { useEffect, useState } from "react";
import AddressInput from "@/components/AddressInput";
import RideCard from "./RideCard";

type Screen = "home" | "book" | "trips" | "account";
type Kind = "transfer" | "hourly";

const vehicles = [
  { id: "sedan", name: "Business Sedan", detail: "1–3 passengers · 2 luggage", img: "/fleet/sedan.jpg" },
  { id: "suv", name: "SUV", detail: "1–6 passengers · 6 luggage", img: "/fleet/suv.jpg" },
  { id: "sprinter", name: "Sprinter Van", detail: "1–14 passengers · 12 luggage", img: "/fleet/sprinter.jpg" },
];

const fieldClass = "mt-1 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#d8b56b]/70";

export default function ClientApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [kind, setKind] = useState<Kind>("transfer");
  const [vehicle, setVehicle] = useState("sedan");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pax, setPax] = useState("2");
  const [bags, setBags] = useState("2");
  const [flight, setFlight] = useState("");
  const [hours, setHours] = useState("3");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [miles, setMiles] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState("");
  const [email, setEmail] = useState("");
  const [phone4, setPhone4] = useState("");
  const [me, setMe] = useState<any>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [edit, setEdit] = useState<any>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipPct, setTipPct] = useState(20);
  const [tipCustom, setTipCustom] = useState("");

  async function loadBookings() {
    const res = await fetch("/api/account/bookings");
    if (res.status === 401) { setMe(null); return; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not load bookings");
    setUpcoming(data.upcoming || []);
    setHistory(data.history || []);
  }

  useEffect(() => {
    fetch("/api/account/me").then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (d?.client) {
        setMe(d.client);
        setGuestName(d.client.full_name || "");
        setGuestEmail(d.client.email || "");
        setGuestPhone(d.client.phone || "");
        loadBookings().catch(() => {});
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { refreshQuote().catch(() => {}); }, 500);
    return () => clearTimeout(t);
  }, [pickup, dropoff, vehicle, kind, hours]);

  async function refreshQuote() {
    setErr("");
    if (kind === "hourly") {
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "hourly", vehicle, hours: Number(hours) || 2 }) });
      const data = await res.json();
      if (!res.ok) { setPrice(null); setBreakdown(""); return; }
      setMiles(null); setPrice(data.price); setBreakdown(data.breakdown || "");
      return;
    }
    if (!pickup.trim() || !dropoff.trim()) { setPrice(null); setMiles(null); setBreakdown(""); return; }
    const distRes = await fetch("/api/distance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pickup, dropoff }) });
    const dist = await distRes.json();
    if (!distRes.ok) { setPrice(null); setMiles(null); setErr(dist.error || "Could not calculate miles"); return; }
    setMiles(dist.miles);
    const qRes = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "oneway", vehicle, miles: dist.miles }) });
    const q = await qRes.json();
    if (!qRes.ok) { setPrice(null); setErr(q.error || "Quote failed"); return; }
    setPrice(q.price); setBreakdown(q.breakdown || `${dist.miles} miles`);
  }

  const tipAmount = price != null ? Math.round(price * (Number(tipPct) || 0)) / 100 : 0;
  const due = price != null ? Math.round((price + tipAmount) * 100) / 100 : null;

  async function goPay() {
    setErr("");
    if (!price) { setErr("Enter pickup and dropoff so we can price the ride."); return; }
    if (!guestName.trim() || !guestPhone.trim() || !guestEmail.includes("@")) { setErr("Name, phone, and email are required for checkout."); return; }
    if (!date || !time) { setErr("Choose a date and time."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, tipAmount, tipPercent: tipPct, vehicle, type: kind === "hourly" ? "hourly" : "oneway", breakdown, passengerName: guestName, passengerPhone: guestPhone, passengerEmail: guestEmail, date, time, pickup, dropoff, flightNumber: flight, passengers: pax, luggage: bags }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout");
      window.location.href = data.url;
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  }

  async function login() {
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/account/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, phone: phone4 }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setMe(data.client); await loadBookings();
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  }

  async function requestChange(action: "change" | "cancel") {
    if (!edit) return;
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/account/booking-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: edit.confirmation, action, newDate: edit.ride_date, newTime: edit.ride_time, pickup: edit.pickup, dropoff: edit.dropoff, flightNumber: edit.flight_number, notes: edit.notes || "" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg(data.message || "Request sent"); setEdit(null); await loadBookings();
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  }

  function bookAgainFromLastRide() {
    const b = history[0] || upcoming[0];
    if (b) {
      setPickup(b.pickup || ""); setDropoff(b.dropoff || ""); setVehicle(b.vehicle || "sedan"); setFlight(b.flight_number || "");
    }
    setScreen("book");
  }

  const initials = (me?.full_name || guestName || "Jean Limo").split(" ").filter(Boolean).slice(0, 2).map((x: string) => x[0]?.toUpperCase()).join("") || "JL";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#080808] pb-8 shadow-2xl">
        {screen === "home" && (
          <>
            <header className="flex items-center justify-between px-5 pb-4 pt-5">
              <button onClick={() => setScreen("account")} className="grid h-10 w-10 place-items-center rounded-full border border-white/5 bg-white/[0.02] text-xl text-zinc-200">☰</button>
              <div className="text-center"><div className="font-serif text-[28px] tracking-[0.18em] text-[#e6c77f]">JEAN LIMO</div><div className="mt-1 text-[10px] tracking-[0.55em] text-[#b99a58]">HOUSTON</div></div>
              <button onClick={() => setScreen("trips")} className="grid h-10 w-10 place-items-center rounded-full border border-white/5 bg-white/[0.02] text-lg text-zinc-200">♡</button>
            </header>
            <section className="relative mx-4 overflow-hidden rounded-[28px] border border-[#d8b56b]/20 bg-[#0d0d0d] shadow-[0_25px_80px_rgba(0,0,0,.5)]">
              <div className="relative min-h-[530px] bg-cover bg-center" style={{ backgroundImage: "url('/fleet/app-hero.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/95" />
                <div className="absolute left-5 top-7 z-10 max-w-[235px]">
                  <div className="font-serif text-[23px] leading-[1.04] tracking-[0.06em] text-[#edd08f]">MORE THAN<br />A RIDE.</div>
                  <div className="mt-3 font-serif text-[31px] leading-[1.02] tracking-[0.02em] text-white">A HIGHER<br />STANDARD.</div>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-zinc-300">Professional chauffeurs.<br />Exceptional experiences.</p>
                </div>
                <div className="absolute bottom-5 left-4 right-4 z-10">
                  <button onClick={() => setScreen("book")} className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f3d88c] via-[#e4bd63] to-[#c59038] px-6 py-4 font-semibold text-black shadow-[0_10px_35px_rgba(218,181,107,.18)]"><span className="flex items-center gap-3"><span className="text-xl">▣</span><span>Book a Ride</span></span><span className="text-2xl">›</span></button>
                </div>
              </div>
            </section>
            <section className="space-y-3 px-4 pt-4">
              <HomeRow icon="▣" label="My Reservations" onClick={() => setScreen("trips")} />
              <HomeRow icon="↻" label="Book Again" onClick={bookAgainFromLastRide} />
              <a href="tel:+12819170085" className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#171717] px-5 py-4.5 transition active:scale-[0.99]"><span className="flex items-center gap-4"><span className="text-xl text-[#ddb96a]">☎</span><span className="text-[17px]">Contact Us</span></span><span className="text-3xl text-zinc-500">›</span></a>
            </section>
            <section className="grid grid-cols-3 gap-3 px-4 pt-4">
              {[["✈", "Airport", "Transfer"], ["◷", "Hourly", "Service"], ["♜", "Galveston", "Cruise Transfer"]].map(([icon, a, b]) => (
                <button key={`${a}-${b}`} onClick={() => { setKind(a === "Hourly" ? "hourly" : "transfer"); setScreen("book"); }} className="rounded-2xl border border-white/5 bg-[#141414] px-3 py-4 text-center"><div className="text-2xl text-[#d8b56b]">{icon}</div><div className="mt-2 text-sm">{a}</div><div className="text-xs text-zinc-400">{b}</div></button>
              ))}
            </section>
            <div className="px-4 pt-5 text-center text-[8px] uppercase tracking-[0.35em] text-[#8d7546]">Houston · Airports · Corporate · Special Events</div>
          </>
        )}

        {screen === "book" && (
          <div className="px-4 pb-6 pt-5">
            <TopBar title="Book a Ride" onBack={() => setScreen("home")} />
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-[#141414] p-1">
              <button onClick={() => setKind("transfer")} className={`rounded-xl py-3 text-sm font-medium transition ${kind === "transfer" ? "bg-gradient-to-r from-[#efd17e] to-[#bd8731] text-black" : "text-zinc-300"}`}>✈ Transfer</button>
              <button onClick={() => setKind("hourly")} className={`rounded-xl py-3 text-sm font-medium transition ${kind === "hourly" ? "bg-gradient-to-r from-[#efd17e] to-[#bd8731] text-black" : "text-zinc-300"}`}>◷ Hourly</button>
            </div>
            <section className="mt-4 space-y-3">
              <label className="block rounded-2xl border border-white/5 bg-[#151515] p-3"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Pickup Location</span><AddressInput id="app-pickup" value={pickup} onChange={setPickup} placeholder="Address or airport" className="mt-1 w-full bg-transparent text-sm text-white outline-none" /></label>
              <label className="block rounded-2xl border border-white/5 bg-[#151515] p-3"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Dropoff Location</span><AddressInput id="app-dropoff" value={dropoff} onChange={setDropoff} placeholder="Address" className="mt-1 w-full bg-transparent text-sm text-white outline-none" /></label>
            </section>
            {kind === "hourly" && <label className="mt-3 block"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Hours</span><select value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass}>{[2,3,4,5,6,8,10].map((n) => <option key={n} value={n}>{n} hours</option>)}</select></label>}
            <div className="mt-3 grid grid-cols-2 gap-3"><Field label="Date" value={date} onChange={setDate} type="date" /><Field label="Time" value={time} onChange={setTime} type="time" /></div>
            <Field label="Flight" value={flight} onChange={(v) => setFlight(v.toUpperCase())} placeholder="UA1234" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Passengers</span><select value={pax} onChange={(e) => setPax(e.target.value)} className={fieldClass}>{[1,2,3,4,5,6,8,14].map((n) => <option key={n}>{n}</option>)}</select></label>
              <label className="block"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">Luggage</span><select value={bags} onChange={(e) => setBags(e.target.value)} className={fieldClass}>{[0,1,2,3,4,6,8,10,12].map((n) => <option key={n}>{n}</option>)}</select></label>
            </div>
            <div className="mt-5 flex items-center justify-between"><p className="font-medium">Select Vehicle</p><span className="text-xs text-[#d8b56b]">View Details</span></div>
            <div className="mt-2 space-y-3">{vehicles.map((v) => { const selected = vehicle === v.id; return <button key={v.id} onClick={() => setVehicle(v.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-[#d8b56b] bg-[#1a160f]" : "border-white/8 bg-[#151515]"}`}><img src={v.img} alt={v.name} className="h-16 w-24 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="font-medium">{v.name}</div><div className="mt-1 text-xs text-zinc-400">{v.detail}</div></div><div className={`h-5 w-5 rounded-full border-2 ${selected ? "border-[#d8b56b] bg-[#d8b56b] shadow-[inset_0_0_0_4px_#171717]" : "border-zinc-500"}`} /></button>; })}</div>
            {(miles != null || price != null) && (
              <div className="mt-4 rounded-2xl border border-[#d8b56b]/30 bg-[#17120b] p-4">
                {miles != null && <div className="text-sm text-zinc-300">{miles} miles</div>}
                {price != null && <div className="mt-1 text-lg text-[#ecd599]">Ride ${price.toFixed(2)}</div>}
                {breakdown && <div className="mt-1 text-xs text-zinc-400">{breakdown}</div>}
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-zinc-500">Driver tip</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[0, 15, 18, 20, 25].map((n) => (
                    <button key={n} type="button" onClick={() => { setTipPct(n); setTipCustom(""); }} className={`rounded-full px-3 py-1.5 text-sm ${tipPct === n ? "bg-gradient-to-r from-[#efd17e] to-[#bd8731] text-black" : "border border-white/10 text-zinc-300"}`}>{n === 0 ? "No tip" : n + "%"}</button>
                  ))}
                </div>
                <input value={tipCustom} onChange={(e) => { setTipCustom(e.target.value); const n = Number(e.target.value); if (Number.isFinite(n)) setTipPct(n); }} placeholder="Custom %" inputMode="decimal" className="mt-3 w-full rounded-xl border border-white/10 bg-[#151515] px-3 py-2 text-sm outline-none" />
                {price != null && <div className="mt-3 text-sm text-zinc-300">Tip ${tipAmount.toFixed(2)}</div>}
                {due != null && <div className="mt-1 text-2xl font-semibold text-[#ecd599]">Total ${due.toFixed(2)}</div>}
              </div>
            )}
            <div className="mt-5 border-t border-white/5 pt-4"><p className="mb-2 text-sm font-medium">Passenger Information</p><Field label="Full name" value={guestName} onChange={setGuestName} /><Field label="Phone" value={guestPhone} onChange={setGuestPhone} /><Field label="Email" value={guestEmail} onChange={setGuestEmail} /></div>
            {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            <button onClick={goPay} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#efd17e] to-[#bd8731] py-4 font-semibold text-black">{loading ? "Opening checkout…" : due != null ? `Continue to Payment · $${due.toFixed(2)}` : "Continue to Payment"}<span>→</span></button>
          </div>
        )}

        {screen === "trips" && (
          <div className="px-4 pb-6 pt-5">
            <TopBar title="My Reservations" onBack={() => setScreen("home")} />
            {!me && <div className="mt-8 rounded-3xl border border-white/5 bg-[#121212] p-5"><div className="text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d8b56b]/30 bg-[#1d170d] text-2xl text-[#d8b56b]">♛</div><h2 className="mt-4 text-xl font-semibold">Access your trips</h2><p className="mt-2 text-sm text-zinc-400">Sign in with the same email and last 4 digits of the phone used at checkout.</p></div><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Booking email" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" /><input value={phone4} onChange={(e) => setPhone4(e.target.value)} placeholder="Last 4 of phone" inputMode="numeric" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" /><button onClick={login} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Signing in…" : "Sign in"}</button>{err && <p className="mt-3 text-sm text-red-400">{err}</p>}</div>}
            {me && !edit && <><div className="mt-4 flex items-center justify-between text-sm text-zinc-400"><span>{me.full_name || me.email}</span><button onClick={async () => { await fetch("/api/account/logout", { method: "POST" }); setMe(null); }} className="text-[#d8b56b]">Sign out</button></div><div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-[#141414] p-1"><button onClick={() => setTab("upcoming")} className={`rounded-xl py-3 text-sm ${tab === "upcoming" ? "bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] font-medium text-black" : "text-zinc-300"}`}>Upcoming ({upcoming.length})</button><button onClick={() => setTab("past")} className={`rounded-xl py-3 text-sm ${tab === "past" ? "bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] font-medium text-black" : "text-zinc-300"}`}>Past Rides ({history.length})</button></div>{msg && <p className="mt-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300">{msg}</p>}<div className="mt-4 space-y-4">{(tab === "upcoming" ? upcoming : history).map((b: any) => <RideCard key={b.id || b.confirmation} b={b} past={tab === "past"} onChange={() => setEdit({ ...b })} onCancel={() => setEdit({ ...b, _cancel: true })} onAgain={() => { setPickup(b.pickup || ""); setDropoff(b.dropoff || ""); setVehicle(b.vehicle || "sedan"); setFlight(b.flight_number || ""); setScreen("book"); }} />)}</div></>}
            {me && edit && <div className="mt-4"><button onClick={() => setEdit(null)} className="mb-3 text-sm text-[#d8b56b]">← Back</button>{edit._cancel ? <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4"><p className="text-sm text-zinc-300">Request cancellation for this reservation?</p><button onClick={() => requestChange("cancel")} className="mt-4 w-full rounded-2xl border border-red-500/40 py-4 text-red-300">{loading ? "Sending…" : "Request cancel"}</button></div> : <><Field label="Date" value={edit.ride_date || ""} onChange={(v) => setEdit({ ...edit, ride_date: v })} type="date" /><Field label="Time" value={edit.ride_time || ""} onChange={(v) => setEdit({ ...edit, ride_time: v })} type="time" /><button onClick={() => requestChange("change")} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Sending…" : "Save change request"}</button></>}</div>}
          </div>
        )}

        {screen === "account" && (
          <div className="px-4 pb-6 pt-5">
            <TopBar title="My Account" onBack={() => setScreen("home")} />
            <section className="mt-5 rounded-3xl border border-white/5 bg-[#141414] p-4"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#c79d56] to-[#6f471b] font-serif text-xl text-white">{initials}</div><div className="min-w-0 flex-1"><div className="truncate text-lg font-semibold">{me?.full_name || guestName || "Jean Limo Customer"}</div><div className="truncate text-sm text-zinc-400">{me?.email || guestEmail || "Sign in through My Reservations"}</div><div className="mt-1 text-sm text-zinc-500">{me?.phone || guestPhone || ""}</div></div><span className="text-2xl text-zinc-500">›</span></div></section>
            <section className="mt-3 rounded-2xl border border-[#d8b56b]/50 bg-[#1b160d] p-4"><div className="flex items-center gap-3"><div className="text-2xl text-[#d8b56b]">♛</div><div><div className="font-medium text-[#eed08a]">Preferred Customer</div><div className="text-xs text-zinc-400">Thank you for choosing Jean Limo.</div></div></div></section>
            <section className="mt-4 overflow-hidden rounded-2xl border border-white/5 bg-[#141414]"><AccountRow icon="♙" title="Passenger Information" subtitle="Manage traveler and saved details" /><AccountRow icon="▣" title="Payment Methods" subtitle="Secure checkout through Stripe" /><AccountRow icon="♢" title="Notification Preferences" subtitle="Ride updates and alerts" /></section>
            <h2 className="mt-6 px-1 text-lg font-semibold">Support & Contact</h2>
            <section className="mt-3 overflow-hidden rounded-2xl border border-white/5 bg-[#141414]"><a href="tel:+12819170085"><AccountRow icon="☎" title="Call Us" subtitle="281-917-0085" /></a><a href="sms:+12819170085"><AccountRow icon="◌" title="Text Us" subtitle="281-917-0085" /></a><a href="mailto:info@jeanlimo.com"><AccountRow icon="✉" title="Email Us" subtitle="info@jeanlimo.com" /></a><AccountRow icon="⌖" title="Our Service Area" subtitle="Houston, TX" /></section>
            <section className="mt-4 overflow-hidden rounded-2xl border border-white/5 bg-[#141414]"><AccountRow icon="?" title="Help & FAQs" /><AccountRow icon="▤" title="Terms & Privacy" />{me && <button onClick={async () => { await fetch("/api/account/logout", { method: "POST" }); setMe(null); setScreen("home"); }} className="w-full"><AccountRow icon="↪" title="Log Out" /></button>}</section>
          </div>
        )}
      </div>
    </main>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return <div className="grid grid-cols-[42px_1fr_42px] items-center"><button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full text-2xl text-zinc-300">‹</button><h1 className="text-center text-lg font-semibold">{title}</h1><div /></div>;
}

function HomeRow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#171717] px-5 py-4.5 transition active:scale-[0.99]"><span className="flex items-center gap-4"><span className="text-xl text-[#ddb96a]">{icon}</span><span className="text-[17px]">{label}</span></span><span className="text-3xl text-zinc-500">›</span></button>;
}

function AccountRow({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return <div className="flex items-center gap-3 border-b border-white/5 px-4 py-4 last:border-b-0"><div className="grid h-9 w-9 place-items-center text-xl text-zinc-200">{icon}</div><div className="min-w-0 flex-1 text-left"><div className="text-sm font-medium">{title}</div>{subtitle && <div className="mt-0.5 truncate text-xs text-zinc-500">{subtitle}</div>}</div><span className="text-2xl text-zinc-600">›</span></div>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <label className="mt-3 block"><span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">{label}</span><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={fieldClass} /></label>;
}
