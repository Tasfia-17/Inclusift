'use client'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

/* 3D-style floating card component */
function FloatingCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderRadius: 20,
      padding: '14px 18px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6)',
      position: 'absolute',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* Animated orb */
function Orb({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, filter: 'blur(60px)', opacity: 0.5,
      position: 'absolute', pointerEvents: 'none', ...style,
    }} />
  )
}

const FEATURES = [
  { icon: '👗', title: 'Adaptive Clothing VTO',  desc: 'See any garment on your actual body. Filters for closure type, waistband, proportional fit.', color: '#f5f3ff' },
  { icon: '✨', title: 'AI Skin Analysis',        desc: '12 concerns analyzed in seconds. Personalized beauty recommendations filtered by container type.', color: '#fdf2f8' },
  { icon: '👟', title: 'AFO-Compatible Shoes',   desc: 'Virtual try-on for footwear that fits over ankle-foot orthoses. Wide widths, small adult sizes.', color: '#f0fdf4' },
  { icon: '💇', title: 'Hair & Wig Try-On',       desc: 'Try wigs, colors, and styles virtually. For alopecia, cancer treatment, any hair loss.', color: '#fffbeb' },
  { icon: '💄', title: 'Makeup VTO',              desc: 'Try foundation, lipstick, eyeshadow before buying. Reduces wasted product for motor disabilities.', color: '#fff1f2' },
  { icon: '💍', title: 'Jewelry Try-On',          desc: 'See earrings, necklaces, rings on your photo. Hearing-aid compatible jewelry filter.', color: '#f0f9ff' },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="mesh" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', paddingTop: 60 }}>
        {/* Background orbs */}
        <Orb color="rgba(124,58,237,0.4)" size={500} style={{ top: -100, left: -100 }} />
        <Orb color="rgba(236,72,153,0.3)" size={400} style={{ top: 100, right: -80 }} />
        <Orb color="rgba(13,148,136,0.25)" size={350} style={{ bottom: -50, left: '40%' }} />

        {/* Floating UI cards */}
        <FloatingCard style={{ top: '18%', right: '6%', zIndex: 10 }} >
          <div className="float" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Skin Analysis</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>12 concerns · 7 sec</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '28%', right: '8%', zIndex: 10 }}>
          <div className="float-2" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0d9488,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👗</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Virtual Try-On</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>AI-powered · Instant</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ top: '35%', left: '4%', zIndex: 10 }}>
          <div className="float-3" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#ec4899,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🦿</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>AFO Compatible</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Adaptive filters</div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard style={{ bottom: '20%', left: '5%', zIndex: 10 }}>
          <div className="float-r" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🎤</span>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>Voice Ready</div>
          </div>
        </FloatingCard>

        {/* Center content */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
          <div className="anim-fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(124,58,237,0.2)', borderRadius: 9999,
            padding: '6px 16px', marginBottom: 32, fontSize: 12, fontWeight: 600, color: 'var(--accent)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-ring 1.5s ease-out infinite' }} />
            Powered by Perfect Corp YouCam AI
          </div>

          <h1 className="serif anim-fade-up-2" style={{ fontSize: 'clamp(48px,8vw,80px)', color: 'var(--ink)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }}>
            Fashion that fits<br />
            <span className="grad">your body.</span>
          </h1>

          <p className="anim-fade-up-3" style={{ fontSize: 18, color: 'var(--body)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 40px', fontWeight: 400 }}>
            Upload one photo. Our AI analyzes your skin, recommends adaptive products, and shows you exactly how they look — all automatically.
          </p>

          <div className="anim-fade-up-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn btn-accent" style={{ fontSize: 16, padding: '14px 32px' }}>
              Start your journey ✦
            </Link>
            <Link href="/studio" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 32px' }}>
              Try AI Studio
            </Link>
          </div>

          {/* Trust row */}
          <div className="anim-fade-up-4" style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {['WCAG 2.1 AA', 'HIPAA Compliant', 'GDPR Ready', '8 YouCam APIs'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#22c55e" opacity="0.2"/><path d="M3 6l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { v: '1.3B', l: 'People with disabilities', c: '#7c3aed' },
            { v: '$8T',  l: 'Spending power',           c: '#ec4899' },
            { v: '71%',  l: 'Abandon inaccessible stores', c: '#d97706' },
            { v: '94%',  l: 'Higher conversion with AR', c: '#0d9488' },
          ].map(s => (
            <div key={s.v}>
              <div className="serif" style={{ fontSize: 40, color: s.c, letterSpacing: '-0.03em' }}>{s.v}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '96px 24px', background: 'var(--canvas)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#f5f3ff,#fdf2f8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 9999, padding: '5px 16px', fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>
              Fully automated
            </div>
            <h2 className="serif" style={{ fontSize: 44, color: 'var(--ink)', letterSpacing: '-0.02em' }}>One photo. Everything.</h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 10, maxWidth: 480, margin: '10px auto 0' }}>Upload your photo once. Our AI runs 8 YouCam APIs simultaneously.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { n: '01', icon: '📸', title: 'Upload your photo', desc: 'One selfie or full-body photo. Our guided camera ensures perfect quality.', color: '#f5f3ff' },
              { n: '02', icon: '🤖', title: 'AI analyzes everything', desc: 'Skin analysis, face attributes, skin tone — all run automatically in parallel.', color: '#fdf2f8' },
              { n: '03', icon: '✨', title: 'See your results', desc: 'Personalized product recommendations + virtual try-on rendered on your photo.', color: '#f0fdf4' },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: 28, background: s.color, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 8 }}>STEP {s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 24px', background: 'var(--stone)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: 40, color: 'var(--ink)', letterSpacing: '-0.02em' }}>8 YouCam APIs. One experience.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: 24, background: f.color, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px', textAlign: 'center', background: 'var(--canvas)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
          <h2 className="serif" style={{ fontSize: 44, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 12 }}>Fashion should fit everyone.</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 36 }}>1.3 billion people deserve this. Set up your profile in 30 seconds.</p>
          <Link href="/profile" className="btn btn-accent" style={{ fontSize: 16, padding: '14px 36px' }}>
            Get started — it's free ✦
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--ink)' }}>InclusiFit</span> · Built with Perfect Corp YouCam API · Hackathon 2026
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>Fashion for 1.3B people</div>
      </footer>
    </div>
  )
}
