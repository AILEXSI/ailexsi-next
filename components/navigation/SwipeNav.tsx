"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getNavSegment, pageOrder } from "./pageMap";

const SWIPE_THRESHOLD_PX = 56;
const MAX_VERTICAL_RATIO = 0.75;
const COOLDOWN_MS = 420;

/**
 * Touch swipe left/right maps to the same circular navigation as ⇦ ⇨.
 * Skips when the gesture starts on interactive UI or when the portal is open.
 */
export default function SwipeNav() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const startRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastNavRef = useRef(0);

  useEffect(() => {
    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          "a, button, input, textarea, select, [role='button'], [data-no-swipe]"
        )
      );
    };

    const isPortalOpen = () =>
      Boolean(
        (window as unknown as { AILEXSI_PORTAL_STATE?: boolean }).AILEXSI_PORTAL_STATE
      );

    const navigate = (direction: "prev" | "next") => {
      const now = Date.now();
      if (now - lastNavRef.current < COOLDOWN_MS) return;
      lastNavRef.current = now;

      const segment = getNavSegment(pathname);
      const index = pageOrder.indexOf(segment as (typeof pageOrder)[number]);
      const safeIndex = index >= 0 ? index : 0;
      const target =
        direction === "prev"
          ? pageOrder[(safeIndex - 1 + pageOrder.length) % pageOrder.length]
          : pageOrder[(safeIndex + 1) % pageOrder.length];

      router.push(target ? `/${target}` : "/");
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        startRef.current = null;
        return;
      }
      if (isPortalOpen() || isInteractiveTarget(e.target)) {
        startRef.current = null;
        return;
      }
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };

    const onTouchEnd = (e: TouchEvent) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start || e.changedTouches.length !== 1) return;
      if (isPortalOpen()) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < SWIPE_THRESHOLD_PX) return;
      if (absY > absX * MAX_VERTICAL_RATIO) return;
      // Ignore very slow drags
      if (Date.now() - start.t > 900) return;

      // Swipe left → next (same as ⇨), swipe right → prev (same as ⇦)
      navigate(dx < 0 ? "next" : "prev");
    };

    const onTouchCancel = () => {
      startRef.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [pathname, router]);

  return null;
}
