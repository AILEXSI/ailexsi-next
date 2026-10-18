/** Public SoundCloud profile for the Studio portal. Single x: ailexsi-monday. */
export const SOUNDCLOUD_PROFILE_URL = "https://soundcloud.com/ailexsi-monday";

/**
 * Official public RSS (no API key). User id is stable if the permalink changes.
 * https://feeds.soundcloud.com/users/soundcloud:users:1611409515/sounds.rss
 */
export const SOUNDCLOUD_TRACKS_RSS =
  "https://feeds.soundcloud.com/users/soundcloud:users:1611409515/sounds.rss";

export const STUDIO_TRACK_LIMIT = 5;

/**
 * SoundBoost masters are uploaded with a trailing "Mastered-File" label.
 * Hide that suffix in the portal. SoundCloud permalinks stay as published.
 * Separators around the words may be spaces or hyphens, in any case.
 */
const MASTERED_FILE_SUFFIX = /[\s-]*mastered[\s-]*file[\s-]*$/i;

export function displayTrackTitle(title: string): string {
  const stripped = title.replace(MASTERED_FILE_SUFFIX, "").trim();
  return stripped.length > 0 ? stripped : title.trim();
}

export type StudioTrack = {
  id: string;
  title: string;
  pageUrl: string;
  streamUrl: string;
  artworkUrl: string | null;
  durationLabel: string;
  publishedAt: string;
};

export function isSoundCloudTrackPage(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "soundcloud.com" &&
      parsed.pathname.startsWith("/ailexsi-monday/")
    );
  } catch {
    return false;
  }
}

/** Stable podcast enclosure. The browser follows a short-lived redirect at play time. */
export function isSoundCloudStreamUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === "feeds.soundcloud.com" &&
      parsed.pathname.startsWith("/stream/") &&
      parsed.pathname.endsWith(".mp3")
    );
  } catch {
    return false;
  }
}

export function isSoundCloudArtworkUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && /(^|\.)sndcdn\.com$/.test(parsed.hostname);
  } catch {
    return false;
  }
}
