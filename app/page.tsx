import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <span className="text-2xl font-bold text-purple-700">InclusiFit</span>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/catalog" className="text-gray-600 hover:text-purple-700">Shop</Link>
          <Link href="/beauty" className="text-gray-600 hover:text-purple-700">Beauty</Link>
          <Link href="/profile" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">My Profile</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
          Built for 1.3 billion people with disabilities
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Fashion that fits <span className="text-purple-600">YOUR body.</span>
          <br />Not the other way around.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Disability-aware smart filters + AI virtual try-on. Find adaptive clothing, see how it looks on you — before you buy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile" className="bg-purple-600 text-white text-lg font-semibold px-8 py-4 rounded-xl hover:bg-purple-700 transition">
            Start My Profile
          </Link>
          <Link href="/catalog" className="border-2 border-purple-600 text-purple-600 text-lg font-semibold px-8 py-4 rounded-xl hover:bg-purple-50 transition">
            Browse Adaptive Catalog
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '1.3B', label: 'People with disabilities' },
            { stat: '$8T', label: 'Spending power' },
            { stat: '71%', label: 'Abandon inaccessible e-commerce' },
            { stat: '94%', label: 'Higher conversion with AR' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div className="text-3xl font-extrabold text-purple-600">{stat}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Built for your needs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '👗',
              title: 'Adaptive Clothing',
              desc: 'Filter by closure type, waistband, fit, and proportional length. See how it looks on your body with AI try-on.',
            },
            {
              icon: '👟',
              title: 'AFO-Compatible Footwear',
              desc: 'Find shoes that fit over ankle-foot orthoses. Wide widths, small adult sizes, velcro closures.',
            },
            {
              icon: '✨',
              title: 'Accessible Beauty',
              desc: 'AI skin analysis + products filtered by container type. Pump dispensers, easy-grip applicators.',
            },
            {
              icon: '💇',
              title: 'Hair & Wigs',
              desc: 'Try on wigs and hairstyles virtually. Perfect for alopecia, cancer treatment, or any hair loss.',
            },
            {
              icon: '🎤',
              title: 'Voice Controlled',
              desc: 'Say "try this on me" or "read my results". Full voice navigation for motor and visual disabilities.',
            },
            {
              icon: '♿',
              title: 'Fully Accessible',
              desc: 'Screen reader support, high contrast mode, large tap targets, session save for fatigue conditions.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Fashion should fit everyone.</h2>
        <p className="text-purple-200 mb-8">Set up your profile in 30 seconds. Start shopping adaptively.</p>
        <Link href="/profile" className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-purple-50 transition">
          Get Started — It's Free
        </Link>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm">
        Built with Perfect Corp YouCam API · InclusiFit 2026
      </footer>
    </div>
  )
}
