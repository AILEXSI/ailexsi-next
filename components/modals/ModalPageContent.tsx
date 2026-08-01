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
        fixed left-0 right-0 bottom-0 top-[115px]
        z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-md
        overflow-y-auto
        px-6 py-10
        transition-opacity duration-300
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-5xl
          bg-black/40
          border border-white/20
          rounded-xl
          shadow-2xl
          p-8
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
      >
        {children}
      </div>
    </div>
  );
}

