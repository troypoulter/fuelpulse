import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from './_components/navbar'
import { Footer } from './_components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fuel Pulse',
  description: 'Find the best fuel price in Australia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
