'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'

export function Navbar({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const onDark = dark && !scrolled
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(242,240,235,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--fog)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo dark={onDark} size={20} />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['Shop', '/catalog'], ['Beauty', '/beauty'], ['Studio', '/studio'], ['Hair', '/hair'], ['Shoes', '/shoes']].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 14, fontWeight: 460, color: onDark ? 'rgba(255,255,255,0.75)' : 'var(--graphite)', padding: '6px 14px', borderRadius: 8, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = onDark ? '#fff' : 'var(--ink)'}
              onMouseLeave={e => e.currentTarget.style.color = onDark ? 'rgba(255,255,255,0.75)' : 'var(--graphite)'}>
              {l}
            </Link>
          ))}
        </nav>
        <Link href="/profile" className="btn-lavender" style={{ fontSize: 13, padding: '6px 14px' }}>
          Get started
        </Link>
      </div>
    </header>
  )
}
