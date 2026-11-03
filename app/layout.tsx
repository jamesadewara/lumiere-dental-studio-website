import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { JourneyCanvas } from '@/components/JourneyCanvas'
import { PageTransition } from '@/components/PageTransition'
import { SmoothScroll } from '@/components/SmoothScroll'
import { FloatingMotifs } from '@/components/floating-motifs'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Lumière Dental Studio | Premium Dentistry in Lekki',
  description: 'Thoughtful, modern dental care in Lekki, Lagos. Lumière Dental Studio offers premium dentistry for the way you live, laugh, and show up.',
  applicationName: 'Lumière Dental Studio',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Lumière Dental Studio',
    title: 'Lumière Dental Studio | Premium Dentistry in Lekki',
    description: 'Thoughtful, modern dental care in Lekki, Lagos. Premium dentistry for the way you live, laugh, and show up.',
  },
  twitter: {
    card: 'summary',
    title: 'Lumière Dental Studio | Premium Dentistry in Lekki',
    description: 'Thoughtful, modern dental care in Lekki, Lagos. Premium dentistry for the way you live, laugh, and show up.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F5F1EA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SmoothScroll>
          <JourneyCanvas />
          <FloatingMotifs />
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
      </body>
    </html>
  )
}
