# Jean Limo — Next.js checkout with tips

This zip **has a Next.js `build` script**, so it matches your Netlify site (`delicate-nougat-e2233ef`).

## Tips

Percent of **total price** (default $260):

| Tip | Amount | Charge |
|-----|--------|--------|
| 0% | $0 | $260 |
| 10% | $26 | $286 |
| 15% | $39 | $299 |
| 20% | $52 | $312 |
| 25% | $65 | $325 |

Change Total price on the page and the buttons update.

## Deploy on Netlify

1. Unzip.
2. Netlify → the Jean Limo site → Deploys → **Deploy manually** → drag the `jean-limo-next` folder.
3. Site settings → Environment variables:

```
STRIPE_SECRET_KEY=sk_live_or_sk_test
```

4. Build settings should be:
   - Build command: `npm run build`
   - Publish directory: `.next`

If a previous zip overwrite broke the site, restore the last good deploy first, then upload this folder.

Jean Limo LLC · Jeannie 281-917-0929 · Cash 281-917-0085
