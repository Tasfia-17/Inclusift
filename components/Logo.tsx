export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="InclusiFit logo">
      {/* Outer circle - inclusive ring */}
      <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none"/>
      {/* Person silhouette */}
      <circle cx="20" cy="13" r="4" fill="url(#logoGrad)"/>
      <path d="M12 32c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Sparkle/star - the "fit" element */}
      <path d="M30 8 L31.2 11.2 L34.5 11.2 L31.9 13.2 L32.9 16.5 L30 14.5 L27.1 16.5 L28.1 13.2 L25.5 11.2 L28.8 11.2 Z" fill="url(#pinkGrad)" opacity="0.9"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="0.5" stopColor="#ec4899"/>
          <stop offset="1" stopColor="#14b8a6"/>
        </linearGradient>
        <linearGradient id="pinkGrad" x1="25" y1="8" x2="35" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f43f5e"/>
          <stop offset="1" stopColor="#fb923c"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
