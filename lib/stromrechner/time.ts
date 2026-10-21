const berlinFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export interface BerlinParts {
  /** YYYY-MM-DD in Europe/Berlin. */
  dateKey: string;
  hour: number;
  minute: number;
}

export function berlinParts(ms: number): BerlinParts {
  const parts = berlinFormatter.formatToParts(new Date(ms));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(pick("hour"));
  if (hour === 24) hour = 0;
  return {
    dateKey: `${pick("year")}-${pick("month")}-${pick("day")}`,
    hour,
    minute: Number(pick("minute")),
  };
}

export const QUARTER_MS = 15 * 60 * 1000;

/** 1 September 2026 00:00 Europe/Berlin (CEST, UTC+2). */
export const SEPTEMBER_2026_START_MS = Date.parse("2026-09-01T00:00:00+02:00");

export function quarterIndex(startMs: number, seriesStartMs: number): number {
  const delta = startMs - seriesStartMs;
  if (delta % QUARTER_MS !== 0) return -1;
  return delta / QUARTER_MS;
}
