import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ArrowRight, Sparkles, Heart, Shield, Mic, Eye, Zap } from 'lucide-react'

const STATS = [
  { value: '1.3B', label: 'People with disabilities', sub: 'globally' },
  { value: '$8T', label: 'Spending power', sub: 'underserved' },
  { value: '71%', label: 'Abandon inaccessible', sub: 'e-commerce' },
  { value: '94%', label: 'Higher conversion', sub: 'with AR try-on' },
]

const FEATURES = [
  { icon: '👗', title: 'Adaptive Clothing', desc: 'Filter by closure type, waistband, fit, and proportional length. See how it looks on your body.', color: 'from-brand-100 to-brand-50' },
  { icon: '👟', title: 'AFO-Compatible Shoes', desc: 'Find shoes that fit over ankle-foot orthoses. Wide widths, small adult sizes, velcro closures.', color: 'from-blush-100 to-blush-50' },
  { icon: '✨', title: 'Accessible Beauty', desc: 'AI skin analysis + products filtered by container type. Pump dispensers, easy-grip applicators.', color: 'from-mint-100 to-mint-50' },
  { icon: '💇', title: 'Hair & Wigs', desc: 'Try on wigs and hairstyles virtually. Perfect for alopecia, cancer treatment, or any hair loss.', color: 'from-amber-100 to-amber-50' },
  { icon: '🎤', title: 'Voice Controlled', desc: 'Say "try this on me" or "read my results". Full voice navigation for motor and visual disabilities.', color: 'from-violet-100 to-violet-50' },
  { icon: '♿', title: 'Fully Accessible', desc: 'Screen reader support, high contrast mode, large tap targets, session save for fatigue conditions.', color: 'from-teal-100 to-teal-50' },
]

const CONDITIONS = [
  { icon: '📏', label: 'Shorter limbs', condition: 'Achondroplasia' },
  { icon: '🤲', label: 'Limited dexterity', condition: 'Muscular Dystrophy' },
  { icon: '🦿', label: 'AFO users', condition: 'GNE Myopathy' },
  { icon: '🧘', label: 'Loose fit needed', condition: 'SMA' },
  { icon: '💆', label: 'Hair loss', condition: 'Alopecia' },
  { icon: '👁️', label: 'Visual impairment', condition: 'Low Vision' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center animated-gradient overflow-hidden pt-20">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blush-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'2s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint-200/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-brand-200/50 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
              <Sparkles size={14} className="text-brand-500" />
              Built for 1.3 billion people with disabilities
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Fashion that fits{' '}
              <span className="gradient-text">YOUR body.</span>
              <br />
              <span className="text-gray-500 font-light text-4xl lg:text-5xl">Not the other way around.</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
              Disability-aware smart filters + Perfect Corp AI virtual try-on. Find adaptive clothing, see how it looks on <em>you</em> — before you buy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-blush-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 transition-all duration-200 text-base">
                Start My Profile
                <ArrowRight size={18} />
              </Link>
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 glass border border-brand-200/50 text-brand-700 font-semibold px-8 py-4 rounded-2xl hover:bg-white/80 transition-all text-base">
                Browse Catalog
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                { icon: <Shield size={14}/>, text: 'WCAG 2.1 AA' },
                { icon: <Heart size={14}/>, text: 'Community-built' },
                { icon: <Zap size={14}/>, text: 'Perfect Corp API' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/50 px-3 py-1.5 rounded-full border border-gray-200/50">
                  <span className="text-brand-500">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Main card */}
            <div className="absolute top-8 left-8 right-8 glass-purple rounded-3xl p-6 shadow-glow border border-brand-200/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-blush-400 flex items-center justify-center text-white text-lg">👗</div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Adaptive Wrap Dress</div>
                  <div className="text-xs text-gray-500">Magnetic snap · Elastic waist · Petite</div>
                </div>
                <div className="ml-auto text-brand-600 font-bold">$89</div>
              </div>
              <div className="bg-gradient-to-br from-brand-50 to-blush-50 rounded-2xl h-48 flex items-center justify-center text-6xl animate-float">
                👗
              </div>
              <div className="mt-4 flex gap-2">
                <div className="flex-1 bg-gradient-to-r from-brand-600 to-blush-500 text-white text-sm font-semibold py-2.5 rounded-xl text-center">Try On →</div>
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-brand-500">♡</div>
              </div>
            </div>

            {/* Floating badge 1 */}
            <div className="absolute -top-4 right-4 glass rounded-2xl px-4 py-3 shadow-card border border-white/60 animate-float" style={{animationDelay:'1s'}}>
              <div className="text-xs font-semibold text-gray-700">✓ AFO Compatible</div>
              <div className="text-xs text-gray-400">Wide width available</div>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-card border border-white/60 animate-float" style={{animationDelay:'3s'}}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-mint-100 rounded-full flex items-center justify-center text-sm">✨</div>
                <div>
                  <div className="text-xs font-semibold text-gray-700">Skin Analysis</div>
                  <div className="text-xs text-gray-400">12 concerns · 7 sec</div>
                </div>
              </div>
            </div>

            {/* Floating badge 3 */}
            <div className="absolute bottom-16 right-0 glass rounded-2xl px-4 py-3 shadow-card border border-white/60 animate-float" style={{animationDelay:'2s'}}>
              <div className="text-xs font-semibold text-green-700">🎤 Voice Ready</div>
              <div className="text-xs text-gray-400">"Try this on me"</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/60 backdrop-blur-sm border-y border-brand-100/30">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.value} className="text-center">
              <div className="text-4xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-sm font-semibold text-gray-700 mt-1">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Built from real community research</div>
          <h2 className="text-4xl font-bold text-gray-900">Designed for your condition</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Every filter, every feature was shaped by real people with disabilities sharing what they actually need.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CONDITIONS.map(c => (
            <Link key={c.label} href={`/profile`}
              className="glass-purple rounded-2xl p-4 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 border border-brand-100/40 group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{c.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.condition}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white/0 to-brand-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-3">Powered by Perfect Corp's AI/AR APIs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className={`bg-gradient-to-br ${f.color} rounded-3xl p-6 border border-white/60 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200`}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">How it works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Set your profile', desc: 'Tell us about your condition. We auto-apply the right adaptive filters.', icon: '👤' },
            { step: '02', title: 'Browse & filter', desc: 'See only products that work for your body. Closure type, waistband, AFO support, and more.', icon: '🔍' },
            { step: '03', title: 'Try on with AI', desc: 'Upload your photo. Perfect Corp\'s AI renders the garment on your actual body in minutes.', icon: '✨' },
          ].map(s => (
            <div key={s.step} className="relative">
              <div className="glass-purple rounded-3xl p-6 border border-brand-100/40 h-full">
                <div className="text-5xl mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-brand-400 mb-2 tracking-widest">STEP {s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
              {s.step !== '03' && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-brand-300 text-2xl z-10">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 mx-6 mb-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-600 via-blush-500 to-mint-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 rounded-3xl" />
          <div className="relative">
            <div className="text-5xl mb-4">🌟</div>
            <h2 className="text-3xl font-bold mb-3">Fashion should fit everyone.</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">Set up your profile in 30 seconds. Start shopping adaptively with AI virtual try-on.</p>
            <Link href="/profile" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl hover:bg-brand-50 transition shadow-lg">
              Get Started — It's Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm border-t border-brand-100/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="gradient-text font-bold">InclusiFit</span>
          <span>·</span>
          <span>Built with Perfect Corp YouCam API</span>
          <span>·</span>
          <span>Hackathon 2026</span>
        </div>
        <div className="text-xs text-gray-300">Fashion for 1.3 billion people with disabilities</div>
      </footer>
    </div>
  )
}
