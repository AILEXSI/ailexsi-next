/**
 * Heartspace portal content (∞).
 * Icon row matches Studio: equal height, clean circular marks, soft cyan hover.
 */
const heartspaceTools = [
  {
    name: "Ailexsi Vault",
    short: "Ailexsi Vault",
    description: "Private knowledge vault & notes",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden fill="none">
        <rect
          x="10"
          y="14"
          width="28"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M18 14V12a6 6 0 0 1 12 0v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="26" r="3" fill="currentColor" opacity="0.9" />
        <path
          d="M24 29v4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "L.I.T.A.",
    short: "L.I.T.A.",
    description: "Living Intelligence · Trust · Alignment",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden fill="none">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.85" />
        <path
          d="M24 6v4M24 38v4M6 24h4M38 24h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    name: "Agents",
    short: "Agents",
    description: "Autonomous co-creation agents",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden fill="none">
        <circle cx="16" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="32" cy="20" r="5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 36c1.5-6 5.5-9 8-9s6.5 3 8 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 36c1.5-6 5.5-9 8-9s6.5 3 8 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M21 20h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    name: "Knowledgebase / Local LLM",
    short: "Knowledgebase",
    description: "Local knowledgebase & LLM",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden fill="none">
        <path
          d="M12 12h18a4 4 0 0 1 4 4v20H16a4 4 0 0 0-4 4V12z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 12V8a2 2 0 0 1 2-2h18a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4h-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.65"
        />
        <path
          d="M18 20h10M18 26h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Continuity",
    short: "Continuity",
    description: "Session memory & resonance continuity",
    icon: (
      <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden fill="none">
        <path
          d="M14 30c0-8 6-14 14-14a12 12 0 0 1 10 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M34 18v6h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 18c0 8-6 14-14 14a12 12 0 0 1-10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M14 30v-6h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    ),
  },
] as const;

export default function HeartspaceContent() {
  return (
    <div
      className="
        space-y-5 text-base leading-relaxed sm:text-lg
        p-4 sm:p-6 rounded-xl
        bg-black/60
        backdrop-blur-sm
        border border-white/10
      "
    >
      <div className="rounded-md bg-black/55 p-4 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
          Heartspace · Core
        </p>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          The Center of Co-Creation
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
          Protocols, ethic core, and the resonance field. Tools that keep memory,
          agents, and alignment in one continuous space.
        </p>

        <nav
          className="
            mt-6 sm:mt-7
            flex flex-wrap items-stretch justify-start
            gap-3 sm:gap-5
          "
          aria-label="Heartspace tools"
        >
          {heartspaceTools.map((tool) => (
            <div
              key={tool.name}
              title={`${tool.name} — ${tool.description}`}
              className="
                group flex w-[5.25rem] sm:w-[6rem] flex-col items-center gap-2
                text-center
              "
            >
              <div
                className="
                  inline-flex h-11 w-11 shrink-0
                  items-center justify-center overflow-hidden rounded-full
                  border border-white/15
                  bg-black/40
                  text-cyan-200/90
                  transition duration-300
                  group-hover:border-cyan-400/40
                  group-hover:text-cyan-100
                  group-hover:drop-shadow-[0_0_14px_rgba(0,200,255,0.45)]
                "
                aria-hidden
              >
                {tool.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight font-medium tracking-wide text-white/70 group-hover:text-white/90 transition">
                {tool.short}
              </span>
              <span className="sr-only">{tool.name}. {tool.description}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
