import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateScenarios } from "./calculate";
import { parseConsumptionCsv, intervalsToCsv } from "./csv";
import { DEFAULT_ASSUMPTIONS, buildExampleIntervals } from "./exampleMonth";
import { roundEur } from "./money";
import { getOperator, modul3CtForHour } from "./operators";
import { EPEX_DE_LU_SEPTEMBER_2026 } from "./prices/series";

const REFERENCE = {
  fixed: 256.64,
  dynamic: 310.08,
  modul3: 321.46,
  dynamicShifted: 232.21,
  modul3Shifted: 228.23,
} as const;

describe("Stromkosten reference month", () => {
  const operator = getOperator("stadtwerke-karlsruhe-netzservice");
  assert.ok(operator);

  it("prices the bundled example month to the cent", () => {
    const result = calculateScenarios(
      buildExampleIntervals(),
      operator,
      EPEX_DE_LU_SEPTEMBER_2026,
      DEFAULT_ASSUMPTIONS
    );
    const byId = Object.fromEntries(result.lines.map((line) => [line.id, roundEur(line.grossEur)]));
    assert.equal(byId.fixed, REFERENCE.fixed);
    assert.equal(byId.dynamic, REFERENCE.dynamic);
    assert.equal(byId.modul3, REFERENCE.modul3);
    assert.equal(byId.dynamicShifted, REFERENCE.dynamicShifted);
    assert.equal(byId.modul3Shifted, REFERENCE.modul3Shifted);
  });

  it("keeps total and flexible energy when shifting", () => {
    const intervals = buildExampleIntervals();
    const result = calculateScenarios(
      intervals,
      operator,
      EPEX_DE_LU_SEPTEMBER_2026,
      DEFAULT_ASSUMPTIONS
    );
    const kwh = intervals.reduce((sum, interval) => sum + interval.kwh, 0);
    const flexible = intervals.reduce((sum, interval) => sum + interval.flexibleKwh, 0);
    for (const line of result.lines) {
      assert.ok(Math.abs(line.kwh - kwh) < 1e-6);
    }
    assert.ok(Math.abs(result.flexibleKwh - flexible) < 1e-6);
    assert.ok(result.flexibleKwh > 300);
  });

  it("round-trips the example CSV in the browser format", () => {
    const csv = intervalsToCsv(buildExampleIntervals());
    assert.match(csv.split("\n")[0] ?? "", /zeit;verbrauch_kwh;flexibel_kwh/);
    assert.match(csv, /Beispieldaten|2026-09-01T00:00:00\+02:00/);
    const parsed = parseConsumptionCsv(csv);
    const result = calculateScenarios(
      parsed,
      operator,
      EPEX_DE_LU_SEPTEMBER_2026,
      DEFAULT_ASSUMPTIONS
    );
    const byId = Object.fromEntries(result.lines.map((line) => [line.id, roundEur(line.grossEur)]));
    assert.equal(byId.fixed, REFERENCE.fixed);
    assert.equal(byId.dynamic, REFERENCE.dynamic);
    assert.equal(byId.dynamicShifted, REFERENCE.dynamicShifted);
    assert.equal(byId.modul3, REFERENCE.modul3);
    assert.equal(byId.modul3Shifted, REFERENCE.modul3Shifted);
  });
});

describe("tariff windows and price snapshot", () => {
  it("uses the Karlsruhe Modul 3 hours", () => {
    const operator = getOperator("stadtwerke-karlsruhe-netzservice");
    assert.ok(operator);
    assert.equal(modul3CtForHour(operator, 0), 7.14);
    assert.equal(modul3CtForHour(operator, 1), 1.43);
    assert.equal(modul3CtForHour(operator, 4), 1.43);
    assert.equal(modul3CtForHour(operator, 5), 7.14);
    assert.equal(modul3CtForHour(operator, 16), 7.14);
    assert.equal(modul3CtForHour(operator, 17), 10.73);
    assert.equal(modul3CtForHour(operator, 20), 10.73);
    assert.equal(modul3CtForHour(operator, 21), 7.14);
  });

  it("freezes 2880 Energy-Charts quarter-hours", () => {
    assert.equal(EPEX_DE_LU_SEPTEMBER_2026.eurPerMwh.length, 2880);
    assert.equal(EPEX_DE_LU_SEPTEMBER_2026.eurPerMwh[0], 163.91);
    assert.equal(EPEX_DE_LU_SEPTEMBER_2026.eurPerMwh[2879], 156.4);
    assert.match(EPEX_DE_LU_SEPTEMBER_2026.attribution, /CC BY 4\.0/);
    assert.match(EPEX_DE_LU_SEPTEMBER_2026.attribution, /SMARD\.de/);
  });
});

describe("CSV parser", () => {
  it("accepts comma decimals and rejects hourly gaps", () => {
    const ok = parseConsumptionCsv(
      "zeit;verbrauch_kwh;flexibel_kwh\n2026-09-01T00:00:00+02:00;0,25;0,10\n2026-09-01T00:15:00+02:00;0,25;0\n"
    );
    assert.equal(ok.length, 2);
    assert.equal(ok[0]?.flexibleKwh, 0.1);
    assert.throws(
      () =>
        parseConsumptionCsv(
          "zeit,verbrauch_kwh\n2026-09-01T00:00:00+02:00,0.2\n2026-09-01T01:00:00+02:00,0.2\n"
        ),
      /15-Minuten/
    );
  });
});
