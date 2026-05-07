'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

/* ── Types ── */
type Step = 'welcome' | 'demo' | 'select' | 'ready'

const CONDITIONS = [
  { id: 'shorter_limbs',     emoji: '📏', label: 'Shorter limbs',       sub: 'Achondroplasia, dwarfism',     accent: '#7c3aed' },
  { id: 'limited_dexterity', emoji: '🤲', label: 'Limited dexterity',   sub: 'Muscular dystrophy, MS',       accent: '#ec4899' },
  { id: 'afo_user',          emoji: '🦿', label: 'AFO / brace user',    sub: 'GNE myopathy, cerebral palsy', accent: '#d97706' },
  { id: 'loose_fit',         emoji: '🧘', label: 'Loose / easy-wear',   sub: 'SMA, fatigue conditions',      accent: '#16a34a' },
  { id: 'hair_loss',         emoji: '💆', label: 'Hair loss / wigs',     sub: 'Alopecia, cancer treatment',   accent: '#ea580c' },
  { id: 'visual_impairment', emoji: '👁️', label: 'Visual impairment',   sub: 'Low vision, blindness',        accent: '#0284c7' },
]

/* ── Scan ray animation ── */
function ScanDemo() {
  const [scanY, setScanY] = useState(0)
  const [phase, setPhase] = useState<'scanning' | 'done'>('scanning')
  const [dots, setDots] = useState<{ x: number; y: number; label: string; color: string }[]>([])
  const rafRef = useRef<number | undefined>(undefined)
  const startRef = useRef<number | undefined>(undefined)

  const SCAN_POINTS = [
    { x: 48, y: 22, label: 'Pores', color: '#7c3aed' },
    { x: 35, y: 38, label: 'Moisture', color: '#0284c7' },
    { x: 62, y: 45, label: 'Radiance', color: '#d97706' },
    { x: 42, y: 58, label: 'Texture', color: '#ec4899' },
    { x: 55, y: 68, label: 'Firmness', color: '#16a34a' },
  ]

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / 2000, 1)
      setScanY(progress * 100)

      // Reveal dots as scan passes
      const revealed = SCAN_POINTS.filter(p => p.y <= progress * 100)
      setDots(revealed)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setPhase('done')
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 16, background: '#0f0f14' }}>
      {/* Face silhouette */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        <ellipse cx="50" cy="45" rx="22" ry="28" fill="white"/>
        <ellipse cx="50" cy="85" rx="18" ry="12" fill="white"/>
      </svg>

      {/* Grid overlay */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#7c3aed" strokeWidth="0.3"/>
            <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#7c3aed" strokeWidth="0.3"/>
          </g>
        ))}
      </svg>

      {/* Scan ray */}
      {phase === 'scanning' && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: `${scanY}%`,
          height: 2, background: 'linear-gradient(90deg, transparent, #7c3aed, #ec4899, transparent)',
          boxShadow: '0 0 12px rgba(124,58,237,0.8), 0 0 24px rgba(236,72,153,0.4)',
          transition: 'top 0.016s linear',
        }}>
          {/* Ray glow */}
          <div style={{ position: 'absolute', inset: '-8px 0', background: 'linear-gradient(180deg, transparent, rgba(124,58,237,0.15), transparent)' }} />
        </div>
      )}

      {/* Analysis dots */}
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${d.x}%`, top: `${d.y}%`,
          transform: 'translate(-50%,-50%)',
          animation: 'dotAppear 0.3s cubic-bezier(0.19,1,0.22,1) both',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
          <div style={{
            position: 'absolute', left: 12, top: -4, whiteSpace: 'nowrap',
            fontSize: 9, fontWeight: 700, color: d.color,
            background: 'rgba(15,15,20,0.8)', padding: '2px 6px', borderRadius: 4,
          }}>
            {d.label}
          </div>
        </div>
      ))}

      {/* Done state */}
      {phase === 'done' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ fontSize: 28, animation: 'bounceIn 0.4s cubic-bezier(0.19,1,0.22,1)' }}>✓</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em' }}>ANALYSIS COMPLETE</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {['Pores 72', 'Moisture 85', 'Radiance 68'].map(t => (
              <div key={t} style={{ fontSize: 9, background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', color: '#c4b5fd', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>
      )}

      {/* Corner brackets */}
      {[['0,0', 'top:8px;left:8px'], ['100,0', 'top:8px;right:8px'], ['0,100', 'bottom:8px;left:8px'], ['100,100', 'bottom:8px;right:8px']].map(([, pos], i) => (
        <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...Object.fromEntries(pos.split(';').map(s => s.split(':'))) }}>
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path d={i === 0 ? 'M0 8 L0 0 L8 0' : i === 1 ? 'M16 8 L16 0 L8 0' : i === 2 ? 'M0 8 L0 16 L8 16' : 'M16 8 L16 16 L8 16'} stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
      ))}
    </div>
  )
}

/* ── VTO Preview animation ── */
function VTOPreview() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setDone(true); clearInterval(interval); return 100 }
        return p + 2
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', background: '#0f0f14' }}>
      {/* Before */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: done ? 0 : 1, transition: 'opacity 0.5s' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <div style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.1em' }}>ORIGINAL</div>
        </div>
      </div>

      {/* After — reveal wipe */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - progress}% 0 0)`, transition: 'clip-path 0.04s linear' }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👗</div>
            <div style={{ fontSize: 10, color: '#c4b5fd', fontWeight: 600, letterSpacing: '0.1em' }}>STYLED</div>
          </div>
        </div>
      </div>

      {/* Wipe line */}
      {!done && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${progress}%`, width: 2, background: 'linear-gradient(180deg, transparent, #7c3aed, #ec4899, transparent)', boxShadow: '0 0 12px rgba(124,58,237,0.8)' }} />
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#ec4899)', borderRadius: 99, transition: 'width 0.04s linear' }} />
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 600, letterSpacing: '0.08em' }}>
          {done ? 'VIRTUAL TRY-ON COMPLETE' : 'APPLYING AI STYLING...'}
        </div>
      </div>
    </div>
  )
}

/* ── Main onboarding ── */
export default function ProfilePage() {
  const [step, setStep] = useState<Step>('welcome')
  const [selected, setSelected] = useState<string[]>([])
  const [demoTab, setDemoTab] = useState<'scan' | 'vto'>('scan')
  const router = useRouter()

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Logo size={28} />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['welcome', 'demo', 'select', 'ready'] as Step[]).map((s, i) => (
            <div key={s} style={{ width: step === s ? 24 : 8, height: 8, borderRadius: 99, background: step === s ? 'linear-gradient(90deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s ease' }} />
          ))}
        </div>
        <a href="/catalog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Skip →</a>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>

        {/* ── STEP 1: Welcome ── */}
        {step === 'welcome' && (
          <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', animation: 'fadeUp 0.5s ease both' }}>
            {/* Animated logo mark */}
            <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 32px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', opacity: 0.2, animation: 'pulseRing 2s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', opacity: 0.3, animation: 'pulseRing 2s 0.4s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✦</div>
            </div>

            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16 }}>
              Fashion that fits<br />
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your body.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
              AI-powered virtual try-on and adaptive filters for people with disabilities. Upload one photo — we do the rest.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              {['Skin Analysis', 'Clothes VTO', 'Hair Try-On', 'Makeup VTO', 'Jewelry VTO', 'Voice Control'].map(f => (
                <div key={f} style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 99, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}>{f}</div>
              ))}
            </div>

            <button onClick={() => setStep('demo')}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', border: 'none', borderRadius: 14, padding: '14px 40px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 32px rgba(124,58,237,0.4)', letterSpacing: '-0.01em' }}>
              See it in action →
            </button>
          </div>
        )}

        {/* ── STEP 2: Interactive Demo ── */}
        {step === 'demo' && (
          <div style={{ maxWidth: 800, width: '100%', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Watch the AI work</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>This is what happens when you upload your photo</p>
            </div>

            {/* Demo tabs */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {[{ id: 'scan', label: '✨ Skin Analysis' }, { id: 'vto', label: '👗 Virtual Try-On' }].map(t => (
                <button key={t.id} onClick={() => setDemoTab(t.id as any)}
                  style={{ padding: '8px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: demoTab === t.id ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.08)', color: demoTab === t.id ? 'white' : 'rgba(255,255,255,0.5)' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Demo window */}
            <div style={{ height: 320, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
              {demoTab === 'scan' ? <ScanDemo key="scan" /> : <VTOPreview key="vto" />}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
              {[
                { v: '6', l: 'YouCam APIs', sub: 'run simultaneously' },
                { v: '7s', l: 'Skin analysis', sub: '12 concerns detected' },
                { v: '94%', l: 'Higher conversion', sub: 'with AR try-on' },
              ].map(s => (
                <div key={s.v} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>{s.v}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setStep('welcome')} style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => setStep('select')} style={{ padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
                Personalize my experience →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Select conditions ── */}
        {step === 'select' && (
          <div style={{ maxWidth: 600, width: '100%', animation: 'fadeUp 0.5s ease both' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Personalize your experience</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Select what applies. We'll adapt everything for you.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {CONDITIONS.map((c, i) => {
                const on = selected.includes(c.id)
                return (
                  <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                      borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                      border: on ? `1.5px solid ${c.accent}` : '1.5px solid rgba(255,255,255,0.08)',
                      background: on ? `${c.accent}18` : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s cubic-bezier(0.19,1,0.22,1)',
                      transform: on ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: on ? `0 4px 20px ${c.accent}30` : 'none',
                      animationDelay: `${i * 0.05}s`,
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: on ? `${c.accent}25` : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {c.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: on ? 'white' : 'rgba(255,255,255,0.8)' }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{c.sub}</div>
                    </div>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: on ? c.accent : 'transparent', border: on ? 'none' : '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                      {on && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </button>
                )
              })}
            </div>

            {selected.length > 0 && (
              <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>🎯</span>
                <div style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 500 }}>
                  {selected.length} filter{selected.length > 1 ? 's' : ''} will be applied to your catalog and AI analysis
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('demo')} style={{ padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => router.push(`/dashboard?c=${selected.join(',')}`)}
                disabled={selected.length === 0}
                style={{ flex: 1, padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', background: selected.length > 0 ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.1)', color: selected.length > 0 ? 'white' : 'rgba(255,255,255,0.3)', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', boxShadow: selected.length > 0 ? '0 4px 20px rgba(124,58,237,0.4)' : 'none', transition: 'all 0.2s' }}>
                {selected.length === 0 ? 'Select at least one' : 'Go to my dashboard →'}
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
              Or <a href="/dashboard" style={{ color: 'rgba(124,58,237,0.8)', textDecoration: 'none' }}>skip to dashboard</a>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseRing { 0% { transform:scale(1); opacity:0.4; } 100% { transform:scale(1.8); opacity:0; } }
        @keyframes dotAppear { from { transform:translate(-50%,-50%) scale(0); opacity:0; } to { transform:translate(-50%,-50%) scale(1); opacity:1; } }
        @keyframes bounceIn { 0% { transform:scale(0.5); opacity:0; } 70% { transform:scale(1.1); } 100% { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  )
}
