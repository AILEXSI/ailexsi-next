"use client";

import { useSyncExternalStore } from "react";
import Background from "@/components/layout/Background";

const STORAGE_KEY = "ailexsi_landing_seen";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export default function LandingPage() {
  const visited = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (typeof window !== "undefined" && !visited) {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore quota / private mode */
    }
  }

  const image = visited
    ? "/images/landing/your-second-landing-image.png"
    : "/images/landing/hero-master_4k.png";

  return (
    <div className="relative w-full min-h-screen">
      <Background image={image} />
      <div className="w-full h-[calc(100vh-70px)]" />
    </div>
  );
}
