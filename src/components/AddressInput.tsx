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
    const existing = document.querySelector("script[data-jean-limo-maps]") as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.maps?.places) { resolve(); return; }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google Maps failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-jean-limo-maps", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });
  return window.__jeanLimoMapsLoading;
}

export default function AddressInput({
  id,
  value,
  onChange,
  placeholder,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [ready, setReady] = useState(false);
  const [hints, setHints] = useState<{ description: string }[]>([]);

  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMaps(apiKey)
      .then(() => setReady(!!window.google?.maps?.places))
      .catch((err) => console.error(err));
  }, [apiKey]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setHints([]);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function suggest(text: string) {
    onChange(text);
    if (!ready || !window.google?.maps?.places || text.trim().length < 3) {
      setHints([]);
      return;
    }
    const svc = new window.google.maps.places.AutocompleteService();
    svc.getPlacePredictions(
      { input: text, componentRestrictions: { country: "us" } },
      (preds: any[] | null) => {
        setHints((preds || []).slice(0, 6).map((p) => ({ description: p.description })));
      }
    );
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => suggest(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        className={className || "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"}
      />
      {hints.length > 0 && (
        <ul className="absolute left-0 right-0 z-[9999] mt-1 max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#1a1a1a] text-sm shadow-xl">
          {hints.map((h) => (
            <li key={h.description}>
              <button
                type="button"
                className="w-full px-3 py-3 text-left text-zinc-100 hover:bg-white/10"
                onClick={() => {
                  onChange(h.description);
                  setHints([]);
                }}
              >
                {h.description}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!apiKey && (
        <p className="mt-1 text-[11px] text-zinc-500">Address suggestions need the Google Maps key on Netlify.</p>
      )}
    </div>
  );
}
