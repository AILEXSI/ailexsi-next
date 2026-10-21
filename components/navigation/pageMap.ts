/**
 * Circular main navigation order for ← ∞ →
 *
 * 1. Landing
 * 2. Vision
 * 3. Skylounge
 * 4. Gallery
 * 5. Studio
 * 6. Stage
 * 7. Bar (/skyloungebar)
 * 8. Heartspace
 * 9. Shop
 */
export const pageOrder = [
  "",
  "vision",
  "skylounge",
  "gallery",
  "studio",
  "stage",
  "skyloungebar",
  "heartspace",
  "shop",
] as const;

export type PageName = (typeof pageOrder)[number];

export const pageTitles: Record<PageName, string> = {
  "": "Landing",
  vision: "Vision",
  skylounge: "Skylounge",
  gallery: "Gallery",
  studio: "Studio",
  stage: "Stage",
  skyloungebar: "Bar",
  heartspace: "Heartspace",
  shop: "Shop",
};

/** Top-level segment used by infinity prev/next. */
export function getNavSegment(pathname: string): string {
  const clean = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return "";
  return clean.split("/")[0] || "";
}

/** Header title for the current path. */
export function getHeaderTitle(pathname: string): string {
  const clean = pathname.replace(/^\//, "").replace(/\/$/, "");
  if (!clean) return pageTitles[""];
  if (clean === "impressum") return "Legal Notice";
  if (clean === "datenschutz") return "Privacy Policy";
  if (getNavSegment(pathname) === "stromrechner") return "Stromrechner";

  const segment = getNavSegment(pathname) as PageName;
  return pageTitles[segment] ?? "AILEXSI";
}

/** Adjacent pages with wrap-around (circular navigation). */
export function getAdjacentPages(current: PageName) {
  const index = pageOrder.indexOf(current);
  if (index < 0) {
    return { prev: pageOrder[pageOrder.length - 1], next: pageOrder[0] };
  }
  const prev = pageOrder[(index - 1 + pageOrder.length) % pageOrder.length];
  const next = pageOrder[(index + 1) % pageOrder.length];
  return { prev, next };
}
