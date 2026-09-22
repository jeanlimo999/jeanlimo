# Jean Limo — Date Change Email + Stripe Tips

Files in this folder:

- `change-request-email.txt` — copy/paste professional email
- `tips.html` — tip buttons (10 / 15 / 20 / 25%) that match your booking page
- `create-checkout-session.example.js` — Stripe Checkout with ride + tip line items
- `tip-amounts.md` — dollar amounts for the $280 sedan quote

## How tips work

Stripe Checkout (`checkout.stripe.com`) has **no** built-in 10/15/20/25% tip picker.

Do this instead:

1. Customer picks a tip on **your** site (`tips.html`).
2. Your server creates a Checkout Session with:
   - Ride: $280.00
   - Tip: selected amount (or omit if $0)
3. Redirect to Stripe. Total already includes the tip.

## $280 sedan amounts

| Tip | Amount | Total |
|-----|--------|-------|
| No tip | $0.00 | $280.00 |
| 10% | $28.00 | $308.00 |
| 15% | $42.00 | $322.00 |
| 20% | $56.00 | $336.00 |
| 25% | $70.00 | $350.00 |

For other quotes: `tip = Math.round(rideDollars * percent) / 100`

## No-code fallback (Payment Link)

In Stripe Dashboard → Products, create:

- Tip 10% — $28.00
- Tip 15% — $42.00
- Tip 20% — $56.00
- Tip 25% — $70.00

Add them as **optional items** on that Payment Link. Only correct for this $280 fare.

Jean Limo LLC · Jeannie 281-917-0929 · Cash 281-917-0085
