import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InclusiFit — Fashion for Everyone',
  description: 'AI-powered adaptive fashion and beauty for people with disabilities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded">
          Skip to main content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}
