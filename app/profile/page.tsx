'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

type Step = 'welcome' | 'demo' | 'select'

const CONDITIONS = [
  { id: 'shorter_limbs',     label: 'Shorter limbs',           sub: 'Achondroplasia, dwarfism' },
  { id: 'limited_dexterity', label: 'Limited dexterity',       sub: 'Muscular dystrophy, MS, Parkinson\'s' },
  { id: 'afo_user',          label: 'AFO / brace user',        sub: 'GNE myopathy, cerebral palsy' },
  { id: 'loose_fit',         label: 'Loose / easy-wear',       sub: 'SMA, fatigue conditions' },
  { id: 'hair_loss',         label: 'Hair loss / wigs',         sub: 'Alopecia, cancer treatment' },
  { id: 'visual_impairment', label: 'Visual impairment',       sub: 'Low vision, blindness' },
  { id: 'hearing_aid',       label: 'Hearing aid / cochlear',  sub: 'Hearing loss, cochlear implant' },
]

/* Animated scan ray demo */
function ScanDemo() {
  const [scanY, setScanY] = useState(0)
  const [dots, setDots] = useState<{ x: number; y: number; label: string }[]>([])
  const [done, setDone] = useState(false)
  const rafRef = useRef<number | undefined>(undefined)
  const startRef = useRef<number | undefined>(undefined)

  const POINTS = [
    { x: 47, y: 20, label: 'Pores · 72' },
    { x: 36, y: 35, label: 'Moisture · 85' },
    { x: 60, y: 42, label: 'Radiance · 68' },
    { x: 43, y: 55, label: 'Texture · 79' },
    { x: 55, y: 65, label: 'Firmness · 61' },
  ]

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min((ts - startRef.current) / 2200, 1)
      setScanY(p * 100)
      setDots(POINTS.filter(pt => pt.y <= p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(animate)
      else setDone(true)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0d0b18', borderRadius: 16, overflow: 'hidden' }}>
      {/* Grid */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i}>
            <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#714cb6" strokeWidth="0.4"/>
            <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#714cb6" strokeWidth="0.4"/>
          </g>
        ))}
      </svg>
      {/* Face silhouette */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
        <ellipse cx="50" cy="42" rx="20" ry="26" fill="white"/>
        <ellipse cx="50" cy="80" rx="16" ry="10" fill="white"/>
      </svg>
      {/* Corner brackets */}
      {[[8,8,'M0 10 L0 0 L10 0'], [92,8,'M0 0 L10 0 L10 10'], [8,92,'M0 0 L0 10 L10 10'], [92,92,'M10 0 L10 10 L0 10']].map(([x,y,d], i) => (
        <svg key={i} width="14" height="14" style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)' }} viewBox="0 0 10 10">
          <path d={d as string} stroke="#714cb6" strokeWidth="1.5" fill="none"/>
        </svg>
      ))}
      {/* Scan ray */}
      {!done && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${scanY}%`, height: 2, background: 'linear-gradient(90deg, transparent, #714cb6, #d4c7ff, #714cb6, transparent)', boxShadow: '0 0 16px rgba(113,76,182,0.8)', transition: 'top 0.016s linear' }}>
          <div style={{ position: 'absolute', inset: '-10px 0', background: 'linear-gradient(180deg, transparent, rgba(113,76,182,0.12), transparent)' }} />
        </div>
      )}
      {/* Analysis dots */}
      {dots.map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%,-50%)', animation: 'dotPop 0.3s cubic-bezier(0.19,1,0.22,1) both' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d4c7ff', boxShadow: '0 0 8px rgba(212,199,255,0.8)' }} />
          <div style={{ position: 'absolute', left: 10, top: -4, whiteSpace: 'nowrap', fontSize: 9, fontWeight: 600, color: '#d4c7ff', background: 'rgba(13,11,24,0.85)', padding: '2px 6px', borderRadius: 4 }}>{d.label}</div>
        </div>
      ))}
      {/* Done */}
      {done && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#86efac', letterSpacing: '0.1em' }}>ANALYSIS COMPLETE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Pores 72', 'Moisture 85', 'Radiance 68'].map(t => (
              <div key={t} style={{ fontSize: 10, background: 'rgba(113,76,182,0.25)', border: '1px solid rgba(212,199,255,0.3)', color: '#d4c7ff', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* VTO wipe demo */
function VTODemo() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t = setInterval(() => setProgress(p => { if (p >= 100) { setDone(true); clearInterval(t); return 100 } return p + 1.5 }), 30)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0d0b18', borderRadius: 16, overflow: 'hidden' }}>
      {/* Before */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 40 }}>👤</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>ORIGINAL</div>
      </div>
      {/* After */}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a0a2e,#2d1b4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 40 }}>👗</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#d4c7ff', letterSpacing: '0.1em' }}>STYLED</div>
        </div>
      </div>
      {/* Wipe line */}
      {!done && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${progress}%`, width: 2, background: 'linear-gradient(180deg,transparent,#714cb6,#d4c7ff,transparent)', boxShadow: '0 0 12px rgba(113,76,182,0.8)' }} />}
      {/* Progress */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#714cb6,#d4c7ff)', borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
          {done ? 'VIRTUAL TRY-ON COMPLETE' : 'APPLYING AI STYLING...'}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [step, setStep] = useState<Step>('welcome')
  const [demoTab, setDemoTab] = useState<'scan' | 'vto'>('scan')
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── WELCOME — dark cinematic ── */}
      {step === 'welcome' && (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          background: `
            radial-gradient(circle at 68% 50%, rgba(133,125,250,0.5) 0, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(255,51,102,0.4) 0, transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(75,105,227,0.4) 0, transparent 50%),
            #0d0b18
          `,
        }}>
          <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo dark size={20} />
            <a href="/catalog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Skip →</a>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }} className="anim-down">
              {/* Step dots */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 48 }}>
                {['welcome','demo','select'].map(s => (
                  <div key={s} style={{ height: 4, width: s === step ? 28 : 8, borderRadius: 99, background: s === step ? '#d4c7ff' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s ease' }} />
                ))}
              </div>

              <h1 style={{ fontSize: 'clamp(40px,7vw,64px)', fontWeight: 600, lineHeight: 0.96, letterSpacing: '-1.79px', color: 'white', marginBottom: 20 }}>
                Fashion that fits<br />your body.
              </h1>
              <p style={{ fontSize: 18, fontWeight: 460, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, letterSpacing: '-0.14px', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
                AI-powered virtual try-on and adaptive filters for people with disabilities. Upload one photo — we do the rest.
              </p>

              {/* Feature pills */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
                {['Skin Analysis', 'Clothes VTO', 'Hair Try-On', 'Makeup VTO', 'Jewelry VTO', 'Voice Control'].map(f => (
                  <div key={f} className="glass-pill" style={{ fontSize: 12, fontWeight: 500, padding: '5px 14px', color: 'rgba(255,255,255,0.8)' }}>{f}</div>
                ))}
              </div>

              <button onClick={() => setStep('demo')}
                style={{ background: 'white', color: '#292827', fontSize: 16, fontWeight: 500, padding: '12px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'rgb(113,76,182) 0 0 0 1px inset'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                See it in action →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEMO — dark with interactive preview ── */}
      {step === 'demo' && (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          background: `
            radial-gradient(circle at 30% 40%, rgba(113,76,182,0.35) 0, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(212,199,255,0.2) 0, transparent 50%),
            #0d0b18
          `,
        }}>
          <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo dark size={20} />
            <div style={{ display: 'flex', gap: 6 }}>
              {['welcome','demo','select'].map(s => (
                <div key={s} style={{ height: 4, width: s === step ? 28 : 8, borderRadius: 99, background: s === step ? '#d4c7ff' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s ease' }} />
              ))}
            </div>
            <a href="/catalog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Skip →</a>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ maxWidth: 760, width: '100%' }} className="anim-up">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.62px', color: 'white', marginBottom: 8 }}>Watch the AI work</h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>This is what happens when you upload your photo</p>
              </div>

              {/* Demo tabs */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
                {[{ id: 'scan', label: 'Skin Analysis' }, { id: 'vto', label: 'Virtual Try-On' }].map(t => (
                  <button key={t.id} onClick={() => setDemoTab(t.id as any)}
                    style={{ padding: '8px 20px', borderRadius: 999, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: demoTab === t.id ? '#d4c7ff' : 'rgba(255,255,255,0.08)', color: demoTab === t.id ? '#292827' : 'rgba(255,255,255,0.6)', fontFamily: 'inherit' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Demo window */}
              <div style={{ height: 280, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 28 }}>
                {demoTab === 'scan' ? <ScanDemo key="scan" /> : <VTODemo key="vto" />}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32 }}>
                {[
                  { v: '6', l: 'YouCam APIs', s: 'run simultaneously' },
                  { v: '7s', l: 'Skin analysis', s: '12 concerns detected' },
                  { v: '94%', l: 'Higher conversion', s: 'with AR try-on' },
                ].map(s => (
                  <div key={s.v} className="glass" style={{ padding: '16px', textAlign: 'center', borderRadius: 12 }}>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.62px', color: 'white' }}>{s.v}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.l}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{s.s}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={() => setStep('welcome')} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
                <button onClick={() => setStep('select')} style={{ padding: '10px 28px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: 'none', background: 'white', color: '#292827', cursor: 'pointer', fontFamily: 'inherit', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'rgb(113,76,182) 0 0 0 1px inset'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  Personalize my experience →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SELECT — parchment canvas ── */}
      {step === 'select' && (
        <div style={{ minHeight: '100vh', background: 'var(--parchment)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--fog)' }}>
            <Logo size={20} />
            <div style={{ display: 'flex', gap: 6 }}>
              {['welcome','demo','select'].map(s => (
                <div key={s} style={{ height: 4, width: s === step ? 28 : 8, borderRadius: 99, background: s === step ? 'var(--iris)' : 'var(--fog)', transition: 'all 0.3s ease' }} />
              ))}
            </div>
            <a href="/catalog" style={{ fontSize: 13, color: 'var(--graphite)', textDecoration: 'none' }}>Skip →</a>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ maxWidth: 560, width: '100%' }} className="anim-up">
              <div style={{ marginBottom: 32 }}>
                <p className="caption" style={{ color: 'var(--iris)', letterSpacing: '0.08em', marginBottom: 8 }}>STEP 03</p>
                <h2 className="h1" style={{ color: 'var(--ink)', marginBottom: 8 }}>Personalize your experience</h2>
                <p className="body" style={{ color: 'var(--graphite)' }}>Select what applies. We'll adapt filters and AI analysis for you.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {CONDITIONS.map(c => {
                  const on = selected.includes(c.id)
                  return (
                    <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on}
                      className={on ? 'card' : 'card'}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left', border: on ? '1px solid var(--iris)' : '1px solid var(--fog)', background: on ? 'rgba(113,76,182,0.04)' : 'var(--bone)', transition: 'all 0.15s ease', fontFamily: 'inherit' }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, border: on ? 'none' : '1.5px solid var(--drift)', background: on ? 'var(--iris)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                        {on && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: on ? 'var(--iris)' : 'var(--ink)', lineHeight: 1.3 }}>{c.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--graphite)', marginTop: 2 }}>{c.sub}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {selected.length > 0 && (
                <div style={{ background: 'rgba(113,76,182,0.06)', border: '1px solid rgba(113,76,182,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--iris)', fontWeight: 500 }}>
                  {selected.length} adaptive filter{selected.length > 1 ? 's' : ''} will be applied to your catalog and AI analysis
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('demo')} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid var(--fog)', background: 'transparent', color: 'var(--graphite)', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
                <button onClick={() => router.push(`/dashboard?c=${selected.join(',')}`)}
                  disabled={selected.length === 0}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, border: 'none', background: selected.length > 0 ? 'var(--ink)' : 'var(--fog)', color: selected.length > 0 ? 'white' : 'var(--graphite)', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => { if (selected.length > 0) e.currentTarget.style.boxShadow = 'rgb(113,76,182) 0 0 0 1px inset' }}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  {selected.length === 0 ? 'Select at least one' : 'Go to my dashboard →'}
                </button>
              </div>
              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--graphite)', marginTop: 12 }}>
                Or <a href="/dashboard" className="iris-link">skip to dashboard</a>
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes dotPop { from { transform:translate(-50%,-50%) scale(0); opacity:0; } to { transform:translate(-50%,-50%) scale(1); opacity:1; } }`}</style>
    </div>
  )
}
