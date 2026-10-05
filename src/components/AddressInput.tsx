"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => { if (!cancelled) setReady(!!window.google?.maps?.places); }).catch((err) => console.error(err));
    return () => { cancelled = true; };
  }, [apiKey]);

  useEffect(() => { if (!open) setQuery(value); }, [value, open]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => searchRef.current?.focus(), 80);
    return () => { document.body.style.overflow = prev; clearTimeout(t); };
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

  function useMyLocation() {
    if (!navigator.geolocation || !window.google?.maps) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }, (results: any[] | null, status: string) => {
        setLocating(false);
        if (status === "OK" && results?.[0]?.formatted_address) choose(results[0].formatted_address);
      });
    }, () => setLocating(false), { enableHighAccuracy: true, timeout: 8000 });
  }

  const screen = open && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-[100000] flex flex-col bg-zinc-950 text-zinc-100" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center gap-3 px-3 py-3">
        <button type="button" onClick={() => setOpen(false)} className="flex h-11 w-11 shrink-0 items-center justify-center text-3xl leading-none text-zinc-100" aria-label="Back">‹</button>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800 px-3">
          <span className="text-yellow-500" aria-hidden>•</span>
          <input ref={searchRef} value={query} onChange={(e) => search(e.target.value)} placeholder={placeholder || "Address, airport, hotel, ..."} autoComplete="off" autoCorrect="off" enterKeyHint="search" className="w-full bg-transparent py-3.5 text-base text-zinc-100 outline-none placeholder:text-zinc-500" />
          {query && <button type="button" onClick={() => search("")} className="px-1 text-xl text-zinc-400" aria-label="Clear">×</button>}
        </div>
      </div>
      <button type="button" onClick={useMyLocation} className="flex items-center gap-3 px-5 py-4 text-left text-base">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-yellow-500">◎</span>
        <span>{locating ? "Finding your location…" : "Use my location"}</span>
      </button>
      <div className="flex-1 overflow-auto border-t border-white/10">
        {hints.map((h) => (
          <button key={h.description} type="button" onClick={() => choose(h.description)} className="w-full border-b border-white/10 px-5 py-4 text-left text-base active:bg-white/5">{h.description}</button>
        ))}
        {query.trim().length >= 2 && hints.length === 0 && <p className="px-5 py-6 text-sm text-zinc-500">Keep typing an airport, hotel, or address.</p>}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button type="button" id={id} onClick={() => { setQuery(value); setOpen(true); }} className={(className || "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm") + " text-left"}>
        {value ? <span className="block truncate text-zinc-100">{value}</span> : <span className="text-zinc-500">{placeholder}</span>}
      </button>
      {screen}
    </>
  );
}
