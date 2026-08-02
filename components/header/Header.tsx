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
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold tracking-wide text-white">
            AiLeXSI
          </Link>

          <div className="hidden sm:flex gap-4 text-sm text-white/70">
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

        <div className="flex justify-center items-center gap-6 sm:gap-10">
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

        <div className="flex items-center justify-end gap-4">
          {isLegalPage && (
            <button
              type="button"
              onClick={() => router.push("/")}
              aria-label="Close"
              title="Close"
              className="w-9 h-9 rounded-full border border-white/15 bg-black/30 backdrop-blur-xl text-white/80 hover:text-white hover:border-white/30 transition flex items-center justify-center text-xl"
            >
              ×
            </button>
          )}

          <div className="text-base sm:text-xl font-semibold text-white select-none text-right">
            {title}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden pointer-events-none">
        <div className="w-[200px] h-full bg-cyan-400/70 blur-[2px] animate-lightsweep" />
      </div>
    </header>
  );
}
