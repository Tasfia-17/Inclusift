'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

type Tab = 'home' | 'studio' | 'catalog' | 'analytics' | 'settings'

const NAV: { id: Tab; label: string }[] = [
  { id: 'home',      label: 'Dashboard' },
  { id: 'studio',    label: 'AI Studio' },
  { id: 'catalog',   label: 'Catalog' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings',  label: 'Settings' },
]

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <aside style={{ width: 200, background: 'var(--aubergine)', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 2, flexShrink: 0 }}>
      <div style={{ padding: '4px 12px', marginBottom: 20 }}>
        <Logo dark size={18} />
      </div>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setTab(n.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', background: tab === n.id ? 'rgba(212,199,255,0.15)' : 'transparent', color: tab === n.id ? '#d4c7ff' : 'rgba(255,255,255,0.45)', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === n.id ? 500 : 460 }}>
          {n.label}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {/* Credits */}
      <div style={{ padding: '12px', borderRadius: 8, background: 'rgba(212,199,255,0.08)', border: '1px solid rgba(212,199,255,0.15)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(212,199,255,0.6)', letterSpacing: '0.06em', marginBottom: 4 }}>API CREDITS</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: 'white', letterSpacing: '-0.3px' }}>847</div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginTop: 6 }}>
          <div style={{ height: '100%', width: '84.7%', background: '#d4c7ff', borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>of 1,000 remaining</div>
      </div>
    </aside>
  )
}

function HomeTab({ conditions }: { conditions: string[] }) {
  const ACTIONS = [
    { label: 'AI Studio',      sub: 'Run full analysis',    href: '/studio',  accent: 'var(--iris)' },
    { label: 'Browse Catalog', sub: 'Adaptive products',    href: '/catalog', accent: '#0d9488' },
    { label: 'Skin Analysis',  sub: 'Beauty insights',      href: '/beauty',  accent: '#d97706' },
    { label: 'Virtual Try-On', sub: 'Clothes & accessories', href: '/tryon',  accent: '#dc2626' },
  ]
  const RECENT = [
    { api: 'Skin Analysis HD',  time: '2 min ago', score: '78/100' },
    { api: 'Clothes VTO',       time: '5 min ago', score: null },
    { api: 'Makeup VTO',        time: '8 min ago', score: null },
    { api: 'Hair Color VTO',    time: '12 min ago', score: null },
  ]
  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="h2" style={{ color: 'var(--ink)', marginBottom: 4 }}>Dashboard</h1>
        <p className="small" style={{ color: 'var(--graphite)' }}>
          {conditions.length > 0 ? `${conditions.length} adaptive filter${conditions.length > 1 ? 's' : ''} active` : 'Your adaptive fashion dashboard'}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {ACTIONS.map(a => (
          <Link key={a.label} href={a.href} style={{ textDecoration: 'none', display: 'block', padding: '20px', borderRadius: 16, background: 'var(--bone)', border: '1px solid var(--fog)', transition: 'border-color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--iris)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--fog)'}>
            <div className="caption" style={{ color: 'var(--iris)', letterSpacing: '0.06em', marginBottom: 8 }}>QUICK ACTION</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{a.label}</div>
            <div className="small" style={{ color: 'var(--graphite)' }}>{a.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent */}
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 16 }}>RECENT API CALLS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RECENT.map(r => (
              <div key={r.api} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="small" style={{ fontWeight: 500, color: 'var(--ink)' }}>{r.api}</div>
                  <div className="caption" style={{ color: 'var(--graphite)' }}>{r.time}</div>
                </div>
                {r.score && <div className="caption" style={{ color: 'var(--iris)', fontWeight: 600 }}>{r.score}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 16 }}>ADAPTIVE FILTERS</div>
          {conditions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {conditions.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(113,76,182,0.06)', border: '1px solid rgba(113,76,182,0.15)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--iris)' }} />
                  <span className="small" style={{ color: 'var(--ink)', fontWeight: 500 }}>{c.replace(/_/g, ' ')}</span>
                </div>
              ))}
              <Link href="/profile" className="iris-link" style={{ marginTop: 4 }}>Edit filters →</Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="small" style={{ color: 'var(--graphite)', marginBottom: 8 }}>No filters active</div>
              <Link href="/profile" className="iris-link">Set up profile →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const SKIN = [
    { l: 'Pores', v: 72 }, { l: 'Moisture', v: 85 }, { l: 'Radiance', v: 68 },
    { l: 'Texture', v: 79 }, { l: 'Firmness', v: 61 }, { l: 'Acne', v: 88 },
  ]
  const APIS = [
    { l: 'Skin Analysis', n: 12 }, { l: 'Clothes VTO', n: 8 }, { l: 'Makeup VTO', n: 6 },
    { l: 'Hair Color', n: 4 }, { l: 'Earring VTO', n: 3 }, { l: 'Face Analysis', n: 12 },
  ]
  const max = Math.max(...APIS.map(a => a.n))
  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      <h1 className="h2" style={{ color: 'var(--ink)', marginBottom: 24 }}>Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[{ v: '45', l: 'Total API calls', d: '+12 today' }, { v: '153', l: 'Credits used', d: '847 remaining' }, { v: '6', l: 'APIs activated', d: 'of 8 available' }].map(s => (
          <div key={s.v} className="card" style={{ padding: 20 }}>
            <div className="h2" style={{ color: 'var(--ink)' }}>{s.v}</div>
            <div className="small" style={{ color: 'var(--graphite)', marginTop: 2 }}>{s.l}</div>
            <div className="caption" style={{ color: 'var(--iris)', marginTop: 4, fontWeight: 600 }}>{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 16 }}>SKIN SCORES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SKIN.map(d => (
              <div key={d.l}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span className="small" style={{ color: 'var(--graphite)', fontWeight: 500 }}>{d.l}</span>
                  <span className="small" style={{ color: 'var(--ink)', fontWeight: 600 }}>{d.v}</span>
                </div>
                <div style={{ height: 4, background: 'var(--fog)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${d.v}%`, background: d.v >= 75 ? '#22c55e' : d.v >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 16 }}>API USAGE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {APIS.map(a => (
              <div key={a.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="caption" style={{ color: 'var(--graphite)', width: 96, flexShrink: 0 }}>{a.l}</div>
                <div style={{ flex: 1, height: 6, background: 'var(--fog)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${(a.n / max) * 100}%`, background: 'var(--iris)', borderRadius: 99 }} />
                </div>
                <div className="caption" style={{ color: 'var(--ink)', fontWeight: 600, width: 16, textAlign: 'right' }}>{a.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsTab({ conditions }: { conditions: string[] }) {
  const [voice, setVoice] = useState(true)
  const [hc, setHc] = useState(false)
  const [auto, setAuto] = useState(true)

  const Toggle = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!on)} style={{ width: 38, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', background: on ? 'var(--iris)' : 'var(--fog)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )

  const Row = ({ label, sub, on, set }: { label: string; sub: string; on: boolean; set: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--fog)' }}>
      <div>
        <div className="small" style={{ fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
        <div className="caption" style={{ color: 'var(--graphite)', marginTop: 1 }}>{sub}</div>
      </div>
      <Toggle on={on} set={set} />
    </div>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      <h1 className="h2" style={{ color: 'var(--ink)', marginBottom: 24 }}>Settings</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 4 }}>ACCESSIBILITY</div>
          <Row label="Voice output" sub="Read results aloud automatically" on={voice} set={setVoice} />
          <Row label="High contrast mode" sub="Increase visual contrast" on={hc} set={setHc} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 4 }}>AI SETTINGS</div>
          <Row label="Auto-run all APIs" sub="Run all 6 APIs automatically on photo upload" on={auto} set={setAuto} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="caption" style={{ color: 'var(--graphite)', letterSpacing: '0.06em', marginBottom: 12 }}>ADAPTIVE PROFILE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {conditions.length > 0 ? conditions.map(c => (
              <div key={c} style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 999, background: 'rgba(113,76,182,0.08)', border: '1px solid rgba(113,76,182,0.2)', color: 'var(--iris)' }}>
                {c.replace(/_/g, ' ')}
              </div>
            )) : <div className="small" style={{ color: 'var(--graphite)' }}>No conditions set</div>}
          </div>
          <Link href="/profile" className="iris-link">Update profile →</Link>
        </div>
      </div>
    </div>
  )
}

function DashboardContent() {
  const sp = useSearchParams()
  const conditions = sp.get('c')?.split(',').filter(Boolean) || []
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--parchment)', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}>
      <Sidebar tab={tab} setTab={setTab} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 52, borderBottom: '1px solid var(--fog)', background: 'var(--parchment)', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div className="small" style={{ color: 'var(--graphite)' }}>{NAV.find(n => n.id === tab)?.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/studio" className="btn-lavender" style={{ fontSize: 13, padding: '6px 14px' }}>New Analysis</Link>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--iris)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 600 }}>U</div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--parchment)' }}>
          {tab === 'home'      && <HomeTab conditions={conditions} />}
          {tab === 'studio'    && <div style={{ flex: 1 }}><iframe src={`/studio?c=${conditions.join(',')}`} style={{ width: '100%', height: '100%', border: 'none' }} title="AI Studio" /></div>}
          {tab === 'catalog'   && <div style={{ flex: 1 }}><iframe src={`/catalog?c=${conditions.join(',')}`} style={{ width: '100%', height: '100%', border: 'none' }} title="Catalog" /></div>}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'settings'  && <SettingsTab conditions={conditions} />}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--parchment)' }} />}><DashboardContent /></Suspense>
}
