"use client";

import { useEffect, useRef, useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-yellow-600/20 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-500 font-serif text-xl font-bold text-yellow-400">
              J
            </div>
            <div>
              <div className="font-serif text-xl tracking-wide text-yellow-400">JEAN LIMO</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">LLC · Houston</div>
            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/account" className="whitespace-nowrap px-2 text-xs text-zinc-300 hover:text-yellow-400 sm:text-sm">
              My trips
            </a>
            <a
              href="/#quote"
              className="rounded bg-yellow-500 px-3 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-400 sm:px-4"
            >
              Book Now
            </a>
            <div ref={box} className="relative">
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-100 hover:border-yellow-500/50 hover:text-yellow-400"
              >
                <span className="text-lg leading-none">{open ? "×" : "☰"}</span>
                <span className="font-medium">Menu</span>
              </button>
              {open && (
                <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-yellow-600/20 bg-zinc-950 py-1 shadow-2xl">
                  <MenuLink href="/#services" onClick={() => setOpen(false)}>Services</MenuLink>
                  <MenuLink href="/#fleet" onClick={() => setOpen(false)}>Fleet & Pricing</MenuLink>
                  <div className="px-4 pb-1 pt-3 text-[11px] uppercase tracking-[0.16em] text-[#C4A574]">Rate cards</div>
                  <MenuLink href="/new-york" onClick={() => setOpen(false)}>New York</MenuLink>
                  <MenuLink href="/los-angeles" onClick={() => setOpen(false)}>Los Angeles</MenuLink>
                  <MenuLink href="/dallas" onClick={() => setOpen(false)}>Dallas</MenuLink>
                  <MenuLink href="https://maps.app.goo.gl/aDG8UD4nBddGKKmk6" onClick={() => setOpen(false)} external>
                    Reviews
                  </MenuLink>
                  <MenuLink href="/#contact" onClick={() => setOpen(false)}>Contact</MenuLink>
                  <MenuLink href="/account" onClick={() => setOpen(false)}>Client portal</MenuLink>
                  <div className="px-4 pb-1 pt-3 text-[11px] uppercase tracking-[0.16em] text-[#C4A574]">Affiliate</div>
                  <MenuLink href="/partners" onClick={() => setOpen(false)}>Partners</MenuLink>
                  <MenuLink href="/driver.html" onClick={() => setOpen(false)}>Driver portal</MenuLink>
                  <MenuLink href="/dispatch" onClick={() => setOpen(false)}>Dispatcher portal</MenuLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MenuLink({
  href,
  children,
  onClick,
  external,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block px-4 py-3 text-sm text-zinc-200 hover:bg-yellow-500/10 hover:text-yellow-400"
    >
      {children}
    </a>
  );
}
