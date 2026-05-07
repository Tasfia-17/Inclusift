'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import products from '@/data/products.json'

const CONCERNS: Record<string,string> = {
  hd_acne:'Acne', hd_pore:'Pores', hd_moisture:'Moisture', hd_redness:'Redness',
  hd_texture:'Texture', hd_wrinkle:'Wrinkles', hd_radiance:'Radiance', hd_oiliness:'Oiliness',
  hd_eye_bag:'Eye Bags', hd_dark_circle:'Dark Circles', hd_firmness:'Firmness', hd_age_spot:'Age Spots',
}
const beautyProducts = products.filter(p => p.category === 'beauty')
type S = 'idle'|'uploading'|'processing'|'done'|'error'

export default function BeautyPage() {
  const [status, setStatus] = useState<S>('idle')
  const [scores, setScores] = useState<Record<string,number>|null>(null)
  const [overlay, setOverlay] = useState<string|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [makeupResult, setMakeupResult] = useState<string|null>(null)
  const [makeupLoading, setMakeupLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const fileId = useRef<string|null>(null)

  const speak = (t: string) => 'speechSynthesis' in window && (window.speechSynthesis.cancel(), window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)))

  const analyze = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('uploading')
    try {
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      fd.append('api', 'skin-analysis')
      const { file_id } = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      fileId.current = file_id
      setStatus('processing')
      const { data: td } = await fetch('/api/vto/skin', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ src_file_id:file_id }) }).then(r=>r.json())
      for (let i=0; i<30; i++) {
        await new Promise(r=>setTimeout(r,2000))
        const d = await fetch(`/api/vto/skin/${td?.task_id}`).then(r=>r.json())
        if (d?.data?.task_status==='success') {
          setScores(d.data.results.scores||{})
          setOverlay(d.data.results.overlay_url||d.data.results.url||null)
          setStatus('done')
          const top = Object.entries(d.data.results.scores||{}).sort(([,a],[,b])=>(a as number)-(b as number)).slice(0,3).map(([k])=>CONCERNS[k]).join(', ')
          speak(`Analysis complete. Top concerns: ${top}.`)
          return
        }
      }
      setStatus('error')
    } catch { setStatus('error') }
  }

  const tryMakeup = async () => {
    if (!fileId.current) return
    setMakeupLoading(true)
    try {
      const { data } = await fetch('/api/vto/makeup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ src_file_id:fileId.current, makeup_items:[{type:'foundation'}] }) }).then(r=>r.json())
      for (let i=0; i<20; i++) {
        await new Promise(r=>setTimeout(r,2000))
        const d = await fetch(`/api/vto/makeup/${data?.task_id}`).then(r=>r.json())
        if (d?.data?.task_status==='success') { setMakeupResult(d.data.results.url); speak('Makeup try-on ready.'); break }
      }
    } finally { setMakeupLoading(false) }
  }

  return (
    <div style={{ background:'var(--parchment)', minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'88px 32px 80px' }}>
        <Link href="/catalog" className="iris-link" style={{ display:'inline-block', marginBottom:24 }}>← Catalog</Link>
        <div style={{ marginBottom:28 }}>
          <h1 className="h2" style={{ color:'var(--ink)' }}>AI Skin Analysis</h1>
          <p className="small" style={{ color:'var(--graphite)', marginTop:4 }}>12 concerns · HD accuracy · Products filtered for your needs</p>
        </div>

        <div className="card" style={{ padding:24, marginBottom:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>Upload a selfie</div>
              <div className="caption" style={{ color:'var(--graphite)', marginBottom:12 }}>Close-up face · Good lighting · No glasses</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload selfie for skin analysis" />
                <div style={{ border:`1.5px dashed ${preview?'var(--iris)':'var(--drift)'}`, borderRadius:12, padding:16, textAlign:'center', background:preview?'rgba(113,76,182,0.03)':'var(--parchment)', transition:'all 0.15s' }}>
                  {preview ? <img src={preview} alt="Selfie" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--graphite)', padding:'16px 0' }}><div style={{ fontSize:24, marginBottom:6 }}>◉</div><div className="small">Click to upload</div></div>}
                </div>
              </label>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ background:'var(--parchment)', borderRadius:10, padding:16, border:'1px solid var(--fog)' }}>
                <div className="caption" style={{ color:'var(--graphite)', marginBottom:8 }}>Analyzes 12 concerns</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:3 }}>
                  {Object.values(CONCERNS).map(c => <div key={c} className="caption" style={{ color:'var(--graphite)' }}>· {c}</div>)}
                </div>
              </div>
              <button onClick={analyze} disabled={!preview||status==='uploading'||status==='processing'}
                className="btn-primary"
                style={{ justifyContent:'center', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer', background:'var(--ink)', color:'white' }}>
                {status==='uploading'?'Uploading...':status==='processing'?'Analyzing...':'Analyze my skin'}
              </button>
              <button onClick={()=>speak('Upload a close-up selfie. We will analyze 12 skin concerns and recommend products filtered by container type.')}
                className="btn-ghost" style={{ justifyContent:'center' }}>
                🔊 Read instructions
              </button>
            </div>
          </div>
        </div>

        {status==='done' && scores && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ padding:24 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div style={{ fontSize:16, fontWeight:600, color:'var(--ink)' }}>Skin Analysis Results</div>
                <button onClick={()=>{ const top=Object.entries(scores).sort(([,a],[,b])=>(a as number)-(b as number)).slice(0,3).map(([k])=>`${CONCERNS[k]}: ${scores[k]}`).join(', '); speak(`Results: ${top}`) }} className="btn-ghost" style={{ fontSize:12, padding:'5px 10px' }}>🔊 Read</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:overlay?'180px 1fr':'1fr', gap:24, alignItems:'start' }}>
                {overlay && <img src={overlay} alt="Skin overlay" style={{ width:180, borderRadius:12 }} />}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {Object.entries(scores).map(([k,v]) => (
                    <div key={k}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                        <span className="small" style={{ color:'var(--graphite)', fontWeight:500 }}>{CONCERNS[k]||k}</span>
                        <span className="small" style={{ color:'var(--ink)', fontWeight:600 }}>{v}</span>
                      </div>
                      <div style={{ height:4, background:'var(--fog)', borderRadius:99 }}>
                        <div style={{ height:'100%', width:`${v}%`, background:(v as number)>=75?'#22c55e':(v as number)>=50?'#f59e0b':'#ef4444', borderRadius:99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:4 }}>Recommended products</div>
              <div className="small" style={{ color:'var(--graphite)', marginBottom:16 }}>Filtered by accessible containers — pump dispensers, easy-grip applicators</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {beautyProducts.map(p => (
                  <div key={p.id} className="card" style={{ padding:14, display:'flex', gap:12 }}>
                    <img src={p.image} alt={p.name} style={{ width:60, height:60, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:'var(--ink)' }}>{p.name}</div>
                      <div className="caption" style={{ color:'var(--graphite)', marginTop:2, marginBottom:8 }}>{p.desc}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:14, fontWeight:600, color:'var(--ink)' }}>${p.price}</span>
                        <button onClick={tryMakeup} disabled={makeupLoading} className="btn-ghost" style={{ fontSize:11, padding:'4px 10px', opacity:makeupLoading?0.5:1 }}>
                          {makeupLoading?'...':'Try on'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {makeupResult && (
              <div className="card" style={{ padding:24 }}>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--ink)', marginBottom:12 }}>Makeup Try-On</div>
                <img src={makeupResult} alt="Makeup result" style={{ maxWidth:280, width:'100%', borderRadius:12 }} />
              </div>
            )}
          </div>
        )}
        {status==='error' && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:20, textAlign:'center' }}><div className="small" style={{ color:'#dc2626' }}>Something went wrong.</div><button onClick={()=>setStatus('idle')} className="iris-link" style={{ background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:8, display:'block', margin:'8px auto 0' }}>Try again</button></div>}
      </div>
    </div>
  )
}
