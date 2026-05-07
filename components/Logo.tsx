/* Logo: clean wordmark with sparkle mark */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 56 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="56" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
      </defs>
      {/* I mark — rounded square with person */}
      <rect width="32" height="32" rx="9" fill="url(#lg)"/>
      <circle cx="16" cy="11" r="4" fill="white"/>
      <path d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Sparkle dot */}
      <circle cx="26" cy="6" r="2" fill="#ec4899"/>
      {/* "fit" text mark */}
      <text x="36" y="22" fontFamily="system-ui" fontWeight="800" fontSize="14" fill="#1c1917" letterSpacing="-0.5">fit</text>
    </svg>
  )
}
