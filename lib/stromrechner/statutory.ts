/**
 * Nationwide 2026 adders used on top of the grid fee.
 * Rates for KWKG, offshore levy and the § 19 StromNEV surcharge are the
 * figures printed on the Stadtwerke Karlsruhe Netzservice price sheet for 2026
 * (Preisblatt 5 and 6), which cites netztransparenz.de.
 * Electricity tax: § 3 StromStG, 20.50 EUR/MWh.
 * VAT: standard rate.
 */
export const STATUTORY_2026 = {
  stromsteuerCtPerKwh: 2.05,
  kwkgCtPerKwh: 0.446,
  offshoreCtPerKwh: 0.941,
  stromNevCtPerKwh: 1.559,
  vatRate: 0.19,
  sources: [
    {
      label: "Stromsteuer 2,05 ct/kWh",
      detail: "§ 3 Stromsteuergesetz, 20,50 Euro je Megawattstunde.",
    },
    {
      label: "KWKG-Umlage 0,446 ct/kWh",
      detail:
        "Nichtprivilegierter Letztverbrauch, Preisblatt 5 der Stadtwerke Karlsruhe Netzservice GmbH 2026, nach netztransparenz.de.",
    },
    {
      label: "Offshore-Netzumlage 0,941 ct/kWh",
      detail:
        "Nichtprivilegierter Letztverbrauch, Preisblatt 5 der Stadtwerke Karlsruhe Netzservice GmbH 2026, nach netztransparenz.de.",
    },
    {
      label: "Aufschlag für besondere Netznutzung 1,559 ct/kWh",
      detail:
        "Letztverbrauchergruppe A', Preisblatt 6 (früher § 19 Abs. 2 StromNEV), Stadtwerke Karlsruhe Netzservice GmbH 2026.",
    },
    {
      label: "Umsatzsteuer 19 %",
      detail: "Regelsteuersatz auf das Nettoentgelt.",
    },
  ],
} as const;

export function leviesCtPerKwh(concessionCtPerKwh: number): number {
  return (
    STATUTORY_2026.stromsteuerCtPerKwh +
    STATUTORY_2026.kwkgCtPerKwh +
    STATUTORY_2026.offshoreCtPerKwh +
    STATUTORY_2026.stromNevCtPerKwh +
    concessionCtPerKwh
  );
}
