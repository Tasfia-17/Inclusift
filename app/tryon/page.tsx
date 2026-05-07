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
      const uploadData = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      if (!uploadData.file_id) throw new Error(uploadData.error || 'Upload failed')
      setStatus('processing')
      const garmentUrl = (product as any).garment_url || product.image
      const taskData = await fetch('/api/vto/clothes', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ src_file_id: uploadData.file_id, ref_file_url: garmentUrl })
      }).then(r=>r.json())
      const task_id = taskData?.data?.task_id || taskData?.task_id
      if (!task_id) throw new Error('No task ID returned')
      for (let i=0; i<40; i++) {
        await new Promise(r=>setTimeout(r,3000))
        const d = await fetch(`/api/vto/clothes/${task_id}`).then(r=>r.json())
        const s = d?.data?.task_status || d?.task_status
        if (s==='success') { setResult(d?.data?.results?.url || d?.results?.url); setStatus('done'); speak('Your virtual try-on is ready.'); return }
        if (s==='error') throw new Error('Processing failed')
      }
      throw new Error('Timed out')
    } catch (e: any) { console.error('VTO error:', e); setStatus('error') }
  }

  if (!product) return (
    <div style={{ minHeight:'100vh', background:'var(--parchment)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <p className="body" style={{ color:'var(--graphite)', marginBottom:12 }}>Product not found</p>
        <Link href="/catalog" className="iris-link">← Back to catalog</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--parchment)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'88px 32px 80px' }}>
        <Link href="/catalog" className="iris-link" style={{ display:'inline-block', marginBottom:24 }}>← Catalog</Link>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ overflow:'hidden' }}>
              <img src={product.image} alt={product.name} style={{ width:'100%', height:240, objectFit:'cover' }} />
              <div style={{ padding:'16px 20px 20px' }}>
                <div style={{ fontSize:16, fontWeight:600, color:'var(--ink)' }}>{product.name}</div>
                <div className="small" style={{ color:'var(--graphite)', marginTop:4 }}>{product.desc}</div>
                {/* Adaptive highlights */}
                {(product as any).adaptive_highlights?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:10 }}>
                    {((product as any).adaptive_highlights as string[]).map((h: string) => (
                      <span key={h} style={{ fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:999, background:'rgba(113,76,182,0.08)', color:'var(--iris)', border:'1px solid rgba(113,76,182,0.15)' }}>{h}</span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize:18, fontWeight:600, color:'var(--ink)', marginTop:10 }}>${product.price}</div>
              </div>
            </div>
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>Upload your photo</div>
              <div className="caption" style={{ color:'var(--graphite)', marginBottom:12 }}>Full-body · Good lighting · Plain background</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload photo for virtual try-on" />
                <div style={{ border:`1.5px dashed ${preview?'var(--iris)':'var(--drift)'}`, borderRadius:12, padding:16, textAlign:'center', background:preview?'rgba(113,76,182,0.03)':'var(--parchment)', transition:'all 0.15s' }}>
                  {preview ? <img src={preview} alt="Preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--graphite)', padding:'16px 0' }}><div style={{ fontSize:24, marginBottom:6 }}>◫</div><div className="small">Click to upload</div></div>}
                </div>
              </label>
              <button onClick={run} disabled={!preview||status==='uploading'||status==='processing'}
                className="btn-primary"
                style={{ width:'100%', marginTop:12, justifyContent:'center', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer', background:'var(--ink)', color:'white' }}>
                {status==='uploading'?'Uploading...':status==='processing'?'Rendering (1–2 min)...':'Try it on →'}
              </button>
            </div>
          </div>
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:480, padding:24 }}>
            {status==='idle' && <div style={{ textAlign:'center', color:'var(--graphite)' }}><div style={{ fontSize:40, marginBottom:12 }}>◫</div><div className="small">Result appears here</div></div>}
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
                {/* Before / After comparison */}
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
                {!preview && <img src={result} alt="Try-on result" style={{ width:'100%', borderRadius:12, marginBottom:12 }} />}
                {/* Free returns banner */}
                <div style={{ padding:'10px 14px', background:'rgba(22,163,74,0.06)', border:'1px solid rgba(22,163,74,0.2)', borderRadius:8, fontSize:12, color:'#15803d', fontWeight:500, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  🎁 Free returns for users with disabilities — no questions asked
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                  <a href={result} download className="btn-ghost" style={{ justifyContent:'center', fontSize:12, padding:'8px 0' }}>Save</a>
                  <button onClick={() => { if (navigator.share) navigator.share({ title:'My InclusiFit look', url: result! }); else speak('Share copied to clipboard') }}
                    className="btn-ghost" style={{ justifyContent:'center', fontSize:12, padding:'8px 0' }}>Share</button>
                  <button className="btn-primary" style={{ justifyContent:'center', fontSize:12, padding:'8px 0', background:'var(--ink)', color:'white' }}>Add to cart</button>
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

export default function TryOnPage() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'var(--parchment)' }} />}><TryOnContent /></Suspense>
}
