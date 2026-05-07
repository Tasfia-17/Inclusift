'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

type S = 'idle'|'uploading'|'processing'|'done'|'error'

const HAIR_COLORS = [
  { id: 'natural_black', label: 'Natural Black', hex: '#1a1a1a' },
  { id: 'dark_brown',    label: 'Dark Brown',    hex: '#3b1f0a' },
  { id: 'auburn',        label: 'Auburn',        hex: '#8b2500' },
  { id: 'golden_blonde', label: 'Golden Blonde', hex: '#c8a84b' },
  { id: 'platinum',      label: 'Platinum',      hex: '#e8e0d0' },
  { id: 'rose_gold',     label: 'Rose Gold',     hex: '#c4857a' },
  { id: 'burgundy',      label: 'Burgundy',      hex: '#6b1a2a' },
  { id: 'silver_grey',   label: 'Silver Grey',   hex: '#9a9a9a' },
]

const WIG_STYLES = [
  { id: 'natural_wave', label: 'Natural Wave', desc: 'Soft waves, natural look' },
  { id: 'straight_bob', label: 'Straight Bob', desc: 'Clean, modern bob cut' },
  { id: 'pixie_cut',    label: 'Pixie Cut',    desc: 'Short, easy to manage' },
  { id: 'long_straight',label: 'Long Straight', desc: 'Classic long straight' },
]

export default function HairPage() {
  const [mode, setMode] = useState<'color' | 'style'>('color')
  const [selectedColor, setSelectedColor] = useState(HAIR_COLORS[0])
  const [selectedStyle, setSelectedStyle] = useState(WIG_STYLES[0])
  const [status, setStatus] = useState<S>('idle')
  const [result, setResult] = useState<string|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speak = (t: string) => 'speechSynthesis' in window && window.speechSynthesis.speak(new SpeechSynthesisUtterance(t))

  const run = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('uploading')
    try {
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      fd.append('api', mode === 'color' ? 'hair-color' : 'hair-style')
      const uploadData = await fetch('/api/vto/upload', { method:'POST', body:fd }).then(r=>r.json())
      if (!uploadData.file_id) throw new Error(uploadData.error || 'Upload failed')

      setStatus('processing')
      const endpoint = mode === 'color' ? '/api/vto/hair' : '/api/vto/hairstyle'
      const pollEndpoint = mode === 'color' ? 'hair' : 'hairstyle'
      const body: Record<string,any> = { src_file_id: uploadData.file_id }
      if (mode === 'color') body.hair_color = selectedColor.hex
      else body.style_id = selectedStyle.id

      const taskData = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(r=>r.json())
      const task_id = taskData?.data?.task_id || taskData?.task_id
      if (!task_id) throw new Error('No task ID')

      for (let i=0; i<40; i++) {
        await new Promise(r=>setTimeout(r,3000))
        const d = await fetch(`/api/vto/${pollEndpoint}/${task_id}`).then(r=>r.json())
        const s = d?.data?.task_status || d?.task_status
        if (s==='success') {
          setResult(d?.data?.results?.url || d?.results?.url)
          setStatus('done')
          speak(mode === 'color' ? `Hair color try-on complete. ${selectedColor.label} looks great on you.` : `Hairstyle try-on complete. ${selectedStyle.label} is ready.`)
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
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'88px 32px 80px' }}>
        <Link href="/catalog" className="iris-link" style={{ display:'inline-block', marginBottom:24 }}>← Catalog</Link>

        <div style={{ marginBottom:28 }}>
          <h1 className="h2" style={{ color:'var(--ink)' }}>Hair & Wig Try-On</h1>
          <p className="small" style={{ color:'var(--graphite)', marginTop:4 }}>
            Try wigs and hair colors virtually. For alopecia, cancer treatment, and hair loss — shop from home with confidence.
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:24 }}>
          <button onClick={() => setMode('color')} className={mode==='color'?'tab-active':'tab-inactive'} style={{ fontFamily:'inherit', fontSize:14 }}>Hair Color</button>
          <button onClick={() => setMode('style')} className={mode==='style'?'tab-active':'tab-inactive'} style={{ fontFamily:'inherit', fontSize:14 }}>Wig Styles</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Color / style picker */}
            <div className="card" style={{ padding:20 }}>
              {mode === 'color' ? (
                <>
                  <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:12 }}>Choose a color</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {HAIR_COLORS.map(c => (
                      <button key={c.id} onClick={() => setSelectedColor(c)}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 4px', borderRadius:10, border: selectedColor.id===c.id ? '1.5px solid var(--iris)' : '1px solid var(--fog)', background: selectedColor.id===c.id ? 'rgba(113,76,182,0.04)' : 'var(--bone)', cursor:'pointer', transition:'all 0.15s', fontFamily:'inherit' }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background:c.hex, border:'2px solid rgba(0,0,0,0.08)' }} />
                        <div style={{ fontSize:10, fontWeight:500, color: selectedColor.id===c.id ? 'var(--iris)' : 'var(--graphite)', textAlign:'center', lineHeight:1.2 }}>{c.label}</div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:12 }}>Choose a style</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {WIG_STYLES.map(s => (
                      <button key={s.id} onClick={() => setSelectedStyle(s)}
                        style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, border: selectedStyle.id===s.id ? '1.5px solid var(--iris)' : '1px solid var(--fog)', background: selectedStyle.id===s.id ? 'rgba(113,76,182,0.04)' : 'var(--bone)', cursor:'pointer', textAlign:'left', transition:'all 0.15s', fontFamily:'inherit' }}>
                        <div style={{ width:16, height:16, borderRadius:'50%', border: selectedStyle.id===s.id ? 'none' : '1.5px solid var(--drift)', background: selectedStyle.id===s.id ? 'var(--iris)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {selectedStyle.id===s.id && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, color: selectedStyle.id===s.id ? 'var(--iris)' : 'var(--ink)' }}>{s.label}</div>
                          <div className="caption" style={{ color:'var(--graphite)' }}>{s.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Upload */}
            <div className="card" style={{ padding:20 }}>
              <div style={{ fontSize:14, fontWeight:500, color:'var(--ink)', marginBottom:4 }}>Upload your selfie</div>
              <div className="caption" style={{ color:'var(--graphite)', marginBottom:12 }}>Clear face photo · Good lighting · Hair visible</div>
              <label style={{ display:'block', cursor:'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload selfie for hair try-on" />
                <div style={{ border:`1.5px dashed ${preview?'var(--iris)':'var(--drift)'}`, borderRadius:12, padding:16, textAlign:'center', background:preview?'rgba(113,76,182,0.03)':'var(--parchment)', transition:'all 0.15s' }}>
                  {preview ? <img src={preview} alt="Preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:8 }} />
                    : <div style={{ color:'var(--graphite)', padding:'16px 0' }}><div style={{ fontSize:24, marginBottom:6 }}>💆</div><div className="small">Click to upload selfie</div></div>}
                </div>
              </label>
              <button onClick={run} disabled={!preview||status==='uploading'||status==='processing'}
                style={{ width:'100%', marginTop:12, padding:'11px 0', borderRadius:8, border:'none', background:'var(--ink)', color:'white', fontSize:14, fontWeight:500, cursor:(!preview||status==='uploading'||status==='processing')?'not-allowed':'pointer', opacity:(!preview||status==='uploading'||status==='processing')?0.4:1, fontFamily:'inherit', transition:'box-shadow 0.2s' }}
                onMouseEnter={e => { if(preview && status==='idle') e.currentTarget.style.boxShadow='rgb(113,76,182) 0 0 0 1px inset' }}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                {status==='uploading'?'Uploading...':status==='processing'?'Rendering (1–2 min)...':mode==='color'?`Try ${selectedColor.label}`:`Try ${selectedStyle.label}`}
              </button>
            </div>
          </div>

          {/* Right — result */}
          <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:480, padding:24 }}>
            {status==='idle' && (
              <div style={{ textAlign:'center', color:'var(--graphite)' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>💇</div>
                <div className="small">Your hair try-on result appears here</div>
                <div className="caption" style={{ marginTop:8, maxWidth:200, margin:'8px auto 0' }}>Shop from home, with privacy and confidence</div>
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
                  {mode==='color' ? `${selectedColor.label} applied` : `${selectedStyle.label} applied`}
                </div>
                <img src={result} alt="Hair try-on result" style={{ width:'100%', borderRadius:12 }} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
                  <a href={result} download className="btn-ghost" style={{ justifyContent:'center', fontSize:13, padding:'8px 0' }}>Save image</a>
                  <button onClick={() => { setStatus('idle'); setResult(null) }} style={{ padding:'8px 0', borderRadius:8, border:'1px solid var(--fog)', background:'transparent', color:'var(--graphite)', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>Try another</button>
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
