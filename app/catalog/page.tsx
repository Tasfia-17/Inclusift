'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import products from '@/data/products.json'

function CatalogContent() {
  const searchParams = useSearchParams()
  const conditions = searchParams.get('conditions')?.split(',').filter(Boolean) || []

  const [filtered, setFiltered] = useState(products)
  const [category, setCategory] = useState('all')

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-700">InclusiFit</Link>
        <div className="flex gap-4">
          <Link href="/beauty" className="text-sm text-gray-600 hover:text-purple-700">Beauty</Link>
          <Link href="/profile" className="text-sm text-purple-600">Edit Profile</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {conditions.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="text-sm font-semibold text-purple-900 mb-2">Filters applied based on your profile:</div>
            <div className="flex flex-wrap gap-2">
              {conditions.map(c => (
                <span key={c} className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Adaptive Catalog</h1>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="footwear">Footwear</option>
            <option value="beauty">Beauty</option>
            <option value="hair">Hair & Wigs</option>
            <option value="jewelry">Jewelry</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <img src={p.image} alt={p.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <div className="text-xs text-purple-600 font-semibold uppercase mb-1">{p.category}</div>
                <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${p.price}</span>
                  <Link
                    href={p.category === 'beauty' ? '/beauty' : `/tryon?product=${p.id}`}
                    className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    {p.category === 'beauty' ? 'Analyze Skin' : 'Try On'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No products match your filters.{' '}
            <Link href="/profile" className="text-purple-600 underline">Update your profile</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
