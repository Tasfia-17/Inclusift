'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Upload, Sparkles, Download, ShoppingCart, RotateCcw, Volume2 } from 'lucide-react'
import products from '@/data/products.json'

type Status = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

function TryOnContent() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')
  const product = products.find(p => p.id === productId)

  const [status, setStatus] = useState<Status>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const speak = (text: string) => {
    if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  const handleTryOn = async () => {
    if (!fileRef.current?.files?.[0] || !product) return
    setStatus('uploading')
    try {
      const formData = new FormData()
      formData.append('file', fileRef.current.files[0])
      formData.append('api', 'cloth')
      const uploadRes = await fetch('/api/vto/upload', { method: 'POST', body: formData })
      const { file_id } = await uploadRes.json()

      setStatus('processing')
      const taskRes = await fetch('/api/vto/clothes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src_file_id: file_id, cloth_file_url: product.garment_url })
      })
      const data = await taskRes.json()
      const task_id = data?.data?.task_id || data?.task_id

      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const poll = await fetch(`/api/vto/clothes/${task_id}`)
        const d = await poll.json()
        if (d?.data?.task_status === 'success') {
          setResultUrl(d.data.results.url)
          setStatus('done')
          speak('Your virtual try-on is ready! The garment has been rendered on your photo.')
          return
        }
        if (d?.data?.task_status === 'error') break
      }
      setStatus('error')
    } catch { setStatus('error') }
  }

  if (!product) return (
    <div className="min-h-screen animated-gradient flex items-center justify-center">
      <div className="text-center glass-purple rounded-3xl p-10">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600 mb-4">Product not found</p>
        <Link href="/catalog" className="text-brand-600 font-semibold">← Back to catalog</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{background:'#faf5ff'}}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-8">
          <Link href="/catalog" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 mb-4">
            ← Back to catalog
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Virtual Try-On</h1>
          <p className="text-gray-500 mt-1">Powered by Perfect Corp AI · See how it looks on <em>you</em></p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Product + Upload */}
          <div className="space-y-5">
            {/* Product card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand-100/40 shadow-card">
              <div className="relative h-64 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-lg">{product.name}</div>
                  <div className="text-white/80 text-sm">{product.desc}</div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="text-2xl font-extrabold text-gray-900">${product.price}</span>
                <span className="text-xs bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-medium capitalize">{product.category}</span>
              </div>
            </div>

            {/* Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-brand-100/40 shadow-card">
              <h3 className="font-bold text-gray-900 mb-1">Upload your photo</h3>
              <p className="text-sm text-gray-400 mb-4">Full-body or upper-body · Good lighting · Plain background</p>

              <label className="block cursor-pointer">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) setUserPhoto(URL.createObjectURL(f)) }}
                  aria-label="Upload your photo for virtual try-on"
                />
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  userPhoto ? 'border-brand-300 bg-brand-50/50' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
                }`}>
                  {userPhoto ? (
                    <img src={userPhoto} alt="Your photo" className="w-full h-40 object-cover rounded-xl" />
                  ) : (
                    <div className="text-gray-400">
                      <Upload size={32} className="mx-auto mb-2 text-brand-300" />
                      <div className="text-sm font-medium">Click to upload photo</div>
                      <div className="text-xs mt-1">JPEG or PNG, max 10MB</div>
                    </div>
                  )}
                </div>
              </label>

              <button
                onClick={handleTryOn}
                disabled={!userPhoto || status === 'uploading' || status === 'processing'}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-blush-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                <Sparkles size={18} />
                {status === 'uploading' ? 'Uploading...' :
                 status === 'processing' ? 'AI rendering (1-2 min)...' :
                 'Try It On'}
              </button>
            </div>
          </div>

          {/* Right: Result */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-brand-100/40 shadow-card flex flex-col items-center justify-center min-h-[500px] p-6">
            {status === 'idle' && (
              <div className="text-center text-gray-400">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-100 to-blush-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 animate-float">
                  👗
                </div>
                <p className="font-medium text-gray-500">Your try-on result will appear here</p>
                <p className="text-sm mt-1">Upload your photo to get started</p>
              </div>
            )}

            {(status === 'uploading' || status === 'processing') && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-200 to-blush-200 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-brand-600 animate-spin" />
                </div>
                <p className="font-semibold text-gray-700">
                  {status === 'uploading' ? 'Uploading your photo...' : 'Perfect Corp AI is rendering...'}
                </p>
                <p className="text-sm text-gray-400 mt-1">This takes 1-2 minutes</p>
                <div className="mt-4 w-48 h-1.5 bg-brand-100 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-blush-500 rounded-full shimmer" style={{width:'60%'}} />
                </div>
              </div>
            )}

            {status === 'done' && resultUrl && (
              <div className="w-full">
                <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  Try-on complete!
                </div>
                <img src={resultUrl} alt="Virtual try-on result" className="w-full rounded-2xl shadow-lg" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <button onClick={() => speak('Your virtual try-on result is displayed. The garment has been rendered on your photo.')}
                    className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                    <Volume2 size={14} /> Read
                  </button>
                  <a href={resultUrl} download className="flex items-center justify-center gap-1.5 border border-brand-300 text-brand-600 py-2.5 rounded-xl text-sm hover:bg-brand-50 transition">
                    <Download size={14} /> Save
                  </a>
                  <button className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-blush-500 text-white py-2.5 rounded-xl text-sm font-semibold">
                    <ShoppingCart size={14} /> Buy
                  </button>
                </div>
                <button onClick={() => { setStatus('idle'); setResultUrl(null) }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition">
                  <RotateCcw size={14} /> Try another photo
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="text-5xl mb-3">⚠️</div>
                <p className="text-red-500 font-medium">Something went wrong</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-brand-600 underline text-sm">Try again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TryOnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animated-gradient flex items-center justify-center"><div className="shimmer w-64 h-8 rounded-full" /></div>}>
      <TryOnContent />
    </Suspense>
  )
}
