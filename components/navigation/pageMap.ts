// Reihenfolge der Seiten in der Navigation
export const pageOrder = [
  "",
  "vision",
  "skylounge",
  "skyloungebar",
  "stage",
  "studio",
  "gallery",
  "shop",
  "heartspace"
 
] as const;

// Typ: erlaubt nur die oben definierten Strings
export type PageName = typeof pageOrder[number];

// Map für Seitennamen (rechts oben im Header)
export const pageTitles: Record<PageName, string> = {
  "": "Landing",
  vision: "Vision",
  skylounge: "Skylounge",
  skyloungebar: "Skylounge Bar",
  stage: "Skylounge Stage",
  studio: "Skylounge Studio",
  gallery: "Skylounge Gallery",
  heartspace: "Heartspace",
  shop: "Skylounge Shop"
};

// Funktion: gibt die vorherige und nächste Seite zurück
export function getAdjacentPages(current: PageName) {
  const index = pageOrder.indexOf(current);

  const prev = index > 0 
    ? pageOrder[index - 1] 
    : null;

  const next = index < pageOrder.length - 1 
    ? pageOrder[index + 1] 
    : null;

  return { prev, next };
}
