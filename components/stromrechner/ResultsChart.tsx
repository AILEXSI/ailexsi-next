import { formatEur, formatNumber, roundEur } from "@/lib/stromrechner/money";
import type { CostLine } from "@/lib/stromrechner/types";

const SHORT: Record<CostLine["id"], string> = {
  fixed: "Festpreis",
  dynamic: "Dynamisch",
  dynamicShifted: "verschoben",
  modul3: "Modul 3",
  modul3Shifted: "M3 verschoben",
};

const COLORS = [
  "rgba(255,255,255,0.72)",
  "rgba(103,232,249,0.9)",
  "rgba(34,211,238,0.55)",
  "rgba(252,211,77,0.92)",
  "rgba(217,169,56,0.62)",
];

export default function ResultsChart({ lines }: { lines: CostLine[] }) {
  const width = 640;
  const height = 260;
  const padLeft = 36;
  const padRight = 12;
  const padTop = 28;
  const padBottom = 42;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...lines.map((line) => line.grossEur), 1);
  const gap = 14;
  const barW = (innerW - gap * (lines.length - 1)) / lines.length;

  return (
    <figure className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
      <figcaption className="mb-2 text-sm text-white/70">
        Monatssumme brutto
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Balkendiagramm der fünf Monatssummen in Euro brutto"
        className="h-auto w-full"
      >
        <title>Vergleich der Monatskosten</title>
        {[0.25, 0.5, 0.75, 1].map((step) => {
          const y = padTop + innerH * (1 - step);
          return (
            <g key={step}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
              <text x={4} y={y + 4} fill="rgba(255,255,255,0.45)" fontSize="11">
                {Math.round(max * step)}
              </text>
            </g>
          );
        })}
        {lines.map((line, index) => {
          const barH = (line.grossEur / max) * innerH;
          const x = padLeft + index * (barW + gap);
          const y = padTop + innerH - barH;
          const euros = formatEur(roundEur(line.grossEur));
          return (
            <g key={line.id}>
              <rect x={x} y={y} width={barW} height={barH} rx={6} fill={COLORS[index]} />
              <text
                x={x + barW / 2}
                y={y - 8}
                textAnchor="middle"
                fill="rgba(255,248,220,0.92)"
                fontSize="12"
              >
                {euros}
              </text>
              <text
                x={x + barW / 2}
                y={padTop + innerH + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.78)"
                fontSize="12"
              >
                {SHORT[line.id]}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export function HourlyPriceChart({ eurPerMwh }: { eurPerMwh: readonly number[] }) {
  const means: number[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    let sum = 0;
    let count = 0;
    for (let index = hour * 4; index < eurPerMwh.length; index += 96) {
      sum += eurPerMwh[index] + eurPerMwh[index + 1] + eurPerMwh[index + 2] + eurPerMwh[index + 3];
      count += 4;
    }
    means.push(count ? sum / count : 0);
  }
  const max = Math.max(...means, 1);
  const min = Math.min(...means, 0);
  const width = 640;
  const height = 160;
  const pad = 16;
  const innerH = height - 36;
  const barW = (width - pad * 2) / 24;

  return (
    <figure className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
      <figcaption className="mb-2 text-sm text-white/70">
        Börsenpreis September 2026, Mittel je Stunde (EUR/MWh)
      </figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Mittlerer Day-Ahead-Preis je Stunde im September 2026"
        className="h-auto w-full"
      >
        {means.map((value, hour) => {
          const barH = ((value - Math.min(0, min)) / (max - Math.min(0, min))) * (innerH - 8);
          const x = pad + hour * barW;
          const y = 8 + (innerH - 8) - barH;
          const expensive = hour >= 17 && hour < 21;
          return (
            <g key={hour}>
              <rect
                x={x + 1}
                y={y}
                width={Math.max(barW - 3, 1)}
                height={Math.max(barH, 0)}
                rx={2}
                fill={expensive ? "rgba(252,211,77,0.85)" : "rgba(103,232,249,0.75)"}
              >
                <title>{`${hour}:00 ${formatNumber(value, 0)} EUR/MWh`}</title>
              </rect>
              {hour % 3 === 0 && (
                <text
                  x={x + barW / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="10"
                >
                  {hour}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
