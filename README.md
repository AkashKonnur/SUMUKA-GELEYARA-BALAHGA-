# ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ — Ganeshotsava 2026 🙏

Official website for **Sumuka Geleyara Balaga's 11th Year Ganeshotsava** — September 14–16, 2026, Kengeri, Bengaluru.

Built with **Next.js 16**, **Tailwind CSS v4** and **Framer Motion**. Zero external databases, zero Firebase, 100% self-contained and configured for **Render Free ($0)** hosting.

---

## 🌐 Live Website Structure

| URL | Description |
|---|---|
| `yoursite.onrender.com/` | Public website (home, events, gallery, etc.) |
| `yoursite.onrender.com/admin/login` | Admin login |
| `yoursite.onrender.com/admin` | Admin CMS dashboard (protected) |
| `yoursite.onrender.com/admin/events` | Manage day-wise event schedule |
| `yoursite.onrender.com/admin/announcements` | Live announcements |
| `yoursite.onrender.com/admin/gallery` | Photo gallery |
| `yoursite.onrender.com/admin/donation` | Donation QR & UPI settings |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set your admin login:

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 🔐 Admin Authentication & Data on Render Free Tier

### Security
* Protected with Next.js **Edge Middleware** (`middleware.js`).
* Verifies credentials against `ADMIN_EMAIL` and `ADMIN_PASSWORD` server-side via Next.js route handlers.
* Manages sessions using secure, tamper-proof **HttpOnly cookies**.

### How Data Works on Render Free Tier
* **Render Free Plan Ephemeral Storage**: Render Free tier instances do not include a permanent disk. Any live changes made through the Admin Panel are stored on disk for the active lifespan of the container.
* **Persistent / Default Updates**: The site is pre-configured with default content in `src/lib/fallbackData.js`. If you want permanent updates to event timings, announcements, or contact info that persist forever across all Free-tier container restarts, you can simply edit `src/lib/fallbackData.js` and push to GitHub!

---

## ☁️ Deploying on Render (100% Free Plan)

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Ready for Render Free deployment"
git push origin main
```

### Step 2 — Create Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository (`AkashKonnur/SUMUKA-GELEYARA-BALAHGA-`).
4. Render will automatically read `render.yaml` and configure:
   * **Plan:** Free ($0/month)
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm start`

### Step 3 — Set Admin Credentials in Render

In your Render Service Dashboard → **Environment** tab, add:

| Variable | Value | Description |
|---|---|---|
| `ADMIN_EMAIL` | `your_email@example.com` | Your admin email for logging into `/admin` |
| `ADMIN_PASSWORD` | `your_secure_password` | Your admin password |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(Optional)* | For custom Google Maps styling |

### Step 4 — Deploy

Click **Deploy Web Service**. Your website will be live in 2–3 minutes at your Render URL!

---

## 📁 Project Structure

```
app/
├── data/                             ← Local JSON files directory
├── public/
│   └── assets/
│       ├── ganeshotsava-design.png   ← Hero background image
│       └── IMG_4339.png              ← Original provided image
├── src/
│   ├── app/
│   │   ├── page.js                   ← Public homepage
│   │   ├── layout.js                 ← Root layout (fonts, meta)
│   │   ├── globals.css               ← All CSS: tokens, animations, utilities
│   │   ├── admin/
│   │   │   ├── layout.js             ← Admin layout (sidebar + auth)
│   │   │   ├── page.js               ← Admin dashboard overview
│   │   │   ├── login/page.js         ← Admin login page
│   │   │   ├── events/page.js        ← Manage events
│   │   │   ├── announcements/page.js ← Live announcements
│   │   │   ├── gallery/page.js       ← Photo gallery
│   │   │   ├── donation/page.js      ← Donation settings
│   │   │   ├── journey/page.js       ← 11-year journey
│   │   │   ├── location/page.js      ← Map & location
│   │   │   └── site-info/page.js     ← Site info & contact
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.js    ← Server-side login API
│   │       │   └── logout/route.js   ← Server-side logout API
│   │       └── data/
│   │           └── [collection]/
│   │               └── route.js      ← Server-side JSON storage API
│   ├── components/
│   │   ├── public/                   ← Public website sections
│   │   │   ├── Hero.jsx              ← Landing section + background
│   │   │   ├── Navbar.jsx            ← Navigation bar
│   │   │   ├── Events.jsx            ← Day-wise event schedule
│   │   │   ├── Gallery.jsx           ← Photo gallery grid
│   │   │   ├── Donation.jsx          ← UPI/QR donation section
│   │   │   └── ...
│   │   └── admin/
│   │       ├── AdminSidebar.jsx      ← Admin navigation sidebar
│   │       └── AuthGate.jsx          ← Client-side auth state
│   └── lib/
│       ├── auth.js                   ← Auth context & login/logout logic
│       ├── data.js                   ← Local JSON file storage module
│       └── fallbackData.js           ← Default static data
├── middleware.js                     ← Route protection for /admin/*
├── next.config.mjs                   ← Next.js configuration
├── render.yaml                       ← Render deployment config (Free plan)
├── .env.example                      ← Environment variables template
├── .gitignore                        ← Git ignore rules
└── package.json                      ← Dependencies & scripts
```

---

## 🎨 Customization Guide

Exact file locations for every customizable element:

### 🖼️ Background Image (First Page / Hero Section)
**File:** `src/components/public/Hero.jsx` — line 39  
**Current image:** `public/assets/ganeshotsava-design.png`  
**To change:** Replace the file `public/assets/ganeshotsava-design.png` with your new image (keep the same filename), OR update the path in `Hero.jsx`:
```jsx
style={{ backgroundImage: "url('/assets/YOUR_NEW_IMAGE.png')" }}
```

### 🖼️ Other Images
- **Gallery photos:** Managed via Admin Dashboard → `yoursite.com/admin/gallery`
- **Donation QR code:** Managed via Admin Dashboard → `yoursite.com/admin/donation`

### 🏷️ Logo / Organization Name
**File:** `src/components/public/Navbar.jsx`  
Look for the brand/logo section (the "ॐ" mark and Kannada text).  
**Also in:** `src/components/admin/AdminSidebar.jsx` — the "ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ" heading.

### 🎨 Colors & Design Theme
**File:** `src/app/globals.css` — lines 4–23 (CSS variables)
```css
:root {
  --gold: #d9a946;           /* Main gold accent */
  --gold-light: #f4d88b;     /* Light gold */
  --maroon: #43150f;         /* Maroon/deep red */
  --cream: #f7eedc;          /* Page background */
  --ink: #130d09;            /* Darkest color */
}
```

### 🔤 Fonts
**File:** `src/app/layout.js` — lines 1–23  
Currently using:
- `Cinzel` — headings (English)
- `Inter` — body text
- `Noto Sans Kannada` — Kannada text  
Change by importing a different Google Font and updating `--font-heading` / `--font-body` in `globals.css`.

### 📝 Main Text & Default Data
**File:** `src/lib/fallbackData.js`  
- `heroTaglineEn` / `heroTaglineKn` — subtitle under the title
- `heroCopyEn` / `heroCopyKn` — description paragraph
- `about` — About section text
- `fallbackEvents` — Schedule for Day 1, 2, and 3
- `fallbackAnnouncements` — Live updates
- `fallbackJourney` — 11-year journey text
- `fallbackLocation` — Address and landmark
- `fallbackDonation` — UPI ID and instructions

### 🔑 Admin Email & Password
- **Local development:** `.env.local` file  
- **Render production:** Render Dashboard → Environment tab  
- Variables: `ADMIN_EMAIL` and `ADMIN_PASSWORD`

---

## 📄 License

Private project — Sumuka Geleyara Balaga, Bengaluru.  
All rights reserved.
