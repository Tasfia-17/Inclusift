'use client'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Logo } from '@/components/Logo'

/* Glassmorphic floating panel */
function GlassPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="glass" style={{ padding: '16px 20px', position: 'absolute', ...style }}>
      {children}
    </div>
  )
}

const FEATURES = [
  { label: 'Skin Analysis',    icon: '✦', desc: '12 concerns detected in 7 seconds. Personalized beauty recommendations.' },
  { label: 'Clothes VTO',      icon: '◫', desc: 'See any garment on your actual body. Adaptive filters for closure, fit, length.' },
  { label: 'AFO Footwear',     icon: '◈', desc: 'Shoes that fit over ankle-foot orthoses. Wide widths, small adult sizes.' },
  { label: 'Hair & Wigs',      icon: '⊙', desc: 'Try wigs and styles virtually. For alopecia, cancer treatment, hair loss.' },
  { label: 'Makeup VTO',       icon: '◉', desc: 'Try foundation and lipstick before buying. Reduces wasted product.' },
  { label: 'Voice Control',    icon: '⊞', desc: 'Full voice navigation. Results read aloud for visual impairment.' },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--parchment)' }}>
      <Navbar dark />

      {/* ── HERO — cinematic full-viewport ── */}
      <section style={{
        position: 'relative', height: '100vh', minHeight: 700,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        /* Dusk gradient — Superhuman-style */
        background: `
          radial-gradient(circle at 68% 50%, rgba(133,125,250,0.55) 0, transparent 50%),
          radial-gradient(circle at 50% 98%, rgba(255,51,102,0.5) 0, transparent 50%),
          radial-gradient(circle at 93% 50%, rgba(75,105,227,0.45) 0, transparent 50%),
          radial-gradient(circle at 50% 75%, rgba(104,222,255,0.4) 0, transparent 50%),
          linear-gradient(to left bottom, rgba(168,164,216,0.9), rgba(107,165,232,0.85), rgba(176,112,192,0.9), rgba(144,136,208,0.85)),
          #1a1035
        `,
      }}>
        {/* Floating glass panels — left */}
        <GlassPanel style={{ left: '4%', top: '22%', maxWidth: 220 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', marginBottom: 8 }}>SKIN ANALYSIS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Pores', 72], ['Moisture', 85], ['Radiance', 68]].map(([l, v]) => (
              <div key={l as string}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'white', marginBottom: 3 }}>
                  <span>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${v}%`, background: 'linear-gradient(90deg,#d4c7ff,#a78bfa)', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel style={{ left: '3%', bottom: '22%', maxWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(212,199,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👗</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>Clothes VTO</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Adaptive fit · AI-powered</div>
            </div>
          </div>
        </GlassPanel>

        {/* Floating glass panels — right */}
        <GlassPanel style={{ right: '4%', top: '20%', maxWidth: 210 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', marginBottom: 10 }}>ADAPTIVE FILTERS</div>
          {['Magnetic closures', 'Elastic waistband', 'AFO compatible', 'Loose fit'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#d4c7ff', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
            </div>
          ))}
        </GlassPanel>

        <GlassPanel style={{ right: '3%', bottom: '24%' }}>
          <div className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(212,199,255,0.25)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>6 YouCam APIs active</span>
          </div>
        </GlassPanel>

        {/* Center headline */}
        <div className="anim-down" style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px', maxWidth: 800 }}>
          <h1 className="display" style={{ color: 'white', marginBottom: 20 }}>
            Fashion that fits<br />your body.
          </h1>
          <p className="anim-up sub" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            AI-powered virtual try-on and adaptive filters for people with disabilities.
          </p>
          <div className="anim-up-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn-primary">
              Get started <span style={{ color: 'var(--iris)' }}>→</span>
            </Link>
            <Link href="/studio" className="glass-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', color: 'white', textDecoration: 'none', fontSize: 16, fontWeight: 500 }}>
              Try AI Studio
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARCHMENT CANVAS — feature sections ── */}
      <section style={{ background: 'var(--parchment)', padding: '96px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="caption" style={{ color: 'var(--iris)', letterSpacing: '0.08em', marginBottom: 12 }}>POWERED BY PERFECT CORP YOUCAM API</p>
            <h2 className="h1" style={{ color: 'var(--ink)', marginBottom: 16 }}>Everything you need.</h2>
            <p className="body" style={{ color: 'var(--graphite)', maxWidth: 480, margin: '0 auto' }}>
              Six AI/AR APIs run automatically when you upload one photo.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.label} className="card" style={{ padding: 24, transition: 'border-color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--iris)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--fog)'}>
                <div style={{ fontSize: 20, color: 'var(--iris)', marginBottom: 12 }}>{f.icon}</div>
                <div className="h3" style={{ color: 'var(--ink)', marginBottom: 8 }}>{f.label}</div>
                <div className="small" style={{ color: 'var(--graphite)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--fog)', borderBottom: '1px solid var(--fog)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="h1" style={{ color: 'var(--ink)', textAlign: 'center', marginBottom: 56 }}>One photo. Everything.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { n: '01', t: 'Set your profile', d: 'Select your condition. Adaptive filters apply automatically.' },
              { n: '02', t: 'Upload your photo', d: '6 YouCam APIs run in parallel — skin, face, makeup, outfit, hair, jewelry.' },
              { n: '03', t: 'See your results', d: 'Personalized recommendations + virtual try-on rendered on your photo.' },
            ].map(s => (
              <div key={s.n}>
                <div className="caption" style={{ color: 'var(--iris)', letterSpacing: '0.08em', marginBottom: 12 }}>STEP {s.n}</div>
                <div className="h3" style={{ color: 'var(--ink)', marginBottom: 8 }}>{s.t}</div>
                <div className="small" style={{ color: 'var(--graphite)', lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--parchment)', padding: '64px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { v: '1.3B', l: 'People with disabilities' },
            { v: '$8T',  l: 'Spending power' },
            { v: '71%',  l: 'Abandon inaccessible stores' },
            { v: '94%',  l: 'Higher conversion with AR' },
          ].map(s => (
            <div key={s.v}>
              <div className="h1" style={{ color: 'var(--ink)' }}>{s.v}</div>
              <div className="small" style={{ color: 'var(--graphite)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--parchment)', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 className="h1" style={{ color: 'var(--ink)', marginBottom: 12 }}>Fashion should fit everyone.</h2>
          <p className="body" style={{ color: 'var(--graphite)', marginBottom: 32 }}>Set up your profile in 30 seconds.</p>
          <Link href="/profile" className="btn-ghost" style={{ fontSize: 16, padding: '10px 28px' }}>
            Get started →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--aubergine)', padding: '36px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo dark size={18} />
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Built with Perfect Corp YouCam API · Hackathon 2026</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Shop', 'Beauty', 'Studio', 'Dashboard'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
