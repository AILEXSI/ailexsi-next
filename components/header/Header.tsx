"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import InfinityButton from "./InfinityButton";
import { pageOrder, pageTitles } from "../navigation/pageMap";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const current = pathname.replace("/", "") || "";
  const index = pageOrder.indexOf(current as any);

  const prevPage = pageOrder[(index - 1 + pageOrder.length) % pageOrder.length];
  const nextPage = pageOrder[(index + 1) % pageOrder.length];

  const title = pageTitles[current as keyof typeof pageTitles] || "Landing";

  /* --------------------------------------------- */
  /* ACTIVE-STATE SYNC FÜR PORTAL & INFINITYBUTTON */
  /* --------------------------------------------- */

  const [portalActive, setPortalActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalActive((window as any).AILEXSI_PORTAL_STATE === true);
    }
  }, [pathname]);

  /* --------------------------------------------- */
  /* LEGAL LINK TOGGLE HANDLER                      */
  /* --------------------------------------------- */

  const handleLegalClick = (
    e: React.MouseEvent,
    targetPath: "/impressum" | "/datenschutz"
  ) => {
    if (pathname === targetPath) {
      // gleiches Ziel → "Close" = zurück zur Landing
      e.preventDefault();
      router.push("/");
      return;
    }
    // sonst normal navigieren
  };

  const isLegalPage = pathname === "/impressum" || pathname === "/datenschutz";

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        bg-black/40 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_0_30px_rgba(0,0,0,0.35)]
        relative
      "
    >
      <div
        className="
          max-w-screen-2xl mx-auto px-6 py-4
          grid grid-cols-3 items-center
        "
      >
        {/* LEFT: LOGO + LEGAL */}
        <div className="flex items-center gap-8">
          <div className="text-3xl font-bold tracking-wide text-white">
            AiLeXSI
          </div>

          <div className="flex gap-4 text-sm text-white/70">
            <Link
              href="/impressum"
              onClick={(e) => handleLegalClick(e, "/impressum")}
              className="hover:text-white transition"
            >
              Legal Notice
            </Link>
            <Link
              href="/datenschutz"
              onClick={(e) => handleLegalClick(e, "/datenschutz")}
              className="hover:text-white transition"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* CENTER ( ← ∞ → ) */}
        <div className="flex justify-center items-center gap-10">
          <button
            onClick={() => router.push(`/${prevPage}`)}
            className="text-3xl text-white/80 hover:text-white transition"
          >
            ⇦
          </button>

          <InfinityButton
            active={portalActive}
            onClick={() => {
              (window as any).AILEXSI_PORTAL_TOGGLE?.();
            }}
          />

          <button
            onClick={() => router.push(`/${nextPage}`)}
            className="text-3xl text-white/80 hover:text-white transition"
          >
            ⇨
          </button>
        </div>

        {/* RIGHT: PAGE TITLE + CLOSE (LEGAL) */}
        <div className="flex items-center justify-end gap-4">
          {isLegalPage && (
            <button
              onClick={() => router.push("/")}
              aria-label="Close"
              title="Close"
              className="
                w-9 h-9
                rounded-full
                border border-white/15
                bg-black/30 backdrop-blur-xl
                text-white/80
                hover:text-white hover:border-white/30
                transition
                flex items-center justify-center
                text-xl
              "
            >
              ×
            </button>
          )}

          <div className="text-xl font-semibold text-white select-none text-right">
            {title}
          </div>
        </div>
      </div>

      {/* HEADER-SWEEP */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
        <div className="w-[200px] h-full bg-cyan-400/70 blur-[2px] animate-lightsweep"></div>
      </div>
    </header>
  );
}

