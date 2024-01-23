import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer'
import PlausibleProvider from 'next-plausible'
import { env } from '@/lib/env.mjs'
import { getStations } from '@/lib/stations'

const inter = Inter({ subsets: ['latin'] })

export const revalidate = 43200 // revalidate the data at most every 12 hours

export async function generateMetadata(): Promise<Metadata> {
  const totalStations = (await getStations()).length;

  return {
    title: {
      default: 'Fuel Pulse',
      template: '%s - Fuel Pulse',
    },
    description: 'Effortlessly locate the most economical fuel prices near you. Streamlined. User-Friendly. Constantly Updated.',
    metadataBase: new URL('https://fuelpulse.troypoulter.com'),
    keywords: ['fuel', 'petrol', 'gas', 'diesel', 'prices', 'australia', 'Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'shadcn', 'Server Components', 'Radix UI'],
    authors: [
      {
        name: 'Troy Poulter',
        url: 'https://troypoulter.com',
      }
    ],
    creator: "Troy Poulter",
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: 'https://fuelpulse.troypoulter.com',
      title: 'Fuel Pulse',
      description: 'Effortlessly locate the most economical fuel prices near you. Streamlined. User-Friendly. Constantly Updated.',
      siteName: 'Fuel Pulse',
      images: [
        {
          url: `/api/og?stationsCount=${totalStations}`,
          width: 1200,
          height: 630,
          alt: 'Fuel Pulse',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Fuel Pulse',
      description: 'Effortlessly locate the most economical fuel prices near you. Streamlined. User-Friendly. Constantly Updated.',
      images: [`/api/og?stationsCount=${totalStations}`],
      creator: "@troypoulterr"
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {env.NODE_ENV === "production" && <PlausibleProvider domain="fuelpulse.troypoulter.com" trackOutboundLinks />}
      </head>
      <body className={inter.className}>
        <div className='h-full relative flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-100'>
          <div className="h-[64px] fixed inset-y-0 w-full z-[49]">
            <Navbar />
          </div>
          <main className="flex-1 pt-[64px] h-full container relative my-4">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
