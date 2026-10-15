"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import {
  SOUNDCLOUD_PROFILE_URL,
  isSoundCloudArtworkUrl,
  isSoundCloudStreamUrl,
  isSoundCloudTrackPage,
  type StudioTrack,
} from "@/lib/studio-tracks";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; tracks: StudioTrack[] }
  | { status: "error" };

function formatPublished(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function Artwork({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed || !isSoundCloudArtworkUrl(src)) {
    return (
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-amber-200/25 bg-gradient-to-br from-amber-950/80 to-black"
      >
        <span className="h-3.5 w-3.5 rounded-full border border-amber-200/60" />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={88}
      height={88}
      className="h-11 w-11 shrink-0 rounded-md object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function PlayGlyph({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" aria-hidden>
        <rect x="1.5" y="1" width="3" height="10" rx="0.6" fill="currentColor" />
        <rect x="7.5" y="1" width="3" height="10" rx="0.6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" className="ml-0.5 h-3.5 w-3.5" aria-hidden>
      <path d="M2.2 1.2v9.6L10.6 6 2.2 1.2z" fill="currentColor" />
    </svg>
  );
}

export default function StudioTracks() {
  const [load, setLoad] = useState<LoadState>({ status: "loading" });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failedId, setFailedId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const seekId = useId();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/studio/tracks", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`tracks ${response.status}`);
        return response.json() as Promise<{ ok?: boolean; tracks?: StudioTrack[] }>;
      })
      .then((data) => {
        const tracks = Array.isArray(data.tracks) ? data.tracks : [];
        const safe = tracks.filter(
          (track) =>
            track &&
            typeof track.id === "string" &&
            typeof track.title === "string" &&
            isSoundCloudTrackPage(track.pageUrl) &&
            isSoundCloudStreamUrl(track.streamUrl)
        );
        if (!data.ok || safe.length === 0) {
          setLoad({ status: "error" });
          return;
        }
        setLoad({ status: "ready", tracks: safe.slice(0, 5) });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoad({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.setAttribute("referrerpolicy", "no-referrer");
    const dialog = rootRef.current?.closest("[role='dialog']");
    if (!dialog) return () => audio?.pause();
    const pauseIfClosed = () => {
      if (dialog.getAttribute("aria-hidden") === "true") {
        audio?.pause();
      }
    };
    const observer = new MutationObserver(pauseIfClosed);
    observer.observe(dialog, { attributes: true, attributeFilter: ["aria-hidden"] });
    return () => {
      observer.disconnect();
      audio?.pause();
    };
  }, []);

  async function toggle(track: StudioTrack) {
    const audio = audioRef.current;
    if (!audio || !isSoundCloudStreamUrl(track.streamUrl)) return;

    if (currentId === track.id && audio.src) {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      try {
        await audio.play();
        setFailedId(null);
      } catch {
        setFailedId(track.id);
      }
      return;
    }

    setFailedId(null);
    setProgress(0);
    setCurrentId(track.id);
    audio.dataset.trackId = track.id;
    audio.src = track.streamUrl;
    try {
      await audio.play();
    } catch {
      setFailedId(track.id);
    }
  }

  function onSeek(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = (value / 1000) * audio.duration;
    setProgress(value / 1000);
  }

  return (
    <section
      ref={rootRef}
      className="mt-6 max-w-xl border-t border-amber-100/15 pt-4"
      aria-label="Latest tracks"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-100/70">
          Latest tracks
        </h3>
        <a
          href={SOUNDCLOUD_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[11px] tracking-wide text-amber-100/70 underline-offset-2 hover:text-amber-50 hover:underline"
        >
          Ailexsi Monday
        </a>
      </div>

      {load.status === "loading" && (
        <ul className="mt-3 space-y-2" aria-hidden>
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="h-14 animate-pulse rounded-lg bg-white/5" />
          ))}
        </ul>
      )}

      {load.status === "error" && (
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Latest tracks are unavailable right now.{" "}
          <a
            href={SOUNDCLOUD_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-100/80 underline-offset-2 hover:text-amber-50 hover:underline"
          >
            Open the SoundCloud profile
          </a>
          .
        </p>
      )}

      {load.status === "ready" && (
        <ol className="mt-3 space-y-1.5">
          {load.tracks.map((track) => {
            const isCurrent = currentId === track.id;
            const isPlaying = isCurrent && playing;
            const meta = [formatPublished(track.publishedAt), track.durationLabel]
              .filter(Boolean)
              .join(" · ");
            return (
              <li
                key={track.id}
                className="rounded-lg bg-black/45 px-2 py-2 sm:px-2.5"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <Artwork src={track.artworkUrl} />
                  <div className="min-w-0 flex-1">
                    <a
                      href={track.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${track.title} on SoundCloud`}
                      className="block truncate text-sm text-white/90 hover:text-amber-100"
                    >
                      {track.title}
                    </a>
                    {meta && <p className="mt-0.5 truncate text-[11px] text-white/45">{meta}</p>}
                    {failedId === track.id && (
                      <p className="mt-0.5 text-[11px] text-amber-100/70">
                        Couldn&apos;t play here — use the title to open SoundCloud.
                      </p>
                    )}
                    {isCurrent && (
                      <label className="mt-2 block">
                        <span className="sr-only" id={`${seekId}-${track.id}`}>
                          Playback position for {track.title}
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={1000}
                          value={Math.round(progress * 1000)}
                          aria-labelledby={`${seekId}-${track.id}`}
                          className="studio-seek w-full"
                          onChange={(event) => onSeek(Number(event.target.value))}
                        />
                      </label>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void toggle(track)}
                    aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    aria-pressed={isPlaying}
                    className="
                      flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                      border border-amber-200/40 bg-black/50 text-amber-100
                      transition duration-300
                      hover:border-amber-100/80 hover:shadow-[0_0_16px_rgba(232,196,140,0.35)]
                      focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
                      focus-visible:outline-cyan-400/50
                    "
                  >
                    <PlayGlyph playing={isPlaying} />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Press play to stream from SoundCloud. Nothing is loaded from SoundCloud until then.
      </p>

      <audio
        ref={audioRef}
        preload="none"
        className="hidden"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(1);
        }}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (!audio || !audio.duration) return;
          setProgress(audio.currentTime / audio.duration);
        }}
        onError={() => {
          setPlaying(false);
          setFailedId(audioRef.current?.dataset.trackId ?? currentId);
        }}
      />
    </section>
  );
}
