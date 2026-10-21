import { EPEX_DE_LU_2026_09_EUR_PER_MWH } from "./epexDeLu202609";
import { SEPTEMBER_2026_START_MS } from "../time";

export interface PriceSeries {
  id: string;
  label: string;
  attribution: string;
  license: string;
  zone: string;
  resolutionMinutes: 15;
  startMs: number;
  eurPerMwh: readonly number[];
}

export const EPEX_DE_LU_SEPTEMBER_2026: PriceSeries = {
  id: "epex-de-lu-2026-09",
  label: "Day-Ahead DE/LU, September 2026, 15 Minuten",
  attribution:
    "Energy-Charts, eingefrorener Stand September 2026. CC BY 4.0, Bundesnetzagentur | SMARD.de.",
  license: "CC BY 4.0",
  zone: "DE-LU",
  resolutionMinutes: 15,
  startMs: SEPTEMBER_2026_START_MS,
  eurPerMwh: EPEX_DE_LU_2026_09_EUR_PER_MWH,
};
