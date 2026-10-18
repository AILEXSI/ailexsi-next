import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { displayTrackTitle } from "./studio-tracks.ts";
import { parseSoundCloudRss } from "./parse-soundcloud-rss.ts";

describe("displayTrackTitle", () => {
  it("strips a hyphenated Mastered-File suffix", () => {
    assert.equal(
      displayTrackTitle("Lai Lee Luu Lyric Seed English-Mastered-File"),
      "Lai Lee Luu Lyric Seed English"
    );
  });

  it("strips a spaced Mastered File suffix", () => {
    assert.equal(
      displayTrackTitle("We rerefuse We are the grid - Mastered File"),
      "We rerefuse We are the grid"
    );
  });

  it("is case-insensitive and ignores extra spaces and hyphens", () => {
    assert.equal(displayTrackTitle("We refuse  -- MASTERED - file  "), "We refuse");
    assert.equal(displayTrackTitle("Chapter X-mastered-file"), "Chapter X");
  });

  it("leaves titles without that trailing suffix unchanged", () => {
    assert.equal(displayTrackTitle("Before the Next Dawn"), "Before the Next Dawn");
    assert.equal(displayTrackTitle("The Mastered-File Sessions"), "The Mastered-File Sessions");
  });

  it("keeps a title that is only the suffix", () => {
    assert.equal(displayTrackTitle("-Mastered-File"), "-Mastered-File");
  });
});

describe("parseSoundCloudRss display titles", () => {
  const xml = `<?xml version="1.0"?>
    <rss><channel>
      <item>
        <title>We refuse-Mastered-File</title>
        <link>https://soundcloud.com/ailexsi-monday/we-refuse-mastered-file</link>
        <pubDate>Mon, 12 Oct 2026 17:42:04 +0000</pubDate>
        <itunes:duration>00:07:12</itunes:duration>
        <enclosure type="audio/mpeg" url="https://feeds.soundcloud.com/stream/2417796699-ailexsi-monday-we-refuse-mastered-file.mp3"/>
        <itunes:image href="https://i1.sndcdn.com/artworks-example-t3000x3000.jpg"/>
      </item>
    </channel></rss>`;

  it("strips the suffix for display and keeps the SoundCloud link", () => {
    const [track] = parseSoundCloudRss(xml);
    assert.equal(track.title, "We refuse");
    assert.equal(track.pageUrl, "https://soundcloud.com/ailexsi-monday/we-refuse-mastered-file");
    assert.equal(
      track.streamUrl,
      "https://feeds.soundcloud.com/stream/2417796699-ailexsi-monday-we-refuse-mastered-file.mp3"
    );
  });
});
