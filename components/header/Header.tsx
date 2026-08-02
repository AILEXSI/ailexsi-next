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
        fixed top-0 left-0 right-0 z-50
        w-full max-w-none
        box-border
        bg-black/40 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_0_30px_rgba(0,0,0,0.35)]
      "
    >
      {/*
        Full-viewport-width bar. Side zones share flex-1 so the middle
        (← ∞ →) is always at 50% of the viewport — stable at every zoom.
      */}
      <div className="relative mx-auto box-border flex w-full max-w-none items-center px-4 py-4 sm:px-6">
        {/* LEFT: logo + legal */}
        <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-wide text-white sm:text-3xl"
          >
            AiLeXSI
          </Link>

          <div className="hidden min-w-0 sm:flex gap-4 text-sm text-white/70">
            <Link
              href="/impressum"
              onClick={(e) => handleLegalClick(e, "/impressum")}
              className="hover:text-white transition whitespace-nowrap"
            >
              Legal Notice
            </Link>
            <Link
              href="/datenschutz"
              onClick={(e) => handleLegalClick(e, "/datenschutz")}
              className="hover:text-white transition whitespace-nowrap"
            >
              Privacy Policy
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
          <div className="pointer-events-auto flex items-center gap-5 sm:gap-10">
            <button
              type="button"
              onClick={() => router.push(prevPage ? `/${prevPage}` : "/")}
              className="text-3xl text-white/80 hover:text-white transition"
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
              className="text-3xl text-white/80 hover:text-white transition"
              aria-label="Next page"
            >
              ⇨
            </button>
          </div>
        </div>

        {/* RIGHT: page title (+ close on legal) */}
        <div className="relative z-10 flex min-w-0 flex-1 items-center justify-end gap-4">
          {isLegalPage && (
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Close"
              title="Close"
              className="
                w-9 h-9 shrink-0
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

          <div className="truncate text-base sm:text-xl font-semibold text-white select-none text-right">
            {title}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="h-full w-[200px] bg-cyan-400/70 blur-[2px] animate-lightsweep" />
      </div>
    </header>
  );
}
