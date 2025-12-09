"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import ModalPageContent from "@/components/modals/ModalPageContent";

import LandingContent from "@/components/content/LandingContent";
import VisionContent from "@/components/content/VisionContent";
import SkyloungeContent from "@/components/content/SkyloungeContent";
import SkyloungeBarContent from "@/components/content/SkyloungeBarContent";
import StageContent from "@/components/content/StageContent";
import StudioContent from "@/components/content/StudioContent";
import GalleryContent from "@/components/content/GalleryContent";
import HeartspaceContent from "@/components/content/HeartspaceContent";
import ShopContent from "@/components/content/ShopContent";

export default function PortalProvider() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  const key = pathname.replace("/", "") || "landing";

  function getContent() {
    switch (key) {
      case "vision":
        return <VisionContent />;
      case "skylounge":
        return <SkyloungeContent />;
      case "skyloungebar":
        return <SkyloungeBarContent />;
      case "stage":
        return <StageContent />;
      case "studio":
        return <StudioContent />;
      case "gallery":
        return <GalleryContent />;
      case "heartspace":
        return <HeartspaceContent />;
      case "shop":
        return <ShopContent />;
      default:
        return <LandingContent />;
    }
  }

  /* -------------------------------------------------------- */
  /* GLOBAL UI FUNCTIONS (für Header & InfinityButton)         */
  /* -------------------------------------------------------- */
  useEffect(() => {
    // Toggle: öffnet oder schließt das Modal
    (window as any).AILEXSI_PORTAL_TOGGLE = () => {
      setOpen((prev) => !prev);
    };

    // Optional: reines Öffnen
    (window as any).AILEXSI_PORTAL_OPEN = () => {
      setOpen(true);
    };

    // Optional: reines Schließen
    (window as any).AILEXSI_PORTAL_CLOSE = () => {
      setOpen(false);
    };
  }, []);

  /* -------------------------------------------------------- */
  /* GLOBAL UI STATE EXPORT (verfügbar für Header.tsx)         */
  /* -------------------------------------------------------- */
  useEffect(() => {
    (window as any).AILEXSI_PORTAL_STATE = open;
  }, [open]);

  /* -------------------------------------------------------- */
  /* OPTIONAL: Scroll-Lock wenn Modal offen                    */
  /* -------------------------------------------------------- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <ModalPageContent isOpen={open} onClose={() => setOpen(false)}>
      {getContent()}
    </ModalPageContent>
  );
}
