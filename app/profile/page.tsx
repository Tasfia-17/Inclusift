'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CONDITIONS = [
  {
    id: 'shorter_limbs',
    icon: '📏',
    label: 'Shorter limbs / atypical proportions',
    desc: 'Achondroplasia, dwarfism, limb differences',
    filters: { length: 'petite', waist_rise: 'high' },
  },
  {
    id: 'limited_dexterity',
    icon: '🤲',
    label: 'Limited hand / arm dexterity',
    desc: 'Muscular dystrophy, GNE myopathy, MS, Parkinson\'s',
    filters: { closure_type: 'magnetic_or_velcro', waistband: 'elastic', container_type: 'pump' },
  },
  {
    id: 'afo_user',
    icon: '🦿',
    label: 'Use ankle-foot orthosis (AFO)',
    desc: 'GNE myopathy, cerebral palsy, foot deformities',
    filters: { afo_compatible: true, width: 'wide' },
  },
  {
    id: 'loose_fit',
    icon: '🧘',
    label: 'Prefer loose / easy-to-wear clothing',
    desc: 'SMA, muscle weakness, fatigue conditions',
    filters: { fit_style: 'loose', dressing_method: 'front_opening' },
  },
  {
    id: 'hair_loss',
    icon: '💆',
    label: 'Hair loss / wig shopping',
    desc: 'Alopecia, cancer treatment, autoimmune conditions',
    filters: { category: 'wigs_and_hair' },
  },
  {
    id: 'visual_impairment',
    icon: '👁️',
    label: 'Visual impairment',
    desc: 'Low vision, blindness, contrast sensitivity',
    filters: { voice_mode: true, high_contrast: true },
  },
]

export default function ProfilePage() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleContinue = () => {
    const params = new URLSearchParams({ conditions: selected.join(',') })
    router.push(`/catalog?${params}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-purple-600 text-sm mb-6 inline-block">← Back</a>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your profile</h1>
        <p className="text-gray-500 mb-8">Select all that apply. We'll auto-apply the right filters for you.</p>

        <div className="space-y-3">
          {CONDITIONS.map(c => (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              aria-pressed={selected.includes(c.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition flex items-start gap-4 ${
                selected.includes(c.id)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <span className="text-3xl">{c.icon}</span>
              <div>
                <div className="font-semibold text-gray-900">{c.label}</div>
                <div className="text-sm text-gray-500">{c.desc}</div>
              </div>
              {selected.includes(c.id) && (
                <span className="ml-auto text-purple-600 font-bold text-xl">✓</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="mt-8 w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Continue to Catalog →
        </button>
      </div>
    </div>
  )
}
