"use client";

import { useState } from "react";
import GalleryCategories from "./GalleryCategories";
import GalleryFiles from "./GalleryFiles";

export default function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div
      className="
        space-y-5 sm:space-y-6 rounded-xl border border-white/10
        bg-black/60 p-4 sm:p-6 text-white backdrop-blur-sm
      "
      style={{
        backgroundImage: "url(/images/content/gallery/gallery_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {selectedCategory === null && (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            Skylounge Gallery — Explore the Archives
          </h2>

          <GalleryCategories onSelectCategory={setSelectedCategory} />
        </>
      )}

      {selectedCategory !== null && (
        <GalleryFiles
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
