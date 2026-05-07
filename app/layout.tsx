import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'InclusiFit — Adaptive Fashion for Everyone',
  description: 'AI-powered virtual try-on and adaptive filters for people with disabilities.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="sr-only">Skip to content</a>
        <div id="main">{children}</div>
      </body>
    </html>
  )
}
