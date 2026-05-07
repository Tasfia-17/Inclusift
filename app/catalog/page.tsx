'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

const CATS = ['all','clothing','footwear','beauty','hair','jewelry']
const BADGE: Record<string, [string, string]> = {
  magnetic_snap:  ['Magnetic snap',  'rgba(113,76,182,0.08) var(--iris)'],
  velcro:         ['Velcro',         'rgba(13,148,136,0.08) #0d9488'],
  elastic:        ['Elastic waist',  'rgba(22,163,74,0.08) #16a34a'],
  loose:          ['Loose fit',      'rgba(217,119,6,0.08) #d97706'],
  afo_compatible: ['AFO ✓',          'rgba(220,38,38,0.08) #dc2626'],
  pump:           ['Pump dispenser', 'rgba(2,132,199,0.08) #0284c7'],
  front_opening:  ['Front opening',  'rgba(113,76,182,0.08) var(--iris)'],
}
function getBadges(p: any) {
  const a = p.adaptive || {}, b: string[] = []
  if (a.closure_type === 'magnetic_snap') b.push('magnetic_snap')
  if (a.closure_type === 'velcro') b.push('velcro')
  if (a.waistband === 'elastic') b.push('elastic')
  if (a.fit_style === 'loose') b.push('loose')
  if (a.afo_compatible) b.push('afo_compatible')
  if (a.container_type === 'pump') b.push('pump')
  if (a.dressing_method === 'front_opening') b.push('front_opening')
  return b
}

function CatalogContent() {
  const sp = useSearchParams()
  const conditions = sp.get('c')?.split(',').filter(Boolean) || []
  const [cat, setCat] = useState('all')
  const [list, setList] = useState(products)
  useEffect(() => {
    let r = products
    if (conditions.length) r = r.filter(p => p.tags.some(t => conditions.includes(t)))
    if (cat !== 'all') r = r.filter(p => p.category === cat)
    setList(r)
  }, [conditions.join(','), cat])

  return (
    <div style={{ background: 'var(--parchment)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 32px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 className="h2" style={{ color: 'var(--ink)' }}>Adaptive Catalog</h1>
            <p className="small" style={{ color: 'var(--graphite)', marginTop: 4 }}>{list.length} products{conditions.length ? ' · filtered for your profile' : ''}</p>
          </div>
          {conditions.length > 0 && <Link href="/profile" className="iris-link">Edit profile</Link>}
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={cat === c ? 'tab-active' : 'tab-inactive'} style={{ fontFamily: 'inherit', fontSize: 14 }}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {list.map(p => {
            const bs = getBadges(p)
            return (
              <div key={p.id} className="card" style={{ overflow: 'hidden', transition: 'border-color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--iris)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--fog)'}>
                <div style={{ height: 200, overflow: 'hidden', background: 'var(--fog)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: '16px' }}>
                  <div className="caption" style={{ color: 'var(--graphite)', textTransform: 'capitalize', marginBottom: 4 }}>{p.category}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{p.name}</div>
                  <div className="small" style={{ color: 'var(--graphite)', marginBottom: 10, lineHeight: 1.4 }}>{p.desc}</div>
                  {bs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {bs.slice(0,3).map(b => {
                        const [label, colors] = BADGE[b] || [b, 'var(--fog) var(--graphite)']
                        const [bg, fg] = colors.split(' ')
                        return <span key={b} style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999, background: bg, color: fg }}>{label}</span>
                      })}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>${p.price}</span>
                    <Link href={p.category === 'beauty' ? '/beauty' : `/tryon?product=${p.id}`} className="btn-ghost btn-sm">
                      {p.category === 'beauty' ? 'Analyze' : 'Try on'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--graphite)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>No products match your filters</div>
            <Link href="/profile" className="iris-link">Update profile</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--parchment)' }} />}><CatalogContent /></Suspense>
}
