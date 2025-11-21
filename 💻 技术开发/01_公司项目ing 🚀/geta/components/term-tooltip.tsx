"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TermTooltipProps {
  term:
    | "SDK"
    | "Skills"
    | "MCP"
    | "本地执行"
    | "数据不出域"
    | "智能编排"
    | "AI智能体"
    | "ClaudeCode"
    | "工具接口"
    | "资源访问"
    | "提示模板"
    | "生态参与者"
  children: React.ReactNode
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const definitions = {
    SDK: {
      title: "SDK (标准开发包)",
      description: '将数据和功能封装为标准化接口,定义 AI "可以做什么" (What)',
      details: "提供工具接口、资源访问和提示模板",
    },
    Skills: {
      title: "Skills (智能技能包)",
      description: '通过知识文件教会 AI "如何做" (How)',
      details: "定义使用场景、最佳实践和示例代码",
    },
    MCP: {
      title: "MCP (Model Context Protocol)",
      description: "AI 与外部工具通信的标准化协议",
      details: "让 AI 可以安全、标准化地访问各类服务和数据源",
    },
    本地执行: {
      title: "本地执行",
      description: "所有操作在用户设备上处理,不依赖云端",
      details: "响应更快,隐私更安全,可离线工作",
    },
    数据不出域: {
      title: "数据不出域",
      description: "企业数据始终保留在本地环境,不上传外部服务器",
      details: "确保数据主权和隐私安全,符合合规要求",
    },
    智能编排: {
      title: "智能编排",
      description: "AI 自动决策、调配资源、组合多个工具完成复杂任务",
      details: "无需人工干预,AI 智能选择最优执行路径",
    },
    AI智能体: {
      title: "AI 智能体",
      description: "具有自主决策能力的 AI 系统,可调用工具完成任务",
      details: "理解意图、规划步骤、执行操作、反馈结果",
    },
    ClaudeCode: {
      title: "Claude Code",
      description: "Anthropic 推出的 AI 编程助手,支持 MCP 协议",
      details: "提供稳定的执行环境和系统级权限管理",
    },
    工具接口: {
      title: "工具接口 (Tools)",
      description: "AI 可以调用的具体功能接口",
      details: "如发送邮件、查询数据库、创建文档等操作",
    },
    资源访问: {
      title: "资源访问 (Resources)",
      description: "企业数据的结构化访问方式",
      details: "让 AI 可以读取文档、数据库、知识库等资源",
    },
    提示模板: {
      title: "提示模板 (Prompts)",
      description: "预定义的 AI 交互模式",
      details: "标准化常见任务的提示词,提高响应质量",
    },
    生态参与者: {
      title: "生态参与者",
      description: "在 AI 生态中既消费又提供能力的组织",
      details: "通过 Gate 平台分享自己的专业能力,实现价值输出",
    },
  }

  const def = definitions[term]

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted decoration-accent/50 cursor-help hover:decoration-accent transition-colors">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4 bg-popover border-border" side="top" sideOffset={5}>
          <div className="space-y-2">
            <p className="font-semibold text-sm text-foreground">{def.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{def.description}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{def.details}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
