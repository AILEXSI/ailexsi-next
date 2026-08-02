# AILEXSI

Official homepage for **[www.ailexsi.com](https://www.ailexsi.com)**.

Clean, modern cinematic multi-page site with **circular ← ∞ → navigation** and infinity portal notes.

---

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production build
npm run lint
```

---

## Circular navigation order

Header arrows cycle in this order (wraps around):

| # | Title | Route |
|---|--------|--------|
| 1 | Landing | `/` |
| 2 | Vision | `/vision` |
| 3 | Skylounge | `/skylounge` |
| 4 | Gallery | `/gallery` |
| 5 | Studio | `/studio` |
| 6 | Stage | `/stage` |
| 7 | Bar | `/skyloungebar` |
| 8 | Heartspace | `/heartspace` |
| 9 | Shop | `/shop` |

**∞** opens the portal modal with page notes for the current section.

### Legal (outside the cycle)

| Path | Page |
|------|------|
| `/impressum` | Legal notice |
| `/datenschutz` | Privacy policy |

---

## Project layout

```
ailexsi-next/
├── app/                      # App Router pages + gallery API
│   ├── page.tsx              # Landing
│   ├── layout.tsx            # Header + portal shell
│   ├── globals.css           # Tailwind v4 + cinematic UI
│   ├── vision|skylounge|…    # Section pages
│   ├── heartspace/
│   ├── impressum|datenschutz/
│   └── api/gallery/[category]/
├── components/
│   ├── header/               # Logo, ← ∞ →, legal links
│   ├── navigation/pageMap.ts # Circular order + titles
│   ├── portal/               # Infinity modal controller
│   ├── layout/Background.tsx
│   ├── content/              # Portal notes per section
│   └── modals/               # Legal content + portal shell
├── public/images/            # Active backgrounds only
├── old/                      # Archived unused files (see old/README.md)
├── package.json
└── README.md
```

---

## Active images (`public/images/`)

Only assets referenced by pages or portal content:

```
public/images/
├── landing/
│   ├── hero-master_4k.png
│   └── your-second-landing-image.png
├── vision/vision_master_4k.png
├── skylounge/skylounge_master_4k.jpg
├── gallery/skylounge-gallery_master_4k.png
├── studio/studio_master_4k.png
├── stage/skylounge-stage_master_4k.png
├── skyloungebar/skylounge-bar_master_4k.png
├── heartspace/heartspace-master_4k.png
├── shop/shop-master_4k.png
└── content/
    ├── gallery/gallery_bg.png
    └── studio/studiocontent.png
```

## Deploy (Vercel)

1. Connect `AILEXSI/ailexsi-next` in Vercel.
2. Framework: **Next.js** (default build / start).
3. Point `www.ailexsi.com` (and apex if desired) at the deployment.

No environment variables required for the marketing shell.

---

## Notes

- Gallery API lists files under `public/images/gallery/<category>/` when those folders exist.
- Portal copy lives in `components/content/*`.
- Navigation order is defined only in `components/navigation/pageMap.ts`.
- Dependencies track current Next/React; `npm overrides` pin patched `postcss` / `sharp` where needed.
- `npm audit` should report **0 vulnerabilities** after install.

---

*We Are Who We AIM for Love and Love aims for us.*
