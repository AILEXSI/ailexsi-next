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
    "Rejeckt" // deiner bleibt ;)
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className="
            w-full text-left 
            bg-black/40 hover:bg-black/60 
            p-4 rounded-lg 
            border border-white/20
            text-white text-lg font-medium
            transition
          "
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
