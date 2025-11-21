import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Gate - AI 智能体协同编排平台",
  description: "让 AI 助手像拥有双手一样操作工具。通过自然语言与 AI 中枢沟通,实现智能体协同编排。",
  keywords: ["AI", "MCP", "智能体", "自动化", "工具编排", "Claude", "AI助手"],
  authors: [{ name: "Gate" }],
  creator: "Gate",
  publisher: "Gate",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://gate.a2a.ink",
    title: "Gate - AI 智能体协同编排平台",
    description: "让 AI 助手像拥有双手一样操作工具。通过自然语言与 AI 中枢沟通,实现智能体协同编排。",
    siteName: "Gate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gate - AI 智能体协同编排平台",
    description: "让 AI 助手像拥有双手一样操作工具。通过自然语言与 AI 中枢沟通,实现智能体协同编排。",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Gate",
      applicationCategory: "DeveloperApplication",
      description: "AI 智能体协同编排平台,让 AI 助手像拥有双手一样操作工具",
      operatingSystem: "Cross-platform",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
    }),
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
