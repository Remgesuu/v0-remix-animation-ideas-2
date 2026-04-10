import type { Metadata, Viewport } from 'next'
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
  title: 'ZaharGo — Go сервисы с нуля до production | Индивидуальное менторство',
  description: 'Индивидуальное менторство по созданию Golang сервисов. Только практика — 5 реальных проектов в портфолио. 94% выпускников трудоустроены. Рост зарплаты x2.1',
  keywords: ['golang', 'go', 'backend', 'разработка', 'программирование', 'курсы', 'менторство', 'обучение', 'карьера'],
  authors: [{ name: 'ZaharGo' }],
  creator: 'ZaharGo',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    title: 'ZaharGo — Go сервисы с нуля до production',
    description: 'Индивидуальное менторство по созданию Golang сервисов. 5 реальных проектов в портфолио. 94% выпускников трудоустроены.',
    siteName: 'ZaharGo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZaharGo — Go сервисы с нуля до production',
    description: 'Индивидуальное менторство по созданию Golang сервисов. 5 реальных проектов в портфолио.',
  },
  robots: {
    index: true,
    follow: true,
  },
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F2ED' },
    { media: '(prefers-color-scheme: dark)', color: '#18181B' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
