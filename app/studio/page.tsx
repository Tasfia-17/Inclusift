'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'

type TaskStatus = 'idle' | 'running' | 'done' | 'error'

interface Results {
  skinScores?: Record<string, number>
  skinOverlay?: string
  makeupResult?: string
  clothResult?: string
  hairResult?: string
  hairstyleResult?: string
  earringResult?: string
  faceAttrs?: any
}

const CONCERN_LABELS: Record<string, string> = {
  hd_acne: 'Acne', hd_pore: 'Pores', hd_moisture: 'Moisture', hd_redness: 'Redness',
  hd_texture: 'Texture', hd_wrinkle: 'Wrinkles', hd_radiance: 'Radiance', hd_oiliness: 'Oiliness',
  hd_eye_bag: 'Eye Bags', hd_dark_circle: 'Dark Circles', hd_firmness: 'Firmness', hd_age_spot: 'Age Spots',
}

// Poll a task until success
async function pollTask(endpoint: string, taskId: string, maxAttempts = 30): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const d = await fetch(`/api/vto/${endpoint}/${taskId}`).then(r => r.json())
    if (d?.data?.task_status === 'success') return d.data.results
    if (d?.data?.task_status === 'error') throw new Error(`${endpoint} failed`)
  }
  throw new Error(`${endpoint} timed out`)
}

const STEPS = [
  { id: 'upload',    label: 'Uploading photo',          icon: '📸' },
  { id: 'skin',      label: 'Analyzing skin',            icon: '✨' },
  { id: 'face',      label: 'Reading face attributes',   icon: '👤' },
  { id: 'makeup',    label: 'Applying makeup VTO',       icon: '💄' },
  { id: 'cloth',     label: 'Trying on outfit',          icon: '👗' },
  { id: 'hair',      label: 'Styling hair color',        icon: '💇' },
  { id: 'hairstyle', label: 'Generating wig style',      icon: '💆' },
  { id: 'earring',   label: 'Adding jewelry',            icon: '💍' },
]

function StudioContent() {
  const sp = useSearchParams()
  const conditions = sp.get('c')?.split(',').filter(Boolean) || []

  const [status, setStatus] = useState<TaskStatus>('idle')
  const [currentStep, setCurrentStep] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [results, setResults] = useState<Results>({})
  const [preview, setPreview] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'skin' | 'makeup' | 'outfit' | 'hair' | 'hairstyle' | 'jewelry'>('skin')
  const fileRef = useRef<HTMLInputElement>(null)
  const fileIdRef = useRef<string | null>(null)

  const speak = (t: string) => 'speechSynthesis' in window && window.speechSynthesis.speak(new SpeechSynthesisUtterance(t))

  const markStep = (id: string) => setCompletedSteps(p => [...p, id])

  const runAll = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('running')
    setCompletedSteps([])
    setResults({})

    // Determine which APIs to run based on conditions
    const runSkin     = true // always run skin analysis
    const runMakeup   = conditions.includes('limited_dexterity') || conditions.includes('visual_impairment') || conditions.length === 0
    const runCloth    = conditions.includes('shorter_limbs') || conditions.includes('limited_dexterity') || conditions.includes('loose_fit') || conditions.length === 0
    const runHair     = conditions.includes('hair_loss') || conditions.length === 0
    const runEarring  = conditions.includes('hearing_aid') || conditions.length === 0

    try {
      // Step 1: Upload
      setCurrentStep(0)
      const fd = new FormData()
      fd.append('file', fileRef.current.files[0])
      fd.append('api', 'skin-analysis')
      const uploadData = await fetch('/api/vto/upload', { method: 'POST', body: fd }).then(r => r.json())
      if (!uploadData.file_id) throw new Error(uploadData.error || 'Upload failed')
      const file_id = uploadData.file_id
      fileIdRef.current = file_id
      markStep('upload')

      // Step 2: Skin analysis (always)
      if (runSkin) {
        setCurrentStep(1)
        try {
          const skinTask = await fetch('/api/vto/skin', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src_file_id: file_id })
          }).then(r => r.json())
          const skinRes = await pollTask('skin', skinTask?.data?.task_id)
          setResults(p => ({ ...p, skinScores: skinRes.scores, skinOverlay: skinRes.overlay_url || skinRes.url }))
          markStep('skin')
          const top = Object.entries(skinRes.scores || {}).sort(([,a],[,b]) => (a as number)-(b as number)).slice(0,2).map(([k]) => CONCERN_LABELS[k]).join(' and ')
          speak(`Skin analysis complete. Top concerns: ${top}.`)
        } catch { /* non-fatal */ }
      }

      // Step 3: Makeup VTO
      if (runMakeup) {
        setCurrentStep(3)
        try {
          const makeupTask = await fetch('/api/vto/makeup', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src_file_id: file_id })
          }).then(r => r.json())
          const makeupRes = await pollTask('makeup', makeupTask?.data?.task_id)
          setResults(p => ({ ...p, makeupResult: makeupRes.url }))
          markStep('makeup')
        } catch { /* non-fatal */ }
      }

      // Step 4: Clothes VTO
      if (runCloth) {
        setCurrentStep(4)
        try {
          const garmentUrl = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=95&fit=crop'
          const clothTask = await fetch('/api/vto/clothes', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src_file_id: file_id, ref_file_url: garmentUrl })
          }).then(r => r.json())
          const clothTaskId = clothTask?.data?.task_id || clothTask?.task_id
          if (clothTaskId) {
            const clothRes = await pollTask('clothes', clothTaskId)
            setResults(p => ({ ...p, clothResult: clothRes.url }))
            markStep('cloth')
          }
        } catch { /* non-fatal */ }
      }

      // Step 5: Hair VTO
      if (runHair) {
        setCurrentStep(5)
        try {
          const hairTask = await fetch('/api/vto/hair', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src_file_id: file_id, hair_color: '#8B4513' })
          }).then(r => r.json())
          const hairRes = await pollTask('hair', hairTask?.data?.task_id)
          setResults(p => ({ ...p, hairResult: hairRes.url }))
          markStep('hair')
        } catch { /* non-fatal */ }
      }

      // Step 6: Earring VTO
      if (runEarring) {
        setCurrentStep(6)
        try {
          const earringTask = await fetch('/api/vto/earring', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ src_file_id: file_id })
          }).then(r => r.json())
          const earringRes = await pollTask('earring', earringTask?.data?.task_id)
          setResults(p => ({ ...p, earringResult: earringRes.url }))
          markStep('earring')
        } catch { /* non-fatal */ }
      }

      setStatus('done')
      setCurrentStep(-1)
      speak('Your AI analysis is complete.')
    } catch (e) {
      setStatus('error')
    }
  }

  const scoreColor = (s: number) => s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'

  const TABS = [
    { id: 'skin',      label: 'Skin',      icon: '✨', result: results.skinOverlay },
    { id: 'makeup',    label: 'Makeup',    icon: '💄', result: results.makeupResult },
    { id: 'outfit',    label: 'Outfit',    icon: '👗', result: results.clothResult },
    { id: 'hair',      label: 'Hair Color',icon: '💇', result: results.hairResult },
    { id: 'hairstyle', label: 'Wig Style', icon: '💆', result: results.hairstyleResult },
    { id: 'jewelry',   label: 'Jewelry',   icon: '💍', result: results.earringResult },
  ] as const

  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/profile" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
            ← Back
          </Link>
          <h1 className="serif" style={{ fontSize: 36, color: 'var(--ink)', letterSpacing: '-0.02em' }}>AI Studio</h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 4 }}>
            Upload one photo. 6 YouCam APIs run automatically.
            {conditions.length > 0 && <span style={{ color: 'var(--accent)', fontWeight: 600 }}> · {conditions.length} adaptive filter{conditions.length > 1 ? 's' : ''} active</span>}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left: Upload + Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Upload */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>Your photo</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Full-body or selfie · Good lighting</div>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)) }}
                  aria-label="Upload photo for AI analysis" />
                <div style={{
                  border: `2px dashed ${preview ? '#c4b5fd' : 'var(--border)'}`,
                  borderRadius: 12, overflow: 'hidden', background: preview ? '#faf5ff' : 'var(--stone)',
                  transition: 'all 0.2s', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {preview
                    ? <img src={preview} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    : <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>Click to upload</div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>JPEG or PNG</div>
                      </div>
                  }
                </div>
              </label>

              <button onClick={runAll} disabled={!preview || status === 'running'}
                className="btn btn-accent"
                style={{ width: '100%', marginTop: 12, fontSize: 14, padding: '12px 0', borderRadius: 12, opacity: (!preview || status === 'running') ? 0.4 : 1, cursor: (!preview || status === 'running') ? 'not-allowed' : 'pointer' }}>
                {status === 'running' ? '⏳ Running AI analysis...' : `✦ Run ${conditions.length > 0 ? 'personalized' : 'full'} analysis`}
              </button>
            </div>

            {/* Steps progress */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', marginBottom: 14 }}>AI Pipeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STEPS.map((s, i) => {
                  const done = completedSteps.includes(s.id)
                  const active = currentStep === i && status === 'running'
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: done || active ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: done ? '#dcfce7' : active ? '#ede9fe' : 'var(--stone)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                        border: active ? '2px solid var(--accent)' : 'none',
                        animation: active ? 'pulse-ring 1.5s ease-out infinite' : 'none',
                      }}>
                        {done ? '✓' : s.icon}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: done ? 600 : 400, color: done ? '#16a34a' : active ? 'var(--accent)' : 'var(--muted)' }}>
                        {s.label}
                      </div>
                      {active && <div style={{ marginLeft: 'auto', width: 14, height: 14, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Voice control */}
            <div className="card-soft" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🎤</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Voice output enabled</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Results read aloud automatically</div>
              </div>
              <button onClick={() => speak('AI Studio is ready. Upload your photo to begin.')}
                style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Test
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {status === 'idle' && (
              <div className="card" style={{ padding: 48, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16, animation: 'float 4s ease-in-out infinite' }}>🤖</div>
                <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Ready to analyze</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 300 }}>Upload your photo and click "Run all 6 APIs" to get your personalized results.</div>
              </div>
            )}

            {status === 'running' && (
              <div className="card" style={{ padding: 48, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid #ede9fe', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: 8, border: '2px solid #fce7f3', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 8, border: '2px solid var(--pink)', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite reverse' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✨</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
                  {currentStep >= 0 ? STEPS[currentStep]?.label : 'Processing...'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {completedSteps.length} of {STEPS.length} steps complete
                </div>
                <div className="progress-bar" style={{ width: 200, marginTop: 16 }}>
                  <div className="progress-fill" style={{ width: `${(completedSteps.length / STEPS.length) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--pink))' }} />
                </div>
              </div>
            )}

            {(status === 'done' || completedSteps.length > 0) && (
              <div className="bounce-in">
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                        borderRadius: 9999, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                        whiteSpace: 'nowrap', transition: 'all 0.15s',
                        background: activeTab === t.id ? 'linear-gradient(135deg,#7c3aed,#ec4899)' : 'var(--surface)',
                        color: activeTab === t.id ? '#fff' : 'var(--muted)',
                        boxShadow: activeTab === t.id ? '0 4px 12px rgba(124,58,237,0.3)' : '#ebe8e4 0 0 0 1px inset',
                        opacity: t.result ? 1 : 0.5,
                      }}>
                      {t.icon} {t.label}
                      {t.result && <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeTab === t.id ? 'rgba(255,255,255,0.6)' : '#22c55e', display: 'inline-block' }} />}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="card" style={{ padding: 24, minHeight: 400 }}>
                  {activeTab === 'skin' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Skin Analysis Results</div>
                      {results.skinScores ? (
                        <div style={{ display: 'grid', gridTemplateColumns: results.skinOverlay ? '180px 1fr' : '1fr', gap: 20 }}>
                          {results.skinOverlay && <img src={results.skinOverlay} alt="Skin overlay" style={{ width: 180, borderRadius: 12 }} />}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {Object.entries(results.skinScores).map(([k, v]) => (
                              <div key={k}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                                  <span style={{ color: 'var(--body)', fontWeight: 500 }}>{CONCERN_LABELS[k] || k}</span>
                                  <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
                                </div>
                                <div className="progress-bar">
                                  <div className="progress-fill" style={{ width: `${v}%`, background: scoreColor(v as number) }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>
                          {status === 'running' ? <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', fontSize: 24 }}>⏳</div> : 'Run analysis to see results'}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'makeup' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Makeup Virtual Try-On</div>
                      {results.makeupResult
                        ? <img src={results.makeupResult} alt="Makeup VTO" style={{ maxWidth: 320, width: '100%', borderRadius: 16 }} />
                        : <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>{status === 'running' ? '⏳ Applying makeup...' : 'Run analysis to see results'}</div>
                      }
                    </div>
                  )}

                  {activeTab === 'outfit' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Outfit Virtual Try-On</div>
                      {results.clothResult
                        ? <img src={results.clothResult} alt="Outfit VTO" style={{ maxWidth: 320, width: '100%', borderRadius: 16 }} />
                        : <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>{status === 'running' ? '⏳ Trying on outfit...' : 'Run analysis to see results'}</div>
                      }
                    </div>
                  )}

                  {activeTab === 'hair' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Hair Color Try-On</div>
                      {results.hairResult
                        ? <img src={results.hairResult} alt="Hair VTO" style={{ maxWidth: 320, width: '100%', borderRadius: 16 }} />
                        : <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>{status === 'running' ? '⏳ Styling hair...' : 'Run analysis to see results'}</div>
                      }
                    </div>
                  )}

                  {activeTab === 'hairstyle' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Wig Style Try-On</div>
                      {results.hairstyleResult
                        ? <img src={results.hairstyleResult} alt="Hairstyle VTO" style={{ maxWidth: 320, width: '100%', borderRadius: 16 }} />
                        : <div style={{ textAlign: 'center', color: 'var(--graphite)', padding: 40 }}>{status === 'running' ? '⏳ Generating wig style...' : 'Run analysis to see results'}</div>
                      }
                    </div>
                  )}

                  {activeTab === 'jewelry' && (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginBottom: 16 }}>Jewelry Try-On</div>
                      {results.earringResult
                        ? <img src={results.earringResult} alt="Earring VTO" style={{ maxWidth: 320, width: '100%', borderRadius: 16 }} />
                        : <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>{status === 'running' ? '⏳ Adding jewelry...' : 'Run analysis to see results'}</div>
                      }
                    </div>
                  )}
                </div>

                {status === 'done' && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                    <Link href="/catalog" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      Browse adaptive catalog →
                    </Link>
                    <button onClick={() => { setStatus('idle'); setResults({}); setCompletedSteps([]); setPreview(null) }}
                      className="btn btn-dark btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      Try another photo
                    </button>
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontSize: 14, color: '#dc2626', fontWeight: 500 }}>Something went wrong</div>
                <button onClick={() => { setStatus('idle'); setCompletedSteps([]) }}
                  style={{ marginTop: 12, fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); } 100% { box-shadow: 0 0 0 8px rgba(124,58,237,0); } }`}</style>
    </div>
  )
}

export default function StudioPage() {
  return <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--canvas)' }} />}><StudioContent /></Suspense>
}
