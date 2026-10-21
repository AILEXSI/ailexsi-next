import { modul3CtForHour } from "./operators";
import type { GridOperator } from "./operators/types";
import type { PriceSeries } from "./prices/series";
import { leviesCtPerKwh, STATUTORY_2026 } from "./statutory";
import { berlinParts, quarterIndex } from "./time";
import type { Assumptions, CostLine, Interval, ScenarioSet } from "./types";

export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculationError";
  }
}

interface Slot {
  kwh: number;
  flexibleKwh: number;
  epexEurPerMwh: number;
  flatGridCt: number;
  modul3GridCt: number;
  dateKey: string;
}

function buildSlots(
  intervals: Interval[],
  operator: GridOperator,
  prices: PriceSeries
): Slot[] {
  if (intervals.length === 0) {
    throw new CalculationError("Keine Verbrauchsintervalle vorhanden.");
  }
  const slots: Slot[] = [];
  for (const interval of intervals) {
    const index = quarterIndex(interval.startMs, prices.startMs);
    if (index < 0 || index >= prices.eurPerMwh.length) {
      throw new CalculationError(
        "Mindestens ein Zeitpunkt liegt außerhalb der eingefrorenen Börsenpreise (September 2026, DE/LU, 15 Minuten) oder nicht auf einem Viertelstundenraster."
      );
    }
    const { hour, dateKey } = berlinParts(interval.startMs);
    slots.push({
      kwh: interval.kwh,
      flexibleKwh: interval.flexibleKwh,
      epexEurPerMwh: prices.eurPerMwh[index],
      flatGridCt: operator.flatEnergyCtPerKwhNet,
      modul3GridCt: modul3CtForHour(operator, hour),
      dateKey,
    });
  }
  return slots;
}

/**
 * Move flexible energy into the cheapest quarter-hours of the same Berlin day.
 * Ranking uses the day-ahead price only. The same shifted profile is then
 * priced for the flat dynamic tariff and for Modul 3.
 */
export function shiftFlexibleKwh(slots: Slot[], maxFlexibleKw: number): number[] {
  if (!(maxFlexibleKw > 0)) {
    throw new CalculationError("Die Leistungsgrenze für verschiebbare Last muss größer als 0 sein.");
  }
  const capKwh = maxFlexibleKw * 0.25;
  const shifted = slots.map((slot) => slot.kwh - slot.flexibleKwh);
  const groups = new Map<string, number[]>();
  slots.forEach((slot, index) => {
    const list = groups.get(slot.dateKey);
    if (list) list.push(index);
    else groups.set(slot.dateKey, [index]);
  });

  for (const indexes of groups.values()) {
    let remain = 0;
    for (const index of indexes) remain += slots[index].flexibleKwh;
    const order = [...indexes].sort((a, b) => {
      const priceDelta = slots[a].epexEurPerMwh - slots[b].epexEurPerMwh;
      if (priceDelta !== 0) return priceDelta;
      return a - b;
    });
    for (const index of order) {
      if (remain <= 1e-15) break;
      const take = Math.min(capKwh, remain);
      shifted[index] += take;
      remain -= take;
    }
    if (remain > 1e-4) {
      throw new CalculationError(
        "Die flexible Menge passt an diesem Tag nicht in die Leistungsgrenze. Erhöhen Sie die maximale verschiebbare Leistung."
      );
    }
  }
  return shifted;
}

interface Priced {
  kwh: number;
  epexEur: number;
  gridEur: number;
}

function priceProfile(kwhBySlot: number[], slots: Slot[], grid: "flat" | "modul3"): Priced {
  let kwh = 0;
  let epexEur = 0;
  let gridEur = 0;
  for (let i = 0; i < slots.length; i += 1) {
    const amount = kwhBySlot[i];
    const ct = grid === "flat" ? slots[i].flatGridCt : slots[i].modul3GridCt;
    kwh += amount;
    epexEur += (amount * slots[i].epexEurPerMwh) / 1000;
    gridEur += (amount * ct) / 100;
  }
  return { kwh, epexEur, gridEur };
}

function lineFromProfile(
  id: CostLine["id"],
  label: string,
  priced: Priced,
  assumptions: Assumptions,
  operator: GridOperator,
  applyModul1: boolean
): CostLine {
  const leviesCt = leviesCtPerKwh(operator.concessionCtPerKwhNet);
  const marginEurNet = (priced.kwh * assumptions.marginCtPerKwhNet) / 100;
  const leviesEurNet = (priced.kwh * leviesCt) / 100;
  const gridBaseEurNet = operator.gridBaseEurYearNet / 12;
  const supplierBaseEurNet = assumptions.supplierBaseEurMonthNet;
  const meteringEurNet = assumptions.meteringEurYearNet / 12;
  const gridForCap =
    applyModul1 ? priced.gridEur : (priced.kwh * operator.flatEnergyCtPerKwhNet) / 100;
  const creditCap = Math.max(0, gridForCap + gridBaseEurNet);
  const modul1CreditEurNet = applyModul1
    ? Math.min(operator.modul1CreditEurYearNet / 12, creditCap)
    : 0;
  // Flat grid is applied as one product so the reference month stays stable.
  // Modul 3 uses the quarter-hour sum, because the rate changes by hour.
  const netEur = applyModul1
    ? priced.epexEur +
      (priced.kwh * (assumptions.marginCtPerKwhNet + leviesCt)) / 100 +
      priced.gridEur +
      gridBaseEurNet +
      supplierBaseEurNet +
      meteringEurNet -
      modul1CreditEurNet
    : priced.epexEur +
      (priced.kwh *
        (assumptions.marginCtPerKwhNet + operator.flatEnergyCtPerKwhNet + leviesCt)) /
        100 +
      gridBaseEurNet +
      supplierBaseEurNet +
      meteringEurNet;
  const vatEur = netEur * STATUTORY_2026.vatRate;
  return {
    id,
    label,
    kwh: priced.kwh,
    grossEur: netEur + vatEur,
    netEur,
    vatEur,
    energyEurNet: priced.epexEur,
    marginEurNet,
    gridEnergyEurNet: priced.gridEur,
    gridBaseEurNet,
    leviesEurNet,
    supplierBaseEurNet,
    meteringEurNet,
    modul1CreditEurNet,
  };
}

function fixedLine(kwh: number, assumptions: Assumptions): CostLine {
  const grossEur =
    (kwh * assumptions.fixedCtPerKwhGross) / 100 + assumptions.fixedBaseEurMonthGross;
  return {
    id: "fixed",
    label: "Festpreis",
    kwh,
    grossEur,
    netEur: grossEur,
    vatEur: 0,
    energyEurNet: 0,
    marginEurNet: 0,
    gridEnergyEurNet: 0,
    gridBaseEurNet: 0,
    leviesEurNet: 0,
    supplierBaseEurNet: 0,
    meteringEurNet: 0,
    modul1CreditEurNet: 0,
  };
}

export function calculateScenarios(
  intervals: Interval[],
  operator: GridOperator,
  prices: PriceSeries,
  assumptions: Assumptions
): ScenarioSet {
  if (
    !Number.isFinite(assumptions.marginCtPerKwhNet) ||
    !Number.isFinite(assumptions.supplierBaseEurMonthNet) ||
    !Number.isFinite(assumptions.meteringEurYearNet) ||
    !Number.isFinite(assumptions.fixedCtPerKwhGross) ||
    !Number.isFinite(assumptions.fixedBaseEurMonthGross) ||
    !Number.isFinite(assumptions.maxFlexibleKw)
  ) {
    throw new CalculationError("Eine Annahme ist keine gültige Zahl.");
  }
  const slots = buildSlots(intervals, operator, prices);
  const original = slots.map((slot) => slot.kwh);
  const shifted = shiftFlexibleKwh(slots, assumptions.maxFlexibleKw);
  const dynamic = priceProfile(original, slots, "flat");
  const dynamicShifted = priceProfile(shifted, slots, "flat");
  const modul3 = priceProfile(original, slots, "modul3");
  const modul3Shifted = priceProfile(shifted, slots, "modul3");
  const flexibleKwh = slots.reduce((sum, slot) => sum + slot.flexibleKwh, 0);

  return {
    kwh: dynamic.kwh,
    flexibleKwh,
    lines: [
      fixedLine(dynamic.kwh, assumptions),
      lineFromProfile("dynamic", "Dynamisch", dynamic, assumptions, operator, false),
      lineFromProfile(
        "dynamicShifted",
        "Dynamisch verschoben",
        dynamicShifted,
        assumptions,
        operator,
        false
      ),
      lineFromProfile("modul3", "Modul 3", modul3, assumptions, operator, true),
      lineFromProfile(
        "modul3Shifted",
        "Modul 3 verschoben",
        modul3Shifted,
        assumptions,
        operator,
        true
      ),
    ],
  };
}
