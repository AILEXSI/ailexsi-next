"use client";

import { useEffect } from "react";
import ImpressumContent from "./ImpressumContent";

interface ModalImpressumProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalImpressum({ isOpen, onClose }: ModalImpressumProps) {
  if (!isOpen) return null;

  // ESC Key zum schließen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Klick außerhalb schließt Modal
  const handleOuterClick = (e: any) => {
    if (e.target.id === "modal-overlay") onClose();
  };

  return (
    <div
      id="modal-overlay"
      onClick={handleOuterClick}
      className="
        fixed inset-0 z-50 
        bg-black/70 backdrop-blur-md 
        flex items-center justify-center
        animate-fadeIn
      "
    >
      <div
        className="
          bg-black/90 text-white 
          p-8 rounded-xl 
          max-w-3xl w-[90%] max-h-[85vh] 
          overflow-y-auto shadow-2xl
          border border-white/10
          animate-scaleIn
        "
      >
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Impressum</h2>

          <button
            onClick={onClose}
            className="
              text-white/70 hover:text-white 
              border border-white/20 
              px-3 py-1 rounded-md
              hover:bg-white/10 transition
            "
          >
            Schließen
          </button>
        </div>

        <ImpressumContent />
      </div>
    </div>
  );
}
