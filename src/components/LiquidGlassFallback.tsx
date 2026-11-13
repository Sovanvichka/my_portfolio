interface LiquidGlassFallbackProps {
  compact?: boolean;
  reason?: 'loading' | 'fallback';
}

export function LiquidGlassFallback({
  compact = false,
  reason = 'fallback',
}: LiquidGlassFallbackProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-full ${
        compact ? 'h-full min-h-[300px]' : 'h-full min-h-[420px]'
      } select-none pointer-events-none`}
      aria-hidden="true"
    >
      <div
        className="absolute rounded-full opacity-55"
        style={{
          width: compact ? '240px' : '380px',
          height: compact ? '240px' : '380px',
          background:
            'radial-gradient(circle at 42% 38%, rgba(34, 211, 238, 0.28), rgba(37, 99, 235, 0.2) 45%, rgba(124, 58, 237, 0.12) 70%, transparent 76%)',
        }}
      />
      <svg
        viewBox="0 0 360 360"
        className={`relative ${compact ? 'w-60 h-60' : 'w-80 h-80 lg:w-96 lg:h-96'} drop-shadow-[0_24px_60px_rgba(37,99,235,0.28)]`}
        fill="none"
      >
        <defs>
          <linearGradient id="glassRibbonA" x1="40" y1="40" x2="320" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.88" />
            <stop offset="48%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="glassRibbonB" x1="310" y1="60" x2="55" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="glassCore" cx="0.45" cy="0.4" r="0.55">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#22D3EE" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#1D4ED8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#07152E" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="180" cy="180" r="142" className="stroke-blue-600/20 dark:stroke-slate-400/20" strokeWidth="1" />
        <ellipse
          cx="180"
          cy="180"
          rx="132"
          ry="58"
          transform="rotate(-24 180 180)"
          stroke="url(#glassRibbonA)"
          strokeWidth="1.5"
          strokeOpacity="0.55"
        />

        <circle cx="180" cy="180" r="76" fill="url(#glassCore)" />

        <path
          d="M180 62C236 62 284 106 284 162C284 218 228 266 168 286C112 304 76 254 76 198C76 138 124 62 180 62Z"
          stroke="url(#glassRibbonA)"
          strokeWidth="26"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
        <path
          d="M110 112C156 68 238 82 268 144C298 206 252 276 184 276C124 276 82 214 98 152"
          stroke="url(#glassRibbonB)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        <circle cx="88" cy="112" r="3" fill="#67E8F9" fillOpacity="0.7" />
        <circle cx="278" cy="128" r="2.5" fill="#93C5FD" fillOpacity="0.65" />
        <circle cx="252" cy="264" r="3.5" fill="#A78BFA" fillOpacity="0.55" />
        <circle cx="104" cy="248" r="2" fill="#22D3EE" fillOpacity="0.75" />
      </svg>
      {reason === 'loading' && (
        <span className="sr-only">Initializing interactive 3D liquid-glass sculpture</span>
      )}
    </div>
  );
}
