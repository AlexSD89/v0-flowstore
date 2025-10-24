import type { Metadata } from "next"
import TutorialClientPage from "./TutorialClientPage"

export const metadata: Metadata = {
  title: "Gate MCP 安装教程 - 5分钟快速上手",
  description: "详细的 Gate MCP 安装指南,包含 Claude Code CLI 配置、服务激活和常见问题解答。5-10分钟完成安装。",
  keywords: ["Gate安装", "MCP教程", "Claude Code", "AI工具配置", "安装指南"],
  openGraph: {
    title: "Gate MCP 安装教程 - 5分钟快速上手",
    description: "详细的 Gate MCP 安装指南,5-10分钟完成安装配置。",
  },
}

export default function TutorialPage() {
  return <TutorialClientPage />
}
