'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import products from '@/data/products.json'

const CONCERN_LABELS: Record<string, string> = {
  hd_acne: 'Acne', hd_pore: 'Pores', hd_moisture: 'Moisture',
  hd_redness: 'Redness', hd_texture: 'Texture', hd_wrinkle: 'Wrinkles',
  hd_radiance: 'Radiance', hd_oiliness: 'Oiliness', hd_eye_bag: 'Eye Bags',
  hd_dark_circle: 'Dark Circles', hd_firmness: 'Firmness', hd_age_spot: 'Age Spots'
}

const beautyProducts = products.filter(p => p.category === 'beauty')

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

export default function BeautyPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [scores, setScores] = useState<Record<string, number> | null>(null)
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null)
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null)
  const [makeupResult, setMakeupResult] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    }
  }

  const handleAnalyze = async () => {
    if (!fileRef.current?.files?.[0]) return
    setStatus('uploading')

    try {
      // Upload photo
      const formData = new FormData()
      formData.append('file', fileRef.current.files[0])
      formData.append('api', 'skin-analysis')
      const uploadRes = await fetch('/api/vto/upload', { method: 'POST', body: formData })
      const { file_id } = await uploadRes.json()

      // We need a public URL for skin analysis — use the file_id approach
      setStatus('processing')

      const taskRes = await fetch('/api/vto/skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src_file_id: file_id })
      })
      const { data: taskData } = await taskRes.json()
      const task_id = taskData?.task_id

      // Poll
      let attempts = 0
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000))
        const pollRes = await fetch(`/api/vto/skin/${task_id}`)
        const poll = await pollRes.json()
        if (poll?.data?.task_status === 'success') {
          const results = poll.data.results
          setScores(results.scores || {})
          setOverlayUrl(results.overlay_url || results.url || null)
          setStatus('done')

          // Voice output
          const topConcerns = Object.entries(results.scores || {})
            .sort(([, a], [, b]) => (a as number) - (b as number))
            .slice(0, 3)
            .map(([k]) => CONCERN_LABELS[k])
            .join(', ')
          speak(`Skin analysis complete. Your top concerns are: ${topConcerns}. Scroll down to see recommended products.`)
          return
        }
        attempts++
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  const handleMakeupVTO = async (productId: string) => {
    if (!userPhotoUrl) return
    const res = await fetch('/api/vto/makeup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        src_file_url: userPhotoUrl,
        makeup_items: [{ type: 'foundation', product_id: productId }]
      })
    })
    const { data } = await res.json()
    const task_id = data?.task_id
    let attempts = 0
    while (attempts < 20) {
      await new Promise(r => setTimeout(r, 2000))
      const poll = await fetch(`/api/vto/makeup/${task_id}`)
      const d = await poll.json()
      if (d?.data?.task_status === 'success') {
        setMakeupResult(d.data.results.url)
        speak('Makeup try-on is ready!')
        return
      }
      attempts++
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link href="/catalog" className="text-purple-600 text-sm">← Catalog</Link>
        <span className="text-xl font-bold text-purple-700">InclusiFit Beauty</span>
        <button
          onClick={() => speak('Welcome to InclusiFit Beauty. Upload your photo to get a personalized skin analysis and product recommendations.')}
          className="ml-auto text-sm text-purple-600 border border-purple-300 px-3 py-1 rounded-lg"
          aria-label="Read page description aloud"
        >
          🔊 Read Aloud
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Skin Analysis</h1>
        <p className="text-gray-500 mb-8">Upload a selfie for a 7-second skin analysis. We'll recommend products filtered by container type you can manage.</p>

        {/* Upload */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) setUserPhotoUrl(URL.createObjectURL(f))
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold"
            aria-label="Upload selfie for skin analysis"
          />
          <button
            onClick={handleAnalyze}
            disabled={!userPhotoUrl || status === 'uploading' || status === 'processing'}
            className="mt-4 bg-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-40 transition"
          >
            {status === 'uploading' ? 'Uploading...' :
             status === 'processing' ? 'Analyzing skin...' :
             'Analyze My Skin'}
          </button>
        </div>

        {/* Results */}
        {status === 'done' && scores && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Skin Analysis</h2>
              {overlayUrl && (
                <img src={overlayUrl} alt="Skin analysis overlay" className="w-64 rounded-xl mb-6" />
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(scores).map(([key, score]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-semibold text-gray-700">{CONCERN_LABELS[key] || key}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Products</h2>
              <p className="text-sm text-gray-500 mb-4">Filtered by easy-to-use containers (pump, twist) for limited dexterity.</p>
              <div className="grid md:grid-cols-2 gap-6">
                {beautyProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                    <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{p.desc}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {(p.adaptive as any)?.container_type} dispenser
                      </span>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-bold text-purple-600">${p.price}</span>
                        {userPhotoUrl && (
                          <button
                            onClick={() => handleMakeupVTO(p.id)}
                            className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                          >
                            Try On
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Makeup VTO Result */}
            {makeupResult && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Makeup Try-On Result</h2>
                <img src={makeupResult} alt="Makeup try-on result" className="w-full max-w-sm rounded-xl" />
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 text-red-600 rounded-xl p-6 text-center">
            Something went wrong. Please try again.
            <button onClick={() => setStatus('idle')} className="block mx-auto mt-3 underline">Reset</button>
          </div>
        )}
      </div>
    </div>
  )
}
