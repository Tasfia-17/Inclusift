'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { SlidersHorizontal, Sparkles, X } from 'lucide-react'
import products from '@/data/products.json'

const CATEGORY_ICONS: Record<string, string> = {
  all: '🛍️', clothing: '👗', footwear: '👟', beauty: '✨', hair: '💇', jewelry: '💍'
}

const ADAPTIVE_BADGES: Record<string, { label: string; color: string }> = {
  magnetic_snap: { label: 'Magnetic snap', color: 'bg-brand-100 text-brand-700' },
  velcro: { label: 'Velcro', color: 'bg-blush-100 text-blush-700' },
  elastic: { label: 'Elastic waist', color: 'bg-mint-100 text-mint-700' },
  loose: { label: 'Loose fit', color: 'bg-violet-100 text-violet-700' },
  afo_compatible: { label: 'AFO compatible', color: 'bg-amber-100 text-amber-700' },
  pump: { label: 'Pump dispenser', color: 'bg-sky-100 text-sky-700' },
  front_opening: { label: 'Front opening', color: 'bg-rose-100 text-rose-700' },
}

function getAdaptiveBadges(product: any): string[] {
  const a = product.adaptive || {}
  const badges: string[] = []
  if (a.closure_type === 'magnetic_snap') badges.push('magnetic_snap')
  if (a.closure_type === 'velcro') badges.push('velcro')
  if (a.waistband === 'elastic') badges.push('elastic')
  if (a.fit_style === 'loose') badges.push('loose')
  if (a.afo_compatible) badges.push('afo_compatible')
  if (a.container_type === 'pump') badges.push('pump')
  if (a.dressing_method === 'front_opening') badges.push('front_opening')
  return badges
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const conditions = searchParams.get('conditions')?.split(',').filter(Boolean) || []
  const [category, setCategory] = useState('all')
  const [filtered, setFiltered] = useState(products)

  useEffect(() => {
    let result = products
    if (conditions.length > 0) {
      result = result.filter(p => p.tags.some(t => conditions.includes(t)))
    }
    if (category !== 'all') {
      result = result.filter(p => p.category === category)
    }
    setFiltered(result)
  }, [conditions.join(','), category])

  return (
    <div className="min-h-screen" style={{background:'#faf5ff'}}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Adaptive Catalog</h1>
          <p className="text-gray-500 mt-1">Products designed for your body and your life</p>
        </div>

        {/* Active filters */}
        {conditions.length > 0 && (
          <div className="glass-purple rounded-2xl p-4 mb-6 border border-brand-200/30 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              <SlidersHorizontal size={14} />
              Active filters:
            </div>
            {conditions.map(c => (
              <span key={c} className="bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                {c.replace(/_/g, ' ')}
              </span>
            ))}
            <Link href="/profile" className="ml-auto text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1">
              <X size={12} /> Edit profile
            </Link>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-brand-600 to-blush-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200/60'
              }`}
            >
              <span>{icon}</span>
              <span className="capitalize">{cat === 'all' ? 'All Products' : cat}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const badges = getAdaptiveBadges(p)
            return (
              <div key={p.id} className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-brand-100/40 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="relative overflow-hidden h-56">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full capitalize">
                      {p.category}
                    </span>
                  </div>
                  {badges.includes('afo_compatible') && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      AFO ✓
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.desc}</p>

                  {/* Adaptive badges */}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {badges.slice(0, 3).map(b => (
                        <span key={b} className={`text-xs font-medium px-2 py-0.5 rounded-full ${ADAPTIVE_BADGES[b]?.color || 'bg-gray-100 text-gray-600'}`}>
                          {ADAPTIVE_BADGES[b]?.label || b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">${p.price}</span>
                    <Link
                      href={p.category === 'beauty' ? '/beauty' : `/tryon?product=${p.id}`}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-blush-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-brand-500/30 hover:scale-105 transition-all"
                    >
                      <Sparkles size={14} />
                      {p.category === 'beauty' ? 'Analyze' : 'Try On'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products match your filters</h3>
            <Link href="/profile" className="text-brand-600 underline text-sm">Update your profile</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen animated-gradient flex items-center justify-center">
        <div className="shimmer w-64 h-8 rounded-full" />
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
