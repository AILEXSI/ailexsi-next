"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import InfinityButton from "./InfinityButton";
import {
  getHeaderTitle,
  getNavSegment,
  pageOrder,
} from "../navigation/pageMap";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const segment = getNavSegment(pathname);
  const index = pageOrder.indexOf(segment as (typeof pageOrder)[number]);
  const safeIndex = index >= 0 ? index : 0;

  const prevPage = pageOrder[(safeIndex - 1 + pageOrder.length) % pageOrder.length];
  const nextPage = pageOrder[(safeIndex + 1) % pageOrder.length];
  const title = getHeaderTitle(pathname);

  const [portalActive, setPortalActive] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setPortalActive(false));
  }, [pathname]);

  const handleLegalClick = (
    e: React.MouseEvent,
    targetPath: "/impressum" | "/datenschutz"
  ) => {
    if (pathname === targetPath) {
      e.preventDefault();
      router.push("/");
    }
  };

  const isLegalPage = pathname === "/impressum" || pathname === "/datenschutz";

  return (
    <header
      className="
        ailexsi-header
        fixed top-0 left-0 right-0 z-50
        box-border h-[var(--header-height)] w-full max-w-none
        overflow-visible
        bg-black/40 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_0_30px_rgba(0,0,0,0.35)]
      "
    >
      {/*
        Full-viewport-width bar. Side zones share flex-1;
        infinity sits in true center. Mobile: tighter padding so
        legal + title sit closer to the ∞ cluster.
      */}
      <div
        className="
          relative mx-auto box-border flex h-full w-full max-w-none items-center
          overflow-visible
          px-2 sm:px-4 md:px-8 lg:px-12
        "
      >
        {/* LEFT: logo + legal — compact on mobile, closer to center */}
        <div
          className="
            relative z-10 flex min-w-0 flex-1 items-center
            gap-1.5 sm:gap-4 md:gap-6
            pr-1 sm:pr-2
          "
        >
          <Link
            href="/"
            className="
              shrink-0 font-bold tracking-wide text-white
              text-lg sm:text-2xl md:text-3xl
            "
          >
            AiLeXSI
          </Link>

          <div
            className="
              flex min-w-0 items-center gap-1.5 sm:gap-3 md:gap-4
              text-[10px] sm:text-xs md:text-sm text-white/70
            "
          >
            <Link
              href="/impressum"
              onClick={(e) => handleLegalClick(e, "/impressum")}
              className="hover:text-white transition whitespace-nowrap leading-tight"
            >
              <span className="sm:hidden">Legal</span>
              <span className="hidden sm:inline">Legal Notice</span>
            </Link>
            <Link
              href="/datenschutz"
              onClick={(e) => handleLegalClick(e, "/datenschutz")}
              className="hover:text-white transition whitespace-nowrap leading-tight"
            >
              <span className="sm:hidden">Privacy</span>
              <span className="hidden sm:inline">Privacy Policy</span>
            </Link>
            <Link
              href="/stromrechner"
              className="hover:text-white transition whitespace-nowrap leading-tight text-amber-100/80"
            >
              <span className="sm:hidden">Strom</span>
              <span className="hidden sm:inline">Stromrechner</span>
            </Link>
          </div>
        </div>

        {/* CENTER: true horizontal center of the viewport */}
        <div
          className="
            pointer-events-none absolute inset-y-0 left-1/2 z-20
            flex -translate-x-1/2 items-center
          "
        >
          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-6 md:gap-10">
            <button
              type="button"
              onClick={() => router.push(prevPage ? `/${prevPage}` : "/")}
              className="
                text-2xl sm:text-3xl text-white/80 hover:text-white transition
                px-0.5 sm:px-1
              "
              aria-label="Previous page"
            >
              ⇦
            </button>

            <InfinityButton
              active={portalActive}
              onClick={() => {
                setPortalActive((v) => !v);
                (
                  window as unknown as { AILEXSI_PORTAL_TOGGLE?: () => void }
                ).AILEXSI_PORTAL_TOGGLE?.();
              }}
            />

            <button
              type="button"
              onClick={() => router.push(nextPage ? `/${nextPage}` : "/")}
              className="
                text-2xl sm:text-3xl text-white/80 hover:text-white transition
                px-0.5 sm:px-1
              "
              aria-label="Next page"
            >
              ⇨
            </button>
          </div>
        </div>

        {/* RIGHT: page title — closer to ∞ on mobile */}
        <div className="relative z-10 flex min-w-0 flex-1 items-center justify-end pl-1 sm:pl-2">
          <div
            className="
              flex items-center justify-end gap-1.5 sm:gap-3 md:gap-4
              max-w-full
            "
          >
            {isLegalPage && (
              <button
                type="button"
                onClick={() => router.push("/")}
                aria-label="Close"
                title="Close"
                className="
                  w-8 h-8 sm:w-9 sm:h-9 shrink-0
                  rounded-full
                  border border-white/15
                  bg-black/30 backdrop-blur-xl
                  text-white/80
                  hover:text-white hover:border-white/30
                  transition
                  flex items-center justify-center
                  text-lg sm:text-xl
                "
              >
                ×
              </button>
            )}

            <div
              className="
                truncate font-semibold tracking-wide text-white select-none text-right
                text-xs sm:text-base md:text-xl
                max-w-[6.5rem] sm:max-w-[12rem] md:max-w-none
              "
            >
              {title}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="h-full w-[200px] bg-cyan-400/70 blur-[2px] animate-lightsweep" />
      </div>
    </header>
  );
}
