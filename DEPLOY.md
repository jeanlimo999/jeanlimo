# Jean Limo — upload to Supabase + Netlify

Two places. Supabase holds customer profiles and trips. Netlify runs the website.

---

## 1. Supabase (database)

1. Open https://supabase.com and sign in.
2. **New project**
   - Name: `jean-limo`
   - Database password: save it
   - Region: `East US (North Virginia)` or closest to Houston
3. Wait until the project is ready (green).
4. Left sidebar → **SQL Editor** → New query.
5. Paste everything in `supabase/schema.sql` → **Run**.
6. Left sidebar → **Project Settings** → **API**. Copy:
   - Project URL
   - `service_role` key (secret — **not** the anon key)

You should see tables `clients`, `client_addresses`, `bookings`, `booking_requests` under Table Editor.

---

## 2. Netlify (website)

Use the existing Jean Limo Netlify site (`delicate-nougat-e223ef`). Do not create a second site.

### A. Environment variables

Netlify → your site → **Site configuration** → **Environment variables** → Add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key from Supabase |
| `SESSION_SECRET` | long random string (see below) |

Keep the keys already on the site:

- `STRIPE_SECRET_KEY`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `BOOKING_NOTIFY_EMAIL`
- `GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

Create `SESSION_SECRET` on your phone or computer:

```
openssl rand -hex 32
```

Or type 40+ random letters and numbers. Do not reuse the Stripe key if you can avoid it.

### B. Upload this folder

1. Unzip `jean-limo-netlify.zip` on your computer.
2. Netlify → Deploys → **Deploy manually** → drag the unzipped `jean-limo-deploy` folder.

Or connect GitHub `jeanlimo999/jeanlimo`, replace the repo files with this folder, and push. Build settings stay:

- Build command: `npm run build`
- Publish directory: `.next`
- Plugin: `@netlify/plugin-nextjs`
- Node: 20

After deploy, open:

- `https://YOUR-SITE.netlify.app/account`

---

## 3. How it works after go-live

1. Customer books on the homepage and pays with Stripe.
2. Success page emails you **and** writes the trip into Supabase.
3. Customer opens **My trips**, enters the same email + phone.
4. They see upcoming + previous website bookings.
5. **Rebook** fills pickup, drop-off, and vehicle on the quote form.

First login also imports paid Stripe checkouts from the last ~100 sessions that match that email and last 4 digits. Older trips past that Stripe window can be added by booking again or inserting a row in Supabase → Table Editor → `bookings`.

`/manage` still works as a guest lookup with confirmation + last 4.

---

## 4. Quick test

1. Run the SQL. Add the 3 new Netlify variables. Deploy.
2. Pay a $1 Stripe test booking with your email and phone (or a live booking).
3. Open `/account`, sign in with that email and phone.
4. Confirm the trip is listed. Tap Rebook. Confirm addresses fill on the homepage quote.
