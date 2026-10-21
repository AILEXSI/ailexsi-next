"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculateScenarios, CalculationError } from "@/lib/stromrechner/calculate";
import { intervalsToCsv, parseConsumptionCsv } from "@/lib/stromrechner/csv";
import {
  DEFAULT_ASSUMPTIONS,
  EXAMPLE_MONTH_DESCRIPTION,
  EXAMPLE_MONTH_LABEL,
  buildExampleIntervals,
} from "@/lib/stromrechner/exampleMonth";
import { formatEur, formatNumber, parseDeNumber, roundEur } from "@/lib/stromrechner/money";
import { getOperator, listOperators } from "@/lib/stromrechner/operators";
import { EPEX_DE_LU_SEPTEMBER_2026 } from "@/lib/stromrechner/prices/series";
import { STATUTORY_2026, leviesCtPerKwh } from "@/lib/stromrechner/statutory";
import type { Assumptions } from "@/lib/stromrechner/types";
import ResultsChart, { HourlyPriceChart } from "./ResultsChart";

const ASSUMPTION_FIELDS: {
  key: keyof Assumptions;
  label: string;
  unit: string;
  digits: number;
}[] = [
  {
    key: "marginCtPerKwhNet",
    label: "Vertriebsmarge dynamischer Tarif",
    unit: "ct/kWh netto",
    digits: 2,
  },
  {
    key: "supplierBaseEurMonthNet",
    label: "Grundpreis Lieferant, dynamischer Tarif",
    unit: "EUR/Monat netto",
    digits: 2,
  },
  {
    key: "meteringEurYearNet",
    label: "Messstellenbetrieb",
    unit: "EUR/Jahr netto",
    digits: 2,
  },
  {
    key: "fixedCtPerKwhGross",
    label: "Festpreis Arbeitspreis, alles inklusive",
    unit: "ct/kWh brutto",
    digits: 4,
  },
  {
    key: "fixedBaseEurMonthGross",
    label: "Festpreis Grundpreis",
    unit: "EUR/Monat brutto",
    digits: 2,
  },
  {
    key: "maxFlexibleKw",
    label: "Maximale verschiebbare Leistung",
    unit: "kW",
    digits: 1,
  },
];

function draftFromAssumptions(assumptions: Assumptions): Record<keyof Assumptions, string> {
  return {
    marginCtPerKwhNet: formatNumber(assumptions.marginCtPerKwhNet, 2),
    supplierBaseEurMonthNet: formatNumber(assumptions.supplierBaseEurMonthNet, 2),
    meteringEurYearNet: formatNumber(assumptions.meteringEurYearNet, 2),
    fixedCtPerKwhGross: formatNumber(assumptions.fixedCtPerKwhGross, 4),
    fixedBaseEurMonthGross: formatNumber(assumptions.fixedBaseEurMonthGross, 2),
    maxFlexibleKw: formatNumber(assumptions.maxFlexibleKw, 1),
  };
}

export default function StromrechnerApp({ operatorId }: { operatorId: string }) {
  const operator = getOperator(operatorId);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const [draft, setDraft] = useState(() => draftFromAssumptions(DEFAULT_ASSUMPTIONS));
  const [intervals, setIntervals] = useState(buildExampleIntervals);
  const [usingExample, setUsingExample] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!operator || !intervals) return null;
    try {
      return {
        value: calculateScenarios(intervals, operator, EPEX_DE_LU_SEPTEMBER_2026, assumptions),
        error: null as string | null,
      };
    } catch (caught) {
      const message =
        caught instanceof CalculationError
          ? caught.message
          : "Die Berechnung ist fehlgeschlagen.";
      return { value: null, error: message };
    }
  }, [assumptions, intervals, operator]);

  if (!operator) {
    return (
      <p className="px-4 py-10 text-white/80">Dieses Netzgebiet ist nicht hinterlegt.</p>
    );
  }

  const levies = leviesCtPerKwh(operator.concessionCtPerKwhNet);
  const fixed = result?.value?.lines.find((line) => line.id === "fixed");

  function updateDraft(key: keyof Assumptions, raw: string) {
    setDraft((current) => ({ ...current, [key]: raw }));
    const parsed = parseDeNumber(raw);
    if (parsed === null) return;
    setAssumptions((current) => ({ ...current, [key]: parsed }));
  }

  function loadExample() {
    setIntervals(buildExampleIntervals());
    setUsingExample(true);
    setFileName(null);
    setError(null);
  }

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseConsumptionCsv(String(reader.result ?? ""));
        setIntervals(parsed);
        setUsingExample(false);
        setFileName(file.name);
        setError(null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Die CSV konnte nicht gelesen werden.");
      }
    };
    reader.readAsText(file);
  }

  function downloadExample() {
    const csv = intervalsToCsv(buildExampleIntervals());
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "beispieldaten-september-2026.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div lang="de" data-no-swipe className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(212,175,95,0.16),transparent_60%)]" />
      <div className="relative space-y-8">
        <header className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-amber-200/70">
            Haushalt · Schätzung
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stromkosten-Rechner
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
            Vergleich für einen Monat mit 15-Minuten-Werten: Festpreis, dynamischer Tarif
            mit Börsenpreisen DE/LU, derselbe Tarif nach Verschiebung flexibler Last und
            § 14a EnWG Modul 3.
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-white/60">
            Ihre CSV bleibt im Browser. Es gibt keinen Upload, keine Berechnung auf einem
            Server und keine Analyse durch Dritte.
          </p>
        </header>

        <section className="grid gap-4 rounded-2xl border border-amber-200/20 bg-black/50 p-4 backdrop-blur-md sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Verbrauchsdaten</h2>
            {usingExample && (
              <span className="rounded-full border border-amber-200/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                {EXAMPLE_MONTH_LABEL}
              </span>
            )}
            {fileName && !usingExample && (
              <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                Datei: {fileName}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-white/70">{EXAMPLE_MONTH_DESCRIPTION}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadExample}
              className="rounded-full border border-amber-200/50 bg-amber-200/15 px-4 py-2 text-sm text-amber-50 transition hover:bg-amber-200/25"
            >
              Mit Beispieldaten rechnen
            </button>
            <label className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm text-white/85 transition hover:border-white/40">
              CSV auswählen
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onFile(file);
                  event.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={downloadExample}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:text-white"
            >
              Beispieldaten als CSV
            </button>
          </div>
          {error && (
            <p className="text-sm text-amber-200" role="alert">
              {error}
            </p>
          )}
          {result?.error && (
            <p className="text-sm text-amber-200" role="alert">
              {result.error}
            </p>
          )}
          <details className="text-sm text-white/70">
            <summary className="cursor-pointer text-white/85">CSV-Format</summary>
            <div className="mt-3 space-y-2 leading-relaxed">
              <p>
                Erste Zeile ist die Kopfzeile. Trennzeichen ist Semikolon oder Komma.
                Dezimalzeichen ist Komma oder Punkt. Die Datei wird nur lokal gelesen.
              </p>
              <p>Spalten:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <span className="text-white/90">zeit</span>: Beginn der Viertelstunde,
                  ISO-8601 mit Offset, zum Beispiel 2026-09-01T00:00:00+02:00
                </li>
                <li>
                  <span className="text-white/90">verbrauch_kwh</span>: Verbrauch in dieser
                  Viertelstunde
                </li>
                <li>
                  <span className="text-white/90">flexibel_kwh</span>: Anteil davon, der am
                  selben Kalendertag verschoben werden darf. Fehlt die Spalte, ist nichts
                  verschiebbar.
                </li>
              </ul>
              <p>
                Die Zeilen müssen lückenlos im 15-Minuten-Raster liegen. Die eingefrorenen
                Börsenpreise decken nur September 2026 ab. Zeitpunkte außerhalb dieses
                Monats können nicht bewertet werden.
              </p>
            </div>
          </details>
        </section>

        {result?.value && fixed && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-lg font-semibold text-white">Ergebnis</h2>
              <p className="text-sm text-white/60">
                {formatNumber(result.value.kwh, 1)} kWh, davon{" "}
                {formatNumber(result.value.flexibleKwh, 1)} kWh verschiebbar
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {result.value.lines.map((line) => {
                const delta = line.grossEur - fixed.grossEur;
                return (
                  <article
                    key={line.id}
                    className="rounded-xl border border-white/10 bg-black/55 p-4"
                  >
                    <h3 className="text-xs uppercase tracking-wide text-white/50">{line.label}</h3>
                    <p className="mt-2 text-2xl font-semibold text-amber-100">
                      {formatEur(roundEur(line.grossEur))}
                    </p>
                    <p className="mt-1 text-xs text-white/50">brutto im Monat</p>
                    {line.id !== "fixed" && (
                      <p className="mt-2 text-xs text-white/60">
                        {delta <= 0 ? "weniger" : "mehr"} als Festpreis:{" "}
                        {formatEur(roundEur(Math.abs(delta)))}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
            <ResultsChart lines={result.value.lines} />
            <p className="text-sm leading-relaxed text-white/65">
              Die Verschiebung legt flexible Energie in die günstigsten Börsen-Viertelstunden
              desselben Tages, höchstens bis zur Leistungsgrenze. Dieselbe verschobene Menge
              wird danach mit dem dynamischen Tarif und mit Modul 3 bewertet. Der Festpreis
              ändert sich durch die Verschiebung nicht, weil er nicht von der Uhrzeit abhängt.
            </p>
          </section>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-2xl border border-white/10 bg-black/45 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-white">Veröffentlichte Daten</h2>
            <p className="text-sm text-white/60">
              Diese Werte sind Quellenangaben. Sie sind hier nicht als freie Schätzung gedacht.
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-white/75">
              <li>
                <span className="text-white">Börsenpreis.</span> {EPEX_DE_LU_SEPTEMBER_2026.label}.{" "}
                {EPEX_DE_LU_SEPTEMBER_2026.attribution} Keine Live-Abfrage.
              </li>
              <li>
                <span className="text-white">Netzentgelt.</span> {operator.name},{" "}
                {operator.priceSheetLabel}. Arbeitspreis ohne Leistungsmessung{" "}
                {formatNumber(operator.flatEnergyCtPerKwhNet, 2)} ct/kWh netto, Grundpreis{" "}
                {formatNumber(operator.gridBaseEurYearNet, 0)} EUR/Jahr netto.{" "}
                <a
                  href={operator.priceSheetUrl}
                  className="text-cyan-200 underline decoration-white/20 underline-offset-2"
                >
                  Preisblatt
                </a>
              </li>
              <li>
                <span className="text-white">Modul 3 und Modul 1.</span> Zeitfenster laut
                Preisblatt, ganzjährig angeboten: 01:00 bis 05:00 Niedriglast{" "}
                {formatNumber(1.43, 2)} ct/kWh, 17:00 bis 21:00 Hochlast {formatNumber(10.73, 2)}{" "}
                ct/kWh, übrige Zeit Standard {formatNumber(7.14, 2)} ct/kWh, alles netto.
                Modul 3 gilt nur zusammen mit Modul 1. Die Gutschrift von{" "}
                {formatNumber(operator.modul1CreditEurYearNet, 2)} EUR/Jahr netto wird hier mit
                einem Zwölftel angesetzt und nicht unter null geführt.
              </li>
              <li>
                <span className="text-white">Konzessionsabgabe.</span> {operator.concessionNote}
              </li>
              {STATUTORY_2026.sources.map((source) => (
                <li key={source.label}>
                  <span className="text-white">{source.label}.</span> {source.detail}
                </li>
              ))}
              <li>
                Summe der mengenabhängigen Umlagen, Steuer und Konzessionsabgabe:{" "}
                {formatNumber(levies, 3)} ct/kWh netto.
              </li>
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border border-amber-200/20 bg-black/45 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-white">Annahmen</h2>
            <p className="text-sm leading-relaxed text-white/65">
              Diese Eingaben sind keine veröffentlichten Tarife. Der Festpreis ist der
              Brutto-Arbeitspreis Ihres Vertrags inklusive Netz, Umlagen und Steuer, plus
              Grundpreis. Der dynamische Tarif wird aus Börsenpreis, Marge, Netz, Umlagen,
              Stromsteuer, Konzessionsabgabe und Grundpreisen gebaut und danach mit 19 %
              Umsatzsteuer versehen. Messstellenbetrieb steht auf 0, bis Sie Ihren Betrag
              eintragen.
            </p>
            <div className="grid gap-3">
              {ASSUMPTION_FIELDS.map((field) => (
                <label key={field.key} className="block text-sm text-white/80">
                  <span className="mb-1 block">
                    {field.label}{" "}
                    <span className="text-white/45">({field.unit})</span>
                  </span>
                  <input
                    inputMode="decimal"
                    value={draft[field.key]}
                    onChange={(event) => updateDraft(field.key, event.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-white outline-none focus:border-amber-200/50"
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setAssumptions(DEFAULT_ASSUMPTIONS);
                setDraft(draftFromAssumptions(DEFAULT_ASSUMPTIONS));
              }}
              className="text-sm text-white/60 underline decoration-white/20 underline-offset-2"
            >
              Annahmen zurücksetzen
            </button>
          </section>
        </div>

        <HourlyPriceChart eurPerMwh={EPEX_DE_LU_SEPTEMBER_2026.eurPerMwh} />

        <section className="space-y-3 rounded-2xl border border-white/10 bg-black/50 p-4 text-sm leading-relaxed text-white/75 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Einordnung</h2>
          <p>
            Netzdaten gibt es auf dieser Seite derzeit nur für einen Beispielnetzbetreiber:{" "}
            {operator.name} ({operator.regionLabel}). Weitere Netzgebiete sind als eigene
            Unterseiten vorgesehen.
          </p>
          <ul className="flex flex-wrap gap-2">
            {listOperators().map((entry) => (
              <li key={entry.id}>
                <Link
                  href={`/stromrechner/${entry.id}`}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80"
                >
                  {entry.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <p>
            Das Ergebnis ist eine Schätzung, keine Beratung und kein Angebot. Es ersetzt
            keine Rechnung Ihres Lieferanten.
          </p>
          <div className="rounded-xl border border-dashed border-amber-200/40 bg-amber-200/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/80">
              TODO
            </p>
            <p className="mt-2">
              Hier muss ein vom Betreiber geprüfter rechtlicher Hinweis stehen. Diesen
              Platzhalter nicht als Disclaimer, Impressum oder Rechtsberatung verwenden.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
