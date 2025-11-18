import type { Metadata } from "next"
import SolutionsMarketClient from "./solutions-market-client"

export const metadata: Metadata = {
  title: "解决方案市场 - Gate",
  description: "封装好的 AI 销售基建方案，一键部署，使用者即创造者",
}

export default function SolutionsMarketPage() {
  return <SolutionsMarketClient />
}
