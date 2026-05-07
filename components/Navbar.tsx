'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(251,250,249,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #e8e6e3' : '1px solid transparent',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Logo size={26} />
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.02em' }}>InclusiFit</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['Shop', '/catalog'], ['Beauty', '/beauty'], ['Try On', '/tryon']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 14, color: 'var(--muted)', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              {l}
            </Link>
          ))}
        </nav>

        <Link href="/profile" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
          Get started
        </Link>
      </div>
    </header>
  )
}
