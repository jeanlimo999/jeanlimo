"use client";

import { useEffect, useState } from "react";
import AddressInput from "@/components/AddressInput";
import RideCard from "./RideCard";

type Screen = "home" | "book" | "trips" | "account";

const vehicles = [
  { id: "sedan", name: "Business Sedan", detail: "1–3 passengers · 2 luggage", img: "/fleet/sedan.jpg" },
  { id: "suv", name: "SUV", detail: "1–6 passengers · 6 luggage", img: "/fleet/suv.jpg" },
  { id: "sprinter", name: "Sprinter Van", detail: "1–14 passengers · 12 luggage", img: "/fleet/sprinter.jpg" },
];
const fieldClass = "mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm";

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
    setPrice(q.price); setBreakdown(q.breakdown || dist.miles + " miles");
  }

  async function goPay() {
    setErr("");
    if (!price) { setErr("Enter pickup and dropoff so we can price the ride."); return; }
    if (!guestName.trim() || !guestPhone.trim() || !guestEmail.includes("@")) { setErr("Name, phone, and email are required for checkout."); return; }
    if (!date || !time) { setErr("Choose a date and time."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, vehicle, type: kind === "hourly" ? "hourly" : "oneway", breakdown, passengerName: guestName, passengerPhone: guestPhone, passengerEmail: guestEmail, date, time, pickup, dropoff, flightNumber: flight }),
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
              <div className="relative min-h-[380px] bg-cover bg-center" style={{ backgroundImage: "url('/fleet/sedan.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/85" />
                <div className="absolute bottom-5 left-4 right-4 z-10">
                  <button onClick={() => setScreen("book")} className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f0cd83] to-[#c99a49] px-6 py-4 font-semibold text-black"><span>Book a Ride</span><span>›</span></button>
                </div>
              </div>
            </section>
            <section className="space-y-3 px-4 pt-4">
              <button onClick={() => setScreen("trips")} className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"><span className="text-[18px]">My Reservations</span><span className="text-3xl text-zinc-400">›</span></button>
              <a href="tel:+12819170085" className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"><span className="text-[18px]">Contact Us</span><span className="text-3xl text-zinc-400">›</span></a>
            </section>
          </>
        )}

        {screen === "book" && (
          <div className="px-5 pt-6">
            <button onClick={() => setScreen("home")} className="mb-5 text-[#d8b56b]">← Back</button>
            <h1 className="text-2xl font-semibold">Book a Ride</h1>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#141414] p-1">
              <button onClick={() => setKind("transfer")} className={`rounded-xl py-3 text-sm ${kind==="transfer"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Transfer</button>
              <button onClick={() => setKind("hourly")} className={`rounded-xl py-3 text-sm ${kind==="hourly"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Hourly</button>
            </div>
            <label className="mt-4 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pickup</span><AddressInput id="app-pickup" value={pickup} onChange={setPickup} placeholder="Address or airport" className={fieldClass} /></label>
            <label className="mt-3 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Dropoff</span><AddressInput id="app-dropoff" value={dropoff} onChange={setDropoff} placeholder="Address" className={fieldClass} /></label>
            {kind === "hourly" && <label className="mt-3 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Hours</span><select value={hours} onChange={(e)=>setHours(e.target.value)} className={fieldClass}>{[2,3,4,5,6,8,10].map(n=><option key={n} value={n}>{n} hours</option>)}</select></label>}
            <Field label="Date" value={date} onChange={setDate} type="date" />
            <Field label="Time" value={time} onChange={setTime} type="time" />
            <Field label="Flight" value={flight} onChange={(v)=>setFlight(v.toUpperCase())} placeholder="UA1234" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pax</span><select value={pax} onChange={(e)=>setPax(e.target.value)} className={fieldClass+" py-2"}>{[1,2,3,4,5,6,8,14].map(n=><option key={n}>{n}</option>)}</select></label>
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Bags</span><select value={bags} onChange={(e)=>setBags(e.target.value)} className={fieldClass+" py-2"}>{[0,1,2,3,4,6,8].map(n=><option key={n}>{n}</option>)}</select></label>
            </div>
            <p className="mt-5 text-sm text-zinc-400">Select Vehicle</p>
            <div className="mt-2 space-y-2">{vehicles.map((v)=>(<button key={v.id} onClick={()=>setVehicle(v.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${vehicle===v.id?"border-[#d8b56b]":"border-white/10"}`}><img src={v.img} alt="" className="h-12 w-16 rounded-lg object-cover" /><div><div className="font-medium">{v.name}</div><div className="text-xs text-zinc-400">{v.detail}</div></div></button>))}</div>
            {(miles != null || price != null) && <div className="mt-4 rounded-2xl border border-[#d8b56b]/30 bg-[#16120c] p-4">{miles != null && <div className="text-sm text-zinc-300">{miles} miles</div>}{price != null && <div className="mt-1 text-2xl font-semibold text-[#e8d3b0]">${price.toFixed(2)}</div>}{breakdown && <div className="mt-1 text-xs text-zinc-400">{breakdown}</div>}</div>}
            <Field label="Full name" value={guestName} onChange={setGuestName} />
            <Field label="Phone" value={guestPhone} onChange={setGuestPhone} />
            <Field label="Email" value={guestEmail} onChange={setGuestEmail} />
            {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
            <button onClick={goPay} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Opening checkout…" : price != null ? `Pay $${price.toFixed(2)}` : "Continue to Payment →"}</button>
          </div>
        )}

        {screen === "trips" && (
          <div className="px-5 pt-6">
            <button onClick={() => setScreen("home")} className="mb-5 text-[#d8b56b]">← Back</button>
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            {!me && (
              <>
                <p className="mt-2 text-sm text-zinc-400">Sign in with checkout email and last 4 of that phone.</p>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Booking email" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <input value={phone4} onChange={(e)=>setPhone4(e.target.value)} placeholder="Last 4 of phone" inputMode="numeric" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <button onClick={login} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Signing in…" : "Sign in"}</button>
                {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
              </>
            )}
            {me && !edit && (
              <>
                <div className="mt-2 flex justify-between text-sm text-zinc-400"><span>{me.full_name || me.email}</span><button onClick={async()=>{ await fetch("/api/account/logout",{method:"POST"}); setMe(null); }} className="text-[#d8b56b]">Sign out</button></div>
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#141414] p-1">
                  <button onClick={()=>setTab("upcoming")} className={`rounded-xl py-3 text-sm ${tab==="upcoming"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Upcoming ({upcoming.length})</button>
                  <button onClick={()=>setTab("past")} className={`rounded-xl py-3 text-sm ${tab==="past"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Past Rides ({history.length})</button>
                </div>
                {msg && <p className="mt-3 text-sm text-[#7DCFB6]">{msg}</p>}
                {(tab==="upcoming"?upcoming:history).map((b:any)=>(
                  <RideCard
                    key={b.id || b.confirmation}
                    b={b}
                    past={tab==="past"}
                    onChange={()=>setEdit({...b})}
                    onCancel={()=>setEdit({...b, _cancel:true})}
                    onAgain={()=>{ setPickup(b.pickup||""); setDropoff(b.dropoff||""); setVehicle(b.vehicle||"sedan"); setFlight(b.flight_number||""); setScreen("book"); }}
                  />
                ))}
              </>
            )}
            {me && edit && (
              <div className="mt-4">
                <button onClick={()=>setEdit(null)} className="mb-3 text-sm text-[#d8b56b]">← Back</button>
                {edit._cancel ? <button onClick={()=>requestChange("cancel")} className="mt-4 w-full rounded-2xl border border-red-500/40 py-4 text-red-300">{loading?"Sending…":"Request cancel"}</button> : <><Field label="Date" value={edit.ride_date||""} onChange={(v)=>setEdit({...edit, ride_date:v})} type="date" /><Field label="Time" value={edit.ride_time||""} onChange={(v)=>setEdit({...edit, ride_time:v})} type="time" /><button onClick={()=>requestChange("change")} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading?"Sending…":"Save change request"}</button></>}
              </div>
            )}
          </div>
        )}

        {screen === "account" && (
          <div className="px-5 pt-6">
            <button onClick={() => setScreen("home")} className="mb-5 text-[#d8b56b]">← Back</button>
            <h1 className="text-2xl font-semibold">My Account</h1>
            <a href="tel:+12819170085" className="mt-6 block text-center text-[#d8b56b]">Call 281-917-0085</a>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type="text" }: { label: string; value: string; onChange: (v: string)=>void; placeholder?: string; type?: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm" />
    </label>
  );
}
