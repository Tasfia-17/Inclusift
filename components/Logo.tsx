/* Conic gradient logo — inspired by ElevenLabs voice spectrum */
export function Logo({ size = 28 }: { size?: number }) {
  const r = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="0.5" stopColor="#a855f7"/>
          <stop offset="1" stopColor="#f43f5e"/>
        </linearGradient>
      </defs>
      {/* Rounded square bg */}
      <rect width={size} height={size} rx={size * 0.28} fill="url(#lg)"/>
      {/* Person */}
      <circle cx={r} cy={r * 0.72} r={r * 0.28} fill="white"/>
      <path d={`M${r*0.38} ${size*0.88} Q${r*0.38} ${r*1.18} ${r} ${r*1.18} Q${r*1.62} ${r*1.18} ${r*1.62} ${size*0.88}`}
        stroke="white" strokeWidth={size*0.09} strokeLinecap="round" fill="none"/>
    </svg>
  )
}
