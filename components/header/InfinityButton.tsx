"use client";

import { useEffect, useRef } from "react";

/**
 * Infinity control for the header.
 * Solid disc stays within the header bar; only soft glow may extend slightly outside.
 * Scales down on short landscape viewports via CSS (see globals.css).
 *
 * If the portal has not been opened, the glow radius eases outward after 42s
 * and starts a slow pulse after 144s. Opening the portal stops the hint.
 * prefers-reduced-motion keeps a static stronger glow and does not pulse.
 */
const PORTAL_HINT_GROW_MS = 42_000;
const PORTAL_HINT_PULSE_MS = 144_000;
const PORTAL_OPENED_KEY = "ailexsi-portal-opened";

function rememberPortalOpened() {
  try {
    sessionStorage.setItem(PORTAL_OPENED_KEY, "1");
  } catch {
    /* private mode */
  }
}

function portalAlreadyOpened(): boolean {
  try {
    return sessionStorage.getItem(PORTAL_OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InfinityButton({
  onClick,
  active = false,
}: {
  onClick?: () => void;
  active?: boolean;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const growSeconds = (PORTAL_HINT_PULSE_MS - PORTAL_HINT_GROW_MS) / 1000;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const clearHint = () => {
      delete shell.dataset.portalHint;
    };

    if (active || portalAlreadyOpened()) {
      if (active) rememberPortalOpened();
      clearHint();
      return;
    }

    const started = Date.now();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timers: number[] = [];
    let growKick = 0;

    const clearTimers = () => {
      for (const timer of timers) window.clearTimeout(timer);
      timers = [];
    };

    const beginGrow = () => {
      if (shell.isConnected && shell.dataset.portalHint === "armed") {
        shell.dataset.portalHint = "grow";
      }
    };

    const schedule = () => {
      clearTimers();
      const elapsed = Date.now() - started;
      const reduce = media.matches;
      if (elapsed >= PORTAL_HINT_PULSE_MS) {
        window.clearTimeout(growKick);
        shell.dataset.portalHint = reduce ? "steady" : "pulse";
        return;
      }
      if (elapsed >= PORTAL_HINT_GROW_MS) {
        if (reduce) {
          window.clearTimeout(growKick);
          shell.dataset.portalHint = "steady";
        } else if (shell.dataset.portalHint !== "grow" && shell.dataset.portalHint !== "armed") {
          // Arm the CSS transition for a frame so the radius eases instead of snapping.
          // setTimeout covers background tabs, where requestAnimationFrame is paused.
          shell.dataset.portalHint = "armed";
          requestAnimationFrame(beginGrow);
          window.clearTimeout(growKick);
          growKick = window.setTimeout(beginGrow, 48);
        }
      } else {
        clearHint();
        timers.push(window.setTimeout(schedule, PORTAL_HINT_GROW_MS - elapsed));
      }
      if (!reduce) {
        timers.push(window.setTimeout(schedule, PORTAL_HINT_PULSE_MS - elapsed));
      }
    };

    schedule();
    media.addEventListener("change", schedule);
    return () => {
      clearTimers();
      window.clearTimeout(growKick);
      media.removeEventListener("change", schedule);
    };
  }, [active]);

  return (
    <div
      ref={shellRef}
      className="infinity-btn-shell relative flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center"
      style={{ ["--portal-grow-duration" as string]: `${growSeconds}s` }}
    >
      {/* Soft outer glow — may extend slightly past the header edge */}
      <span
        aria-hidden
        className={`portal-glow pointer-events-none absolute left-1/2 top-1/2 z-0 h-full w-full rounded-full ${
          active ? "portal-glow-active" : ""
        }`}
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
        onClick={() => {
          if (!active) {
            rememberPortalOpened();
            if (shellRef.current) delete shellRef.current.dataset.portalHint;
          }
          onClick?.();
        }}
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
