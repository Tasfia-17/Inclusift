'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

const CONDITIONS = [
  { id: 'shorter_limbs',     emoji: '📏', label: 'Shorter limbs',       sub: 'Achondroplasia, dwarfism',         color: '#f5f3ff', border: '#c4b5fd', text: '#5b21b6', dot: '#7c3aed' },
  { id: 'limited_dexterity', emoji: '🤲', label: 'Limited dexterity',   sub: 'Muscular dystrophy, MS',           color: '#fdf2f8', border: '#f9a8d4', text: '#9d174d', dot: '#ec4899' },
  { id: 'afo_user',          emoji: '🦿', label: 'AFO / brace user',    sub: 'GNE myopathy, cerebral palsy',     color: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#d97706' },
  { id: 'loose_fit',         emoji: '🧘', label: 'Loose / easy-wear',   sub: 'SMA, fatigue conditions',          color: '#f0fdf4', border: '#86efac', text: '#14532d', dot: '#16a34a' },
  { id: 'hair_loss',         emoji: '💆', label: 'Hair loss / wigs',     sub: 'Alopecia, cancer treatment',       color: '#fff7ed', border: '#fdba74', text: '#7c2d12', dot: '#ea580c' },
  { id: 'visual_impairment', emoji: '👁️', label: 'Visual impairment',   sub: 'Low vision, blindness',            color: '#f0f9ff', border: '#7dd3fc', text: '#0c4a6e', dot: '#0284c7' },
]

export default function ProfilePage() {
  const [selected, setSelected] = useState<string[]>([])
  const [step, setStep] = useState<'select' | 'confirm'>('select')
  const router = useRouter()

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const proceed = () => {
    if (selected.length === 0) return
    router.push(`/studio?c=${selected.join(',')}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(124,58,237,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(236,72,153,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 600, position: 'relative', zIndex: 1 }}>
        {/* Logo + back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo size={28} />
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.02em' }}>InclusiFit</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--stone)', padding: '4px 12px', borderRadius: 99 }}>
            Step 1 of 2
          </div>
        </div>

        {/* Header */}
        <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 4s ease-in-out infinite' }}>✨</div>
          <h1 className="serif" style={{ fontSize: 36, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Tell us about yourself
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
            Select what applies. We'll personalize your entire experience.
          </p>
        </div>

        {/* Condition cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {CONDITIONS.map((c, i) => {
            const on = selected.includes(c.id)
            return (
              <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on}
                className="anim-fade-up"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
                  border: on ? `2px solid ${c.border}` : '2px solid var(--border)',
                  background: on ? c.color : 'var(--surface)',
                  textAlign: 'left', transition: 'all 0.2s cubic-bezier(0.19,1,0.22,1)',
                  transform: on ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: on ? `0 4px 20px ${c.dot}22` : '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: on ? `${c.dot}18` : 'var(--stone)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, transition: 'all 0.2s',
                  transform: on ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {c.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: on ? c.text : 'var(--ink)', lineHeight: 1.2 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.3 }}>{c.sub}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: on ? c.dot : 'transparent',
                  border: on ? 'none' : '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {on && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected summary */}
        {selected.length > 0 && (
          <div className="slide-up" style={{ background: 'linear-gradient(135deg,#f5f3ff,#fdf2f8)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                {selected.length} condition{selected.length > 1 ? 's' : ''} selected
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                We'll auto-apply adaptive filters and run personalized AI analysis
              </div>
            </div>
          </div>
        )}

        <button onClick={proceed} disabled={selected.length === 0}
          className="btn btn-accent"
          style={{ width: '100%', fontSize: 15, padding: '14px 0', opacity: selected.length === 0 ? 0.35 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer', borderRadius: 14 }}>
          {selected.length === 0 ? 'Select at least one' : 'Continue to AI Studio →'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
          You can skip this and browse the full catalog instead.{' '}
          <a href="/catalog" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Browse all →</a>
        </p>
      </div>
    </div>
  )
}
