"use client";

export default function InfinityButton({
  onClick,
  active = false,
}: {
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative
        w-14 h-14
        flex items-center justify-center
        rounded-full
        bg-black/30 backdrop-blur-xl
        border ${active ? "border-cyan-300/70" : "border-cyan-400/40"}
        ${active 
          ? "shadow-[0_0_32px_rgba(0,200,255,0.85)]" 
          : "shadow-[0_0_18px_rgba(0,200,255,0.35)]"}
        transition-all duration-300
      `}
    >
      {/* Outer Glow / Pulse */}
      <div
        className={`
          absolute inset-0 rounded-full blur-xl transition-all
          ${active 
            ? "bg-cyan-400/40 opacity-80" 
            : "bg-cyan-400/20 opacity-40 animate-[ping_3.5s_ease-in-out_infinite]"}
        `}
      />

      {/* Infinity Symbol */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 60"
        className={`
          relative w-10 h-6 transition-all
          ${active 
            ? "drop-shadow-[0_0_22px_rgba(0,200,255,0.9)]" 
            : "drop-shadow-[0_0_8px_rgba(0,200,255,0.55)] group-hover:drop-shadow-[0_0_14px_rgba(0,200,255,0.85)]"}
        `}
      >
        <defs>
          <linearGradient id="infGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4df4ff" />
            <stop offset="100%" stopColor="#00aaff" />
          </linearGradient>
        </defs>

        <path
          d="
            M20,30
            C20,15 40,15 60,30
            C80,45 100,45 100,30
            C100,15 80,15 60,30
            C40,45 20,45 20,30
          "
          fill="none"
          stroke="url(#infGradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
