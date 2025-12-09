"use client";

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
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 
        top-[115px]
        z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-md
        animate-ailexsiFadeIn
        overflow-y-auto
        px-6
        py-10
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full 
          max-w-5xl
          bg-black/40 
          border border-white/20
          rounded-xl 
          shadow-2xl 
          p-8 
          backdrop-blur-xl
          animate-scaleIn

          /* --- HOLOGRAPHIC EDGE GLOW --- */
          after:content-['']
          after:absolute
          after:inset-0
          after:rounded-xl
          after:border after:border-cyan-400/30
          after:blur-[18px]
          after:opacity-70
          after:pointer-events-none
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
