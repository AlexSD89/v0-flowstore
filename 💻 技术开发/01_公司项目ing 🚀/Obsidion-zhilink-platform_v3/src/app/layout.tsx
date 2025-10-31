import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";

import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fontDisplay = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LaunchX智链平台 - B2B AI能力市场",
    template: "%s | LaunchX智链平台",
  },
  description:
    "LaunchX智链平台是专业的B2B AI解决方案市场平台，通过6角色AI协作系统为法律、医疗、电商等行业提供精准的AI转型服务。",
  keywords: [
    "AI",
    "人工智能",
    "B2B",
    "企业服务",
    "智能解决方案",
    "LaunchX",
    "智链平台",
    "法律AI",
    "医疗AI",
    "电商AI",
  ],
  authors: [
    {
      name: "LaunchX团队",
      url: "https://launchx.ai",
    },
  ],
  creator: "LaunchX",
  publisher: "LaunchX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:1300"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "LaunchX智链平台",
    title: "LaunchX智链平台 - B2B AI能力市场",
    description:
      "专业的B2B AI解决方案市场平台，通过6角色AI协作系统为企业提供精准的AI转型服务。",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LaunchX智链平台",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchX智链平台 - B2B AI能力市场",
    description:
      "专业的B2B AI解决方案市场平台，通过6角色AI协作系统为企业提供精准的AI转型服务。",
    images: ["/images/og-image.jpg"],
    creator: "@LaunchX_AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#6366f1",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "LaunchX智链",
    "application-name": "LaunchX智链",
    "msapplication-TileColor": "#6366f1",
    "theme-color": "#0f172a",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "dark light",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="zh-CN"
      className={cn(
        "min-h-screen bg-background-main font-sans antialiased",
        fontSans.variable,
        fontMono.variable,
        fontDisplay.variable
      )}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//cdn.zhilink.com" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/Inter-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/hero-bg.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-background-main via-background-main to-background-card",
          "selection:bg-cloudsway-primary-500 selection:text-white"
        )}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cloudsway-primary-500 focus:px-3 focus:py-2 focus:text-white focus:shadow-lg"
        >
          跳转到主内容
        </a>

        {/* Providers wrapper for context, state management, etc. */}
        <Providers>
          {/* Main content */}
          <main id="main-content" className="relative">
            {children}
          </main>

          {/* Background decorative elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-4 top-0 h-96 w-96 rounded-full bg-cloudsway-primary-500/5 blur-3xl" />
            <div className="absolute -right-4 top-1/3 h-96 w-96 rounded-full bg-cloudsway-accent-500/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cloudsway-secondary-500/5 blur-3xl" />
          </div>
        </Providers>

        {/* Development tools (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="rounded-lg bg-background-glass px-3 py-2 text-xs text-text-muted backdrop-blur-sm">
              <div>Mode: {process.env.NODE_ENV}</div>
              <div>Screen: <span className="inline-block sm:hidden">xs</span>
                <span className="hidden sm:inline-block md:hidden">sm</span>
                <span className="hidden md:inline-block lg:hidden">md</span>
                <span className="hidden lg:inline-block xl:hidden">lg</span>
                <span className="hidden xl:inline-block 2xl:hidden">xl</span>
                <span className="hidden 2xl:inline-block">2xl</span>
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}