# Jean Limo — complete checkout + tips

This is a drop-in site you can upload to Netlify.

## What is included

- `index.html` — checkout card with 10 / 15 / 20 / 25% tips based on **total price**
- `netlify/functions/create-checkout-session.js` — sends ride + tip to Stripe
- `netlify.toml` — function settings
- `change-request-email.txt` — booking change email
- `package.json` — Stripe dependency for the function

## How tips work

Tips use the **total price on the page** (example default $260).

| Total | 10% | 15% | 20% | 25% |
|-------|-----|-----|-----|-----|
| $260  | $26 | $39 | $52 | $65 |
| $230  | $23 | $34.50 | $46 | $57.50 |
| $280  | $28 | $42 | $56 | $70 |

Change the price in `index.html`:

```html
<input id="ridePrice" type="hidden" value="260.00" />
```

Or type a new amount in the Total price field.

## Upload to Netlify

1. Unzip this folder.
2. Go to [app.netlify.com](https://app.netlify.com).
3. Sites → Add new site → Deploy manually.
4. Drag the unzipped `jean-limo-complete` folder onto Netlify.
5. Site settings → Environment variables → add:

```
STRIPE_SECRET_KEY = sk_live_...   (or sk_test_... for testing)
SUCCESS_URL = https://YOUR-SITE.netlify.app/success.html
CANCEL_URL  = https://YOUR-SITE.netlify.app/
```

6. Redeploy.

Without `STRIPE_SECRET_KEY`, the page still shows tip buttons. Pay will show the amounts instead of opening Stripe.

## Add tips to your existing Jean Limo site

Do not expect tips on `delicate-nougat-e2233ef.netlify.app` until you edit **that** project.

1. Open the file that has **Pay Securely with Stripe**.
2. Copy the tip block from `index.html` (search for `Add a tip`).
3. Paste it between Email and the yellow Pay button.
4. Copy the `<script>` at the bottom of `index.html`.
5. Redeploy that project.

Jean Limo LLC · Jeannie 281-917-0929 · Cash 281-917-0085
