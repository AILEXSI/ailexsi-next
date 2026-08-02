/**
 * Studio portal content (∞). Page itself is image-only; music lives here.
 */
const musicBrands = [
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/ailexsi-monday",
    src: "/images/studio/logos/soundcloud.svg",
    width: 40,
  },
  {
    name: "Suno",
    href: "https://suno.com",
    // Official Suno app icon: orange→pink/red gradient circle with SUNO wordmark
    src: "/images/studio/logos/suno.png",
    width: 40,
  },
  {
    name: "SoundBoost",
    href: "https://soundboost.ai/",
    src: "/images/studio/logos/soundboost.png",
    width: 40,
  },
] as const;

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

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Co-Creation in Resonance
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
          Mensch und KI im Dialog.
          <br />
          Suno als Resonanzraum, SoundBoost als letzter liebevoller Schliff – ausgerichtet am
          AIM-Protokoll.
        </p>

        <nav
          className="mt-7 flex flex-wrap items-center gap-6 sm:gap-8"
          aria-label="Studio music platforms"
        >
          {musicBrands.map((brand) => (
            <a
              key={brand.name}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              title={brand.name}
              aria-label={brand.name}
              className="
                group inline-flex h-11 w-11 items-center justify-center
                rounded-full
                transition duration-300
                opacity-95
                hover:opacity-100
                hover:drop-shadow-[0_0_14px_rgba(255,120,80,0.45)]
                focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-400/50
              "
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={40}
                className="
                  h-10 w-10 object-contain
                  transition duration-300
                  group-hover:brightness-110
                  group-hover:scale-[1.04]
                "
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
