import { QUARTER_MS } from "./time";
import type { Interval } from "./types";

export class CsvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CsvError";
  }
}

const TIME_HEADERS = new Set([
  "zeit",
  "timestamp",
  "time",
  "start",
  "datum",
  "datetime",
]);
const KWH_HEADERS = new Set([
  "verbrauch_kwh",
  "verbrauch",
  "kwh",
  "energie_kwh",
  "value_kwh",
]);
const FLEX_HEADERS = new Set([
  "flexibel_kwh",
  "flexibel",
  "flexible_kwh",
  "verschiebbar_kwh",
]);

function splitLine(line: string, delimiter: string): string[] {
  return line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, ""));
}

function detectDelimiter(header: string): string {
  const semicolons = (header.match(/;/g) ?? []).length;
  const commas = (header.match(/,/g) ?? []).length;
  return semicolons >= commas ? ";" : ",";
}

function parseNumber(raw: string, row: number, label: string): number {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) {
    throw new CsvError(`Zeile ${row}: ${label} fehlt.`);
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    throw new CsvError(`Zeile ${row}: ${label} ist keine Zahl (${raw}).`);
  }
  return value;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "");
}

/**
 * Parse a 15-minute smart-meter CSV in the browser.
 * Required columns: zeit, verbrauch_kwh. Optional: flexibel_kwh.
 * Delimiter semicolon or comma. Decimal comma or point.
 */
export function parseConsumptionCsv(text: string): Interval[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  if (lines.length < 2) {
    throw new CsvError("Die CSV braucht eine Kopfzeile und mindestens eine Datenzeile.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = splitLine(lines[0], delimiter).map(normalizeHeader);
  const timeIndex = headers.findIndex((header) => TIME_HEADERS.has(header));
  const kwhIndex = headers.findIndex((header) => KWH_HEADERS.has(header));
  const flexIndex = headers.findIndex((header) => FLEX_HEADERS.has(header));

  if (timeIndex < 0 || kwhIndex < 0) {
    throw new CsvError(
      "Kopfzeile nicht erkannt. Erwartet werden die Spalten zeit und verbrauch_kwh, optional flexibel_kwh."
    );
  }

  const intervals: Interval[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitLine(lines[i], delimiter);
    const row = i + 1;
    const stamp = cells[timeIndex] ?? "";
    const startMs = Date.parse(stamp);
    if (!Number.isFinite(startMs)) {
      throw new CsvError(
        `Zeile ${row}: Zeitpunkt nicht lesbar (${stamp}). Nutzen Sie ISO-8601, zum Beispiel 2026-09-01T00:00:00+02:00.`
      );
    }
    const kwh = parseNumber(cells[kwhIndex] ?? "", row, "verbrauch_kwh");
    const flexibleKwh =
      flexIndex >= 0 ? parseNumber(cells[flexIndex] ?? "0", row, "flexibel_kwh") : 0;
    if (kwh < 0 || flexibleKwh < 0) {
      throw new CsvError(`Zeile ${row}: Negative Mengen sind nicht zulässig.`);
    }
    if (flexibleKwh - kwh > 1e-6) {
      throw new CsvError(
        `Zeile ${row}: flexibel_kwh darf nicht größer als verbrauch_kwh sein.`
      );
    }
    intervals.push({ startMs, kwh, flexibleKwh });
  }

  intervals.sort((a, b) => a.startMs - b.startMs);
  for (let i = 1; i < intervals.length; i += 1) {
    const gap = intervals[i].startMs - intervals[i - 1].startMs;
    if (gap !== QUARTER_MS) {
      throw new CsvError(
        "Die Werte müssen lückenlos im 15-Minuten-Raster liegen. Zwischen zwei Zeilen liegt kein Viertelstundenschritt."
      );
    }
  }
  return intervals;
}

export function intervalsToCsv(intervals: Interval[]): string {
  const lines = ["zeit;verbrauch_kwh;flexibel_kwh"];
  for (const interval of intervals) {
    lines.push(
      `${formatBerlinIso(interval.startMs)};${formatDe(interval.kwh)};${formatDe(interval.flexibleKwh)}`
    );
  }
  return `${lines.join("\n")}\n`;
}

function formatDe(value: number): string {
  return value.toFixed(8).replace(".", ",");
}

function formatBerlinIso(ms: number): string {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(new Date(ms));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  let hour = pick("hour");
  if (hour === "24") hour = "00";
  const offset = berlinOffset(ms);
  return `${pick("year")}-${pick("month")}-${pick("day")}T${hour}:${pick("minute")}:${pick("second")}${offset}`;
}

function berlinOffset(ms: number): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    timeZoneName: "shortOffset",
    hour: "2-digit",
  });
  const name =
    formatter.formatToParts(new Date(ms)).find((part) => part.type === "timeZoneName")
      ?.value ?? "GMT+2";
  const match = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return "+02:00";
  const sign = match[1];
  const hours = match[2].padStart(2, "0");
  const minutes = (match[3] ?? "00").padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}
