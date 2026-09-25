"use client";

function prettyDate(d?: string) {
  if (!d) return { mon: "", day: "", wk: "" };
  const dt = new Date(d + "T12:00:00");
  if (Number.isNaN(dt.getTime())) return { mon: d.slice(5, 7), day: d.slice(8, 10), wk: "" };
  return {
    mon: dt.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(dt.getDate()),
    wk: dt.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
  };
}
function prettyTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const am = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m || 0).padStart(2, "0")} ${am}`;
}
function shortAddr(a?: string) {
  return String(a || "").split(",")[0];
}
function vehicleImg(v?: string) {
  const id = String(v || "sedan").toLowerCase();
  if (id.includes("suv")) return "/fleet/suv.jpg";
  if (id.includes("sprint")) return "/fleet/sprinter.jpg";
  return "/fleet/sedan.jpg";
}
function vehicleLabel(v?: string) {
  const id = String(v || "sedan").toLowerCase();
  if (id.includes("suv")) return "SUV";
  if (id.includes("sprint")) return "Sprinter Van";
  return "Business Sedan";
}
function sms(phone?: string) {
  const d = String(phone || "").replace(/\D/g, "");
  const n = d.length === 10 ? "1" + d : d;
  return n ? `sms:+${n}` : "sms:+12819170085";
}

export default function RideCard({
  b,
  past,
  onChange,
  onCancel,
  onAgain,
}: {
  b: any;
  past?: boolean;
  onChange?: () => void;
  onCancel?: () => void;
  onAgain?: () => void;
}) {
  const d = prettyDate(b.ride_date);
  const status = String(b.status || "confirmed").replaceAll("_", " ");
  const chauffeur = String(b.driverName || "").trim();
  const photo = String(b.driverPhoto || "").trim();
  const initial = (chauffeur || "J").charAt(0).toUpperCase();

  const avatar = photo ? (
    <img src={photo} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
  ) : (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2a2418] text-[#e8d3b0]">{initial}</div>
  );

  if (past) {
    return (
      <div className="mt-3 rounded-2xl border border-white/10 bg-[#141414] p-4">
        <div className="flex gap-3">
          <div className="w-14 text-center">
            <div className="text-[11px] tracking-widest text-[#d8b56b]">{d.mon}</div>
            <div className="text-2xl font-semibold">{d.day}</div>
            <div className="text-[10px] text-zinc-500">{b.ride_date?.slice(0, 4) || ""}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">
              {shortAddr(b.pickup)} → {shortAddr(b.dropoff)}
            </div>
            <div className="mt-1 text-xs text-zinc-400">
              {prettyTime(b.ride_time)} · {vehicleLabel(b.vehicle)}
              {chauffeur ? ` · ${chauffeur}` : ""}
            </div>
            {onAgain && (
              <button onClick={onAgain} className="mt-3 w-full rounded-xl border border-[#d8b56b]/50 py-2 text-sm text-[#e8d3b0]">
                Book Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-[22px] border border-white/10 bg-[#121212] p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Upcoming Ride</div>
        <span className="rounded-full bg-[#1a3d32] px-2 py-1 text-[10px] tracking-widest text-[#7DCFB6]">
          {status.toUpperCase()}
        </span>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="w-14 text-center">
          <div className="text-[11px] tracking-widest text-[#d8b56b]">{d.mon}</div>
          <div className="text-3xl font-semibold leading-none">{d.day}</div>
          <div className="mt-1 text-[10px] text-zinc-500">{d.wk}</div>
        </div>
        <div className="relative flex-1 pl-3">
          <div className="absolute bottom-2 left-0 top-2 w-px bg-white/20" />
          <div className="absolute left-[-3px] top-1 h-2 w-2 rounded-full border border-[#d8b56b]" />
          <div className="absolute bottom-1 left-[-3px] h-2 w-2 rounded-full border border-[#d8b56b]" />
          <div className="text-sm">{shortAddr(b.pickup) || "Pickup"}</div>
          <div className="text-xs text-zinc-400">{prettyTime(b.ride_time)}</div>
          <div className="mt-4 text-sm">{shortAddr(b.dropoff) || "Dropoff"}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#0d0d0d] p-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatar}
          <div className="min-w-0">
            <div className="text-[11px] text-zinc-500">Your Chauffeur</div>
            <div className="truncate font-medium">{chauffeur || "Assigned at dispatch"}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <img src={vehicleImg(b.vehicle)} alt="" className="h-10 w-16 rounded-lg object-cover" />
          <div className="mt-1 text-[10px] text-zinc-400">{vehicleLabel(b.vehicle)}</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={onChange} className="rounded-xl border border-[#d8b56b]/40 py-3 text-sm">
          Request Change
        </button>
        <a
          href={sms(b.driverPhone)}
          className="rounded-xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] py-3 text-center text-sm font-semibold text-black"
        >
          {b.driverPhone ? "Message Driver" : "Message Dispatch"}
        </a>
      </div>

      <div className="mt-4 space-y-2 text-sm text-zinc-300">
        <div className="flex justify-between">
          <span className="text-zinc-500">Flight</span>
          <span>{b.flight_number || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Confirmation</span>
          <span>{b.confirmation}</span>
        </div>
        <button onClick={onCancel} className="w-full pt-2 text-left text-xs text-red-300">
          Cancel ride
        </button>
      </div>
    </div>
  );
}
