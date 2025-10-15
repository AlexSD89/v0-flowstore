import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "Gate · AI 自动化指挥中心";
const description =
  "Gate 让你的智能体与 n8n 工作流协同，秒级启动跨应用自动化，真正把 AI 变成生产力。";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Gate",
    "Rube",
    "AI automation",
    "n8n",
    "智能体",
    "Workflow Orchestration",
  ],
  openGraph: {
    title,
    description,
    url: "https://gate.launchx.ai",
    siteName: "Gate",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
