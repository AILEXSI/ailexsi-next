import type { GridOperator } from "./types";

/**
 * Stadtwerke Karlsruhe Netzservice GmbH, price sheet electricity 2026.
 * Valid from 1 January 2026, document date 5 December 2025.
 * All grid figures below are net.
 */
export const stadtwerkeKarlsruheNetzservice: GridOperator = {
  id: "stadtwerke-karlsruhe-netzservice",
  name: "Stadtwerke Karlsruhe Netzservice GmbH",
  shortName: "Stadtwerke Karlsruhe Netzservice",
  regionLabel: "Netzgebiet Karlsruhe, Beispielnetzbetreiber",
  priceYear: 2026,
  priceSheetLabel: "Preisblatt Strom 2026, gültig ab 01.01.2026, Stand 05.12.2025",
  priceSheetUrl:
    "https://www.netzservice-swka.de/netze-wAssets/docs/downloads/preisblatt-strom-2026.pdf",
  flatEnergyCtPerKwhNet: 7.14,
  gridBaseEurYearNet: 90,
  modul1CreditEurYearNet: 120.78,
  modul3: [
    { startHour: 0, endHour: 1, ctPerKwhNet: 7.14, label: "Standardtarifstufe (ST)" },
    { startHour: 1, endHour: 5, ctPerKwhNet: 1.43, label: "Niedriglasttarifstufe (NT)" },
    { startHour: 5, endHour: 17, ctPerKwhNet: 7.14, label: "Standardtarifstufe (ST)" },
    { startHour: 17, endHour: 21, ctPerKwhNet: 10.73, label: "Hochlasttarifstufe (HT)" },
    { startHour: 21, endHour: 24, ctPerKwhNet: 7.14, label: "Standardtarifstufe (ST)" },
  ],
  concessionCtPerKwhNet: 1.99,
  concessionNote:
    "Konzessionsabgabe für Tarifkunden 1,99 ct/kWh (Preisblatt 3). Der Schwachlastsatz 0,61 ct/kWh ist nicht angesetzt: das Preisblatt verlangt dafür einen Zweitarifnachweis.",
};
