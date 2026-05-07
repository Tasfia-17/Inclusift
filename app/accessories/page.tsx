'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

type S = 'idle'|'uploading'|'processing'|'done'|'error'

const CATEGORIES = [
  {
    id: 'ring', label: 'Ring', icon: '💍', endpoint: 'ring', pollEndpoint: 'ring',
    uploadHint: 'Hand photo · Fingers visible · Good lighting',
    items: [
      { id: 'r1', name: 'Diamond Solitaire', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=90', price: 299 },
      { id: 'r2', name: 'Gold Band', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=90', price: 149 },
    ]
  },
  {
    id: 'bracelet', label: 'Bracelet', icon: '📿', endpoint: 'bracelet', pollEndpoint: 'bracelet',
    uploadHint: 'Wrist photo · Side view · Good lighting',
    items: [
      { id: 'b1', name: 'Magnetic Clasp Bracelet', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=90', price: 89, adaptive: 'Magnetic clasp — one-handed' },
      { id: 'b2', name: 'Stretch Bead Bracelet', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=90', price: 45, adaptive: 'Stretch — no clasp needed' },
    ]
  },
  {
    id: 'watch', label: 'Watch', icon: '⌚', endpoint: 'watch', pollEndpoint: 'watch',
    uploadHint: 'Wrist photo · Side view · Good lighting',
    items: [
      { id: 'w1', name: 'Easy-Clasp Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=90', price: 199, adaptive: 'Magnetic clasp — one-handed' },
      { id: 'w2', name: 'Velcro Strap Watch', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=90', price: 129, adaptive: 'Velcro strap — easy on/off' },
    ]
  },
  {
    id: 'necklace', label: 'Necklace', icon: '📿', endpoint: 'necklace', pollEndpoint: 'necklace',
    uploadHint: 'Selfie · Neck visible · Good lighting',
    items: [
      { id: 'n1', name: 'Magnetic Clasp Chain', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=90', price: 79, adaptive: 'Magnetic clasp — one-handed' },
      { id: 'n2', name: 'Slide-Lock Pendant', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=90', price: 95 },
    ]
  },
  {
    id: 'bag', label: 'Bag', icon: '👜', endpoint: 'bag', pollEndpoint: 'bag',
    uploadHint: 'Full-body or upper-body photo',
    items: [
      { id: 'bg1', name: 'Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=90', price: 159 },
      { id: 'bg2', name: 'Magnetic Snap Tote', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=90', price: 119, adaptive: 'Magnetic snap — easy open' },
    ]
  },
  {
    id: 'hat', label: 'Hat', icon: '🎩', endpoint: 'hat', pollEndpoint: 'hat',
    uploadHint: 'Selfie · Head visible · Good lighting',
    items: [
      { id: 'h1', name: 'Adjustable Cap', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=90', price: 35 },
      { id: 'h2', name: 'Wide Brim Sun Hat', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=90', price: 55 },
    ]
  },
]

export default function AccessoriesPage() {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0])
  const [selectedItem, setSelectedItem] = useState(CATEGORIES[0].items[0])
  const [status, setStatus] = useState<S>('idle')
  const [result, setResult] = useState<string|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speak = (t: string) => 'speechSynthesis' in window && window.speechSynthesis.speak(new SpeechSynthesisUtterance(t))

  const switchCat = (cat: typeof CATEGORIES[0]) => {
    setActiveCat(cat)
    setSelectedItem(cat.items[0])
    setStatus('idle')
    setResult(null)
    setPreview(null)
  }

  const run = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('uploading')
    try {
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      fd.append('api', activeCat.id)
      const uploadData = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      if (!uploadData.file_id) throw new Error(uploadData.error || 'Upload failed')

      setStatus('processing')
      const taskData = await fetch(`/api/vto/${activeCat.endpoint}`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ src_file_id: uploadData.file_id, item_file_url: selectedItem.image })
      }).then(r=>r.json())

      const task_id = taskData?.data?.task_id || taskData?.task_id
      if (!task_id) throw new Error('No task ID')

      for (let i=0; i<40; i++) {
        await new Promise(r=>setTimeout(r,3000))
        const d = await fetch(`/api/vto/${activeCat.pollEndpoint}/${task_id}`).then(r=>r.json())
        const s = d?.data?.task_status || d?.task_status
        if (s==='success') {
          setResult(d?.data?.results?.url || d?.results?.url)
          setStatus('done')
          speak(`${activeCat.label} try-on complete.`)
          return
        }
        if (s==='error') throw new Error('Processing failed')
      }
      throw new Error('Timed out')
    } catch (e: any) { console.error(e); setStatus('error') }
  }

  return (
    <div style={{ background:'var(--parchment)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'88px 32px 80px' }}>
        <Link href="/catalog" className="iris-link" style={{ display:'inline-block', marginBottom:24 }}>← Catalog</Link>

        <div style={{ marginBottom:28 }}>
          <h1 className="h2" style={{ color:'var(--ink)' }}>Accessories Try-On</h1>
          <p className="small" style={{ color:'var(--graphite)', marginTop:4 }}>
            Rings, bracelets, watches, necklaces, bags, hats — see them on you before buying.
            Adaptive options with magnetic clasps and easy-open designs.
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:28, overflowX:'auto', paddingBottom:4 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => switchCat(c)}
              className={activeCat.id===c.id ? 'tab-active' : 'tab-inactive'}
              style={{ fontFamily:'inherit', fontSize:14, display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap' }}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Left: item picker + upload */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Item selector */}
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:12 }}>
                Choose a {activeCat.label.toLowerCase()}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {activeCat.items.map(item => (
                  <button key={item.id} onClick={() => { setSelectedItem(item); setStatus('idle'); setResult(null) }}
                    style={{ padding:0, border: selectedItem.id===item.id ? '1.5px solid var(--iris)' : '1px solid var(--fog)', borderRadius:12, overflow:'hidden', cursor:'pointer', background: selectedItem.id===item.id ? 'rgba(113,76,182,0.03)' : 'var(--bone)', transition:'all 0.15s', textAlign:'left' }}>
                    <img src={item.image} alt={item.name} style={{ width:'100%', height:100, objectFit:'cover' }} />
                    <div style={{ padding:'8px 10px' }}>
                      <div style={{ fontSize:12, fontWeight:500, color: selectedItem.id===item.id ? 'var(--iris)' : 'var(--ink)' }}>{item.name}</div>
                      <div style={{ fontSize:11, color:'var(--graphite)' }}>${item.price}</div>
                      {(item as any).adaptive && (
                        <div style={{ fontSize:10, color:'var(--iris)', marginTop:3, fontWeight:500 }}>✦ {(item as any).adaptive}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>Upload your photo</div>
              <div className="caption" style={{ color:'var(--graphite)', marginBottom:12 }}>{activeCat.uploadHint}</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) { setPreview(URL.createObjectURL(f)); setStatus('idle'); setResult(null) } }}
                  aria-label={`Upload photo for ${activeCat.label} try-on`} />
                <div style={{ border:`1.5px dashed ${preview?'var(--iris)':'var(--drift)'}`, borderRadius:12, padding:16, textAlign:'center', background:preview?'rgba(113,76,182,0.03)':'var(--parchment)', transition:'all 0.15s' }}>
                  {preview
                    ? <img src={preview} alt="Preview" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--graphite)', padding:'12px 0' }}><div style={{ fontSize:24, marginBottom:6 }}>{activeCat.icon}</div><div className="small">Click to upload</div></div>
                  }
                </div>
              </label>
              <button onClick={run} disabled={!preview||status==='uploading'||status==='processing'}
                style={{ width:'100%', marginTop:12, padding:'11px 0', borderRadius:8, border:'none', background:'var(--ink)', color:'white', fontSize:14, fontWeight:500, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, fontFamily:'inherit', transition:'box-shadow 0.2s' }}
                onMouseEnter={e => { if(preview&&status==='idle') e.currentTarget.style.boxShadow='rgb(113,76,182) 0 0 0 1px inset' }}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                {status==='uploading'?'Uploading...':status==='processing'?'Rendering (1–2 min)...':`Try ${activeCat.label} →`}
              </button>
            </div>
          </div>

          {/* Right: result */}
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:460, padding:24 }}>
            {status==='idle' && (
              <div style={{ textAlign:'center', color:'var(--graphite)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>{activeCat.icon}</div>
                <div className="small">{activeCat.label} try-on result appears here</div>
              </div>
            )}
            {(status==='uploading'||status==='processing') && (
              <div style={{ textAlign:'center' }}>
                <div style={{ width:32, height:32, border:'2px solid var(--fog)', borderTopColor:'var(--iris)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
                <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>{status==='uploading'?'Uploading...':'AI rendering...'}</div>
                <div className="caption" style={{ color:'var(--graphite)', marginTop:4 }}>Takes 1–2 minutes</div>
              </div>
            )}
            {status==='done' && result && (
              <div style={{ width:'100%' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, color:'#16a34a', fontSize:13, fontWeight:500, marginBottom:12 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#22c55e"/><path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {activeCat.label} try-on complete
                </div>
                {preview && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                    <div>
                      <div className="caption" style={{ color:'var(--graphite)', marginBottom:4, textAlign:'center' }}>Before</div>
                      <img src={preview} alt="Before" style={{ width:'100%', borderRadius:10, aspectRatio:'1', objectFit:'cover' }} />
                    </div>
                    <div>
                      <div className="caption" style={{ color:'var(--iris)', marginBottom:4, textAlign:'center', fontWeight:600 }}>After ✦</div>
                      <img src={result} alt="After" style={{ width:'100%', borderRadius:10, aspectRatio:'1', objectFit:'cover' }} />
                    </div>
                  </div>
                )}
                <div style={{ padding:'10px 14px', background:'rgba(22,163,74,0.06)', border:'1px solid rgba(22,163,74,0.2)', borderRadius:8, fontSize:12, color:'#15803d', fontWeight:500, marginBottom:12 }}>
                  🎁 Free returns for users with disabilities
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <a href={result} download className="btn-ghost" style={{ justifyContent:'center', fontSize:13, padding:'8px 0' }}>Save</a>
                  <button style={{ padding:'8px 0', borderRadius:8, border:'none', background:'var(--ink)', color:'white', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Add to cart</button>
                </div>
              </div>
            )}
            {status==='error' && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, color:'#dc2626', marginBottom:8 }}>Something went wrong</div>
                <button onClick={()=>setStatus('idle')} className="iris-link" style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Try again</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )
}
