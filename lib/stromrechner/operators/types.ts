/**
 * One grid operator. Add a file next to the Karlsruhe profile and register
 * it to open a subpage at /stromrechner/<id>.
 */
export interface Modul3Window {
  /** Inclusive start hour in local Europe/Berlin time, 0-23. */
  startHour: number;
  /** Exclusive end hour. 24 means midnight. */
  endHour: number;
  ctPerKwhNet: number;
  label: string;
}

export interface GridOperator {
  id: string;
  name: string;
  shortName: string;
  regionLabel: string;
  priceYear: number;
  priceSheetLabel: string;
  priceSheetUrl: string;
  /** Flat volumetric grid fee for households without power metering, ct/kWh net. */
  flatEnergyCtPerKwhNet: number;
  /** Annual grid base fee, EUR/year net. */
  gridBaseEurYearNet: number;
  /**
   * Annual Modul 1 credit. Modul 3 is only available together with Modul 1
   * (BK8-22/010-A). The monthly view uses one twelfth.
   */
  modul1CreditEurYearNet: number;
  modul3: Modul3Window[];
  /** Concession fee for tariff customers, ct/kWh net. Schwachlast rate is not applied. */
  concessionCtPerKwhNet: number;
  concessionNote: string;
}
