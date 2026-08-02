/**
 * Studio portal content (∞). Page itself is image-only; music lives here.
 */
export default function StudioContent() {
  return (
    <div
      className="
        space-y-6 text-lg leading-relaxed
        p-6 rounded-xl
        bg-black/60
        backdrop-blur-sm
        border border-white/10
      "
      style={{
        backgroundImage: "url(/images/content/studio/studiocontent.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="rounded-md bg-black/55 p-5 sm:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
          Studio · Music
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">
          Listen and create — open links in a new tab.
        </p>

        <nav className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          <a
            href="https://soundcloud.com/ailexsi-monday"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-2 text-base
              text-white/85 transition
              hover:text-cyan-200
            "
          >
            <span className="border-b border-white/20 pb-0.5 transition group-hover:border-cyan-300/50">
              SoundCloud
            </span>
            <span className="text-white/40 transition group-hover:text-cyan-300/80">→</span>
          </a>

          <a
            href="https://suno.com/@mgm1977"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-2 text-base
              text-white/85 transition
              hover:text-cyan-200
            "
          >
            <span className="border-b border-white/20 pb-0.5 transition group-hover:border-cyan-300/50">
              Suno
            </span>
            <span className="text-white/40 transition group-hover:text-cyan-300/80">→</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
