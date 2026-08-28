# Sumuka Geleyara Balaga — Ganeshotsava 2026 Website

Official website for **Sumuka Geleyara Balaga's 11th Ganeshotsava** celebration.

---

## Architecture

- **Framework**: Next.js 16 (App Router, SSR)
- **Database**: MongoDB Atlas (free M0 tier) — all CMS data is permanently stored here
- **Hosting**: Render Free Web Service
- **Admin CMS**: Built-in at `/admin`
- **Authentication**: Environment-variable credentials + HttpOnly session cookies

### Why MongoDB Atlas?
Render's free tier uses an **ephemeral filesystem** — any file written to disk is wiped when the service restarts, sleeps, or redeploys. MongoDB Atlas (free M0 cluster) stores all CMS data externally, independently of Render. Data persists permanently across all restarts.

---

## Data Flow

```
Admin CMS → POST /api/data/[collection] → MongoDB Atlas → public site reads on next request
```

The public home page revalidates every 30 seconds. After an admin save, the change appears on the public site within ~30 seconds at most.

---

## Required Environment Variables

Set these in **Render Dashboard → Your Service → Environment**:

| Variable | Required | Description |
|---|---|---|
| `ADMIN_EMAIL` | ✅ Required | Admin login email |
| `ADMIN_PASSWORD` | ✅ Required | Admin login password (strong) |
| `MONGODB_URI` | ✅ Required | MongoDB Atlas connection string |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Enables styled Google Maps embed |

### How to get MONGODB_URI (free, no credit card)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **FREE cluster** (M0 tier — always free)
3. Create a database user: **Database Access** → Add New Database User → set username + password
4. Whitelist all IPs: **Network Access** → Add IP Address → `0.0.0.0/0` (Allow from anywhere)
5. Get connection string: **Database** → Connect → Drivers → Node.js (copy the string)
6. Replace `<password>` with your database user's password
7. Paste into Render's `MONGODB_URI` environment variable

**Example format:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

---

## Deploying to Render

1. Push the `app/` folder to GitHub (`main` branch)
2. Go to [https://dashboard.render.com](https://dashboard.render.com) → New → Web Service
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` — build/start commands are pre-filled
5. Add the 3 required environment variables in the **Environment** tab
6. Click **Deploy**

### After first deploy
- Visit `https://your-app.onrender.com/admin/login` to access the CMS
- Log in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`

---

## Keeping Render Alive (free tier)

Render Free instances sleep after 15 minutes of inactivity. Set up a free cron ping:

1. Go to [https://cron-job.org](https://cron-job.org) — free account
2. Create a new cron job:
   - **URL**: `https://your-app.onrender.com/api/health`
   - **Schedule**: every 10 minutes
3. Save

> **Note**: This keeps the server responsive, but data persistence is handled by MongoDB — it survives whether or not the server is awake.

---

## Local Development

```bash
cd app/
cp .env.example .env.local
# Fill in ADMIN_EMAIL, ADMIN_PASSWORD, and MONGODB_URI in .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS.

---

## Admin CMS Pages

| Page | URL | Description |
|---|---|---|
| Dashboard | `/admin` | Stats overview |
| Events | `/admin/events` | Day 1/2/3 schedule |
| Announcements | `/admin/announcements` | Live updates broadcast |
| Gallery | `/admin/gallery` | Photo gallery (URL or upload) |
| 11-Year Journey | `/admin/journey` | Year-by-year taglines + photos |
| Donation Settings | `/admin/donation` | UPI ID, QR code, instructions |
| Donation Dashboard | `/admin/donations-log` | All donations, confirm/cancel, PDF export |
| Location | `/admin/location` | Venue address + map |
| Site Info | `/admin/site-info` | About, hero text, contact, background |

---

## Donation System

### Public Flow
1. Devotee visits the Donation section
2. Selects a quick amount (₹51, ₹101, ₹251, ₹501, ₹1001, ₹2501) or enters a custom amount
3. Optionally enters their name
4. Clicks **Pay via UPI** → UPI deep link opens PhonePe, GPay, Paytm, or any UPI app
5. Completes payment in UPI app
6. Website shows "Thank you" confirmation

### Why no automatic payment verification?
Automatic verified payment callbacks require:
- Merchant registration with a payment gateway (Razorpay, PayU, Cashfree, etc.)
- PAN/GST/bank account for KYC
- Transaction fees (typically 1.5–2%)

For a community event at ₹0 cost, the UPI deep link approach is the best option:
- Completely free
- Opens any UPI app with pre-filled amount and UPI ID
- No merchant account required
- Admin verifies from their UPI app and marks donations as "confirmed"

**Future upgrade**: Add Razorpay (2% per transaction, merchant onboarding required) for automatic verification.

---

## Security Notes

- Admin password is never stored in source code or exposed to the browser
- All admin API routes require the `admin_session` HttpOnly cookie
- MongoDB credentials are server-side only (never sent to the browser)
- File uploads are validated (type + size) before saving
- Do not commit `.env.local` to Git (it is in `.gitignore`)

---

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── page.js                    # Public home page (SSR)
│   │   ├── api/
│   │   │   ├── auth/login/            # Admin login API
│   │   │   ├── auth/logout/           # Admin logout API
│   │   │   ├── data/[collection]/     # Generic CMS data CRUD API
│   │   │   ├── donations/             # Public donation recording
│   │   │   ├── admin/donations/[id]/  # Admin donation status update
│   │   │   ├── upload/                # File upload API
│   │   │   └── health/                # Health check endpoint
│   │   └── admin/                     # All admin CMS pages
│   ├── components/
│   │   ├── public/                    # Public site components
│   │   └── admin/                     # Admin UI components
│   └── lib/
│       ├── db.js                      # MongoDB connection singleton
│       ├── data.js                    # readData/writeData (MongoDB-backed)
│       ├── auth.js                    # Client-side auth context
│       └── fallbackData.js            # Default data when DB unavailable
├── .env.example                       # Template for required env vars
├── render.yaml                        # Render deployment config
└── package.json
```
