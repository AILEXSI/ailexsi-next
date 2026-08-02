"use client";

import { useEffect } from "react";

interface ModalPageContentProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalPageContent({
  isOpen,
  onClose,
  children,
}: ModalPageContentProps) {
  /* --------------------------------------------- */
  /* ESC → GLOBAL PORTAL CLOSE                      */
  /* --------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`
        fixed left-0 right-0 bottom-0 top-[var(--header-height)]
        z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-md
        overflow-y-auto overscroll-contain
        px-3 py-4 sm:px-6 sm:py-10
        landscape:px-4 landscape:py-3
        transition-opacity duration-300
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
      data-no-swipe
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div
        className={`
          relative w-full max-w-5xl
          max-h-[calc(100dvh-var(--header-height)-1.5rem)]
          sm:max-h-[calc(100dvh-var(--header-height)-3rem)]
          overflow-y-auto overscroll-contain
          bg-black/40
          border border-white/20
          rounded-xl
          shadow-2xl
          p-4 sm:p-8
          landscape:p-4 landscape:max-h-[calc(100dvh-var(--header-height)-1rem)]
          backdrop-blur-xl
          transition-transform duration-300
          ${isOpen ? "scale-100" : "scale-95"}

          after:content-['']
          after:absolute
          after:inset-0
          after:rounded-xl
          after:border after:border-cyan-400/30
          after:blur-[18px]
          after:opacity-70
          after:pointer-events-none
        `}
        onClick={(e) => e.stopPropagation()}
        data-no-swipe
      >
        {children}
      </div>
    </div>
  );
}
