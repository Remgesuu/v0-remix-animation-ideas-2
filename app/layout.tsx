import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScroll } from '@/components/SmoothScroll'

import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
});
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});
const _fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'ZaharGo — Go сервисы с нуля до production',
  description: 'Индивидуальное менторство по созданию Golang сервисов. Только практика — 5 реальных проектов в портфолио. Код, который приносит деньги.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_geist.variable} ${_geistMono.variable} ${_fraunces.variable} font-sans antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
