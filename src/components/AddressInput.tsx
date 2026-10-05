"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __jeanLimoMapsLoading?: Promise<void>;
  }
}

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__jeanLimoMapsLoading) return window.__jeanLimoMapsLoading;
  window.__jeanLimoMapsLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-jean-limo-maps]") || document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      const wait = () => (window.google?.maps?.places ? resolve() : setTimeout(wait, 80));
      existing.addEventListener("load", () => wait());
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      wait();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-jean-limo-maps", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
  return window.__jeanLimoMapsLoading;
}

function biasCenter(bias?: string) {
  const s = String(bias || "").toLowerCase();
  if (/\b(ewr|newark|jfk|lga|laguardia|new york|new jersey|nyc|manhattan|brooklyn|queens)\b/.test(s) || /,\s*ny\b|,\s*nj\b/.test(s)) {
    return { lat: 40.6895, lng: -74.1745, label: "New York" };
  }
  if (/\b(iah|hobby|houston|galveston)\b/.test(s) || /,\s*tx\b/.test(s)) {
    return { lat: 29.7604, lng: -95.3698, label: "Houston" };
  }
  return null;
}

export default function AddressInput({
  id, value, onChange, placeholder, className, bias,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  bias?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const searchRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [hints, setHints] = useState<{ description: string }[]>([]);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => { if (!cancelled) setReady(!!window.google?.maps?.places); }).catch((err) => console.error(err));
    return () => { cancelled = true; };
  }, [apiKey]);

  useEffect(() => { if (!open) setQuery(value); }, [value, open]);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  function search(text: string) {
    setQuery(text);
    if (!ready || !window.google?.maps?.places || text.trim().length < 2) {
      setHints([]);
      return;
    }
    const center = biasCenter(bias);
    const input = center && !text.toLowerCase().includes(center.label.toLowerCase()) ? `${text} ${center.label}` : text;
    const req: any = { input, componentRestrictions: { country: "us" } };
    if (center) {
      req.location = new window.google.maps.LatLng(center.lat, center.lng);
      req.radius = 80000;
    }
    new window.google.maps.places.AutocompleteService().getPlacePredictions(req, (preds: any[] | null) => {
      setHints((preds || []).slice(0, 8).map((p) => ({ description: p.description })));
    });
  }

  function choose(description: string) {
    onChange(description);
    setQuery(description);
    setHints([]);
    setOpen(false);
  }

  return (
    <>
      <button type="button" id={id} onClick={() => { setQuery(value); setOpen(true); }} className={(className || "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm") + " text-left"}>
        {value ? <span className="text-zinc-100">{value}</span> : <span className="text-zinc-500">{placeholder}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100000] bg-zinc-950 text-zinc-100 flex flex-col">
          <div className="flex items-center gap-2 px-3 pt-4 pb-3 border-b border-white/10">
            <button type="button" onClick={() => setOpen(false)} className="h-11 w-11 rounded-full bg-zinc-800 text-xl" aria-label="Back">‹</button>
            <input ref={searchRef} value={query} onChange={(e) => search(e.target.value)} placeholder={placeholder} autoComplete="off" autoCorrect="off" className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-yellow-500" />
          </div>
          <div className="flex-1 overflow-auto">
            {hints.map((h) => (
              <button key={h.description} type="button" onClick={() => choose(h.description)} className="w-full px-5 py-4 text-left text-base border-b border-white/10 hover:bg-white/5">{h.description}</button>
            ))}
            {query.trim().length >= 2 && hints.length === 0 && <p className="px-5 py-6 text-sm text-zinc-500">Keep typing an airport, hotel, or address.</p>}
          </div>
        </div>
      )}
    </>
  );
}
