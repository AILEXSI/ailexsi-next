"use client";

interface BackgroundProps {
  image: string;
}

export default function Background({ image }: BackgroundProps) {
  return (
    <div
      className="
        fixed
        inset-0
        top-[70px]
        -z-10
        bg-black
      "
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
