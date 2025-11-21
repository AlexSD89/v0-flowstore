import type { Metadata } from "next"
import MarketplaceClientPage from "./marketplace-client"

export const metadata: Metadata = {
  title: "AI 工具市场 - Gate",
  description: "探索精选 MCP 工具集成，连接 GitHub、Gmail、Notion 等主流服务，为 AI 智能体提供标准化工具能力",
  keywords: ["MCP工具", "集成市场", "MCP服务", "GitHub", "Gmail", "Notion", "自动化"],
  openGraph: {
    title: "AI 工具市场 - Gate",
    description: "探索精选 MCP 工具集成，为 AI 智能体提供标准化工具能力",
  },
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
