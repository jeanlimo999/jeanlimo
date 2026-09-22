"use client";

import { useMemo, useState } from "react";

function money(n) {
  return "$" + Number(n).toFixed(2);
}

export default function Page() {
  const [ride, setRide] = useState(260);
  const [tipPct, setTipPct] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const tip = useMemo(() => Math.round(ride * tipPct) / 100, [ride, tipPct]);
  const total = ride + tip;
  const percents = [0, 10, 15, 20, 25];

  async function pay() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          rideCents: Math.round(ride * 100),
          tipCents: Math.round(tip * 100),
          tipPercent: tipPct,
          description: "Outbound 28.8 mi $130 + return 27.0 mi $130",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location = data.url;
        return;
      }
      setError(data.error || "Could not start Stripe checkout.");
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header>
        <div className="brand">
          <div className="logo">J</div>
          <div>
            JEAN LIMO
            <br />
            <span style={{ fontSize: 10, letterSpacing: "0.16em", color: "#9a9588" }}>
              LLC · HOUSTON
            </span>
          </div>
        </div>
        <button className="book" type="button">
          Book Now
        </button>
      </header>

      <main>
        <div className="card">
          <h1>Business Sedan · Total due</h1>
          <p className="price">{money(total)}</p>
          <p className="sub">Outbound 28.8 mi $130 + return 27.0 mi $130</p>

          <label>Total price *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={ride}
            onChange={(e) => setRide(parseFloat(e.target.value) || 0)}
          />

          <label>Full Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Phone *</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />

          <label>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <p className="tip-title">Add a tip (optional)</p>
          <div className="tips">
            {percents.map((pct) => (
              <button
                key={pct}
                type="button"
                className={tipPct === pct ? "tip active" : "tip"}
                onClick={() => setTipPct(pct)}
              >
                <strong>{pct === 0 ? "No tip" : `${pct}%`}</strong>
                <span>{money(Math.round(ride * pct) / 100)}</span>
              </button>
            ))}
          </div>

          <div className="totals">
            <div className="row">
              <span>Ride</span>
              <span>{money(ride)}</span>
            </div>
            <div className="row">
              <span>Tip</span>
              <span>{money(tip)}</span>
            </div>
            <div className="row total">
              <span>Pay now</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <button className="pay" type="button" onClick={pay} disabled={busy || ride <= 0}>
            {busy ? "Opening Stripe…" : "Pay Securely with Stripe"}
          </button>
          {error ? <p className="error">{error}</p> : null}
          <p className="note">
            Full refund if canceled at least 12 hours before the scheduled pickup time.
            <br />
            Tips are a percent of the total price.
          </p>
        </div>
      </main>
    </>
  );
}
