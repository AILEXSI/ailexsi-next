"use client";

interface GalleryCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export default function GalleryCategories({ onSelectCategory }: GalleryCategoriesProps) {
  const categories = [
    "Art",
    "Audiobooks",
    "Books",
    "Movies",
    "Music",
    "Poster",
    "Sticker",
    "Rejeckt",
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3 sm:gap-4 sm:p-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelectCategory(cat)}
          className="
            w-full rounded-lg border border-white/20 bg-black/40
            p-4 text-left text-base font-medium text-white
            transition hover:bg-black/60 sm:text-lg
          "
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
