export default function LandingContent() {
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
          Landing · Arrival
        </p>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Welcome to AILEXSI
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
          A cinematic journey through co-creation spaces. Move with{" "}
          <span className="text-white/90">⇦ ∞ ⇨</span> — or swipe on mobile.
          Open <span className="text-cyan-300/90">∞</span> for notes on the current page.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-white/65 sm:text-[15px]">
          <li className="flex gap-2">
            <span className="text-cyan-400/70 shrink-0">→</span>
            <span>
              <span className="text-white/85">Studio</span> — music &amp; resonance
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400/70 shrink-0">→</span>
            <span>
              <span className="text-white/85">Gallery</span> — archives of the Skylounge
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400/70 shrink-0">→</span>
            <span>
              <span className="text-white/85">Heartspace</span> — vault, agents &amp; continuity
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
