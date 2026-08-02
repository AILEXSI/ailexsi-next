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
      <div className="space-y-4 rounded-md bg-black/50 p-4">
        <p>CONTENT still in Orbit — Studio awakening soon ;)</p>

        <div className="border-t border-white/10 pt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
            Music
          </p>
          <div className="flex flex-wrap gap-3 text-base">
            <a
              href="https://soundcloud.com/ailexsi-monday"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300/90 underline-offset-4 transition hover:text-cyan-200 hover:underline"
            >
              SoundCloud →
            </a>
            <a
              href="https://suno.com/@mgm1977"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300/90 underline-offset-4 transition hover:text-cyan-200 hover:underline"
            >
              Suno →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
