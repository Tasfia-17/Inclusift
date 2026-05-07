'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

const CATS = ['all','clothing','footwear','beauty','hair','jewelry']

// Advanced filter options
const CLOSURE_OPTS = ['any','magnetic_snap','velcro','zip','none','slip_on','side_zip','elastic']
const WAISTBAND_OPTS = ['any','elastic','adjustable','rigid','none']
const FIT_OPTS = ['any','loose','relaxed','compression']
const CONTAINER_OPTS = ['any','pump','squeeze','twist','spray','wide_grip']

function CatalogContent() {
  const sp = useSearchParams()
  const conditions = sp.get('c')?.split(',').filter(Boolean) || []

  const [cat, setCat] = useState('all')
  const [list, setList] = useState(products)
  const [showFilters, setShowFilters] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)

  // Advanced filters
  const [closure, setClosure] = useState('any')
  const [waistband, setWaistband] = useState('any')
  const [fit, setFit] = useState('any')
  const [container, setContainer] = useState('any')
  const [afoOnly, setAfoOnly] = useState(false)

  // Session save — restore last filters from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('inclusift_filters')
      if (saved) {
        const f = JSON.parse(saved)
        if (f.cat) setCat(f.cat)
        if (f.closure) setClosure(f.closure)
        if (f.waistband) setWaistband(f.waistband)
        if (f.fit) setFit(f.fit)
        if (f.container) setContainer(f.container)
        if (f.afoOnly !== undefined) setAfoOnly(f.afoOnly)
      }
    } catch {}
  }, [])

  // Save filters to localStorage on change
  useEffect(() => {
    try { localStorage.setItem('inclusift_filters', JSON.stringify({ cat, closure, waistband, fit, container, afoOnly })) } catch {}
  }, [cat, closure, waistband, fit, container, afoOnly])

  // Filter logic
  useEffect(() => {
    let r = products as any[]
    // Profile conditions
    if (conditions.length) {
      r = r.filter(p => {
        if (conditions.includes('shorter_limbs') && p.adaptive?.length === 'petite') return true
        if (conditions.includes('limited_dexterity') && (p.adaptive?.closure_type === 'magnetic_snap' || p.adaptive?.closure_type === 'velcro' || p.adaptive?.waistband === 'elastic' || p.adaptive?.container_type === 'pump' || p.adaptive?.grip_difficulty === 'easy')) return true
        if (conditions.includes('afo_user') && p.adaptive?.afo_compatible) return true
        if (conditions.includes('loose_fit') && (p.adaptive?.fit_style === 'loose' || p.adaptive?.fit_style === 'relaxed')) return true
        if (conditions.includes('hair_loss') && p.category === 'hair') return true
        if (conditions.includes('visual_impairment')) return true // show all, voice reads them
        if (conditions.includes('hearing_aid') && (p.adaptive?.hearing_aid_compatible || p.category === 'jewelry')) return true
        return p.tags?.some((t: string) => conditions.includes(t))
      })
    }
    // Category
    if (cat !== 'all') r = r.filter(p => p.category === cat)
    // Advanced filters
    if (closure !== 'any') r = r.filter(p => p.adaptive?.closure_type === closure)
    if (waistband !== 'any') r = r.filter(p => p.adaptive?.waistband === waistband)
    if (fit !== 'any') r = r.filter(p => p.adaptive?.fit_style === fit)
    if (container !== 'any') r = r.filter(p => p.adaptive?.container_type === container)
    if (afoOnly) r = r.filter(p => p.adaptive?.afo_compatible === true)
    setList(r)
  }, [conditions.join(','), cat, closure, waistband, fit, container, afoOnly])

  // Voice commands
  const speak = useCallback((t: string) => {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)) }
  }, [])

  const startVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      speak('Voice commands are not supported in this browser.')
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.onstart = () => setVoiceActive(true)
    rec.onend = () => setVoiceActive(false)
    rec.onresult = (e: any) => {
      const cmd = e.results[0][0].transcript.toLowerCase()
      if (cmd.includes('loose') || cmd.includes('easy wear')) { setFit('loose'); speak('Showing loose fitting items.') }
      else if (cmd.includes('afo') || cmd.includes('brace')) { setAfoOnly(true); speak('Showing AFO compatible footwear.') }
      else if (cmd.includes('beauty') || cmd.includes('makeup')) { setCat('beauty'); speak('Showing beauty products.') }
      else if (cmd.includes('clothing') || cmd.includes('clothes')) { setCat('clothing'); speak('Showing clothing.') }
      else if (cmd.includes('shoes') || cmd.includes('footwear')) { setCat('footwear'); speak('Showing footwear.') }
      else if (cmd.includes('hair') || cmd.includes('wig')) { setCat('hair'); speak('Showing hair and wigs.') }
      else if (cmd.includes('all') || cmd.includes('everything')) { setCat('all'); speak('Showing all products.') }
      else if (cmd.includes('clear') || cmd.includes('reset')) { setClosure('any'); setWaistband('any'); setFit('any'); setContainer('any'); setAfoOnly(false); speak('Filters cleared.') }
      else speak(`I heard: ${cmd}. Try saying: loose fit, AFO, beauty, clothing, shoes, or clear filters.`)
    }
    rec.start()
  }, [speak])

  const activeFilterCount = [closure!=='any', waistband!=='any', fit!=='any', container!=='any', afoOnly].filter(Boolean).length

  return (
    <div style={{ background:'var(--parchment)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'88px 32px 80px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <h1 className="h2" style={{ color:'var(--ink)' }}>Adaptive Catalog</h1>
            <p className="small" style={{ color:'var(--graphite)', marginTop:4 }}>
              {list.length} products{conditions.length ? ` · ${conditions.length} profile filter${conditions.length>1?'s':''} active` : ''}
            </p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {/* Voice command button */}
            <button onClick={startVoice}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, border:'1px solid var(--fog)', background: voiceActive ? 'rgba(113,76,182,0.08)' : 'var(--bone)', color: voiceActive ? 'var(--iris)' : 'var(--graphite)', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
              aria-label="Voice commands">
              <span style={{ fontSize:14 }}>{voiceActive ? '🔴' : '🎤'}</span>
              {voiceActive ? 'Listening...' : 'Voice'}
            </button>
            {/* Advanced filters toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, border: showFilters ? '1.5px solid var(--iris)' : '1px solid var(--fog)', background: showFilters ? 'rgba(113,76,182,0.04)' : 'var(--bone)', color: showFilters ? 'var(--iris)' : 'var(--graphite)', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
              Filters {activeFilterCount > 0 && <span style={{ background:'var(--iris)', color:'white', borderRadius:'50%', width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{activeFilterCount}</span>}
            </button>
            {conditions.length > 0 && <Link href="/profile" className="iris-link">Edit profile</Link>}
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="card" style={{ padding:20, marginBottom:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
              {[
                { label:'Closure type', val:closure, set:setClosure, opts:CLOSURE_OPTS },
                { label:'Waistband', val:waistband, set:setWaistband, opts:WAISTBAND_OPTS },
                { label:'Fit style', val:fit, set:setFit, opts:FIT_OPTS },
                { label:'Container type', val:container, set:setContainer, opts:CONTAINER_OPTS },
              ].map(f => (
                <div key={f.label}>
                  <div className="caption" style={{ color:'var(--graphite)', marginBottom:6 }}>{f.label}</div>
                  <select value={f.val} onChange={e => f.set(e.target.value)}
                    style={{ width:'100%', padding:'7px 10px', borderRadius:8, border:'1px solid var(--fog)', background:'var(--bone)', color:'var(--ink)', fontSize:13, fontFamily:'inherit', cursor:'pointer' }}>
                    {f.opts.map(o => <option key={o} value={o}>{o === 'any' ? 'Any' : o.replace(/_/g,' ')}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={afoOnly} onChange={e => setAfoOnly(e.target.checked)}
                    style={{ width:16, height:16, accentColor:'var(--iris)', cursor:'pointer' }} />
                  <span style={{ fontSize:13, color:'var(--ink)', fontWeight:500 }}>AFO compatible only</span>
                </label>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={() => { setClosure('any'); setWaistband('any'); setFit('any'); setContainer('any'); setAfoOnly(false) }}
                className="iris-link" style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:12, display:'block', fontSize:13 }}>
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:24, overflowX:'auto', paddingBottom:4 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={cat===c?'tab-active':'tab-inactive'} style={{ fontFamily:'inherit', fontSize:14, whiteSpace:'nowrap' }}>
              {c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
          {list.map((p: any) => (
            <div key={p.id} className="card" style={{ overflow:'hidden', transition:'border-color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--iris)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--fog)'}>
              <div style={{ height:200, overflow:'hidden', background:'var(--fog)' }}>
                <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
              </div>
              <div style={{ padding:'16px' }}>
                <div className="caption" style={{ color:'var(--graphite)', textTransform:'capitalize', marginBottom:4 }}>{p.category}</div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:4 }}>{p.name}</div>
                <div className="small" style={{ color:'var(--graphite)', marginBottom:10, lineHeight:1.4 }}>{p.desc}</div>
                {p.adaptive_highlights?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
                    {(p.adaptive_highlights as string[]).slice(0,3).map((h:string) => (
                      <span key={h} style={{ fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:999, background:'rgba(113,76,182,0.08)', color:'var(--iris)', border:'1px solid rgba(113,76,182,0.15)' }}>{h}</span>
                    ))}
                  </div>
                )}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:16, fontWeight:600, color:'var(--ink)' }}>${p.price}</span>
                  <Link
                    href={
                      p.category === 'beauty' ? '/beauty' :
                      p.category === 'footwear' ? `/shoes?product=${p.id}` :
                      p.category === 'hair' ? '/hair' :
                      `/tryon?product=${p.id}`
                    }
                    className="btn-ghost btn-sm">
                    {p.category === 'beauty' ? 'Analyze' : p.category === 'footwear' ? 'Try shoes' : p.category === 'hair' ? 'Try style' : 'Try on'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--graphite)' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>◈</div>
            <div style={{ fontWeight:500, marginBottom:8 }}>No products match your filters</div>
            <button onClick={() => { setClosure('any'); setWaistband('any'); setFit('any'); setContainer('any'); setAfoOnly(false) }}
              className="iris-link" style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', marginRight:12 }}>
              Clear filters
            </button>
            <Link href="/profile" className="iris-link">Update profile</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'var(--parchment)' }} />}><CatalogContent /></Suspense>
}
