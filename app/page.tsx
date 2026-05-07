import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

/* SVG blob character — flat illustrated, Family-style */
function Blob({ color, emoji, style }: { color: string; emoji: string; style?: React.CSSProperties }) {
  return (
    <div className="float" style={{
      width: 72, height: 72, borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
      background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, flexShrink: 0, position: 'absolute', ...style,
    }}>
      {emoji}
    </div>
  )
}

const STATS = [
  { v: '1.3B', l: 'People with disabilities' },
  { v: '$8T',  l: 'Spending power' },
  { v: '71%',  l: 'Abandon inaccessible stores' },
  { v: '94%',  l: 'Higher conversion with AR' },
]

const FEATURES = [
  { icon: '👗', title: 'Adaptive clothing',    desc: 'Filter by closure type, waistband, fit, and proportional length.' },
  { icon: '👟', title: 'AFO-compatible shoes', desc: 'Wide widths, small adult sizes, fits over ankle-foot orthoses.' },
  { icon: '✨', title: 'Accessible beauty',    desc: 'Skin analysis + products filtered by container type and grip.' },
  { icon: '💇', title: 'Hair & wigs',          desc: 'Try on wigs and styles virtually. For alopecia and hair loss.' },
  { icon: '🎤', title: 'Voice controlled',     desc: 'Full voice navigation for motor and visual disabilities.' },
  { icon: '♿', title: 'WCAG 2.1 AA',          desc: 'Screen reader support, high contrast, large tap targets.' },
]

export default function Home() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 100, overflow: 'hidden' }}>
        {/* Soft radial glow */}
        <div style={{
          position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating blobs */}
        <Blob color="#ede9fe" emoji="👗" style={{ top: 120, left: '8%', animationDelay: '0s' }} />
        <Blob color="#fce7f3" emoji="✨" style={{ top: 200, right: '7%', animationDelay: '1.2s' }} />
        <Blob color="#d1fae5" emoji="👟" style={{ bottom: 80, left: '12%', animationDelay: '2.1s' }} />
        <Blob color="#fef3c7" emoji="💇" style={{ bottom: 60, right: '10%', animationDelay: '0.7s' }} />

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          {/* Eyebrow */}
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 9999, padding: '5px 14px', marginBottom: 28,
            fontSize: 12, fontWeight: 500, color: 'var(--muted)',
            boxShadow: 'rgba(0,0,0,0.04) 0px 1px 4px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Built for 1.3 billion people with disabilities
          </div>

          {/* Headline */}
          <h1 className="serif fade-up-2" style={{ fontSize: 'clamp(44px,7vw,72px)', color: 'var(--ink)', marginBottom: 20 }}>
            Fashion that fits<br />
            <span className="grad">your body.</span>
          </h1>

          <p className="fade-up-3" style={{ fontSize: 17, color: 'var(--body)', lineHeight: 1.6, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Smart adaptive filters + AI virtual try-on. Find clothes that work for your body and see how they look — before you buy.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/profile" className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
              Start your profile →
            </Link>
            <Link href="/catalog" className="btn-ghost" style={{ fontSize: 15, padding: '12px 28px' }}>
              Browse catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.v}>
              <div className="serif grad" style={{ fontSize: 36 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: 44, color: 'var(--ink)' }}>Everything you need</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>Powered by Perfect Corp AI/AR APIs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card-inset feature-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: 'var(--stone)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 40, color: 'var(--ink)', textAlign: 'center', marginBottom: 48 }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { n: '01', t: 'Set your profile',   d: 'Select your condition. Adaptive filters apply automatically.' },
              { n: '02', t: 'Browse & filter',    d: 'See only products that work for your body and needs.' },
              { n: '03', t: 'Try on with AI',     d: 'Upload your photo. See the garment on you in minutes.' },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: 28 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 16, letterSpacing: '0.05em' }}>{s.n}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.55 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 className="serif" style={{ fontSize: 44, color: 'var(--ink)', marginBottom: 12 }}>Fashion should fit everyone.</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 32 }}>Set up your profile in 30 seconds.</p>
          <Link href="/profile" className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
            Get started — it's free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>InclusiFit</span> · Built with Perfect Corp YouCam API
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Hackathon 2026</div>
      </footer>
    </div>
  )
}
