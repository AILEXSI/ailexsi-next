// Main navigation order for ← ∞ →
export const pageOrder = [
  "",
  "vision",
  "skylounge",
  "skyloungebar",
  "stage",
  "studio",
  "gallery",
  "shop",
  "heartspace",
] as const;

export type PageName = (typeof pageOrder)[number];

export const pageTitles: Record<PageName, string> = {
  "": "Landing",
  vision: "Vision",
  skylounge: "Skylounge",
  skyloungebar: "Skylounge Bar",
  stage: "Skylounge Stage",
  studio: "Skylounge Studio",
  gallery: "Skylounge Gallery",
  heartspace: "Heartspace",
  shop: "Skylounge Shop",
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

  const segment = getNavSegment(pathname) as PageName;
  return pageTitles[segment] ?? "AILEXSI";
}

export function getAdjacentPages(current: PageName) {
  const index = pageOrder.indexOf(current);
  const prev = index > 0 ? pageOrder[index - 1] : null;
  const next = index < pageOrder.length - 1 ? pageOrder[index + 1] : null;
  return { prev, next };
}
