"use client";

import { useState } from "react";

export default function AppHome() {
  const [screen, setScreen] = useState<"home" | "trips">("home");

  if (screen === "trips") {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto min-h-screen max-w-md bg-[#070707] px-5 py-6">
          <button
            onClick={() => setScreen("home")}
            className="mb-6 text-[#d8b56b]"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold">My Reservations</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Enter your confirmation number and phone number to manage your ride.
          </p>

          <input
            placeholder="Confirmation number"
            className="mt-6 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none"
          />

          <input
            placeholder="Phone number"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-[#171717] px-4 py-4 outline-none"
          />

          <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#e3c17a] to-[#bc8d3d] px-4 py-4 font-semibold text-black">
            Find Reservation
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-black">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 pb-4 pt-6">
          <button className="text-3xl text-zinc-300">☰</button>

          <div className="text-center">
            <div
              className="text-[30px] tracking-[0.14em] text-[#e5c883]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              JEAN LIMO
            </div>

            <div className="mt-1 text-[11px] tracking-[0.5em] text-[#d4bb7d]">
              HOUSTON
            </div>
          </div>

          <button className="text-2xl text-zinc-300">♢</button>
        </header>

        {/* HERO */}
        <section className="relative mx-4 overflow-hidden rounded-[26px] border border-white/5">
          <div
            className="relative min-h-[560px] bg-cover bg-center"
            style={{
              backgroundImage: "url('/fleet/app-hero.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

            <div className="absolute left-6 top-8 z-10">
              <div
                className="text-[25px] leading-[1.05] tracking-[0.12em] text-[#d8bc78]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                MORE THAN
                <br />A RIDE.
              </div>

              <div
                className="mt-4 text-[34px] leading-[1.08] text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                A HIGHER
                <br />
                STANDARD.
              </div>

              <div className="mt-5 text-[11px] tracking-[0.17em] text-zinc-300">
                PROFESSIONAL CHAUFFEURS
              </div>

              <div className="mt-1 text-[11px] tracking-[0.17em] text-zinc-300">
                EXCEPTIONAL EXPERIENCES
              </div>
            </div>

            <div className="absolute bottom-5 left-4 right-4 z-10">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex w-full items-center justify-between rounded-[18px] bg-gradient-to-r from-[#f0cd83] to-[#c99a49] px-6 py-5 text-black shadow-lg"
              >
                <span className="flex items-center gap-4 text-[21px] font-semibold">
                  <span className="text-2xl">▣</span>
                  Book a Ride
                </span>

                <span className="text-3xl font-light">›</span>
              </button>
            </div>
          </div>
        </section>

        {/* MAIN BUTTONS */}
        <section className="space-y-3 px-4 pt-4">
          <button
            onClick={() => setScreen("trips")}
            className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"
          >
            <span className="flex items-center gap-5 text-[18px]">
              <span className="text-2xl">▣</span>
              My Reservations
            </span>

            <span className="text-3xl text-zinc-400">›</span>
          </button>

          <button
            onClick={() => (window.location.href = "/account")}
            className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"
          >
            <span className="flex items-center gap-5 text-[18px]">
              <span className="text-2xl">↻</span>
              Book Again
            </span>

            <span className="text-3xl text-zinc-400">›</span>
          </button>

          <a
            href="sms:2819170085"
            className="flex w-full items-center justify-between rounded-[18px] border border-white/5 bg-[#181818] px-6 py-5"
          >
            <span className="flex items-center gap-5 text-[18px]">
              <span className="text-2xl">☎</span>
              Contact Us
            </span>

            <span className="text-3xl text-zinc-400">›</span>
          </a>
        </section>

        {/* SERVICE CARDS */}
        <section className="grid grid-cols-3 gap-3 px-4 pt-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-[18px] border border-white/5 bg-[#171717] px-2 py-5 text-center"
          >
            <div className="text-3xl text-[#d8b56b]">✈</div>
            <div className="mt-3 text-sm leading-5">
              Airport
              <br />
              Transfer
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-[18px] border border-white/5 bg-[#171717] px-2 py-5 text-center"
          >
            <div className="text-3xl text-[#d8b56b]">◷</div>
            <div className="mt-3 text-sm leading-5">
              Hourly
              <br />
              Service
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-[18px] border border-white/5 bg-[#171717] px-2 py-5 text-center"
          >
            <div className="text-3xl text-[#d8b56b]">⚓</div>
            <div className="mt-3 text-sm leading-5">
              Galveston
              <br />
              Cruise Transfer
            </div>
          </button>
        </section>

        <footer className="px-4 pb-6 pt-5 text-center text-[10px] tracking-[0.28em] text-[#9b8354]">
          HOUSTON &nbsp; | &nbsp; AIRPORTS &nbsp; | &nbsp; CORPORATE &nbsp; |
          &nbsp; SPECIAL EVENTS
        </footer>
      </div>
    </main>
  );
}
