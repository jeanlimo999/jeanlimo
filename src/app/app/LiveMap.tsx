"use client";

import { useEffect, useState } from "react";

export default function LiveMap({ confirmation, tripStatus }: { confirmation?: string; tripStatus?: string }) {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [pickup, setPickup] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [status, setStatus] = useState(tripStatus || "");

  useEffect(() => {
    if (!confirmation) return;
    let stop = false;
    async function tick() {
      try {
        const res = await fetch("/api/account/track?confirmation=" + encodeURIComponent(confirmation!));
        const data = await res.json();
        if (stop) return;
        setLive(!!data.live);
        setStatus(data.tripStatus || "");
        setPickup(data.pickup || null);
        setFresh(!!data.fresh);
        if (data.live && data.fresh && data.lat != null && data.lng != null) {
          setLat(Number(data.lat));
          setLng(Number(data.lng));
        } else {
          setLat(null);
          setLng(null);
        }
      } catch {}
    }
    tick();
    const id = setInterval(tick, 8000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [confirmation]);

  if (!live) return null;

  // Prefer fresh driver GPS. Otherwise show the actual pickup address so the customer is not pinned in the wrong place.
  let src = "";
  if (fresh && lat != null && lng != null) {
    src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  } else if (pickup) {
    src = `https://maps.google.com/maps?q=${encodeURIComponent(pickup)}&z=14&output=embed`;
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#d8b56b]/30 bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-3 py-2 text-xs">
        <span className="tracking-widest text-[#7DCFB6]">LIVE TRACKING</span>
        <span className="text-zinc-400">{String(status).replaceAll("_", " ")}</span>
      </div>
      {src ? (
        <iframe title="Chauffeur location" src={src} className="h-52 w-full border-0" loading="lazy" />
      ) : (
        <p className="px-3 pb-3 text-sm text-zinc-400">Waiting for chauffeur GPS… Keep the driver app open on the way.</p>
      )}
      {!fresh && pickup && (
        <p className="px-3 py-2 text-[11px] text-zinc-500">Showing pickup until chauffeur GPS is live.</p>
      )}
    </div>
  );
}
