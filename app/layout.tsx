import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InclusiFit — Fashion for Everyone',
  description: 'AI-powered adaptive fashion and beauty for people with disabilities. Virtual try-on, skin analysis, and smart filters.',
  openGraph: {
    title: 'InclusiFit',
    description: 'Fashion that fits YOUR body. Not the other way around.',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
          Skip to main content
        </a>
        <div id="main">{children}</div>
      </body>
    </html>
  )
}
