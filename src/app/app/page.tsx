"use client";

import { useEffect, useState } from "react";
import AddressInput from "@/components/AddressInput";

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
    fetch("/api/account/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.client) {
          setMe(d.client);
          loadBookings().catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  function goPay() {
    const q = new URLSearchParams({ pickup, dropoff, date, time, vehicle, pax, bags, kind, flight });
    window.location.href = "/?" + q.toString();
  }

  async function login() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: phone4 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setMe(data.client);
      await loadBookings();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    setMe(null); setUpcoming([]); setHistory([]); setEdit(null);
  }

  async function requestChange(action: "change" | "cancel") {
    if (!edit) return;
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/account/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation: edit.confirmation,
          action,
          newDate: edit.ride_date,
          newTime: edit.ride_time,
          pickup: edit.pickup,
          dropoff: edit.dropoff,
          flightNumber: edit.flight_number,
          notes: edit.notes || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg(data.message || "Request sent");
      setEdit(null);
      await loadBookings();
    } catch (e: any) {
      setErr(e.message);
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
              <div className="relative min-h-[380px] bg-cover bg-center" style={{ backgroundImage: "url('/fleet/sedan.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/85" />
                <div className="absolute bottom-5 left-4 right-4 z-10">
                  <button onClick={() => setScreen("book")} className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f0cd83] to-[#c99a49] px-6 py-4 font-semibold text-black">
                    <span>Book a Ride</span><span>›</span>
                  </button>
                </div>
              </div>
            </section>
            <section className="space-y-3 px-4 pt-4">
              <Row label="My Reservations" onClick={() => setScreen("trips")} />
              <a href="tel:+12819170085" className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"><span className="text-[18px]">Contact Us</span><span className="text-3xl text-zinc-400">›</span></a>
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
            <label className="mt-4 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pickup</span>
              <AddressInput id="app-pickup" value={pickup} onChange={setPickup} placeholder="Address or airport" className={fieldClass} /></label>
            <label className="mt-3 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Dropoff</span>
              <AddressInput id="app-dropoff" value={dropoff} onChange={setDropoff} placeholder="Address" className={fieldClass} /></label>
            <Field label="Date" value={date} onChange={setDate} type="date" />
            <Field label="Time" value={time} onChange={setTime} type="time" />
            <Field label="Flight" value={flight} onChange={(v)=>setFlight(v.toUpperCase())} placeholder="UA1234" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pax</span>
                <select value={pax} onChange={(e)=>setPax(e.target.value)} className={fieldClass+" py-2"}>{[1,2,3,4,5,6,7,8,10,14].map(n=><option key={n}>{n}</option>)}</select></label>
              <label className="block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Bags</span>
                <select value={bags} onChange={(e)=>setBags(e.target.value)} className={fieldClass+" py-2"}>{[0,1,2,3,4,6,8,12].map(n=><option key={n}>{n}</option>)}</select></label>
            </div>
            <p className="mt-5 text-sm text-zinc-400">Select Vehicle</p>
            <div className="mt-2 space-y-2">{vehicles.map((v)=>(
              <button key={v.id} onClick={()=>setVehicle(v.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${vehicle===v.id?"border-[#d8b56b]":"border-white/10"}`}>
                <img src={v.img} alt="" className="h-12 w-16 rounded-lg object-cover" />
                <div><div className="font-medium">{v.name}</div><div className="text-xs text-zinc-400">{v.detail}</div></div>
              </button>))}</div>
            <button onClick={goPay} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">Continue to Payment →</button>
          </div>
        )}

        {screen === "trips" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">My Reservations</h1>
            {!me && (
              <>
                <p className="mt-2 text-sm text-zinc-400">Sign in with the email from checkout and the last 4 digits of that phone.</p>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Booking email" className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <input value={phone4} onChange={(e)=>setPhone4(e.target.value)} placeholder="Last 4 of phone" inputMode="numeric" className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none" />
                <button onClick={login} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading ? "Signing in…" : "Sign in"}</button>
                {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
              </>
            )}
            {me && !edit && (
              <>
                <div className="mt-2 flex items-center justify-between text-sm text-zinc-400">
                  <span>{me.full_name || me.email}</span>
                  <button onClick={logout} className="text-[#d8b56b]">Sign out</button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#141414] p-1">
                  <button onClick={()=>setTab("upcoming")} className={`rounded-xl py-3 text-sm ${tab==="upcoming"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Upcoming ({upcoming.length})</button>
                  <button onClick={()=>setTab("past")} className={`rounded-xl py-3 text-sm ${tab==="past"?"bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] text-black":"text-zinc-300"}`}>Past ({history.length})</button>
                </div>
                {msg && <p className="mt-3 text-sm text-[#7DCFB6]">{msg}</p>}
                {(tab==="upcoming"?upcoming:history).length === 0 && <p className="mt-6 text-sm text-zinc-500">No {tab} rides.</p>}
                {(tab==="upcoming"?upcoming:history).map((b:any)=>(
                  <div key={b.id || b.confirmation} className="mt-3 rounded-2xl border border-white/10 bg-[#141414] p-4">
                    <div className="text-xs tracking-[0.14em] text-[#d8b56b]">{b.confirmation} · {b.status}</div>
                    <div className="mt-1 text-sm">{b.ride_date} {b.ride_time}</div>
                    <div className="mt-1 text-sm text-zinc-400">{b.pickup}</div>
                    <div className="text-sm text-zinc-400">→ {b.dropoff}</div>
                    <div className="mt-2 text-sm">{b.driverName ? "Chauffeur: "+b.driverName : "Driver will be assigned"}</div>
                    {tab==="upcoming" && b.status !== "cancelled" && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button onClick={()=>setEdit({...b})} className="rounded-xl border border-[#d8b56b]/40 py-2 text-sm text-[#e8d3b0]">Change</button>
                        <button onClick={()=>setEdit({...b, _cancel:true})} className="rounded-xl border border-red-500/30 py-2 text-sm text-red-300">Cancel</button>
                      </div>
                    )}
                    {tab==="past" && (
                      <button
                        onClick={() => {
                          setPickup(b.pickup || "");
                          setDropoff(b.dropoff || "");
                          setVehicle(b.vehicle || "sedan");
                          setFlight(b.flight_number || "");
                          setScreen("book");
                        }}
                        className="mt-3 w-full rounded-xl border border-[#d8b56b]/40 py-2 text-sm text-[#e8d3b0]"
                      >Book again</button>
                    )}
                  </div>
                ))}
              </>
            )}
            {me && edit && (
              <div className="mt-4">
                <button onClick={()=>setEdit(null)} className="mb-3 text-sm text-[#d8b56b]">← Back to list</button>
                <div className="text-xs text-[#d8b56b]">{edit.confirmation}</div>
                {edit._cancel ? (
                  <>
                    <p className="mt-3 text-sm text-zinc-300">Request cancel for this ride? Dispatch will confirm any refund by phone.</p>
                    <button onClick={()=>requestChange("cancel")} className="mt-4 w-full rounded-2xl border border-red-500/40 py-4 text-red-300">{loading?"Sending…":"Request cancel"}</button>
                  </>
                ) : (
                  <>
                    <Field label="Date" value={edit.ride_date||""} onChange={(v)=>setEdit({...edit, ride_date:v})} type="date" />
                    <Field label="Time" value={edit.ride_time||""} onChange={(v)=>setEdit({...edit, ride_time:v})} type="time" />
                    <label className="mt-3 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Pickup</span>
                      <AddressInput id="edit-pu" value={edit.pickup||""} onChange={(v)=>setEdit({...edit, pickup:v})} placeholder="Pickup" className={fieldClass} /></label>
                    <label className="mt-3 block"><span className="text-xs uppercase tracking-[0.14em] text-zinc-500">Dropoff</span>
                      <AddressInput id="edit-do" value={edit.dropoff||""} onChange={(v)=>setEdit({...edit, dropoff:v})} placeholder="Dropoff" className={fieldClass} /></label>
                    <Field label="Flight" value={edit.flight_number||""} onChange={(v)=>setEdit({...edit, flight_number:v.toUpperCase()})} />
                    <Field label="Notes" value={edit.notes||""} onChange={(v)=>setEdit({...edit, notes:v})} />
                    <button onClick={()=>requestChange("change")} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-4 font-semibold text-black">{loading?"Sending…":"Save change request"}</button>
                  </>
                )}
                {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
              </div>
            )}
          </div>
        )}

        {screen === "account" && (
          <div className="px-5 pt-6">
            <Back onClick={() => setScreen("home")} />
            <h1 className="text-2xl font-semibold">My Account</h1>
            <button onClick={()=>setScreen("trips")} className="mt-6 w-full rounded-2xl border border-white/10 py-4">My Reservations</button>
            <a href="tel:+12819170085" className="mt-3 block text-center text-[#d8b56b]">Call 281-917-0085</a>
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
function Field({ label, value, onChange, placeholder, type="text" }: { label: string; value: string; onChange: (v: string)=>void; placeholder?: string; type?: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-3 outline-none text-sm" />
    </label>
  );
}
