import '@/styles/tailwind.css'
import { Metadata } from 'next'
import 'rc-slider/assets/index.css'
import ThemeProvider from './theme-provider'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    template: '%s - Venevtour',
    default: 'Venevtour - En İyi Tur ve Tatil Deneyimleri',
  },
  description: 'Venevtour ile dünyayı keşfedin. En iyi turlar, oteller ve seyahat rotaları.',
  keywords: ['Venevtour', 'Tur', 'Tatil', 'Seyahat', 'Rezervasyon', 'Acente'],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <ThemeProvider>
          <AuthProvider>
            <div>
              {children}
            </div>

            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
