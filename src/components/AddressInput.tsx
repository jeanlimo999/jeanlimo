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
    const existing =
      document.querySelector("script[data-jean-limo-maps]") ||
      document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) {
      const wait = () => {
        if (window.google?.maps?.places) resolve();
        else setTimeout(wait, 80);
      };
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
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [ready, setReady] = useState(false);
  const [hints, setHints] = useState<{ description: string }[]>([]);
  const [menu, setMenu] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled) return;
        setReady(!!window.google?.maps?.places);
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!ready || !inputRef.current || !window.google?.maps?.places?.Autocomplete) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["formatted_address", "name", "address_components"],
      componentRestrictions: { country: "us" },
    });
    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      const next = place?.formatted_address || place?.name || inputRef.current?.value || "";
      if (next) onChangeRef.current(next);
      setHints([]);
    });
    return () => {
      if (window.google?.maps?.event) window.google.maps.event.clearInstanceListeners(ac);
      else listener?.remove?.();
    };
  }, [ready]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setHints([]);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function placeMenu() {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenu({ top: r.bottom + 4, left: r.left, width: r.width });
  }

  function suggest(text: string) {
    onChange(text);
    placeMenu();
    if (!window.google?.maps?.places || text.trim().length < 3) {
      setHints([]);
      return;
    }
    const svc = new window.google.maps.places.AutocompleteService();
    svc.getPlacePredictions(
      {
        input: text,
        componentRestrictions: { country: "us" },
      },
      (preds: any[] | null) => {
        setHints((preds || []).slice(0, 6).map((p) => ({ description: p.description })));
        placeMenu();
      }
    );
  }

  const list =
    hints.length > 0 && typeof document !== "undefined"
      ? createPortal(
          <ul
            className="fixed z-[99999] max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#1a1a1a] text-sm shadow-xl"
            style={{ top: menu.top, left: menu.left, width: menu.width }}
          >
            {hints.map((h) => (
              <li key={h.description}>
                <button
                  type="button"
                  className="w-full px-3 py-3 text-left text-zinc-100 hover:bg-white/10"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(h.description);
                    setHints([]);
                  }}
                >
                  {h.description}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div ref={boxRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={(e) => suggest(e.target.value)}
        onFocus={() => placeMenu()}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        className={className || "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"}
      />
      {list}
      {!apiKey && (
        <p className="mt-1 text-[11px] text-zinc-500">Address suggestions need the Google Maps key on Netlify.</p>
      )}
    </div>
  );
}
