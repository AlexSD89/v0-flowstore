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
  title: "Gate - 企业销售的 AI 基建平台",
  description:
    "Gate 通过封装销售知识、智能编排 AI 工具、生成即用 AI Agent（AI 销售智能体），让企业在 10 天内拥有专属 AI 销售系统，成本降低 80%，ROI 超过 500%。",
  keywords: ["AI", "MCP", "智能体", "自动化", "工具编排", "Claude", "AI助手", "销售", "AI 基建"],
  authors: [{ name: "Gate" }],
  creator: "Gate",
  publisher: "Gate",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://gate.a2a.ink",
    title: "Gate - 企业销售的 AI 基建平台",
    description:
      "Gate 通过封装销售知识、智能编排 AI 工具、生成即用 AI Agent（AI 销售智能体），让企业在 10 天内拥有专属 AI 销售系统，成本降低 80%，ROI 超过 500%。",
    siteName: "Gate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gate - 企业销售的 AI 基建平台",
    description:
      "Gate 通过封装销售知识、智能编排 AI 工具、生成即用 AI Agent（AI 销售智能体），让企业在 10 天内拥有专属 AI 销售系统，成本降低 80%，ROI 超过 500%。",
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
      description:
        "企业销售的 AI 基建平台：封装销售知识、智能编排 AI 工具、生成即用 AI Agent（AI 销售智能体），10 天构建专属 AI 销售系统。",
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
