'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

const CATS = ['all','clothing','footwear','beauty','hair','jewelry']

const BADGE: Record<string, [string,string]> = {
  magnetic_snap:  ['Magnetic snap',  '#ede9fe #5b21b6'],
  velcro:         ['Velcro',         '#dbeafe #1d4ed8'],
  elastic:        ['Elastic waist',  '#dcfce7 #15803d'],
  loose:          ['Loose fit',      '#fef3c7 #92400e'],
  afo_compatible: ['AFO ✓',          '#fef9c3 #854d0e'],
  pump:           ['Pump dispenser', '#ccfbf1 #0f766e'],
  front_opening:  ['Front opening',  '#fce7f3 #9d174d'],
}

function getBadges(p: any) {
  const a = p.adaptive || {}
  const b: string[] = []
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
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 className="serif" style={{ fontSize: 32, color: 'var(--ink)' }}>Adaptive Catalog</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              {list.length} products{conditions.length ? ' · filtered for your profile' : ''}
            </p>
          </div>
          {conditions.length > 0 && (
            <Link href="/profile" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>Edit profile</Link>
          )}
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '7px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              background: cat === c ? 'var(--ink)' : 'var(--surface)',
              color: cat === c ? 'var(--canvas)' : 'var(--muted)',
              boxShadow: cat === c ? 'none' : '#e8e6e3 0px 0px 0px 1px inset',
            }}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {list.map(p => {
            const bs = getBadges(p)
            return (
              <div key={p.id} className="card" style={{ overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'rgba(0,0,0,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.08) 0px 8px 24px' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 8px' }}>
                <div style={{ height: 200, overflow: 'hidden', background: 'var(--stone)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                </div>
                <div style={{ padding: '16px 16px 20px' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 4 }}>{p.category}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--body)', marginBottom: 10, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</div>

                  {bs.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {bs.slice(0,3).map(b => {
                        const [label, colors] = BADGE[b] || [b, '#f3f4f6 #374151']
                        const [bg, fg] = colors.split(' ')
                        return (
                          <span key={b} className="tag" style={{ background: bg, color: fg }}>{label}</span>
                        )
                      })}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>${p.price}</span>
                    <Link href={p.category === 'beauty' ? '/beauty' : `/tryon?product=${p.id}`}
                      className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
                      {p.category === 'beauty' ? 'Analyze' : 'Try on'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 500 }}>No products match your filters</div>
            <Link href="/profile" style={{ fontSize: 13, color: 'var(--accent)', marginTop: 8, display: 'inline-block' }}>Update profile</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--canvas)' }} />}>
      <CatalogContent />
    </Suspense>
  )
}
