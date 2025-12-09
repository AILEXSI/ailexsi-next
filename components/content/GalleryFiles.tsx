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

  const currentIndex = selectedFile ? files.indexOf(selectedFile) : -1;

  const showNext = () => {
    if (currentIndex < files.length - 1)
      setSelectedFile(files[currentIndex + 1]);
  };

  const showPrev = () => {
    if (currentIndex > 0)
      setSelectedFile(files[currentIndex - 1]);
  };

  // Dateien dynamisch laden
  useEffect(() => {
    async function loadFiles() {
      const res = await fetch(`/api/gallery/${category}`);
      const data = await res.json();
      setFiles(data.files);
    }
    loadFiles();
  }, [category]);

  return (
    <div
      className="
        p-6 rounded-xl
        bg-black/60
        backdrop-blur-sm
        border border-white/10
        space-y-6 text-white
      "
    >
      {/* Back Button */}
      {!selectedFile && (
        <button
          onClick={onBack}
          className="
            text-white/70 hover:text-white
            border border-white/20 px-3 py-1
            rounded-md hover:bg-white/10 transition
          "
        >
          ← Back to Categories
        </button>
      )}

      {/* File Grid */}
      {!selectedFile && (
        <>
          <h2 className="text-2xl font-semibold">{category} — Files</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((src) => (
              <div
                key={src}
                onClick={() => setSelectedFile(src)}
                className="
                  bg-black/40 p-2 rounded-lg border border-white/20
                  hover:bg-black/60 transition cursor-pointer
                  flex items-center justify-center
                "
              >
                {/* Thumbnail */}
                {src.match(/\.(mp4|mov|webm)$/i) ? (
                  <video
                    src={src}
                    className="w-full h-full object-cover rounded"
                    muted
                  />
                ) : src.match(/\.(mp3|wav|ogg)$/i) ? (
                  <div className="text-center text-xs">Audio File</div>
                ) : src.match(/\.pdf$/i) ? (
                  <div className="text-center text-xs">PDF File</div>
                ) : (
                  <img
                    src={src}
                    alt={src}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Viewer */}
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
