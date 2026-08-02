"use client";

/**
 * Infinity control for the header.
 * Solid disc stays within the header bar; only soft glow may extend slightly outside.
 * Scales down on short landscape viewports via CSS (see globals.css).
 */
export default function InfinityButton({
  onClick,
  active = false,
}: {
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <div className="infinity-btn-shell relative flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center">
      {/* Soft outer glow — may extend slightly past the header edge */}
      <span
        aria-hidden
        className={`
          pointer-events-none absolute left-1/2 top-1/2 z-0
          h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full
          blur-xl transition-all duration-300
          ${
            active
              ? "scale-110 bg-cyan-400/40 opacity-80"
              : "scale-100 bg-cyan-400/20 opacity-45"
          }
        `}
      />
      {/* Gentle pulse (no layout-breaking ping scale) */}
      {!active && (
        <span
          aria-hidden
          className="
            pointer-events-none absolute left-1/2 top-1/2 z-0
            h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full
            bg-cyan-400/15 opacity-40 blur-lg
            animate-[infinityGlow_3.5s_ease-in-out_infinite]
          "
        />
      )}

      <button
        type="button"
        onClick={onClick}
        className={`
          group relative z-10
          box-border
          h-full w-full
          flex items-center justify-center
          rounded-full
          bg-black/30 backdrop-blur-xl
          border
          ${active ? "border-cyan-300/70" : "border-cyan-400/40"}
          ${
            active
              ? "shadow-[0_0_32px_rgba(0,200,255,0.85)]"
              : "shadow-[0_0_18px_rgba(0,200,255,0.35)]"
          }
          transition-all duration-300
        `}
        aria-label={active ? "Close portal" : "Open portal"}
        aria-pressed={active}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 60"
          className={`
            relative h-5 w-8 sm:h-6 sm:w-10 transition-all
            ${
              active
                ? "drop-shadow-[0_0_22px_rgba(0,200,255,0.9)]"
                : "drop-shadow-[0_0_8px_rgba(0,200,255,0.55)] group-hover:drop-shadow-[0_0_14px_rgba(0,200,255,0.85)]"
            }
          `}
          aria-hidden
        >
          <defs>
            <linearGradient id="infGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4df4ff" />
              <stop offset="100%" stopColor="#00aaff" />
            </linearGradient>
          </defs>
          <path
            d="
              M20,30
              C20,15 40,15 60,30
              C80,45 100,45 100,30
              C100,15 80,15 60,30
              C40,45 20,45 20,30
            "
            fill="none"
            stroke="url(#infGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
