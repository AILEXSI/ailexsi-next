import { QUARTER_MS, SEPTEMBER_2026_START_MS, berlinParts } from "./time";
import type { Assumptions, Interval } from "./types";

/**
 * Synthetic September 2026 household ("Beispieldaten").
 *
 * Inflexible shape, kW, every day:
 * - 0.10 kW from 01:00 to 05:00
 * - about 1.72 kW from 17:00 to 21:00
 * - about 0.079 kW in the other hours
 *
 * Flexible energy, kWh per day, shifted at most at 6 kW:
 * - 18:00 about 6.98 kWh
 * - 19:00 about 2.00 kWh
 * - 20:00 3 kWh
 * - 21:00 about 0.015 kWh
 *
 * The exact weights are the reference profile for the published example-month
 * totals (fixed 256.64, dynamic 310.08, Modul 3 321.46, dynamic shifted 232.21,
 * Modul 3 shifted 228.23 EUR gross) under the default assumptions.
 */
const FLEX_KWH_BY_HOUR: Readonly<Record<number, number>> = {
  18: 6.9813371687461316,
  19: 2.0034010162214599,
  20: 3,
  21: 0.0152618150324088,
};

const NIGHT_KW = 0.1;
const EVENING_KW = 1.7190487894322222;
const OTHER_KW = 0.0792253274908545;

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  marginCtPerKwhNet: 5,
  supplierBaseEurMonthNet: 4,
  meteringEurYearNet: 0,
  fixedCtPerKwhGross: 39.6941,
  fixedBaseEurMonthGross: 12,
  maxFlexibleKw: 6,
};

function inflexibleKw(hour: number): number {
  if (hour >= 1 && hour < 5) return NIGHT_KW;
  if (hour >= 17 && hour < 21) return EVENING_KW;
  return OTHER_KW;
}

export function buildExampleIntervals(): Interval[] {
  const intervals: Interval[] = [];
  for (let index = 0; index < 2880; index += 1) {
    const startMs = SEPTEMBER_2026_START_MS + index * QUARTER_MS;
    const { hour } = berlinParts(startMs);
    const flexibleKwh = (FLEX_KWH_BY_HOUR[hour] ?? 0) / 4;
    const kwh = inflexibleKw(hour) * 0.25 + flexibleKwh;
    intervals.push({ startMs, kwh, flexibleKwh });
  }
  return intervals;
}

export const EXAMPLE_MONTH_LABEL = "Beispieldaten";
export const EXAMPLE_MONTH_DESCRIPTION =
  "Synthetischer September 2026, kein echter Zählerstand. Grundlast über den Tag, höhere nicht verschiebbare Abendlast und etwa 12 kWh verschiebbarer Verbrauch je Tag, vor allem von 18 bis 20 Uhr.";
