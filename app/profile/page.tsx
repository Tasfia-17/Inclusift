'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'

const CONDITIONS = [
  { id: 'shorter_limbs',     icon: '📏', label: 'Shorter limbs',         sub: 'Achondroplasia, dwarfism' },
  { id: 'limited_dexterity', icon: '🤲', label: 'Limited dexterity',     sub: 'Muscular dystrophy, MS, Parkinson\'s' },
  { id: 'afo_user',          icon: '🦿', label: 'AFO / brace user',      sub: 'GNE myopathy, cerebral palsy' },
  { id: 'loose_fit',         icon: '🧘', label: 'Loose / easy-wear',     sub: 'SMA, fatigue conditions' },
  { id: 'hair_loss',         icon: '💆', label: 'Hair loss / wigs',       sub: 'Alopecia, cancer treatment' },
  { id: 'visual_impairment', icon: '👁️', label: 'Visual impairment',     sub: 'Low vision, blindness' },
]

export default function ProfilePage() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()
  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 className="serif" style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 8 }}>Your profile</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Select what applies. We'll filter the catalog for you.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CONDITIONS.map(c => {
            const on = selected.includes(c.id)
            return (
              <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, border: on ? '1.5px solid #c4b5fd' : '1.5px solid var(--border)',
                  background: on ? '#faf5ff' : 'var(--surface)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                  boxShadow: on ? 'rgba(124,58,237,0.08) 0px 0px 0px 3px' : 'none',
                }}>
                <span style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: on ? '#5b21b6' : 'var(--ink)' }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{c.sub}</div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: on ? 'none' : '1.5px solid var(--border)',
                  background: on ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {on && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={() => router.push(`/catalog?c=${selected.join(',')}`)}
          disabled={selected.length === 0}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 24, fontSize: 15, padding: '13px 0', opacity: selected.length === 0 ? 0.35 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}>
          Continue →
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>You can update this anytime</p>
      </div>
    </div>
  )
}
