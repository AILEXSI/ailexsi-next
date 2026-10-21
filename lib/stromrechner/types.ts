export interface Interval {
  /** Start of the 15-minute slot, epoch milliseconds. */
  startMs: number;
  /** Total consumption in the slot, kWh. */
  kwh: number;
  /** Portion of `kwh` that may move to another slot on the same Berlin day. */
  flexibleKwh: number;
}

export interface Assumptions {
  /** Supplier margin on the dynamic tariff, ct/kWh net. */
  marginCtPerKwhNet: number;
  /** Supplier base fee for the dynamic tariff, EUR/month net. */
  supplierBaseEurMonthNet: number;
  /** Metering fee, EUR/year net. Default 0 until the user enters their own. */
  meteringEurYearNet: number;
  /** All-in fixed contract working price, ct/kWh gross. */
  fixedCtPerKwhGross: number;
  /** All-in fixed contract base fee, EUR/month gross. */
  fixedBaseEurMonthGross: number;
  /** Maximum power of shifted flexible load, kW. */
  maxFlexibleKw: number;
}

export interface CostLine {
  id:
    | "fixed"
    | "dynamic"
    | "dynamicShifted"
    | "modul3"
    | "modul3Shifted";
  label: string;
  kwh: number;
  grossEur: number;
  netEur: number;
  vatEur: number;
  energyEurNet: number;
  marginEurNet: number;
  gridEnergyEurNet: number;
  gridBaseEurNet: number;
  leviesEurNet: number;
  supplierBaseEurNet: number;
  meteringEurNet: number;
  modul1CreditEurNet: number;
}

export interface ScenarioSet {
  kwh: number;
  flexibleKwh: number;
  lines: CostLine[];
}
