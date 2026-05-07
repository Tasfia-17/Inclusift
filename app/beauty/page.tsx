'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Upload, Sparkles, Volume2, Mic } from 'lucide-react'
import products from '@/data/products.json'

const CONCERN_LABELS: Record<string, { label: string; icon: string }> = {
  hd_acne:              { label: 'Acne',          icon: '🔴' },
  hd_pore:              { label: 'Pores',          icon: '🔵' },
  hd_moisture:          { label: 'Moisture',       icon: '💧' },
  hd_redness:           { label: 'Redness',        icon: '🌹' },
  hd_texture:           { label: 'Texture',        icon: '🌊' },
  hd_wrinkle:           { label: 'Wrinkles',       icon: '〰️' },
  hd_radiance:          { label: 'Radiance',       icon: '✨' },
  hd_oiliness:          { label: 'Oiliness',       icon: '💫' },
  hd_eye_bag:           { label: 'Eye Bags',       icon: '👁️' },
  hd_dark_circle:       { label: 'Dark Circles',   icon: '🌑' },
  hd_firmness:          { label: 'Firmness',       icon: '💪' },
  hd_age_spot:          { label: 'Age Spots',      icon: '🟤' },
}

const beautyProducts = products.filter(p => p.category === 'beauty')
type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export default function BeautyPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [scores, setScores] = useState<Record<string, number> | null>(null)
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [makeupResult, setMakeupResult] = useState<string | null>(null)
  const [makeupLoading, setMakeupLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadedFileId = useRef<string | null>(null)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(text)) }
  }

  const handleAnalyze = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('uploading')
    try {
      const formData = new FormData()
      formData.append('file', fileRef.current.files[0])
      formData.append('api', 'skin-analysis')
      const uploadRes = await fetch('/api/vto/upload', { method: 'POST', body: formData })
      const { file_id } = await uploadRes.json()
      uploadedFileId.current = file_id

      setStatus('processing')
      const taskRes = await fetch('/api/vto/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src_file_id: file_id })
      })
      const { data: taskData } = await taskRes.json()
      const task_id = taskData?.task_id

      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const poll = await fetch(`/api/vto/skin/${task_id}`)
        const d = await poll.json()
        if (d?.data?.task_status === 'success') {
          const results = d.data.results
          setScores(results.scores || {})
          setOverlayUrl(results.overlay_url || results.url || null)
          setStatus('done')
          const topConcerns = Object.entries(results.scores || {})
            .sort(([,a],[,b]) => (a as number) - (b as number))
            .slice(0, 3).map(([k]) => CONCERN_LABELS[k]?.label || k).join(', ')
          speak(`Skin analysis complete. Your top concerns are: ${topConcerns}. Scroll down to see recommended products.`)
          return
        }
      }
      setStatus('error')
    } catch { setStatus('error') }
  }

  const handleMakeupVTO = async (productId: string) => {
    if (!uploadedFileId.current) return
    setMakeupLoading(true)
    try {
      const taskRes = await fetch('/api/vto/makeup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src_file_id: uploadedFileId.current, makeup_items: [{ type: 'foundation' }] })
      })
      const { data } = await taskRes.json()
      const task_id = data?.task_id
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const poll = await fetch(`/api/vto/makeup/${task_id}`)
        const d = await poll.json()
        if (d?.data?.task_status === 'success') {
          setMakeupResult(d.data.results.url)
          speak('Makeup try-on is ready!')
          break
        }
      }
    } finally { setMakeupLoading(false) }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-400'
    if (score >= 60) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="min-h-screen" style={{background:'#faf5ff'}}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/catalog" className="text-sm text-brand-600 mb-3 inline-block">← Catalog</Link>
            <h1 className="text-3xl font-extrabold text-gray-900">AI Skin Analysis</h1>
            <p className="text-gray-500 mt-1">12 concerns · HD accuracy · Products filtered for your needs</p>
          </div>
          <button
            onClick={() => speak('Welcome to InclusiFit Beauty. Upload your selfie for a personalized skin analysis. Results will be read aloud automatically.')}
            className="flex items-center gap-2 glass-purple border border-brand-200/40 text-brand-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-brand-50 transition"
            aria-label="Read page description aloud"
          >
            <Volume2 size={16} /> Read Aloud
          </button>
        </div>

        {/* Upload section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-brand-100/40 shadow-card mb-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Upload your selfie</h3>
              <p className="text-sm text-gray-400 mb-4">Close-up face photo · Good lighting · No glasses</p>
              <label className="block cursor-pointer">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setUserPhoto(URL.createObjectURL(f)) }}
                  aria-label="Upload selfie for skin analysis"
                />
                <div className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
                  userPhoto ? 'border-brand-300 bg-brand-50/50' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
                }`}>
                  {userPhoto
                    ? <img src={userPhoto} alt="Your selfie" className="w-full h-36 object-cover rounded-xl" />
                    : <div className="text-gray-400"><Upload size={28} className="mx-auto mb-2 text-brand-300" /><div className="text-sm">Click to upload selfie</div></div>
                  }
                </div>
              </label>
            </div>
            <div className="space-y-3">
              <div className="glass-purple rounded-2xl p-4 border border-brand-100/30">
                <div className="text-sm font-semibold text-gray-700 mb-2">What we analyze:</div>
                <div className="grid grid-cols-2 gap-1">
                  {Object.values(CONCERN_LABELS).slice(0,8).map(c => (
                    <div key={c.label} className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{c.icon}</span> {c.label}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!userPhoto || status === 'uploading' || status === 'processing'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-blush-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Sparkles size={18} />
                {status === 'uploading' ? 'Uploading...' :
                 status === 'processing' ? 'Analyzing (7 sec)...' :
                 'Analyze My Skin'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {status === 'done' && scores && (
          <div className="space-y-8">
            {/* Scores */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-brand-100/40 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">Your Skin Analysis</h2>
                <button onClick={() => {
                  const top = Object.entries(scores).sort(([,a],[,b]) => (a as number)-(b as number)).slice(0,3).map(([k]) => `${CONCERN_LABELS[k]?.label}: ${scores[k]}`).join(', ')
                  speak(`Your skin analysis results: ${top}`)
                }} className="flex items-center gap-1.5 text-sm text-brand-600 border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition">
                  <Volume2 size={14} /> Read Results
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {overlayUrl && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Skin overlay</div>
                    <img src={overlayUrl} alt="Skin analysis overlay" className="w-full rounded-2xl" />
                  </div>
                )}
                <div className="space-y-3">
                  {Object.entries(scores).map(([key, score]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          {CONCERN_LABELS[key]?.icon} {CONCERN_LABELS[key]?.label || key}
                        </span>
                        <span className="text-sm font-bold text-gray-900">{score}/100</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${getScoreColor(score as number)}`}
                          style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended products */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Recommended for you</h2>
              <p className="text-sm text-gray-500 mb-5">Filtered by accessible containers — pump dispensers and easy-grip applicators</p>
              <div className="grid md:grid-cols-2 gap-5">
                {beautyProducts.map(p => (
                  <div key={p.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-brand-100/40 shadow-card flex gap-4">
                    <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 mb-2">{p.desc}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-mint-100 text-mint-700 px-2 py-0.5 rounded-full font-medium">
                          {(p.adaptive as any)?.container_type} dispenser
                        </span>
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                          {(p.adaptive as any)?.grip_difficulty} grip
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">${p.price}</span>
                        <button
                          onClick={() => handleMakeupVTO(p.id)}
                          disabled={makeupLoading}
                          className="flex items-center gap-1 text-xs bg-gradient-to-r from-brand-600 to-blush-500 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50 hover:scale-105 transition-all"
                        >
                          <Sparkles size={12} />
                          {makeupLoading ? 'Loading...' : 'Try On'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Makeup VTO result */}
            {makeupResult && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-brand-100/40 shadow-card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Makeup Try-On Result</h2>
                <img src={makeupResult} alt="Makeup try-on result" className="max-w-sm w-full rounded-2xl shadow-lg" />
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Something went wrong. Please try again.</p>
            <button onClick={() => setStatus('idle')} className="mt-3 text-brand-600 underline text-sm">Reset</button>
          </div>
        )}
      </div>
    </div>
  )
}
