/* Clean wordmark logo */
export function Logo({ dark = false, size = 22 }: { dark?: boolean; size?: number }) {
  const c = dark ? '#ffffff' : '#292827'
  return (
    <svg width={size * 4.2} height={size} viewBox="0 0 88 22" fill="none" aria-label="InclusiFit">
      {/* Mark: rounded square with person silhouette */}
      <rect width="22" height="22" rx="6" fill="#714cb6"/>
      <circle cx="11" cy="8.5" r="3" fill="white"/>
      <path d="M5 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Wordmark */}
      <text x="28" y="16" fontFamily="Inter, system-ui" fontWeight="600" fontSize="14" fill={c} letterSpacing="-0.3">InclusiFit</text>
    </svg>
  )
}
