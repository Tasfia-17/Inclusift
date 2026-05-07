'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

type S = 'idle'|'uploading'|'processing'|'done'|'error'

function TryOnContent() {
  const sp = useSearchParams()
  const product = products.find(p => p.id === sp.get('product'))
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
      fd.append('api', 'cloth')
      const { file_id } = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      setStatus('processing')
      const data = await fetch('/api/vto/clothes', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ src_file_id: file_id, cloth_file_url: product.garment_url })
      }).then(r=>r.json())
      const task_id = data?.data?.task_id || data?.task_id
      for (let i=0; i<30; i++) {
        await new Promise(r=>setTimeout(r,2000))
        const d = await fetch(`/api/vto/clothes/${task_id}`).then(r=>r.json())
        if (d?.data?.task_status==='success') { setResult(d.data.results.url); setStatus('done'); speak('Your virtual try-on is ready.'); return }
        if (d?.data?.task_status==='error') break
      }
      setStatus('error')
    } catch { setStatus('error') }
  }

  if (!product) return (
    <div style={{ minHeight:'100vh', background:'var(--canvas)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'var(--muted)', marginBottom:12 }}>Product not found</p>
        <Link href="/catalog" style={{ color:'var(--accent)', fontSize:14 }}>← Back to catalog</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--canvas)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'96px 24px 80px' }}>
        <Link href="/catalog" style={{ fontSize:13, color:'var(--muted)', textDecoration:'none', display:'inline-block', marginBottom:24 }}>← Catalog</Link>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ overflow:'hidden' }}>
              <img src={product.image} alt={product.name} style={{ width:'100%', height:240, objectFit:'cover' }} />
              <div style={{ padding:'16px 20px 20px' }}>
                <div style={{ fontWeight:600, fontSize:16, color:'var(--ink)' }}>{product.name}</div>
                <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>{product.desc}</div>
                <div style={{ fontWeight:700, fontSize:18, color:'var(--ink)', marginTop:10 }}>${product.price}</div>
              </div>
            </div>

            <div className="card" style={{ padding:20 }}>
              <div style={{ fontWeight:500, fontSize:14, color:'var(--ink)', marginBottom:4 }}>Upload your photo</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>Full-body · Good lighting · Plain background</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload photo for virtual try-on" />
                <div style={{
                  border: `2px dashed ${preview ? '#c4b5fd' : 'var(--border)'}`,
                  borderRadius:10, padding:16, textAlign:'center',
                  background: preview ? '#faf5ff' : 'var(--stone)',
                  transition:'all 0.15s',
                }}>
                  {preview
                    ? <img src={preview} alt="Preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--muted)', padding:'16px 0' }}>
                        <div style={{ fontSize:24, marginBottom:6 }}>📷</div>
                        <div style={{ fontSize:13 }}>Click to upload</div>
                      </div>
                  }
                </div>
              </label>
              <button onClick={run} disabled={!preview || status==='uploading' || status==='processing'}
                className="btn-primary"
                style={{ width:'100%', justifyContent:'center', marginTop:12, fontSize:14, padding:'11px 0', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer' }}>
                {status==='uploading' ? 'Uploading...' : status==='processing' ? 'Rendering (1–2 min)...' : 'Try it on'}
              </button>
            </div>
          </div>

          {/* Right — result */}
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:480, padding:24 }}>
            {status==='idle' && (
              <div style={{ textAlign:'center', color:'var(--muted)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>👗</div>
                <div style={{ fontSize:14 }}>Result appears here</div>
              </div>
            )}
            {(status==='uploading'||status==='processing') && (
              <div style={{ textAlign:'center' }}>
                <div style={{ width:36, height:36, border:'2px solid #ede9fe', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
                <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)' }}>
                  {status==='uploading' ? 'Uploading...' : 'AI rendering...'}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:4 }}>Takes 1–2 minutes</div>
              </div>
            )}
            {status==='done' && result && (
              <div style={{ width:'100%' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, color:'#16a34a', fontSize:13, fontWeight:500, marginBottom:12 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="7" fill="#22c55e"/><path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Try-on complete
                </div>
                <img src={result} alt="Try-on result" style={{ width:'100%', borderRadius:12 }} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
                  <a href={result} download className="btn-ghost" style={{ justifyContent:'center', fontSize:13, padding:'9px 0' }}>Save</a>
                  <button className="btn-primary" style={{ justifyContent:'center', fontSize:13, padding:'9px 0' }}>Add to cart</button>
                </div>
                <button onClick={()=>{setStatus('idle');setResult(null)}} style={{ width:'100%', marginTop:8, fontSize:12, color:'var(--muted)', background:'none', border:'none', cursor:'pointer' }}>Try another photo</button>
              </div>
            )}
            {status==='error' && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
                <div style={{ fontSize:14, color:'#dc2626' }}>Something went wrong</div>
                <button onClick={()=>setStatus('idle')} style={{ marginTop:8, fontSize:13, color:'var(--accent)', background:'none', border:'none', cursor:'pointer' }}>Try again</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function TryOnPage() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'var(--canvas)' }} />}><TryOnContent /></Suspense>
}
