import rawVideos from "@/data/stage-videos.json";

export type StageMp4 = {
  id: string;
  title: string;
  source: "mp4";
  src: string;
};

export type StageYouTube = {
  id: string;
  title: string;
  source: "youtube";
  youtubeId: string;
};

export type StageVideo = StageMp4 | StageYouTube;

type RawVideo = {
  id?: string;
  title?: string;
  source?: string;
  src?: string;
  youtubeId?: string;
};

function isStageVideo(item: RawVideo): item is StageVideo {
  if (!item.id || !item.title) return false;
  if (item.source === "mp4" && item.src) return true;
  if (item.source === "youtube" && item.youtubeId) return true;
  return false;
}

/** Editable list: `data/stage-videos.json`. */
export function loadStageVideos(): StageVideo[] {
  return (rawVideos as RawVideo[]).filter(isStageVideo);
}
