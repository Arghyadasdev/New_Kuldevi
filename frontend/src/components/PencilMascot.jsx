function PencilMascot({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 2.2}
      viewBox="0 0 60 132"
      className={`pencil-mascot ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.18))' }}
    >
      {/* Eraser (pink top) */}
      <rect x="18" y="0" width="24" height="14" rx="5" fill="#FF8FAB" />
      {/* Eraser band (silver) */}
      <rect x="16" y="13" width="28" height="6" rx="2" fill="#C0C0C0" />

      {/* Pencil body (yellow) */}
      <rect x="16" y="18" width="28" height="72" rx="2" fill="#FFD700" />
      {/* Pencil side shading */}
      <rect x="16" y="18" width="8" height="72" rx="2" fill="#FFC200" opacity="0.6" />
      {/* Pencil right highlight */}
      <rect x="36" y="18" width="8" height="72" rx="2" fill="#FFE76A" opacity="0.5" />

      {/* Face area (slightly lighter patch) */}
      <ellipse cx="30" cy="52" rx="12" ry="14" fill="#FFEAA0" />

      {/* Eyes */}
      <circle cx="25" cy="47" r="4" fill="white" />
      <circle cx="35" cy="47" r="4" fill="white" />
      <circle cx="26" cy="48" r="2.2" fill="#2d1a00" />
      <circle cx="36" cy="48" r="2.2" fill="#2d1a00" />
      {/* Eye shine */}
      <circle cx="27" cy="47" r="0.8" fill="white" />
      <circle cx="37" cy="47" r="0.8" fill="white" />

      {/* Smile */}
      <path d="M24 57 Q30 63 36 57" stroke="#2d1a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Rosy cheeks */}
      <circle cx="21" cy="55" r="3.5" fill="#FF8FAB" opacity="0.45" />
      <circle cx="39" cy="55" r="3.5" fill="#FF8FAB" opacity="0.45" />

      {/* Left arm */}
      <line x1="16" y1="65" x2="5" y2="78" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" />
      <circle cx="5" cy="79" r="3.5" fill="#FF8FAB" />

      {/* Right arm (waving) */}
      <line x1="44" y1="62" x2="57" y2="52" stroke="#FFD700" strokeWidth="5" strokeLinecap="round" />
      <circle cx="57" cy="51" r="3.5" fill="#FF8FAB" />

      {/* Pencil tip (wood) */}
      <polygon points="16,90 44,90 30,108" fill="#D4A855" />
      {/* Graphite tip */}
      <polygon points="23,100 37,100 30,108" fill="#4a4a4a" />

      {/* Legs */}
      <rect x="21" y="108" width="8" height="16" rx="4" fill="#FF8FAB" />
      <rect x="31" y="110" width="8" height="16" rx="4" fill="#FF8FAB" />

      {/* Shoes */}
      <ellipse cx="25" cy="125" rx="7" ry="5" fill="#c2200e" />
      <ellipse cx="35" cy="127" rx="7" ry="5" fill="#c2200e" />

      <style>{`
        .pencil-mascot {
          animation: mascotBob 2.5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes mascotBob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
    </svg>
  )
}

export default PencilMascot
