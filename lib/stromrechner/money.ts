/** Round half away from zero to euro cents for positive amounts. */
export function roundEur(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function parseDeNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!trimmed || trimmed === "-" || trimmed === "." || trimmed === "-.") return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}
