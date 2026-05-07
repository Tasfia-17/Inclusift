'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ArrowRight, Check } from 'lucide-react'

const CONDITIONS = [
  { id: 'shorter_limbs', icon: '📏', label: 'Shorter limbs / atypical proportions', desc: 'Achondroplasia, dwarfism, limb differences', color: 'from-brand-100 to-brand-50', border: 'border-brand-300' },
  { id: 'limited_dexterity', icon: '🤲', label: 'Limited hand / arm dexterity', desc: 'Muscular dystrophy, GNE myopathy, MS, Parkinson\'s', color: 'from-blush-100 to-blush-50', border: 'border-blush-300' },
  { id: 'afo_user', icon: '🦿', label: 'Use ankle-foot orthosis (AFO)', desc: 'GNE myopathy, cerebral palsy, foot deformities', color: 'from-amber-100 to-amber-50', border: 'border-amber-300' },
  { id: 'loose_fit', icon: '🧘', label: 'Prefer loose / easy-to-wear clothing', desc: 'SMA, muscle weakness, fatigue conditions', color: 'from-mint-100 to-mint-50', border: 'border-mint-300' },
  { id: 'hair_loss', icon: '💆', label: 'Hair loss / wig shopping', desc: 'Alopecia, cancer treatment, autoimmune conditions', color: 'from-violet-100 to-violet-50', border: 'border-violet-300' },
  { id: 'visual_impairment', icon: '👁️', label: 'Visual impairment', desc: 'Low vision, blindness, contrast sensitivity', color: 'from-sky-100 to-sky-50', border: 'border-sky-300' },
]

export default function ProfilePage() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-10">
          <div className="inline-block bg-white/60 backdrop-blur-sm border border-brand-200/50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            30 seconds to set up
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Your adaptive profile</h1>
          <p className="text-gray-500">Select all that apply. We'll auto-apply the right filters and features for you.</p>
        </div>

        <div className="space-y-3">
          {CONDITIONS.map(c => {
            const isSelected = selected.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={isSelected}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                  isSelected
                    ? `bg-gradient-to-r ${c.color} ${c.border} shadow-card`
                    : 'bg-white/70 backdrop-blur-sm border-gray-200/60 hover:border-brand-200 hover:shadow-card'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-white/60' : 'bg-gray-50'
                }`}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{c.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{c.desc}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? 'bg-brand-600 border-brand-600' : 'border-gray-300'
                }`}>
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => router.push(`/catalog?conditions=${selected.join(',')}`)}
          disabled={selected.length === 0}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-blush-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
        >
          Continue to Catalog
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          You can always update your profile later
        </p>
      </div>
    </div>
  )
}
