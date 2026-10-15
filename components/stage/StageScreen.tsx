"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  STAGE_IMAGE,
  coverLayout,
  openingRect,
  type CoverLayout,
  type FrameRect,
} from "./stageGeometry";
import { loadStageVideos, type StageVideo } from "./stageVideos";
import YouTubeStage, { type YouTubeHandle } from "./YouTubeStage";

const VIDEOS = loadStageVideos();
const STRIPS = 8;
const GATHER = 0.14;
const CURTAIN_MS = 1400;

type Phase = "closed" | "opening" | "open" | "closing";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function startPlayback(video: HTMLVideoElement) {
  try {
    await video.play();
  } catch {
    video.muted = true;
    try {
      await video.play();
    } catch {
      /* native controls stay available */
    }
  }
}

type CurtainHalfProps = {
  side: "left" | "right";
  parted: boolean;
  reduced: boolean;
  cover: CoverLayout;
  opening: FrameRect;
};

function CurtainHalf({ side, parted, reduced, cover, opening }: CurtainHalfProps) {
  const halfW = opening.width / 2;

  return (
    <div
      aria-hidden
      className="absolute inset-y-0 z-10 w-1/2 overflow-hidden"
      style={side === "left" ? { left: 0 } : { right: 0 }}
    >
      {Array.from({ length: STRIPS }, (_, index) => {
        const stripW = halfW / STRIPS;
        const closedLeft =
          side === "left" ? index * stripW : (STRIPS - 1 - index) * stripW;
        const halfOrigin = side === "left" ? opening.left : opening.left + halfW;
        const stripFrameLeft = halfOrigin + closedLeft;
        const gather = parted ? GATHER : 1;
        const fromLeft =
          side === "left" ? index / STRIPS : (STRIPS - 1 - index) / STRIPS;
        const leftPercent =
          side === "left"
            ? fromLeft * gather * 100
            : ((1 - gather) + fromLeft * gather) * 100;

        return (
          <div
            key={index}
            data-curtain-lead={index === STRIPS - 1 ? "" : undefined}
            className="absolute inset-y-0"
            style={{
              width: `calc(${100 / STRIPS}% + 2px)`,
              left: `${leftPercent}%`,
              zIndex: index,
              transition: reduced ? "none" : `left ${CURTAIN_MS}ms cubic-bezier(0.77, 0, 0.18, 1)`,
              backgroundImage: `url(${STAGE_IMAGE.src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${cover.renderedW}px ${cover.renderedH}px`,
              backgroundPosition: `${cover.offsetX - stripFrameLeft}px ${cover.offsetY - opening.top}px`,
              boxShadow:
                side === "left"
                  ? "inset -10px 0 14px rgba(0,0,0,0.28)"
                  : "inset 10px 0 14px rgba(0,0,0,0.28)",
            }}
          />
        );
      })}
    </div>
  );
}

export default function StageScreen() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<YouTubeHandle>(null);
  const phaseRef = useRef<Phase>("closed");

  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [imageSize, setImageSize] = useState<{ w: number; h: number }>({
    w: STAGE_IMAGE.width,
    h: STAGE_IMAGE.height,
  });
  const [reduced, setReduced] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("closed");
  const [parted, setParted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const video: StageVideo | undefined = VIDEOS[index];

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = STAGE_IMAGE.src;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
  }, []);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setFrame({ w: rect.width, h: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    if (phase !== "opening" && phase !== "closing") return;
    const id = window.setTimeout(() => {
      setPhase((current) => {
        if (phase === "opening" && current === "opening") return "open";
        if (phase === "closing" && current === "closing") return "closed";
        return current;
      });
    }, CURTAIN_MS + 90);
    return () => window.clearTimeout(id);
  }, [phase, reduced]);

  const stopPlayback = useCallback(() => {
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    youtubeRef.current?.stop();
  }, []);

  const beginClose = useCallback(() => {
    const current = phaseRef.current;
    if (current === "closed" || current === "closing") return;
    stopPlayback();
    setParted(false);
    if (prefersReducedMotion()) {
      setPhase("closed");
      return;
    }
    setPhase("closing");
  }, [stopPlayback]);

  const openCurtain = useCallback(() => {
    if (phaseRef.current !== "closed" || !video) return;
    setVideoFailed(false);
    const snap = prefersReducedMotion();
    if (snap) {
      setParted(true);
      setPhase("open");
    } else {
      setParted(false);
      setPhase("opening");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setParted(true));
      });
    }
    window.setTimeout(() => {
      const el = videoRef.current;
      if (el) void startPlayback(el);
      youtubeRef.current?.play();
    }, 0);
  }, [video]);

  const go = useCallback((delta: number) => {
    if (VIDEOS.length < 2) return;
    if (phaseRef.current !== "open") return;
    setVideoFailed(false);
    setIndex((current) => (current + delta + VIDEOS.length) % VIDEOS.length);
  }, []);

  useEffect(() => {
    if (phase !== "open" && phase !== "opening") return;
    const el = videoRef.current;
    if (!el) return;
    void startPlayback(el);
  }, [phase, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const portalOpen = Boolean(
        (window as unknown as { AILEXSI_PORTAL_STATE?: boolean }).AILEXSI_PORTAL_STATE
      );
      if (portalOpen) return;
      if (event.key === "Escape" && phaseRef.current !== "closed") {
        event.preventDefault();
        beginClose();
        return;
      }
      if (phaseRef.current !== "open") return;
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beginClose, go]);

  const cover =
    frame.w > 0 && frame.h > 0
      ? coverLayout(frame.w, frame.h, imageSize.w, imageSize.h)
      : null;
  const opening = cover ? openingRect(cover) : null;
  const showCurtain = phase !== "closed" && opening && cover;
  const showControls = phase === "open" && video;

  return (
    <div
      ref={frameRef}
      className="pointer-events-none fixed inset-0 top-[var(--header-height)] z-30"
      data-stage-phase={phase}
    >
      {opening && video && phase === "closed" && (
        <button
          type="button"
          data-stage-play
          data-no-swipe
          onClick={openCurtain}
          aria-label={`Play ${video.title}`}
          className="pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200/80"
          style={{
            left: opening.left + opening.width / 2,
            top: opening.top + opening.height / 2,
          }}
        >
          <span className="animate-stagePlay flex h-16 w-16 items-center justify-center rounded-full border border-white/35 bg-black/50 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-amber-100/80 hover:bg-black/65">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
              <path d="M7 4.5v13l11-6.5-11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/85">
            Play
          </span>
          <span className="max-w-[12rem] truncate text-center text-xs text-white/60">
            {video.title}
          </span>
          {VIDEOS.length > 1 && (
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">
              {index + 1} of {VIDEOS.length}
            </span>
          )}
        </button>
      )}

      {showCurtain && opening && cover && (
        <div
          data-stage-opening
          data-no-swipe
          className="pointer-events-auto absolute"
          style={{
            left: opening.left,
            top: opening.top,
            width: opening.width,
            height: opening.height,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(92,42,14,0.55), rgba(8,4,2,0.94) 68%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[18%]"
            style={{
              background:
                "linear-gradient(to top, rgba(130,58,14,0.5), rgba(40,16,6,0.2) 50%, transparent)",
            }}
          />

          {video && (
            <div
              className="absolute inset-x-[8%] top-[6%] bottom-[13%] z-[2]"
              style={{ perspective: "980px" }}
            >
              <div
                className="relative h-full w-full overflow-hidden bg-black shadow-[0_28px_50px_rgba(0,0,0,0.55)] ring-1 ring-amber-100/30"
                style={{
                  transform: "rotateX(11deg)",
                  transformOrigin: "center bottom",
                  clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
                }}
              >
                {video.source === "mp4" ? (
                  <video
                    key={video.id}
                    ref={videoRef}
                    data-stage-video
                    className="h-full w-full bg-black object-cover"
                    src={video.src}
                    controls
                    playsInline
                    preload="auto"
                    onEnded={() => {
                      const current = phaseRef.current;
                      if (current === "open" || current === "opening") beginClose();
                    }}
                    onError={() => setVideoFailed(true)}
                  />
                ) : (
                  <YouTubeStage
                    key={video.id}
                    ref={youtubeRef}
                    videoId={video.youtubeId}
                    title={video.title}
                    active={phase === "opening" || phase === "open"}
                    onEnded={() => {
                      const current = phaseRef.current;
                      if (current === "open" || current === "opening") beginClose();
                    }}
                    onError={() => setVideoFailed(true)}
                  />
                )}
                {videoFailed && (
                  <p className="absolute inset-0 flex items-center justify-center bg-black/80 px-4 text-center text-sm text-white/80">
                    Video unavailable
                  </p>
                )}
              </div>
            </div>
          )}

          <CurtainHalf
            side="left"
            parted={parted}
            reduced={reduced}
            cover={cover}
            opening={opening}
          />
          <CurtainHalf
            side="right"
            parted={parted}
            reduced={reduced}
            cover={cover}
            opening={opening}
          />

          <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_42px_rgba(0,0,0,0.45)]" />

          {showControls && video && (
            <div className="absolute left-1/2 top-2 z-30 flex max-w-[calc(100%-0.75rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2 py-1.5 shadow-lg backdrop-blur-md">
              {VIDEOS.length > 1 && (
                <button
                  type="button"
                  data-stage-prev
                  onClick={() => go(-1)}
                  className="h-11 min-w-11 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-amber-200/80"
                >
                  Prev
                </button>
              )}
              <span className="max-w-[7.5rem] truncate px-1 text-[11px] uppercase tracking-[0.14em] text-white/70 sm:max-w-[14rem]">
                {video.title}
              </span>
              {VIDEOS.length > 1 && (
                <span className="text-[10px] text-white/40">
                  {index + 1} of {VIDEOS.length}
                </span>
              )}
              {VIDEOS.length > 1 && (
                <button
                  type="button"
                  data-stage-next
                  onClick={() => go(1)}
                  className="h-11 min-w-11 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85 hover:bg-white/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-amber-200/80"
                >
                  Next
                </button>
              )}
              <button
                type="button"
                data-stage-close
                onClick={beginClose}
                className="h-11 min-w-11 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-100/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-amber-200/80"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
