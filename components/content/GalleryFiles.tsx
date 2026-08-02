"use client";

import { useEffect, useState } from "react";
import GalleryViewer from "./GalleryViewer";

interface GalleryFilesProps {
  category: string;
  onBack: () => void;
}

export default function GalleryFiles({ category, onBack }: GalleryFilesProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isMusic = category.toLowerCase() === "music";
  const currentIndex = selectedFile ? files.indexOf(selectedFile) : -1;

  const showNext = () => {
    if (currentIndex < files.length - 1) setSelectedFile(files[currentIndex + 1]);
  };

  const showPrev = () => {
    if (currentIndex > 0) setSelectedFile(files[currentIndex - 1]);
  };

  useEffect(() => {
    async function loadFiles() {
      setLoading(true);
      try {
        const res = await fetch(`/api/gallery/${encodeURIComponent(category)}`);
        const data = await res.json();
        setFiles(Array.isArray(data.files) ? data.files : []);
      } catch {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    }
    loadFiles();
  }, [category]);

  return (
    <div className="space-y-6 rounded-xl border border-white/10 bg-black/60 p-6 text-white backdrop-blur-sm">
      {!selectedFile && (
        <button
          type="button"
          onClick={onBack}
          className="
            rounded-md border border-white/20 px-3 py-1
            text-white/70 transition
            hover:bg-white/10 hover:text-white
          "
        >
          ← Back to Categories
        </button>
      )}

      {!selectedFile && (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isMusic ? "Music" : `${category} — Files`}
          </h2>

          {/* Music: official orange SoundCloud logo link */}
          {isMusic && (
            <a
              href="https://soundcloud.com/ailexsi-monday"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group inline-flex items-center gap-4 rounded-xl
                border border-white/15 bg-black/50 px-5 py-4
                transition
                hover:border-[#FF5500]/50 hover:bg-black/70
                hover:drop-shadow-[0_0_16px_rgba(255,85,0,0.25)]
              "
              title="SoundCloud — AILEXSI Monday"
              aria-label="Open SoundCloud AILEXSI Monday"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/studio/logos/soundcloud.svg"
                alt="SoundCloud"
                width={48}
                height={48}
                className="h-12 w-12 object-contain transition group-hover:brightness-110"
              />
              <span className="text-sm tracking-wide text-white/80">
                soundcloud.com/ailexsi-monday
                <span className="ml-2 text-[#FF5500]/70 transition group-hover:text-[#FF5500]">
                  ↗
                </span>
              </span>
            </a>
          )}

          {loading && <p className="text-sm text-white/45">Loading…</p>}

          {!loading && files.length === 0 && !isMusic && (
            <p className="text-sm text-white/50">No files in this archive yet.</p>
          )}

          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {files.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setSelectedFile(src)}
                  className="
                    flex cursor-pointer items-center justify-center
                    rounded-lg border border-white/20 bg-black/40 p-2
                    transition hover:bg-black/60
                  "
                >
                  {src.match(/\.(mp4|mov|webm)$/i) ? (
                    <video
                      src={src}
                      className="h-full w-full rounded object-cover"
                      muted
                      playsInline
                    />
                  ) : src.match(/\.(mp3|wav|ogg)$/i) ? (
                    <div className="text-center text-xs text-white/60">Audio</div>
                  ) : src.match(/\.pdf$/i) ? (
                    <div className="text-center text-xs text-white/60">PDF</div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full rounded object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedFile && (
        <GalleryViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}
    </div>
  );
}
