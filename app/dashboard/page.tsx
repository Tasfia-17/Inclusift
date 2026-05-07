'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

type Tab = 'home' | 'studio' | 'catalog' | 'analytics' | 'settings'

const NAV = [
  { id: 'home',      icon: '⊞',  label: 'Dashboard' },
  { id: 'studio',    icon: '✦',  label: 'AI Studio' },
  { id: 'catalog',   icon: '◫',  label: 'Catalog' },
  { id: 'analytics', icon: '◈',  label: 'Analytics' },
  { id: 'settings',  icon: '⊙',  label: 'Settings' },
] as const

/* ── Sidebar ── */
function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <aside style={{ width: 220, background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 12px', gap: 4, flexShrink: 0 }}>
      <div style={{ padding: '8px 12px', marginBottom: 16 }}>
        <Logo size={24} />
      </div>
      {NAV.map(n => (
        <button key={n.id} onClick={() => setTab(n.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', background: tab === n.id ? 'rgba(124,58,237,0.15)' : 'transparent', color: tab === n.id ? '#c4b5fd' : 'rgba(255,255,255,0.4)', fontFamily: 'inherit', fontSize: 14, fontWeight: tab === n.id ? 600 : 400 }}>
          <span style={{ fontSize: 16, opacity: tab === n.id ? 1 : 0.6 }}>{n.icon}</span>
          {n.label}
          {tab === n.id && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }} />}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', marginBottom: 4 }}>API Credits</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>847</div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, marginTop: 6 }}>
          <div style={{ height: '100%', width: '84.7%', background: 'linear-gradient(90deg,#7c3aed,#ec4899)', borderRadius: 99 }} />
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>of 1,000 remaining</div>
      </div>
    </aside>
  )
}

/* ── Home tab ── */
function HomeTab({ conditions }: { conditions: string[] }) {
  const QUICK_ACTIONS = [
    { icon: '✦', label: 'AI Studio', sub: 'Run full analysis', href: '/studio', color: '#7c3aed' },
    { icon: '◫', label: 'Browse Catalog', sub: 'Adaptive products', href: '/catalog', color: '#ec4899' },
    { icon: '✨', label: 'Skin Analysis', sub: 'Beauty insights', href: '/beauty', color: '#0d9488' },
    { icon: '👗', label: 'Try On', sub: 'Virtual fitting', href: '/tryon', color: '#d97706' },
  ]

  const RECENT_APIS = [
    { api: 'Skin Analysis HD', time: '2 min ago', status: 'done', score: 78 },
    { api: 'Clothes VTO', time: '5 min ago', status: 'done', score: null },
    { api: 'Makeup VTO', time: '8 min ago', status: 'done', score: null },
    { api: 'Hair Color VTO', time: '12 min ago', status: 'done', score: null },
  ]

  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 4 }}>
          Welcome back ✦
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          {conditions.length > 0
            ? `${conditions.length} adaptive filter${conditions.length > 1 ? 's' : ''} active · Catalog personalized for you`
            : 'Your adaptive fashion dashboard'}
        </p>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
        {QUICK_ACTIONS.map(a => (
          <Link key={a.label} href={a.href} style={{ textDecoration: 'none', display: 'block', padding: '20px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${a.color}15`; e.currentTarget.style.borderColor = `${a.color}40` }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 24, marginBottom: 10, color: a.color }}>{a.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{a.sub}</div>
          </Link>
        ))}
      </div>

      {/* Two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent activity */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>RECENT API CALLS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {RECENT_APIS.map(r => (
              <div key={r.api} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{r.api}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{r.time}</div>
                </div>
                {r.score && <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>{r.score}/100</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Active filters */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>ADAPTIVE FILTERS</div>
          {conditions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {conditions.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                  <span style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 500 }}>{c.replace(/_/g, ' ')}</span>
                </div>
              ))}
              <Link href="/profile" style={{ fontSize: 12, color: 'rgba(124,58,237,0.7)', textDecoration: 'none', marginTop: 4 }}>Edit filters →</Link>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>No filters active</div>
              <Link href="/profile" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Set up profile →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Analytics tab ── */
function AnalyticsTab() {
  const SKIN_DATA = [
    { label: 'Pores', score: 72, color: '#7c3aed' },
    { label: 'Moisture', score: 85, color: '#0d9488' },
    { label: 'Radiance', score: 68, color: '#d97706' },
    { label: 'Texture', score: 79, color: '#ec4899' },
    { label: 'Firmness', score: 61, color: '#0284c7' },
    { label: 'Acne', score: 88, color: '#16a34a' },
  ]

  const API_USAGE = [
    { api: 'Skin Analysis', calls: 12, color: '#7c3aed' },
    { api: 'Clothes VTO', calls: 8, color: '#ec4899' },
    { api: 'Makeup VTO', calls: 6, color: '#0d9488' },
    { api: 'Hair Color', calls: 4, color: '#d97706' },
    { api: 'Earring VTO', calls: 3, color: '#0284c7' },
    { api: 'Face Analysis', calls: 12, color: '#16a34a' },
  ]
  const maxCalls = Math.max(...API_USAGE.map(a => a.calls))

  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { v: '45', l: 'Total API calls', delta: '+12 today' },
          { v: '153', l: 'Credits used', delta: '847 remaining' },
          { v: '6', l: 'APIs activated', delta: 'of 8 available' },
        ].map(s => (
          <div key={s.v} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{s.v}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.l}</div>
            <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 4, fontWeight: 600 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Skin scores */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>SKIN ANALYSIS SCORES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SKIN_DATA.map(d => (
              <div key={d.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{d.label}</span>
                  <span style={{ color: 'white', fontWeight: 700 }}>{d.score}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 99, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API usage */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>API USAGE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {API_USAGE.map(a => (
              <div key={a.api} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', width: 90, flexShrink: 0 }}>{a.api}</div>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${(a.calls / maxCalls) * 100}%`, background: a.color, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'white', width: 20, textAlign: 'right' }}>{a.calls}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Settings tab ── */
function SettingsTab({ conditions }: { conditions: string[] }) {
  const [voice, setVoice] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [autoAnalyze, setAutoAnalyze] = useState(true)

  const Toggle = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => (
    <button onClick={() => set(!on)} style={{ width: 40, height: 22, borderRadius: 99, border: 'none', cursor: 'pointer', background: on ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </button>
  )

  return (
    <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 24 }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
        {/* Accessibility */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>ACCESSIBILITY</div>
          {[
            { label: 'Voice output', sub: 'Read results aloud automatically', val: voice, set: setVoice },
            { label: 'High contrast mode', sub: 'Increase visual contrast', val: highContrast, set: setHighContrast },
            { label: 'Large text', sub: 'Increase font sizes throughout', val: largeText, set: setLargeText },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{s.sub}</div>
              </div>
              <Toggle on={s.val} set={s.set} />
            </div>
          ))}
        </div>

        {/* AI Settings */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>AI SETTINGS</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>Auto-run all APIs</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Run all 6 APIs automatically on photo upload</div>
            </div>
            <Toggle on={autoAnalyze} set={setAutoAnalyze} />
          </div>
        </div>

        {/* Profile */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', marginBottom: 16 }}>ADAPTIVE PROFILE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {conditions.length > 0 ? conditions.map(c => (
              <div key={c} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
                {c.replace(/_/g, ' ')}
              </div>
            )) : <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No conditions set</div>}
          </div>
          <Link href="/profile" style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Update profile →</Link>
        </div>
      </div>
    </div>
  )
}

/* ── Catalog embed ── */
function CatalogTab({ conditions }: { conditions: string[] }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Catalog</h1>
        <Link href={`/catalog?c=${conditions.join(',')}`} style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Open full catalog →</Link>
      </div>
      <iframe src={`/catalog?c=${conditions.join(',')}&embed=1`} style={{ flex: 1, border: 'none', background: 'white' }} title="Adaptive Catalog" />
    </div>
  )
}

/* ── Studio embed ── */
function StudioTab({ conditions }: { conditions: string[] }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>AI Studio</h1>
        <Link href={`/studio?c=${conditions.join(',')}`} style={{ fontSize: 13, color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>Open full studio →</Link>
      </div>
      <iframe src={`/studio?c=${conditions.join(',')}`} style={{ flex: 1, border: 'none', background: '#0a0a0f' }} title="AI Studio" />
    </div>
  )
}

/* ── Dashboard ── */
function DashboardContent() {
  const sp = useSearchParams()
  const conditions = sp.get('c')?.split(',').filter(Boolean) || []
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0f', color: 'white', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", overflow: 'hidden' }}>
      <Sidebar tab={tab} setTab={setTab} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            {NAV.find(n => n.id === tab)?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/studio" style={{ fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 99, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', textDecoration: 'none', boxShadow: '0 2px 12px rgba(124,58,237,0.4)' }}>
              ✦ New Analysis
            </Link>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              👤
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {tab === 'home'      && <HomeTab conditions={conditions} />}
          {tab === 'studio'    && <StudioTab conditions={conditions} />}
          {tab === 'catalog'   && <CatalogTab conditions={conditions} />}
          {tab === 'analytics' && <AnalyticsTab />}
          {tab === 'settings'  && <SettingsTab conditions={conditions} />}
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}><DashboardContent /></Suspense>
}
