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

  // Portal-State aus globalem Fenster lesen, immer wenn Route wechselt
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalActive((window as any).AILEXSI_PORTAL_STATE === true);
    }
  }, [pathname]);

  // Wenn Route wechselt → Modal automatisch schließen
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).AILEXSI_PORTAL_CLOSE) {
      (window as any).AILEXSI_PORTAL_CLOSE();
    }
  }, [pathname]);

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
            <Link href="/impressum" className="hover:text-white transition">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white transition">
              Datenschutz
            </Link>
          </div>
        </div>

        {/* CENTER ( ← ∞ → ) */}
        <div className="flex justify-center items-center gap-10">

          {/* PREV */}
          <button
            onClick={() => router.push(`/${prevPage}`)}
            className="text-3xl text-white/80 hover:text-white transition"
          >
            ⇦
          </button>

          {/* INFINITY PORTAL mit active-Sync */}
          <InfinityButton
            active={portalActive}
            onClick={() => {
              if ((window as any).AILEXSI_PORTAL_TOGGLE) {
                (window as any).AILEXSI_PORTAL_TOGGLE();
              }
            }}
          />

          {/* NEXT */}
          <button
            onClick={() => router.push(`/${nextPage}`)}
            className="text-3xl text-white/80 hover:text-white transition"
          >
            ⇨
          </button>

        </div>

        {/* RIGHT: PAGE TITLE */}
        <div className="text-right">
          <div className="text-xl font-semibold text-white select-none">
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
