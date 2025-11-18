"use client"

import { Database, Zap, TrendingDown, Layers, Workflow, Brain, Building2, Sparkles, Cloud, Users, Target, Phone } from 'lucide-react'

const capabilities = [
  // 第一层：知识封装优势（蓝色系）- 销售方法论
  {
    icon: Layers,
    title: "销售方法论封装",
    description: "将您的销售SOP、话术模板、最佳实践封装为可复用AI模块",
    tools: [],
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Database,
    title: "客户数据理解",
    description: "深度理解客户互动历史、偏好画像，构建360度客户视图",
    tools: [],
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: TrendingDown,
    title: "知识持续积累",
    description: "每次销售互动都沉淀为企业资产，新人快速传承优秀经验",
    tools: [],
    color: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  
  // 第二层：Gate 智能能力（Accent 色）- 销售智能
  {
    icon: Workflow,
    title: "智能工作流编排",
    description: "自动化设计销售流程，编排多工具协同完成复杂销售任务",
    tools: [],
    color: "from-accent/10 to-accent/20",
    iconColor: "text-accent dark:text-accent"
  },
  {
    icon: Brain,
    title: "AI Agent 生成",
    description: "自动生成销售AI Agent，封装外部工具调用（语音、邮件、CRM）",
    tools: [],
    color: "from-accent/10 to-accent/20",
    iconColor: "text-accent dark:text-accent"
  },
  {
    icon: Zap,
    title: "可复用销售模板",
    description: "将成功销售流程模板化，一键复制到新场景和团队",
    tools: [],
    color: "from-accent/10 to-accent/20",
    iconColor: "text-accent dark:text-accent"
  },
  
  // 第三层：外部工具整合（绿色系）- 销售工具集成
  {
    icon: Building2,
    title: "CRM 系统整合",
    description: "整合Salesforce、HubSpot等CRM，自动同步销售数据",
    tools: ["Salesforce", "HubSpot", "Pipedrive", "Zoho", "飞书CRM"],
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Sparkles,
    title: "AI 工具生态接入",
    description: "接入语音AI（ElevenLabs）、销售智能工具（Gong、Clari）",
    tools: ["ElevenLabs", "Gong", "Clari", "Apollo", "ZoomInfo"],
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600 dark:text-green-400"
  },
  {
    icon: Cloud,
    title: "通讯协作工具",
    description: "整合Gmail、LinkedIn、Zoom等工具实现全渠道触达",
    tools: ["Gmail", "Outlook", "LinkedIn", "Zoom", "Slack"],
    color: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600 dark:text-green-400"
  },
]

export function GateArchitectureTree() {
  return (
    <section className="section-spacing px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">
            <span className="font-normal">让</span>{' '}
            <span className="font-bold">Gate</span>{' '}
            <span className="font-normal">编排您的销售AI</span>
          </h2>
          <p className="text-xl sm:text-2xl font-medium text-accent mb-4">
            封装知识 · 智能编排 · 工具整合
          </p>
          <p className="section-subtitle">
            理解客户数据，自动化编排工作流，生成可复用的AI销售Agent
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="card-base card-padding card-hover cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${item.iconColor} stroke-[1.5]`} />
                </div>
                
                <h4 className="font-semibold text-xl text-foreground mb-3 leading-snug">
                  {item.title}
                </h4>
                
                <p className="text-muted-foreground leading-relaxed text-base mb-4">
                  {item.description}
                </p>

                {item.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tools.map((tool, toolIndex) => (
                      <span 
                        key={toolIndex}
                        className="px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
