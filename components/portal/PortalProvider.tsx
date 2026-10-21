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
import StromrechnerContent from "@/components/content/StromrechnerContent";

export default function PortalProvider() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const segment = pathname.replace(/^\//, "").split("/")[0] || "landing";

  function getContent() {
    switch (segment) {
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
      case "stromrechner":
        return <StromrechnerContent />;
      default:
        return <LandingContent />;
    }
  }

  useEffect(() => {
    const w = window as unknown as {
      AILEXSI_PORTAL_OPEN?: () => void;
      AILEXSI_PORTAL_CLOSE?: () => void;
      AILEXSI_PORTAL_TOGGLE?: () => void;
      AILEXSI_PORTAL_STATE?: boolean;
    };

    w.AILEXSI_PORTAL_OPEN = () => {
      setOpen(true);
      w.AILEXSI_PORTAL_STATE = true;
    };

    w.AILEXSI_PORTAL_CLOSE = () => {
      setOpen(false);
      w.AILEXSI_PORTAL_STATE = false;
    };

    w.AILEXSI_PORTAL_TOGGLE = () => {
      const next = !w.AILEXSI_PORTAL_STATE;
      setOpen(next);
      w.AILEXSI_PORTAL_STATE = next;
    };
  }, []);

  useEffect(() => {
    (window as unknown as { AILEXSI_PORTAL_CLOSE?: () => void }).AILEXSI_PORTAL_CLOSE?.();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <ModalPageContent
      isOpen={open}
      onClose={() =>
        (window as unknown as { AILEXSI_PORTAL_CLOSE?: () => void }).AILEXSI_PORTAL_CLOSE?.()
      }
    >
      {getContent()}
    </ModalPageContent>
  );
}
