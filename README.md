# RP Technologies — Website

A premium, production-ready website for **RP Technologies**, a software and web solutions company.

Built with **React + Vite + Tailwind CSS v3 + Framer Motion**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `/dist` folder.

---

## 🌐 Deployment

### Mode A — Command-Based (Netlify, Vercel, GitHub Pages, VPS)

After running `npm run build`, deploy the `/dist` folder:

**Netlify (recommended)**
```bash
npx netlify-cli deploy --prod --dir=dist
```

**Vercel**
```bash
npx vercel --prod
```

**Nginx / Apache VPS**
- Upload the `/dist` folder to your server root (e.g., `/var/www/html/`)
- Configure the server to serve `index.html` for all routes

---

### Mode B — Static Hosting (cPanel / Shared Hosting / FTP)

Since this site uses **anchor-based navigation** (`#id` links), there is no React Router and no server-side routing required.

**Steps:**
1. Run `npm run build` locally — this creates a `/dist` folder
2. Upload all contents of `/dist` to your server via FTP or cPanel File Manager
   - Upload to `public_html/` or any domain's root folder
3. That's it — `index.html` is the single entry point
4. No `.htaccess` rewrites needed (no client-side routing)

**File size reference:**
- `index.html` — ~1.5 KB
- `assets/index-*.css` — ~34 KB (6.7 KB gzipped)
- `assets/index-*.js` — ~387 KB (119 KB gzipped)

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx        — Fixed nav with scroll spy + mobile menu
│   │   └── Footer.jsx        — Footer with links, socials, CTA
│   ├── sections/
│   │   ├── Hero.jsx          — Hero with code editor visual
│   │   ├── Services.jsx      — Bento grid of 6 services
│   │   ├── About.jsx         — Brand story + animated stat counters
│   │   ├── Process.jsx       — 6-step timeline (H + V responsive)
│   │   ├── Projects.jsx      — 3 case-study project cards
│   │   ├── WhyUs.jsx         — 6 differentiator cards
│   │   ├── Testimonials.jsx  — Animated carousel with 3 testimonials
│   │   └── Contact.jsx       — Validated contact form
│   └── ui/
│       ├── Button.jsx        — Primary / ghost / outline variants
│       ├── SectionHeading.jsx — Badge + title + subtitle
│       ├── AnimatedCounter.jsx — Count-up on scroll
│       ├── ThemeToggle.jsx   — Dark/light mode toggle
│       └── WhatsAppButton.jsx — Floating WA button
├── hooks/
│   ├── useTheme.js           — Dark mode with localStorage
│   └── useScrollSpy.js       — Active nav link on scroll
├── App.jsx
├── main.jsx
└── index.css                 — Tailwind + custom design tokens
```

---

## ✏️ Customisation Guide

### Change Brand Color (Accent)
Edit `tailwind.config.js` → `theme.extend.colors.accent.DEFAULT`
Default: `#00D4FF` (electric cyan)

### Update Contact Details
Edit `src/components/sections/Contact.jsx` → `CONTACT_INFO` array

### Update WhatsApp Number
Edit `src/components/ui/WhatsAppButton.jsx` → `WA_NUMBER`

### Add/Remove Services
Edit `src/components/sections/Services.jsx` → `SERVICES` array

### Update Projects
Edit `src/components/sections/Projects.jsx` → `PROJECTS` array

### Add Testimonials
Edit `src/components/sections/Testimonials.jsx` → `TESTIMONIALS` array

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Accent | `#00D4FF` Electric Cyan |
| Dark BG | `#0A0A0F` |
| Dark Surface | `#13131A` |
| Dark Card | `#1A1A24` |
| Light BG | `#F4F4F8` |
| Font Display | Space Grotesk |
| Font Body | Inter |

---

## 🔧 Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite 8 |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Google Fonts (Inter + Space Grotesk) |

---

## 📄 License

© 2025 RP Technologies. All rights reserved.
