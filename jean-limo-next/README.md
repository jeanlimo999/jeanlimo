# Jean Limo LLC – Website

Premium Houston chauffeur / black-car service website with live quote calculator and Stripe payments.

## Features

- Dark gold luxury design
- Instant quote (One-way & Hourly) using your exact rates
- Stripe Checkout payment flow
- Success / Cancel pages
- Mobile responsive
- Ready for Netlify or Vercel

## 1. Local Setup

```bash
# Install dependencies
npm install

# Copy environment file and add your Stripe keys
cp .env.example .env.local
# Edit .env.local and paste your Stripe test keys

# Run development server
npm run dev
```

Open http://localhost:3000

## 2. Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Secret key** → `STRIPE_SECRET_KEY`
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Use **test** keys first (`sk_test_...` / `pk_test_...`)

## 3. Deploy to GitHub

```bash
# Create a new repo on GitHub, then:
git init
git add .
git commit -m "Initial Jean Limo website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jean-limo.git
git push -u origin main
```

## 4. Deploy to Netlify

### Option A – From GitHub (recommended)
1. Go to https://app.netlify.com
2. Click **Add new site → Import an existing project**
3. Connect GitHub and select your `jean-limo` repo
4. Netlify will detect Next.js automatically
5. Add environment variables in **Site settings → Environment variables**:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your Netlify URL (e.g. https://jean-limo.netlify.app)
6. Deploy

### Option B – Drag & drop (after build)
```bash
npm run build
# Then drag the .next folder or use Netlify CLI
```

> Note: For best Next.js support on Netlify, the `@netlify/plugin-nextjs` is already configured in `netlify.toml`.

## 5. Environment Variables (required on Netlify)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_...) |
| `NEXT_PUBLIC_SITE_URL` | Your live site URL (for Stripe redirects) |

## 6. After Deploy

1. Test a quote and payment with Stripe test card: `4242 4242 4242 4242`
2. Switch to **live** Stripe keys when ready for real payments
3. Optional: Add a Stripe webhook later to automatically notify Jeannie/Cash when a payment succeeds

## Contact Info Used

- Jeannie: 281-917-0929
- Cash: 281-917-0085
- Domain: jeanlimo.com

---

Built for Jean Limo LLC · Houston · Airport · Cruise · Chauffeur
