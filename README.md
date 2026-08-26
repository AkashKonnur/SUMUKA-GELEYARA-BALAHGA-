# ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ — Ganeshotsava 2026 🙏

Official website for **Sumuka Geleyara Balaga's 11th Year Ganeshotsava** — September 14–16, 2026, Kengeri, Bengaluru.

Built with **Next.js 16**, **Firebase**, **Tailwind CSS v4** and **Framer Motion**.

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

Open `.env.local` and fill in at minimum:

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

> Firebase variables are optional — without them, the site runs on beautiful static fallback data.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 🔐 Admin Login

The admin panel is at `/admin/login`. Login is protected by:

1. **Server-side authentication** via Next.js API route + HttpOnly cookies
2. **Next.js Edge Middleware** protecting all `/admin/*` routes

**Credentials** are set via environment variables — `ADMIN_EMAIL` and `ADMIN_PASSWORD`.  
They are **never exposed to the browser** or visible in source code.

**Correct credentials** → Redirected to `/admin` dashboard  
**Wrong credentials** → Error message shown, access denied  
**Visiting `/admin` without login** → Auto-redirected to `/admin/login`

---

## ☁️ Deploying to Render

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial production deployment"
git push origin main
```

### Step 2 — Create a Render Web Service

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **New → Web Service**
3. Connect your **GitHub repository**
4. Render will auto-detect `render.yaml` and pre-fill:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Runtime:** Node

### Step 3 — Set Environment Variables on Render

In the Render dashboard → **Environment** tab, add:

| Variable | Value | Required? |
|---|---|---|
| `ADMIN_EMAIL` | Your admin email | ✅ Yes |
| `ADMIN_PASSWORD` | Your secure password | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console | Optional |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase Console | Optional |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase Console | Optional |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase Console | Optional |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console | Optional |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase Console | Optional |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | From Google Cloud Console | Optional |

> Without Firebase variables, the site works beautifully with static data. Add Firebase later for live CMS.

### Step 4 — Deploy

Click **Deploy Web Service**. Your site will be live at:
```
https://sumuka-ganeshotsava-2026.onrender.com
```

### Step 5 — Future Updates

```bash
# Make your changes locally, then:
git add .
git commit -m "Your change description"
git push origin main
# Render automatically redeploys — SAME URL, SAME service
```

---

## 🔥 Firebase Setup (Optional — for Live CMS)

Firebase enables the admin panel to save/load content dynamically.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore**, **Storage**, and **Authentication (Email/Password)**
4. Go to **Project Settings → Web App** → copy the config
5. Add values to your `.env.local` and Render environment variables
6. In **Firebase Authentication → Users**, create your admin user:
   - Email: same as `ADMIN_EMAIL`
   - Password: same as `ADMIN_PASSWORD`
7. Set up Firestore rules from `firestore.rules` in this repo

---

## 📁 Project Structure

```
app/
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
│   │   │   ├── site-info/page.js     ← Site info & contact
│   │   │   └── donations-log/page.js ← Private donations log
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.js    ← Server-side login API
│   │           └── logout/route.js   ← Server-side logout API
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
│   │       └── AuthGate.jsx          ← Client-side auth loading state
│   └── lib/
│       ├── auth.js                   ← Auth context & login/logout logic
│       ├── firebase.js               ← Firebase initialization
│       ├── firestore.js              ← Firestore CRUD helpers
│       ├── storage.js                ← Firebase Storage helpers
│       └── fallbackData.js           ← Static data (used without Firebase)
├── middleware.js                     ← Route protection for /admin/*
├── next.config.mjs                   ← Next.js configuration
├── render.yaml                       ← Render deployment config
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

### 📝 Main Text / Hero Content (English & Kannada)
**Static text (no Firebase):** `src/lib/fallbackData.js`  
- `heroTaglineEn` / `heroTaglineKn` — subtitle under the title
- `heroCopyEn` / `heroCopyKn` — description paragraph
- `about` — About section text  

**With Firebase:** Manage via Admin Dashboard → Site Info & Contact.

### 🗺️ Navigation Links
**File:** `src/components/public/Navbar.jsx`  
Look for the `navLinks` array to add/remove/rename nav items.

### 📅 Event Schedule
**Static:** `src/lib/fallbackData.js` → `fallbackEvents` array  
**With Firebase:** Admin Dashboard → Events (Day 1/2/3)

### 🔑 Admin Email & Password
**Local development:** `.env.local` file  
**Render production:** Render Dashboard → Environment tab  
Variables: `ADMIN_EMAIL` and `ADMIN_PASSWORD`

### ☁️ Render Environment Variables
All available variables with explanations are in `.env.example`.  
Set them in: Render Dashboard → Your Service → Environment.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (App Router) |
| React 19 | UI components |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Firebase Firestore | Database (optional) |
| Firebase Auth | Authentication (optional) |
| Firebase Storage | Image uploads (optional) |

---

## 📄 License

Private project — Sumuka Geleyara Balaga, Bengaluru.  
All rights reserved.
