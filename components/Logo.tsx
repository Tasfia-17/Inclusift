export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#g1)"/>
      {/* Sparkle top-right */}
      <path d="M23 6 L24 9 L27 10 L24 11 L23 14 L22 11 L19 10 L22 9 Z" fill="white" opacity="0.9"/>
      {/* Person */}
      <circle cx="16" cy="13" r="4" fill="white"/>
      <path d="M8 26c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}
