import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '智评AI - 中国专业AI产品评测与采购平台',
    template: '%s | 智评AI'
  },
  description: '中国首个"AI项目成功保障+产品评测"一体化平台，解决企业AI项目42%失败率痛点。提供专业AI产品评测、项目成功保障服务、智能采购匹配，让每一个AI项目都能成功落地。',
  keywords: [
    'AI评测', 'AI产品评测', 'AI项目管理', 'AI采购', '人工智能评估', 
    'AI解决方案', 'AI咨询', '企业AI转型', 'AI项目成功保障', '智评AI'
  ],
  authors: [{ name: '智评AI团队' }],
  creator: '智评AI',
  publisher: '智评AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: '智评AI - 中国专业AI产品评测与采购平台',
    description: '中国首个"AI项目成功保障+产品评测"一体化平台，让每一个AI项目都能成功落地',
    siteName: '智评AI',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '智评AI - 让每一个AI项目都能成功落地',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '智评AI - 中国专业AI产品评测与采购平台',
    description: '中国首个"AI项目成功保障+产品评测"一体化平台',
    images: ['/images/og-image.jpg'],
    creator: '@zhiping_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}