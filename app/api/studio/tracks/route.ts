import { NextResponse } from "next/server";
import { getLatestStudioTracks } from "@/lib/soundcloud-feed";
import { SOUNDCLOUD_PROFILE_URL } from "@/lib/studio-tracks";

export async function GET() {
  try {
    const tracks = await getLatestStudioTracks();
    return NextResponse.json(
      { ok: true as const, profileUrl: SOUNDCLOUD_PROFILE_URL, tracks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("Studio SoundCloud feed unavailable", error);
    return NextResponse.json(
      { ok: false as const, profileUrl: SOUNDCLOUD_PROFILE_URL, tracks: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
