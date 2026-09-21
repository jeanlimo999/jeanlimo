"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/booking?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load booking");
        setBooking(data.booking);
        const sentKey = `emailed-${data.booking?.confirmation || sessionId}`;
        if (data.booking && !sessionStorage.getItem(sentKey)) {
          sessionStorage.setItem(sentKey, "1");
          fetch("/api/notify-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.booking),
          }).catch(() => {});
        }
      })
      .catch((err) => setError(err.message));
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-zinc-900 border border-yellow-600/20 rounded-2xl p-8">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="font-serif text-3xl text-yellow-500 mb-3">Booking Confirmed</h1>
        <p className="text-zinc-400 mb-6">
          Payment received. Save your confirmation number. A booking email is sent to you (if you entered an email) and to Jean Limo dispatch.
        </p>

        {booking?.confirmation && (
          <div className="mb-6 p-4 bg-zinc-800 rounded-xl border border-yellow-600/30">
            <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1">Confirmation number</div>
            <div className="text-2xl font-mono text-yellow-400">{booking.confirmation}</div>
            <div className="text-xs text-zinc-500 mt-3">
              {booking.vehicle} · {booking.date} {booking.time}
            </div>
            {booking.amount != null && (
              <div className="text-sm text-zinc-300 mt-1">${booking.amount.toFixed(2)} paid</div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <p className="text-sm text-zinc-500 mb-6">
          Need to change or cancel? Use your confirmation number on the manage page, or call Jeannie at{" "}
          <a href="tel:+12819170929" className="text-yellow-500">281-917-0929</a>
        </p>

        <div className="flex flex-col gap-3">
          <a href="/manage" className="px-6 py-3 border border-yellow-500/50 text-yellow-400 font-semibold rounded-lg">
            Manage booking
          </a>
          <a href="/" className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
