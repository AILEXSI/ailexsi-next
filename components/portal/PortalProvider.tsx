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
  /* GLOBAL PORTAL STATE – SINGLE SOURCE OF TRUTH              */
  /* -------------------------------------------------------- */
  useEffect(() => {
    (window as any).AILEXSI_PORTAL_OPEN = () => {
      setOpen(true);
      (window as any).AILEXSI_PORTAL_STATE = true;
    };

    (window as any).AILEXSI_PORTAL_CLOSE = () => {
      setOpen(false);
      (window as any).AILEXSI_PORTAL_STATE = false;
    };

    (window as any).AILEXSI_PORTAL_TOGGLE = () => {
      const next = !(window as any).AILEXSI_PORTAL_STATE;
      setOpen(next);
      (window as any).AILEXSI_PORTAL_STATE = next;
    };
  }, []);

  /* -------------------------------------------------------- */
  /* ROUTE CHANGE → ALWAYS CLOSE PORTAL                        */
  /* -------------------------------------------------------- */
  useEffect(() => {
    (window as any).AILEXSI_PORTAL_CLOSE?.();
  }, [pathname]);

  /* -------------------------------------------------------- */
  /* SCROLL LOCK                                              */
  /* -------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <ModalPageContent
      isOpen={open}
      onClose={() => (window as any).AILEXSI_PORTAL_CLOSE?.()}
    >
      {getContent()}
    </ModalPageContent>
  );
}
