"use client";

import Background from "@/components/layout/Background";

/** Immersive Studio: full background only. Music links live in the ∞ content layer. */
export default function StudioPage() {
  return (
    <div className="relative w-full min-h-screen">
      <Background image="/images/studio/studio_master_4k.png" />
    </div>
  );
}
