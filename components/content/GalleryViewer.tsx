"use client";

import { useState } from "react";

interface GalleryViewerProps {
  file: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryViewer({ file, onClose, onNext, onPrev }: GalleryViewerProps) {

  // File Type Checks
  const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isVideo = file.match(/\.(mp4|mov|webm)$/i);
  const isAudio = file.match(/\.(mp3|wav|ogg)$/i);
  const isPDF   = file.match(/\.pdf$/i);

  // PDF Controls
  const [pdfPage, setPdfPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [spread, setSpread] = useState(false);

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/80 backdrop-blur-md
        flex items-center justify-center
        animate-fadeIn
      "
      onClick={onClose}
    >
      {/* CONTAINER */}
      <div
        className="
          relative max-w-[90vw] w-[90%] max-h-[90vh]
          bg-black/70 border border-white/20
          rounded-xl shadow-2xl overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-white/70 hover:text-white
            bg-black/30 border border-white/20
            px-3 py-1 rounded-md
          "
        >
          Close
        </button>

        {/* PREV */}
        <button
          onClick={onPrev}
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            text-4xl text-white/50 hover:text-white
          "
        >
          ⇦
        </button>

        {/* NEXT */}
        <button
          onClick={onNext}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-4xl text-white/50 hover:text-white
          "
        >
          ⇨
        </button>


        {/* CONTENT */}
        <div className="flex flex-col items-center justify-center h-full p-6 gap-4">

          {/* ---------------- IMAGE ---------------- */}
          {isImage && (
            <img
              src={file}
              alt={file}
              className="max-h-[80vh] object-contain rounded-lg"
            />
          )}

          {/* ---------------- VIDEO ---------------- */}
          {isVideo && (
            <video
              src={file}
              controls
              autoPlay
              className="max-h-[80vh] rounded-lg"
            />
          )}

          {/* ---------------- AUDIO ---------------- */}
          {isAudio && (
            <audio
              src={file}
              controls
              autoPlay
              className="w-full"
            />
          )}

          {/* ---------------- PDF ---------------- */}
          {isPDF && (
            <div className="w-full h-[80vh] flex flex-col items-center gap-4">
              
              {/* PDF CONTROLS */}
              <div className="flex items-center gap-4 text-white">

                {/* Prev Page */}
                <button
                  onClick={() => setPdfPage(Math.max(1, pdfPage - 1))}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded hover:bg-white/10"
                >
                  ⇦
                </button>

                {/* Page Label */}
                <span className="text-lg">
                  Page {pdfPage}
                </span>

                {/* Next Page */}
                <button
                  onClick={() => setPdfPage(pdfPage + 1)}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded hover:bg-white/10"
                >
                  ⇨
                </button>

                {/* Zoom Out */}
                <button
                  onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded hover:bg-white/10"
                >
                  –
                </button>

                <span>{Math.round(zoom * 100)}%</span>

                {/* Zoom In */}
                <button
                  onClick={() => setZoom(zoom + 0.1)}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded hover:bg-white/10"
                >
                  +
                </button>

                {/* Toggle Spread */}
                <button
                  onClick={() => setSpread(!spread)}
                  className="px-3 py-1 bg-black/40 border border-white/20 rounded hover:bg-white/10"
                >
                  {spread ? "Single Page" : "Two Pages"}
                </button>
              </div>


              {/* PDF VIEWING AREA */}
              <div className="flex gap-4 justify-center w-full h-full overflow-auto">

                {/* LEFT PAGE */}
                <iframe
                  src={`${file}#page=${pdfPage}`}
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    width: spread ? "45%" : "90%",
                    height: "90vh",
                    border: "none",
                    background: "black"
                  }}
                />

                {/* RIGHT PAGE (SPREAD MODE) */}
                {spread && (
                  <iframe
                    src={`${file}#page=${pdfPage + 1}`}
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      width: "45%",
                      height: "90vh",
                      border: "none",
                      background: "black"
                    }}
                  />
                )}
              </div>


              {/* THUMBNAILS */}
              <div className="w-full flex overflow-x-auto gap-2 p-2 bg-black/30 border-t border-white/10">
                {[...Array(10)].map((_, i) => (
                  <iframe
                    key={i}
                    src={`${file}#page=${i + 1}`}
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                      width: "80px",
                      height: "120px",
                      transform: "scale(0.2)",
                      transformOrigin: "top left",
                      border: "1px solid rgba(255,255,255,0.2)",
                      cursor: "pointer"
                    }}
                    onClick={() => setPdfPage(i + 1)}
                  />
                ))}
              </div>

            </div>
          )}


          {/* ---------------- FALLBACK ---------------- */}
          {!isImage && !isVideo && !isAudio && !isPDF && (
            <p className="text-white text-center">
              File type not supported yet.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

