import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InclusiFit — Adaptive Fashion for Everyone',
  description: 'AI-powered virtual try-on and smart filters for people with disabilities.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-violet-600 focus:text-white focus:px-3 focus:py-1.5 focus:rounded-full focus:text-sm">
          Skip to content
        </a>
        <div id="main">{children}</div>
      </body>
    </html>
  )
}
