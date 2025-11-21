import type { Metadata } from "next"
import MarketplaceClientPage from "./marketplace-client"

export const metadata: Metadata = {
  title: "Gate Market - AI 工具集成市场",
  description: "探索精选 AI 工具集成,连接 GitHub、Gmail、Notion 等主流服务,让你的 AI 助手更强大。",
  keywords: ["AI工具", "集成市场", "MCP服务", "GitHub", "Gmail", "Notion", "自动化"],
  openGraph: {
    title: "Gate Market - AI 工具集成市场",
    description: "探索精选 AI 工具集成,连接 GitHub、Gmail、Notion 等主流服务。",
  },
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
