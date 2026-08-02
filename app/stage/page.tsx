"use client";

import Background from "@/components/layout/Background";

export default function StagePage() {
  return (
    <div className="relative w-full min-h-[calc(100dvh-var(--header-height))] animate-pageEnter">
      <Background image="/images/stage/skylounge-stage_master_4k.png" />
    </div>
  );
}
