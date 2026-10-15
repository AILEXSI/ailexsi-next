"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type YouTubeHandle = {
  play: () => void;
  stop: () => void;
};

type YouTubePlayer = {
  playVideo: () => void;
  stopVideo: () => void;
  destroy: () => void;
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      width?: string;
      height?: string;
      host?: string;
      playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (event: { target: YouTubePlayer }) => void;
          onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
          onError?: (event: { data: number; target: YouTubePlayer }) => void;
        };
    }
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error("YouTube API failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

type YouTubeStageProps = {
  videoId: string;
  title: string;
  active: boolean;
  onEnded: () => void;
  onError?: () => void;
};

/** YouTube IFrame API player. Falls back to a plain embed if the API cannot load. */
const YouTubeStage = forwardRef<YouTubeHandle, YouTubeStageProps>(
  function YouTubeStage({ videoId, title, active, onEnded, onError }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const onEndedRef = useRef(onEnded);
    const onErrorRef = useRef(onError);
    const activeRef = useRef(active);
    const playedRef = useRef(false);
    const [fallback, setFallback] = useState(false);

    useEffect(() => {
      onEndedRef.current = onEnded;
    }, [onEnded]);

    useEffect(() => {
      onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
      activeRef.current = active;
    }, [active]);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo(),
      stop: () => playerRef.current?.stopVideo(),
    }));

    useEffect(() => {
      let cancelled = false;
      const failTimer = window.setTimeout(() => {
        if (!cancelled && !window.YT?.Player) setFallback(true);
      }, 7000);

      loadYouTubeApi()
        .then(() => {
          if (cancelled || !hostRef.current || !window.YT?.Player) return;
          window.clearTimeout(failTimer);
          playerRef.current = new window.YT.Player(hostRef.current, {
            videoId,
            width: "100%",
            height: "100%",
            host: "https://www.youtube-nocookie.com",
            playerVars: {
              autoplay: activeRef.current ? 1 : 0,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: (event) => {
                if (activeRef.current) event.target.playVideo();
              },
              onStateChange: (event) => {
                // 1 is playing, 0 is ended. Ignore a spurious ended before playback.
                if (event.data === 1) playedRef.current = true;
                if (event.data === 0 && playedRef.current) onEndedRef.current();
              },
              onError: () => onErrorRef.current?.(),
            },
          });
        })
        .catch(() => {
          if (!cancelled) setFallback(true);
        });

      return () => {
        cancelled = true;
        window.clearTimeout(failTimer);
        try {
          playerRef.current?.destroy();
        } catch {
          /* player already removed */
        }
        playerRef.current = null;
      };
    }, [videoId]);

    if (fallback) {
      const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      return (
        <iframe
          title={title}
          src={src}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      );
    }

    return (
      <div className="stage-youtube h-full w-full">
        <div ref={hostRef} className="h-full w-full" />
      </div>
    );
  }
);

export default YouTubeStage;
