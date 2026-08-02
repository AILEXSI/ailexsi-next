"use client";

interface BackgroundProps {
  image: string;
}

/**
 * Full-bleed cinematic backdrop under the fixed header.
 * Uses cover so portrait and landscape both fill the viewport without letterboxing.
 */
export default function Background({ image }: BackgroundProps) {
  return (
    <div
      className="ailexsi-bg fixed inset-0 top-[var(--header-height)] -z-10 bg-black"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      aria-hidden
    />
  );
}
