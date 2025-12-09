"use client";

import { useEffect, useState } from "react";
import Background from "@/components/layout/Background";

export default function LandingPage() {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("ailexsi_landing_seen");

    if (hasVisited) {
      setVisited(true);
    } else {
      localStorage.setItem("ailexsi_landing_seen", "true");
    }
  }, []);

  const image = visited
    ? "/images/landing/your-second-landing-image.png"
    : "/images/landing/hero-master_4k.png";

  return (
    <div className="relative w-full min-h-screen">
      <Background image={image} />

      {/* FÜLLER – zwingt die Seite, Platz einzunehmen */}
      <div className="w-full h-[calc(100vh-70px)]" />
    </div>
  );
}
