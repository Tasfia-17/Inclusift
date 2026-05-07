'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(253,252,251,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.25s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Logo size={28} />
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>InclusiFit</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[['Shop', '/catalog'], ['Beauty', '/beauty'], ['Try On', '/tryon']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)', padding: '6px 14px', borderRadius: 99, textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.background = 'var(--stone)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}>
              {l}
            </Link>
          ))}
        </nav>

        <Link href="/profile" className="btn btn-accent btn-sm">
          Get started ✦
        </Link>
      </div>
    </header>
  )
}
