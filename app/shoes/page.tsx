'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

type S = 'idle'|'uploading'|'processing'|'done'|'error'

function ShoesContent() {
  const sp = useSearchParams()
  const productId = sp.get('product')
  const product = products.find(p => p.id === productId && p.category === 'footwear')
    || products.find(p => p.category === 'footwear')

  const [status, setStatus] = useState<S>('idle')
  const [result, setResult] = useState<string|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speak = (t: string) => 'speechSynthesis' in window && window.speechSynthesis.speak(new SpeechSynthesisUtterance(t))

  const run = async () => {
    if (!fileRef.current?.files?.[0] || !product) return
    setStatus('uploading')
    try {
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      fd.append('api', 'shoes')
      const uploadData = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      if (!uploadData.file_id) throw new Error(uploadData.error || 'Upload failed')

      setStatus('processing')
      const taskData = await fetch('/api/vto/shoes', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ src_file_id: uploadData.file_id, shoes_file_url: (product as any).garment_url || product.image })
      }).then(r=>r.json())

      const task_id = taskData?.data?.task_id || taskData?.task_id
      if (!task_id) throw new Error('No task ID')

      for (let i=0; i<40; i++) {
        await new Promise(r=>setTimeout(r,3000))
        const d = await fetch(`/api/vto/shoes/${task_id}`).then(r=>r.json())
        const s = d?.data?.task_status || d?.task_status
        if (s==='success') { setResult(d?.data?.results?.url || d?.results?.url); setStatus('done'); speak('Your shoe try-on is ready.'); return }
        if (s==='error') throw new Error('Processing failed')
      }
      throw new Error('Timed out')
    } catch (e: any) { console.error(e); setStatus('error') }
  }

  const footwearProducts = products.filter(p => p.category === 'footwear')

  return (
    <div style={{ background:'var(--parchment)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'88px 32px 80px' }}>
        <Link href="/catalog" className="iris-link" style={{ display:'inline-block', marginBottom:24 }}>← Catalog</Link>

        <div style={{ marginBottom:28 }}>
          <h1 className="h2" style={{ color:'var(--ink)' }}>Shoes Virtual Try-On</h1>
          <p className="small" style={{ color:'var(--graphite)', marginTop:4 }}>
            AFO-compatible footwear · Wide widths · Small adult sizes · See before you buy
          </p>
        </div>

        {/* Product selector */}
        <div style={{ display:'flex', gap:10, marginBottom:24, overflowX:'auto', paddingBottom:4 }}>
          {footwearProducts.map(p => (
            <Link key={p.id} href={`/shoes?product=${p.id}`}
              style={{ flexShrink:0, padding:'10px 14px', borderRadius:12, border: p.id === product?.id ? '1.5px solid var(--iris)' : '1px solid var(--fog)', background: p.id === product?.id ? 'rgba(113,76,182,0.04)' : 'var(--bone)', textDecoration:'none', transition:'all 0.15s' }}>
              <div style={{ fontSize:13, fontWeight:500, color: p.id === product?.id ? 'var(--iris)' : 'var(--ink)' }}>{p.name}</div>
              <div className="caption" style={{ color:'var(--graphite)', marginTop:2 }}>${p.price}</div>
            </Link>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {product && (
              <div className="card" style={{ overflow:'hidden' }}>
                <img src={product.image} alt={product.name} style={{ width:'100%', height:220, objectFit:'cover' }} />
                <div style={{ padding:'16px 20px 20px' }}>
                  <div style={{ fontSize:16, fontWeight:600, color:'var(--ink)' }}>{product.name}</div>
                  <div className="small" style={{ color:'var(--graphite)', marginTop:4 }}>{product.desc}</div>
                  {(product as any).adaptive_highlights?.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:10 }}>
                      {((product as any).adaptive_highlights as string[]).map((h:string) => (
                        <span key={h} style={{ fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:999, background:'rgba(113,76,182,0.08)', color:'var(--iris)', border:'1px solid rgba(113,76,182,0.15)' }}>{h}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize:18, fontWeight:600, color:'var(--ink)', marginTop:10 }}>${product.price}</div>
                </div>
              </div>
            )}

            <div className="card" style={{ padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>Upload a foot photo</div>
              <div className="caption" style={{ color:'var(--graphite)', marginBottom:12 }}>Side or front view · Good lighting · Flat surface</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload foot photo for shoe try-on" />
                <div style={{ border:`1.5px dashed ${preview?'var(--iris)':'var(--drift)'}`, borderRadius:12, padding:16, textAlign:'center', background:preview?'rgba(113,76,182,0.03)':'var(--parchment)', transition:'all 0.15s' }}>
                  {preview ? <img src={preview} alt="Preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--graphite)', padding:'16px 0' }}><div style={{ fontSize:24, marginBottom:6 }}>👟</div><div className="small">Click to upload foot photo</div></div>}
                </div>
              </label>
              <button onClick={run} disabled={!preview||status==='uploading'||status==='processing'}
                style={{ width:'100%', marginTop:12, padding:'11px 0', borderRadius:8, border:'none', background:'var(--ink)', color:'white', fontSize:14, fontWeight:500, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, fontFamily:'inherit', transition:'box-shadow 0.2s' }}
                onMouseEnter={e => { if(preview && status==='idle') e.currentTarget.style.boxShadow='rgb(113,76,182) 0 0 0 1px inset' }}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                {status==='uploading'?'Uploading...':status==='processing'?'Rendering (1–2 min)...':'Try it on →'}
              </button>
            </div>
          </div>

          {/* Right — result */}
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:480, padding:24 }}>
            {status==='idle' && <div style={{ textAlign:'center', color:'var(--graphite)' }}><div style={{ fontSize:40, marginBottom:12 }}>👟</div><div className="small">Shoe try-on result appears here</div></div>}
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
                  Try-on complete
                </div>
                <img src={result} alt="Shoe try-on result" style={{ width:'100%', borderRadius:12 }} />
                <div style={{ marginTop:12, padding:'12px 16px', background:'rgba(113,76,182,0.06)', border:'1px solid rgba(113,76,182,0.15)', borderRadius:8, fontSize:13, color:'var(--iris)', fontWeight:500 }}>
                  🎁 Free returns for users with disabilities
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
                  <a href={result} download className="btn-ghost" style={{ justifyContent:'center', fontSize:13, padding:'8px 0' }}>Save image</a>
                  <button style={{ padding:'8px 0', borderRadius:8, border:'none', background:'var(--ink)', color:'white', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Add to cart</button>
                </div>
              </div>
            )}
            {status==='error' && <div style={{ textAlign:'center' }}><div style={{ fontSize:13, color:'#dc2626', marginBottom:8 }}>Something went wrong</div><button onClick={()=>setStatus('idle')} className="iris-link" style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Try again</button></div>}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ShoesPage() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'var(--parchment)' }} />}><ShoesContent /></Suspense>
}
