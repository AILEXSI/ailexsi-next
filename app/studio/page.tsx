"use client";

import Background from "@/components/layout/Background";

const STUDIO_LINKS = [
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/ailexsi-monday",
    note: "Listen",
  },
  {
    label: "Suno",
    // Public AILEXSI / M.G.M. track hub on Suno (profile hubs vary; this is a stable public entry)
    href: "https://suno.com/@mgm1977",
    note: "Create & play",
  },
] as const;

export default function StudioPage() {
  return (
    <div className="relative w-full min-h-screen">
      <Background image="/images/studio/studio_master_4k.png" />

      {/* Music links — bottom-left, dark cinematic glass */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start px-5 pb-10 sm:px-8 sm:pb-12">
        <div
          className="
            pointer-events-auto
            max-w-md rounded-2xl border border-white/10
            bg-black/55 px-5 py-4 shadow-[0_0_40px_rgba(0,0,0,0.45)]
            backdrop-blur-xl
            sm:px-6 sm:py-5
          "
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
            Studio · Music
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {STUDIO_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group inline-flex items-center gap-2 rounded-full
                  border border-cyan-400/25 bg-black/40
                  px-4 py-2 text-sm text-white/85
                  transition
                  hover:border-cyan-300/50 hover:bg-cyan-400/10 hover:text-white
                "
              >
                <span className="font-medium tracking-wide">{link.label}</span>
                <span className="text-white/35 transition group-hover:text-cyan-300/80">↗</span>
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/40">
            SoundCloud · Suno — open in a new tab
          </p>
        </div>
      </div>
    </div>
  );
}
