# ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ — Ganeshotsava 2026 🙏

Official website for **Sumuka Geleyara Balaga's 11th Year Ganeshotsava** — September 14–16, 2026, Kengeri, Bengaluru.

Built with **Next.js 16**, **Tailwind CSS v4** and **Framer Motion**. Powered by a local JSON file-based database for absolute simplicity (no external database or configuration required!).

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

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 🔐 Admin Login & Persistence

The admin panel is at `/admin/login`. Login is protected by:

1. **Server-side credentials check** via Next.js API route + HttpOnly session cookies.
2. **Next.js Edge Middleware** protecting all `/admin/*` routes.
3. **Local JSON Database** (`src/lib/data.js`): All changes made in the admin panel are saved instantly as JSON files in a local directory (`data/`).
4. **Render Persistence**: When deploying on Render, a Persistent Disk is attached and mounted under `/data`. All CMS updates are saved to this disk, ensuring changes are kept safely across server restarts, updates, and redeployments.

---

## ☁️ Deploying to Render (With Data Persistence)

Follow these steps to deploy your website to Render with full persistence for admin changes.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Configure deployment"
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
   - **Instance Type:** Starter (Recommended to enable Persistent Disks. Disks are not supported on Render's Free tier).

### Step 3 — Set Environment Variables on Render

In the Render dashboard → **Environment** tab, set:

| Variable | Value | Description |
|---|---|---|
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Your custom admin email login |
| `ADMIN_PASSWORD` | `your-secure-password` | Your custom admin password |
| `DATA_DIR` | `/data` | Folder where persistent disk saves CMS files |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | *(Optional)* | Google Maps API key |

### Step 4 — Deploy

Click **Deploy Web Service**. Your site will be live at your custom URL.

---

## 📁 Project Structure

```
app/
├── data/                             ← Local JSON files directory (created on write)
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
│   │               └── route.js      ← Server-side JSON database CRUD routes
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
│       ├── data.js                   ← Local JSON file storage module
│       └── fallbackData.js           ← Static default data
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
- **Static Defaults:** `src/lib/fallbackData.js`  
  - `heroTaglineEn` / `heroTaglineKn` — subtitle under the title
  - `heroCopyEn` / `heroCopyKn` — description paragraph
  - `about` — About section text  
- **Admin Dashboard Updates:** Edit directly from the Admin Dashboard under **Site Info & Contact** which overrides defaults and saves to your local/Render storage.

### 🗺️ Navigation Links
**File:** `src/components/public/Navbar.jsx`  
Look for the `navLinks` array to add/remove/rename nav items.

### 📅 Event Schedule
- **Static Defaults:** `src/lib/fallbackData.js` → `fallbackEvents` array  
- **Admin Dashboard Updates:** Manage via Admin Dashboard → **Events (Day 1/2/3)**

### 🔑 Admin Email & Password
- **Local development:** `.env.local` file  
- **Render production:** Render Dashboard → Environment tab  
- Variables: `ADMIN_EMAIL` and `ADMIN_PASSWORD`

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
| Local File System | JSON Database |

---

## 📄 License

Private project — Sumuka Geleyara Balaga, Bengaluru.  
All rights reserved.
