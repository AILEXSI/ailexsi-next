"use client";

import { useState } from "react";
import GalleryCategories from "./GalleryCategories";
import GalleryFiles from "./GalleryFiles";

export default function GalleryContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div
      className="
        p-6 rounded-xl
        bg-black/60
        backdrop-blur-sm
        border border-white/10
        text-white
        space-y-6
      "
      style={{
        backgroundImage: "url(/images/content/gallery/gallery_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >

      {/* Wenn keine Kategorie gewählt ist → Kategorien anzeigen */}
      {selectedCategory === null && (
        <>
          <h2 className="text-2xl font-semibold">
            Skylounge Gallery — Explore the Archives
          </h2>

          <GalleryCategories onSelectCategory={setSelectedCategory} />

          <div className="mt-8 bg-black/50 p-4 rounded-md">
            <p>CONTENT still in Orbit — Full Gallery unlocking soon ;)</p>
          </div>
        </>
      )}

      {/* Wenn Kategorie gewählt ist → Files anzeigen */}
      {selectedCategory !== null && (
        <GalleryFiles 
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )}

    </div>
  );
}
