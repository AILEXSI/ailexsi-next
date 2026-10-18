import { unstable_cache } from "next/cache";
import { parseSoundCloudRss } from "./parse-soundcloud-rss";
import { SOUNDCLOUD_TRACKS_RSS } from "./studio-tracks";

const HOUR_SECONDS = 60 * 60;

async function loadLatestStudioTracks() {
  const response = await fetch(SOUNDCLOUD_TRACKS_RSS, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, */*",
      "User-Agent": "AilexsiStudio/1.0 (+https://www.ailexsi.com)",
    },
  });
  if (!response.ok) {
    throw new Error(`SoundCloud RSS responded ${response.status}`);
  }
  const xml = await response.text();
  const tracks = parseSoundCloudRss(xml);
  if (tracks.length === 0) {
    throw new Error("SoundCloud RSS contained no playable tracks");
  }
  return tracks;
}

/**
 * Hourly cache. Failures throw and are not stored, so a down feed is retried
 * on the next request instead of sticking for the full hour.
 * The cache key changes when the displayed title shape changes.
 */
export const getLatestStudioTracks = unstable_cache(
  loadLatestStudioTracks,
  ["ailexsi-monday-latest-tracks-v2"],
  { revalidate: HOUR_SECONDS }
);
