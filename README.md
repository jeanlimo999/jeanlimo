# Jean Limo LLC — complete site

## Upload to GitHub (jeanlimo999/jeanlimo)

1. On GitHub: delete EVERY file and folder in the repo (or create a new empty repo).
2. Unzip this package.
3. Upload the FILES INSIDE the folder (not the wrapper folder itself).

At the repo ROOT you must see:

  src/
  public/
  package.json
  next.config.mjs
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  next-env.d.ts
  netlify.toml
  README.md

You must NOT see a second nested folder like jean-limo-complete/src.

4. Check these two files after upload:

  src/app/page.tsx          → first lines say QuoteWidget and Ride in Comfort
  src/app/manage/page.tsx   → says Manage Booking

5. Commit. Netlify deploys from that commit.

## What is in this build
- Home page with quote, fleet photos, hourly $95 / $125 / $195
- Tips: No tip, 15%, 20%, 25%, Custom
- Manage booking: Make changes → then Request change
- Change-request email with Original / Requested change / Return sections
- Stripe checkout with tip line item

Jean Limo LLC · Jeannie 281-917-0929 · Cash 281-917-0085
