# `/old` — archived assets & dead code

This folder holds material that is **not used by the live AILEXSI homepage**, but was **kept on purpose** for transparency and recovery.

> Nothing here is served by Next.js unless you move it back into `app/`, `components/`, or `public/`.  
> TypeScript and ESLint **exclude** this folder (`tsconfig.json` / `eslint.config.mjs`) so broken relative imports in archived components do not fail the build.

---

## Why these files are here

They were removed from the **active** tree during the site cleanup so that:

- production stays lean (only current page backgrounds and code)
- the repo stays maintainable
- history and design alternatives remain available without hunting git history

Files were restored from commit `887c4ca` (*Upgrade to Next.js 16 – working local build, old structure intact*) into this archive, preserving their **original relative paths** under `old/`.

---

## Inventory (by original location)

### Components (unused modal wrappers)

| Path under `/old` | Original path | Reason |
|-------------------|---------------|--------|
| `components/modals/ModalDatenschutz.tsx` | `components/modals/ModalDatenschutz.tsx` | Legal pages render `DatenschutzContent` directly; portal uses `ModalPageContent` |
| `components/modals/ModalImpressum.tsx` | `components/modals/ModalImpressum.tsx` | Same — impressum page uses `ImpressumContent` directly |

### Config (superseded)

| Path under `/old` | Original path | Reason |
|-------------------|---------------|--------|
| `postcss.config.js` | `postcss.config.js` | Duplicate of `postcss.config.mjs` (Tailwind v4 PostCSS setup) |
| `tailwind.config.js` | `tailwind.config.js` | Tailwind v4 uses CSS-first config via `@import "tailwindcss"` in `app/globals.css` |

### Public — default Next.js starter assets

| Path under `/old` | Original path | Reason |
|-------------------|---------------|--------|
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | same under `public/` | Starter placeholders, unused by pages |
| `public/icons/infinity.svg` | same | Infinity symbol is drawn inline in `InfinityButton.tsx` |

### Public — old image variants & working folders

| Path under `/old` | Original path | Reason |
|-------------------|---------------|--------|
| `public/images/**/Neuer Ordner/**` | same | Local “new folder” dumps; not referenced by code |
| `public/images/**/*_old*` / `*old*` | same | Previous master backgrounds / drafts |
| `public/images/skylounge/old/**` | same | Older desktop/mobile/icon exports |

Live backgrounds remain under the root `public/images/` tree (one master asset per section + portal content art).

---

## How to restore something

1. Copy the file from `old/<original-path>` back to `<original-path>` at the repo root.
2. Wire it up if needed (page `Background image="..."`, component import, etc.).
3. Run `npm run build` to confirm.

Example:

```bash
# restore one archived image into public
cp "old/public/images/landing/Neuer Ordner/hero-master_4k_old.png" public/images/landing/
```

---

## What is *not* in this archive

- Active app routes (`app/`)
- Active components (header, portal, content, legal text)
- Current section master images under `public/images/`
- Dependency lockfile / package.json (always use the live root copies)

If you need something deleted before `887c4ca`, check full git history (`git log --all -- path`).
