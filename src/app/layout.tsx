import type { Metadata } from 'next'
import { Bebas_Neue, Space_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ruido — Agencia de eventos',
  description: 'Eventos underground en Barcelona. Techno, drum & bass, experimental.',
  openGraph: {
    title: 'Ruido',
    description: 'Eventos underground en Barcelona',
    siteName: 'Ruido',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${spaceMono.variable}`}>
      <body>{children}
        <Analytics/>
      </body>
    </html>
  )
}