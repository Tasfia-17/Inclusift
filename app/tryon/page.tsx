'use client'
import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    }
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

      let attempts = 0
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000))
        const pollRes = await fetch(`/api/vto/clothes/${task_id}`)
        const poll = await pollRes.json()
        if (poll?.data?.task_status === 'success') {
          setResultUrl(poll.data.results.url)
          setStatus('done')
          speak('Your virtual try-on is ready!')
          return
        }
        if (poll?.data?.task_status === 'error') break
        attempts++
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <Link href="/catalog" className="text-purple-600">← Back to catalog</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link href="/catalog" className="text-purple-600 text-sm">← Back</Link>
        <span className="text-xl font-bold text-purple-700">InclusiFit</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Virtual Try-On</h1>
        <p className="text-gray-500 mb-8">Upload your photo to see how <strong>{product.name}</strong> looks on you.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h2 className="font-bold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.desc}</p>
              <p className="text-lg font-bold text-purple-600 mt-2">${product.price}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Upload your photo</h3>
              <p className="text-sm text-gray-400 mb-4">Full-body or upper-body, good lighting, plain background works best.</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) setUserPhoto(URL.createObjectURL(f))
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold"
                aria-label="Upload your photo for virtual try-on"
              />
              {userPhoto && (
                <img src={userPhoto} alt="Your photo preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
              )}
              <button
                onClick={handleTryOn}
                disabled={!userPhoto || status === 'uploading' || status === 'processing'}
                className="mt-4 w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {status === 'uploading' ? 'Uploading...' :
                 status === 'processing' ? 'AI rendering (1-2 min)...' :
                 'Try It On →'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            {status === 'idle' && (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">👗</div>
                <p>Upload your photo and click "Try It On"</p>
              </div>
            )}
            {(status === 'uploading' || status === 'processing') && (
              <div className="text-center">
                <div className="animate-spin text-5xl mb-4">⏳</div>
                <p className="text-gray-600 font-medium">
                  {status === 'uploading' ? 'Uploading...' : 'AI is rendering your try-on...'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Takes 1-2 minutes</p>
              </div>
            )}
            {status === 'done' && resultUrl && (
              <div className="w-full">
                <div className="text-green-600 font-semibold text-center mb-4">✓ Try-on complete!</div>
                <img src={resultUrl} alt="Virtual try-on result" className="w-full rounded-xl" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a href={resultUrl} download className="text-center border border-purple-600 text-purple-600 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50">
                    Save Image
                  </a>
                  <button className="bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-purple-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div className="text-center text-red-500">
                <div className="text-4xl mb-3">⚠️</div>
                <p>Something went wrong. Please try again.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-purple-600 underline">Reset</button>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <TryOnContent />
    </Suspense>
  )
}
