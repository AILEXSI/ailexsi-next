import {
  STUDIO_TRACK_LIMIT,
  displayTrackTitle,
  isSoundCloudArtworkUrl,
  isSoundCloudStreamUrl,
  isSoundCloudTrackPage,
  type StudioTrack,
} from "./studio-tracks.ts";

function decodeXml(value: string): string {
  const withoutCdata = value.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1");
  return withoutCdata
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tagText(block: string, tag: string): string {
  const match = block.match(
    new RegExp(`<${escapeRegExp(tag)}\\b[^>]*>([\\s\\S]*?)</${escapeRegExp(tag)}>`, "i")
  );
  return match ? decodeXml(match[1].trim()) : "";
}

function tagAttr(block: string, tag: string, attr: string): string {
  const tagMatch = block.match(new RegExp(`<${escapeRegExp(tag)}\\b[^>]*>`, "i"));
  if (!tagMatch) return "";
  const attrMatch = tagMatch[0].match(new RegExp(`${escapeRegExp(attr)}="([^"]*)"`, "i"));
  return attrMatch ? decodeXml(attrMatch[1]) : "";
}

function formatDuration(raw: string): string {
  const parts = raw.split(":").map((part) => part.trim());
  let seconds = 0;
  if (parts.length === 3) {
    seconds = Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
  } else if (parts.length === 2) {
    seconds = Number(parts[0]) * 60 + Number(parts[1]);
  } else if (parts.length === 1 && parts[0]) {
    seconds = Number(parts[0]);
  }
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ss = secs.toString().padStart(2, "0");
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${ss}`;
  return `${minutes}:${ss}`;
}

function artworkThumb(url: string): string {
  return url
    .replace(/-t\d+x\d+(?=\.)/, "-t500x500")
    .replace(/-original(?=\.)/, "-t500x500");
}

export function parseSoundCloudRss(xml: string, limit = STUDIO_TRACK_LIMIT): StudioTrack[] {
  const tracks: StudioTrack[] = [];
  const items = xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi);
  for (const item of items) {
    if (tracks.length >= limit) break;
    const block = item[1];
    const title = tagText(block, "title");
    const pageUrl = tagText(block, "link");
    const streamUrl = tagAttr(block, "enclosure", "url");
    const publishedRaw = tagText(block, "pubDate");
    const publishedMs = Date.parse(publishedRaw);
    if (!title || !isSoundCloudTrackPage(pageUrl) || !isSoundCloudStreamUrl(streamUrl)) {
      continue;
    }
    if (!Number.isFinite(publishedMs)) continue;

    const artworkRaw = tagAttr(block, "itunes:image", "href");
    const artworkUrl =
      artworkRaw && isSoundCloudArtworkUrl(artworkRaw) ? artworkThumb(artworkRaw) : null;
    const idMatch = streamUrl.match(/\/stream\/(\d+)-/);
    const id = idMatch?.[1] ?? pageUrl;

    tracks.push({
      id,
      title: displayTrackTitle(title),
      pageUrl,
      streamUrl,
      artworkUrl,
      durationLabel: formatDuration(tagText(block, "itunes:duration")),
      publishedAt: new Date(publishedMs).toISOString(),
    });
  }
  return tracks;
}
