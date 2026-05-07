'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { ShoppingBag, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-card py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={36} />
          <span className="text-xl font-bold gradient-text">InclusiFit</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/catalog" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Shop</Link>
          <Link href="/beauty" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Beauty</Link>
          <Link href="/tryon" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Try On</Link>
          <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">My Profile</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/catalog" className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-blush-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105 transition-all duration-200">
            <ShoppingBag size={16} />
            Shop Adaptive
          </Link>
        </div>

        {/* Mobile menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600" aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/30 px-6 py-4 space-y-3">
          {['Shop|/catalog', 'Beauty|/beauty', 'Try On|/tryon', 'My Profile|/profile'].map(item => {
            const [label, href] = item.split('|')
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-brand-600 py-2">
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
